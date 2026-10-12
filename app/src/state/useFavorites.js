import { createContext, useContext } from 'react'

export const FavoritesContext = createContext(null)

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites 必须在 FavoritesProvider 内使用')
  return context
}
