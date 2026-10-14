'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const CITIES = ['Gurgaon', 'Delhi'] as const;
export type City = (typeof CITIES)[number];

type CityContextValue = { city: City; setCity: (city: City) => void; delhiEnabled: boolean };

const CityContext = createContext<CityContextValue>({
  city: 'Gurgaon',
  setCity: () => {},
  delhiEnabled: false,
});

/**
 * The visitor's chosen city, shared by the whole site. Prices on the site are
 * Gurgaon's; the choice drives the "prices may differ" notice. Remembered per
 * browser; storage can be unavailable, so it only ever enhances the default.
 */
export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState<City>('Gurgaon');
  // Delhi is hidden until switched on in /admin; the flag is fetched fresh.
  const [delhiEnabled, setDelhiEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/settings/', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setDelhiEnabled(Boolean(data?.delhiEnabled)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vz-city');
      if (saved === 'Delhi' || saved === 'Gurgaon') setCityState(saved);
    } catch {
      /* default stays */
    }
  }, []);

  const setCity = useCallback((next: City) => {
    setCityState(next);
    try {
      localStorage.setItem('vz-city', next);
    } catch {
      /* ignore */
    }
  }, []);

  return <CityContext.Provider
      value={{ city: delhiEnabled ? city : 'Gurgaon', setCity, delhiEnabled }}
    >{children}</CityContext.Provider>;
}

export const useCity = () => useContext(CityContext);
