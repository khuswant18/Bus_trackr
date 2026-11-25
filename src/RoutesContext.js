import { createContext, useContext, useEffect, useState } from 'react';
import { routes as savedRoutes } from './data';
import { fetchRoutes } from './api';

const RoutesContext = createContext(null);

export function RoutesProvider({ children }) {
  const [routes, setRoutes] = useState(savedRoutes);
  const [offline, setOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadRoutes() {
    try {
      const data = await fetchRoutes();
      setRoutes(data);
      setOffline(false);
    } catch {
      setRoutes(savedRoutes);
      setOffline(true);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  return (
    <RoutesContext.Provider value={{ routes, offline, refreshing, refresh }}>
      {children}
    </RoutesContext.Provider>
  );
}

export function useRoutes() {
  return useContext(RoutesContext);
}
