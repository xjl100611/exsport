import { useFavorites } from '../state/useFavorites'

export default function FavoriteButton({ slug, size = 'md' }) {
  const { has, toggle } = useFavorites()
  const active = has(slug)

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={active}
      className={`btn ${size === 'sm' ? 'btn-sm' : ''} ${
        active
          ? 'bg-[rgba(15,169,160,0.16)] text-teal-deep ring-1 ring-[rgba(15,169,160,0.4)]'
          : 'btn-ghost'
      }`}
    >
      <span aria-hidden="true">{active ? '★' : '☆'}</span>
      {active ? '已收藏' : '收藏'}
    </button>
  )
}
