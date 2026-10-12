import { Link } from 'react-router-dom'
import { DISCLAIMER, getSport } from '../data/sports'
import { INJURIES } from '../data/injuries'

export default function InjuryPanel({ part, onSelect }) {
  if (!part) {
    return (
      <div className="glass rounded-3xl p-6 sm:p-8">
        <p className="section-eyebrow">伤痛地图</p>
        <h2 className="mt-2 text-2xl text-ink">点一下身体上的发光点</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          十个常见部位对应十组「为什么会痛」和「哪些运动有帮助」。拖动左侧的人体可以旋转，鼠标移到光点上先看一句话原因，点开看完整内容。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {INJURIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className="rounded-full border border-[rgba(15,169,160,0.28)] bg-white/70 px-3.5 py-1.5 text-sm text-teal-deep transition hover:-translate-y-0.5 hover:bg-white"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="tag tag-teal">{part.en}</span>
        <span className="text-xs text-muted">常见不适的成因与应对</span>
      </div>
      <h2 className="mt-3 text-3xl text-ink">{part.name}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{part.brief}</p>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-ink">常见原因</h3>
        <ul className="mt-3 space-y-2">
          {part.causes.map((cause) => (
            <li key={cause} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0fa9a0]" aria-hidden="true" />
              {cause}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-ink">有帮助的运动</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {part.helpful.map(({ slug, why }) => {
            const sport = getSport(slug)
            if (!sport) return null
            return (
              <Link
                key={slug}
                to={`/sports/${slug}`}
                className="glass-soft card-hover flex flex-col gap-1.5 rounded-2xl p-3.5"
              >
                <span className="text-xl" aria-hidden="true">
                  {sport.icon}
                </span>
                <span className="text-sm font-medium text-ink">{sport.name}</span>
                <span className="text-xs leading-relaxed text-muted">{why}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-ink">日常预防</h3>
        <ul className="mt-3 space-y-2">
          {part.prevention.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <span className="mt-1 text-[#0fa9a0]" aria-hidden="true">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-[rgba(74,124,255,0.25)] bg-[rgba(74,124,255,0.07)] p-4 text-xs leading-relaxed text-muted">
        <p className="font-medium text-ink">需要就医的信号</p>
        <p className="mt-1">{part.note}</p>
        <p className="mt-2">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
