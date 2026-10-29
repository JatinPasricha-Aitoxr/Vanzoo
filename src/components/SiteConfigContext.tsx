'use client';

import { createContext, useContext } from 'react';
import { navLinks } from '@/lib/site';

type Nav = ReadonlyArray<{ href: string; label: string }>;
const NavContext = createContext<Nav>(navLinks);

/** Lets the CMS-edited primary menu reach the client-side Header without prop-drilling. */
export function NavProvider({ nav, children }: { nav?: Nav; children: React.ReactNode }) {
  return <NavContext.Provider value={nav && nav.length ? nav : navLinks}>{children}</NavContext.Provider>;
}
export const useNav = () => useContext(NavContext);
