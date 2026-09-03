"use client";

import { useCallback, useEffect, useState } from "react";

export type Favorite = {
  id: string;
  name: string;
  category: string;
  location: string;
  price: string;
};

const storageKey = "klutch:favorites";
const changeEvent = "klutch:favorites-changed";

function readFavorites(): Favorite[] {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener(changeEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(changeEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((next: Favorite[]) => {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setFavorites(next);
    window.dispatchEvent(new Event(changeEvent));
  }, []);

  const toggleFavorite = useCallback((favorite: Favorite) => {
    const current = readFavorites();
    update(current.some((item) => item.id === favorite.id)
      ? current.filter((item) => item.id !== favorite.id)
      : [...current, favorite]);
  }, [update]);

  const removeFavorite = useCallback((id: string) => {
    update(readFavorites().filter((item) => item.id !== id));
  }, [update]);

  return { favorites, favoriteIds: new Set(favorites.map((item) => item.id)), toggleFavorite, removeFavorite };
}
