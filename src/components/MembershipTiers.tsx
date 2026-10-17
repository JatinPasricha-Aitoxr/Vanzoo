'use client';

import { useCart } from '@/lib/cart';
import { membership } from '@/content/marketing';

/**
 * "Choose your club" table. Each tier can be added to the cart; the cart drawer
 * then offers "Continue on WhatsApp" with the chosen club in the message.
 */
export function MembershipTiers() {
  const { add, openCart, lines } = useCart();

  return (
    <div className="overflow-x-auto rounded-card border border-accent-gold/60">
      <table className="w-full min-w-[40rem] border-collapse text-center text-white">
        <thead>
          <tr className="bg-accent-gold text-sm font-semibold uppercase tracking-[0.08em] text-brand-ink">
            <th scope="col" className="px-4 py-3.5">Club</th>
            <th scope="col" className="px-4 py-3.5">Credits (₹)</th>
            <th scope="col" className="px-4 py-3.5">Flat discount</th>
            <th scope="col" className="px-4 py-3.5">Validity</th>
            <th scope="col" className="px-4 py-3.5"><span className="sr-only">Add to cart</span></th>
          </tr>
        </thead>
        <tbody>
          {membership.tiers.map((tier) => {
            const id = `membership:${tier.name.toLowerCase().replace(/\s+/g, '-')}`;
            const inCart = lines.some((line) => line.id === id);
            return (
              <tr key={tier.name} className="border-t border-accent-gold/30">
                <th scope="row" className="px-4 py-4 text-sm font-medium uppercase tracking-[0.08em]">{tier.name}</th>
                <td className="px-4 py-4 tabular-nums">₹{tier.credits.toLocaleString('en-IN')}</td>
                <td className="px-4 py-4 font-semibold tabular-nums text-accent-gold-soft">{tier.discount}% OFF</td>
                <td className="px-4 py-4 text-sm uppercase tracking-[0.08em]">{tier.validity}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      add({
                        id,
                        item: `${tier.name} Membership — ₹${tier.credits.toLocaleString('en-IN')} credits, ${tier.discount}% off, ${tier.validity}`,
                        service: 'Membership Club',
                        amount: tier.credits,
                        from: false,
                      });
                      openCart();
                    }}
                    className="btn-gold btn-sm whitespace-nowrap"
                  >
                    {inCart ? 'In cart' : 'Add to cart'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
