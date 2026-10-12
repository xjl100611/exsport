import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useFavorites } from '../state/useFavorites'

const LINKS = [
  { to: '/', label: '人体', end: true },
  { to: '/sports', label: '全部运动' },
  { to: '/about', label: '关于' },
]

export default function Navbar() {
  const { favorites } = useFavorites()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="glass mx-auto flex max-w-[1180px] items-center justify-between rounded-2xl px-4 py-3">
        <NavLink to="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight text-ink">exsport</span>
          <span className="hidden text-xs text-muted sm:inline">专家级运动指南</span>
        </NavLink>

        <div className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-[rgba(15,169,160,0.14)] text-teal-deep' : 'text-muted hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <span className="ml-2 rounded-full border border-[rgba(15,169,160,0.3)] px-3 py-1 text-xs text-teal-deep">
            已收藏 {favorites.length}
          </span>
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/70 px-3 py-1.5 text-sm text-muted sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="展开导航"
        >
          {open ? '收起' : '菜单'}
        </button>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 flex max-w-[1180px] flex-col rounded-2xl p-3 sm:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-[rgba(15,169,160,0.12)] text-teal-deep' : 'text-muted'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <span className="px-3 pt-1 text-xs text-muted">已收藏 {favorites.length} 项</span>
        </div>
      )}
    </header>
  )
}
