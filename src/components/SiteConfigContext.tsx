'use client';

import { createContext, useContext } from 'react';
import { navLinks } from '@/lib/site';

type Nav = ReadonlyArray<{ href: string; label: string }>;
type ServiceLink = { id: string; title: string };
type Data = { nav: Nav; services: ReadonlyArray<ServiceLink> };
const DataContext = createContext<Data>({ nav: navLinks, services: [] });

/** Lets CMS-edited menus and the (edited) service list reach client components without prop-drilling. */
export function NavProvider({ nav, services, children }: { nav?: Nav; services?: ReadonlyArray<ServiceLink>; children: React.ReactNode }) {
  return <DataContext.Provider value={{ nav: nav && nav.length ? nav : navLinks, services: services ?? [] }}>{children}</DataContext.Provider>;
}
export const useNav = () => useContext(DataContext).nav;
export const useServiceLinks = () => useContext(DataContext).services;
