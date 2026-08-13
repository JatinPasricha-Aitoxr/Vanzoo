'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * Tariff cart.
 *
 * This is a quotation basket, not a checkout: nothing is charged here and no
 * order is created. The visitor assembles a list of garments from the tariff
 * pages, and the drawer hands that list to the existing `/api/enquiry` route so
 * the team can confirm and schedule a pickup. Payment happens in Vanzoo's own
 * booking app, as it always has.
 *
 * State lives in localStorage so a cart survives the hop between the Couture
 * Care and Steam Iron pages (and a page reload), which is the whole reason a
 * cart beats the old per-item "Enquire Now" button.
 */

export type CartLine = {
  /** `catalogId:groupId:item-slug` — see `lineId` in content/pricing. */
  id: string;
  item: string;
  /** Which tariff the price came from, e.g. "Couture Care". */
  service: string;
  /** Unit price in rupees, GST exclusive. */
  amount: number;
  /** True when the published price is a "starting from" figure. */
  from: boolean;
  quantity: number;
  /** Product thumbnail. Optional so carts stored before images shipped still load. */
  image?: string;
};

type CartContextValue = {
  lines: CartLine[];
  /** Total garment count across all lines — the header badge reads this. */
  count: number;
  /** Sum of amount × quantity, GST exclusive. */
  subtotal: number;
  /** True when any line is a from-price, so the total must be shown as an estimate. */
  hasFromPrices: boolean;
  /** Whether the drawer is open. */
  isOpen: boolean;
  /** True once localStorage has been read — guards the SSR/first-paint mismatch. */
  isHydrated: boolean;
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = 'vanzoo.cart.v1';
/** Guards against a runaway quantity stepper reaching an absurd figure. */
const MAX_QUANTITY = 99;

const CartContext = createContext<CartContextValue | null>(null);

function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Written by an older build, hand-edited, or simply corrupt — validate each
    // line rather than trusting whatever is in storage.
    return parsed.filter(
      (line): line is CartLine =>
        typeof line === 'object' &&
        line !== null &&
        typeof (line as CartLine).id === 'string' &&
        typeof (line as CartLine).item === 'string' &&
        typeof (line as CartLine).service === 'string' &&
        Number.isFinite((line as CartLine).amount) &&
        Number.isFinite((line as CartLine).quantity) &&
        (line as CartLine).quantity > 0 &&
        (typeof (line as CartLine).image === 'string' ||
          typeof (line as CartLine).image === 'undefined'),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read after mount, never during render: the server has no localStorage, so
  // seeding state from it directly would hydrate a different tree than the HTML.
  useEffect(() => {
    setLines(parseStored(window.localStorage.getItem(STORAGE_KEY)));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Private browsing and full quotas both throw here. The cart still works
      // for this page view; it just won't survive a reload.
    }
  }, [lines, isHydrated]);

  // Two tabs open on the tariff pages should not disagree about the cart.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setLines(parseStored(event.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((line: Omit<CartLine, 'quantity'>, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((entry) => entry.id === line.id);
      if (!existing) return [...current, { ...line, quantity }];
      return current.map((entry) =>
        entry.id === line.id
          ? { ...entry, quantity: Math.min(entry.quantity + quantity, MAX_QUANTITY) }
          : entry,
      );
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((entry) => entry.id !== id)
        : current.map((entry) =>
            entry.id === id
              ? { ...entry, quantity: Math.min(quantity, MAX_QUANTITY) }
              : entry,
          ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce((total, line) => total + line.amount * line.quantity, 0);
    return {
      lines,
      count,
      subtotal,
      hasFromPrices: lines.some((line) => line.from),
      isOpen,
      isHydrated,
      add,
      setQuantity,
      remove,
      clear,
      openCart,
      closeCart,
    };
  }, [lines, isOpen, isHydrated, add, setQuantity, remove, clear, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>.');
  return context;
}
