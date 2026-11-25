import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((value) => {
      if (value) setFavorites(JSON.parse(value));
    });
  }, []);

  function toggleFavorite(id) {
    const updated = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(updated);
    AsyncStorage.setItem(KEY, JSON.stringify(updated));
  }

  return { favorites, toggleFavorite };
}

export function sortByFavorites(routes, favorites) {
  const starred = routes.filter((route) => favorites.includes(route.id));
  const others = routes.filter((route) => !favorites.includes(route.id));
  return [...starred, ...others];
}
