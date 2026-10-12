// 指到伤痛点时弹出的白卡片：主要原因 + 「查看与伤痛有关的运动」
import { getTcm } from '../data/tcm'

export default function InjuryPopup({ part, onShowRelated, onMouseEnter, onMouseLeave, className = '' }) {
  // 弹窗只放得下前三条原因：还有更多时，按钮改成「了解更多」
  const shownCauses = part.causes.slice(0, 3)
  const hasMore = part.causes.length > shownCauses.length
  const tcm = getTcm(part.id)

  return (
    <div className={`injury-popup ${className}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#0b8079] uppercase">{part.en}</p>
      <p className="mt-0.5 text-base font-semibold text-[#16204a]">{part.name} · 主要原因</p>
      <ul className="mt-2 space-y-1.5">
        {shownCauses.map((cause) => (
          <li key={cause} className="flex gap-2 text-xs leading-relaxed text-[#4a5875]">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3f7bff]" aria-hidden="true" />
            {cause}
          </li>
        ))}
      </ul>
      {tcm && (
        <p className="mt-2 rounded-lg bg-[rgba(15,169,160,0.08)] px-2.5 py-1.5 text-[11px] leading-relaxed text-[#3f4a63]">
          <span className="font-medium text-[#0b8079]">中医参考</span>　{tcm.pattern}　
          {tcm.points.slice(0, 3).map((point) => point.name).join(' / ')}
        </p>
      )}
      <button
        type="button"
        onClick={() => onShowRelated(part.id)}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2b53e0] transition hover:gap-2"
      >
        {hasMore ? '了解更多' : '查看与伤痛有关的运动'}
        <span aria-hidden="true">→</span>
      </button>
      <p className="mt-2 text-[10px] leading-tight text-[#8b95ad]">
        以上为公开文献整理的参考信息，不构成诊断；症状持续或加重请及时就医。
      </p>
    </div>
  )
}
