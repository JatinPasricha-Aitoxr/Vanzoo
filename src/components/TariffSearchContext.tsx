'use client';

import { createContext, useContext, useState } from 'react';

type Value = { query: string; setQuery: (query: string) => void };

const TariffSearchContext = createContext<Value | null>(null);

/** One search box, shared by every tariff grid on the Pricing page. */
export function TariffSearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  return <TariffSearchContext.Provider value={{ query, setQuery }}>{children}</TariffSearchContext.Provider>;
}

export const useTariffSearch = () => useContext(TariffSearchContext);
