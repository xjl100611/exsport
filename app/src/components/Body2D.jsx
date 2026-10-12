import anchors from '../data/anchors.json'
import { INJURIES } from '../data/injuries'

// 2D 人体剪影上痛点的横向位置（右侧为正值），纵向位置由锚点坐标换算
const LATERAL = {
  neck: [0, 0],
  occiput: [0, -6],
  temple: [0.2, -8],
  jaw: [0.16, -2],
  ribcart: [0.12, -2],
  shoulder: [0.98, 0],
  elbow: [1.02, 0],
  forearm: [1.02, 6],
  wrist: [1.04, 0],
  finger: [1.05, 0],
  trigger: [1.05, 2],
  thumb: [1.0, 4],
  rib: [0.4, 0],
  upperback: [0, -3],
  nerveroot: [0.08, 2],
  lowback: [0, 0],
  sacroiliac: [0.16, 3],
  stomach: [0, 0],
  groin: [0.2, 0],
  hip: [0.34, 0],
  hipflexor: [0.24, -3],
  hipside: [0.62, 0],
  thighfront: [0.28, 0],
  thighback: [0.4, 2],
  knee: [0.3, 0],
  shin: [0.2, 0],
  shinfront: [0.36, 0],
  calf: [0.3, 0],
  achilles: [0.3, 1],
  ankle: [0.3, 2],
  foot: [0.46, -2],
  arch: [0.24, -1],
  forefoot: [0.5, -1],
  toe: [0.5, -3],
}

const VB_W = 220
const VB_H = 360
const BODY_TOP = 30
const BODY_BOTTOM = 336

const box = anchors.box
const normY = (y) => (y - box.min[1]) / (box.max[1] - box.min[1])

const positionOf = (id) => {
  const anchor = anchors.parts[id]
  const [lateral, dy] = LATERAL[id] ?? [0, 0]
  const x = VB_W / 2 + lateral * 46
  const y = BODY_BOTTOM - normY(anchor[1]) * (BODY_BOTTOM - BODY_TOP) + dy
  return { left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }
}

export default function Body2D({ selectedId, hoveredId = null, onSelect, onHover }) {
  return (
    <div
      className="relative mx-auto h-full w-full max-w-[290px] px-2 py-3 sm:max-w-[420px] sm:px-3 sm:py-4"
      // 点击空白处取消选中
      onClick={() => onSelect?.(null)}
    >
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full" role="img" aria-label="人体正面示意图">
        <defs>
          <linearGradient id="bodyFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#e8f2ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d9f2ee" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <g fill="url(#bodyFill)" stroke="rgba(15,169,160,0.35)" strokeWidth="1.2">
          <circle cx="110" cy="48" r="22" />
          <rect x="102" y="64" width="16" height="18" rx="7" />
          <rect x="52" y="86" width="17" height="128" rx="8.5" transform="rotate(6 60 90)" />
          <rect x="151" y="86" width="17" height="128" rx="8.5" transform="rotate(-6 160 90)" />
          <path d="M74 84 Q110 72 146 84 L150 148 Q110 162 70 148 Z" />
          <rect x="80" y="146" width="60" height="46" rx="18" />
          <rect x="76" y="188" width="68" height="32" rx="15" />
          <rect x="86" y="214" width="23" height="112" rx="11.5" />
          <rect x="111" y="214" width="23" height="112" rx="11.5" />
          <rect x="80" y="322" width="32" height="13" rx="6.5" />
          <rect x="108" y="322" width="32" height="13" rx="6.5" />
        </g>
      </svg>

      {INJURIES.map((part) => {
        const active = selectedId === part.id
        const hovered = hoveredId === part.id
        return (
          <button
            key={part.id}
            type="button"
            // 阻止冒泡，避免被外层「点空白处取消选中」接走；再点一次同一个点则取消
            onClick={(event) => {
              event.stopPropagation()
              onSelect(active ? null : part.id)
            }}
            onMouseEnter={() => onHover?.(part.id)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(part.id)}
            onBlur={() => onHover?.(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ ...positionOf(part.id), width: 44, height: 44 }}
            aria-label={`${part.name}：${part.brief}`}
            aria-pressed={active}
          >
            <span
              className={`absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                active || hovered ? 'h-[26px] w-[26px]' : 'h-[22px] w-[22px]'
              }`}
              style={{
                background:
                  'radial-gradient(circle, rgba(15,169,160,0.95) 0%, rgba(15,169,160,0.35) 55%, rgba(15,169,160,0) 72%)',
              }}
            />
            <span
              className={`hotspot-pulse absolute left-1/2 top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                active ? 'bg-[#0b8079]' : 'bg-[#0fa9a0]'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
