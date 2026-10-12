import { Link } from 'react-router-dom'

export default function SportCard({ sport, compact = false, onOpen }) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-3xl" aria-hidden="true">
          {sport.icon}
        </span>
        <span className="tag tag-teal">{sport.group}</span>
      </div>
      <div>
        <h3 className="text-lg text-ink">{sport.name}</h3>
        <p className="text-xs uppercase tracking-wide text-muted">{sport.en}</p>
      </div>
      {!compact && <p className="text-sm text-muted">{sport.intro.slice(0, 46)}…</p>}
      <div className="mt-auto flex flex-wrap gap-2 text-xs text-muted">
        <span className="tag">{sport.difficulty}</span>
        <span className="rounded-full bg-white/70 px-2.5 py-0.5">{sport.duration}</span>
      </div>
    </>
  )

  const className = 'glass card-hover flex h-full w-full flex-col gap-3 rounded-3xl p-5 text-left'

  if (onOpen) {
    return (
      <button type="button" className={className} onClick={() => onOpen(sport.slug)}>
        {inner}
      </button>
    )
  }

  return (
    <Link to={`/sports/${sport.slug}`} className={className}>
      {inner}
    </Link>
  )
}
