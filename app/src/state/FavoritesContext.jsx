import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { FavoritesContext } from './useFavorites'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('exsport:favorites', [])

  const toggle = useCallback(
    (slug) => {
      setFavorites((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]))
    },
    [setFavorites],
  )

  const value = useMemo(
    () => ({ favorites, toggle, has: (slug) => favorites.includes(slug) }),
    [favorites, toggle],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
