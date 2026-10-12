import { useCallback, useRef, useState } from 'react'
import BodyMap from './BodyMap'
import InjuryPopup from './InjuryPopup'
import { INJURY_MAP } from '../data/injuries'

// 顶部以下整块区域：3D 人体 + 指到痛点弹出的原因卡片
export default function BodyStage({ onShowRelated }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('2d')
  const hideTimer = useRef(null)
  const apiRef = useRef(null)

  // 鼠标从热点移到弹窗上时会先触发热点移出，这里留 240ms 缓冲，移进弹窗就取消关闭
  const hold = useCallback((id) => {
    clearTimeout(hideTimer.current)
    setHoveredId(id)
  }, [])

  const release = useCallback(() => {
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHoveredId(null), 320)
  }, [])

  const activeId = hoveredId || selectedId
  const part = activeId ? INJURY_MAP[activeId] : null

  const popupHandlers = {
    onEnter: () => hold(activeId),
    onLeave: release,
    onShowRelated,
  }

  const handleHover = (id) => (id ? hold(id) : release())
  const showSheet = mode === '2d' && part

  return (
    <div className="relative h-full w-full">
      <BodyMap
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={setSelectedId}
        onHover={handleHover}
        onModeChange={setMode}
        popupHandlers={popupHandlers}
        apiRef={apiRef}
      />

      {mode === '3d' && (
        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-glass btn-sm"
              onClick={() => apiRef.current?.zoom(1.35)}
              aria-label="放大"
            >
              放大 ＋
            </button>
            <button
              type="button"
              className="btn btn-glass btn-sm"
              onClick={() => apiRef.current?.zoom(1 / 1.35)}
              aria-label="缩小"
            >
              缩小 －
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-glass btn-sm"
              onClick={() => apiRef.current?.reset()}
              aria-label="回到全身"
            >
              全身
            </button>
            <button
              type="button"
              className="btn btn-blue btn-sm"
              onClick={() => {
                setSelectedId('finger')
                apiRef.current?.focus('finger')
              }}
            >
              看手指关节
            </button>
          </div>
          <p className="rounded-full bg-white/12 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
            身体转到背面时，正面痛点会自动淡出
          </p>
        </div>
      )}

      {showSheet && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center px-4">
          <InjuryPopup
            part={part}
            onShowRelated={onShowRelated}
            onMouseEnter={popupHandlers.onEnter}
            onMouseLeave={release}
          />
        </div>
      )}

      {!showSheet && (
        <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center px-4">
          <p className="rounded-full bg-white/15 px-4 py-1.5 text-xs text-white/80 backdrop-blur">
            {mode === '3d' ? '拖动旋转 · 滚轮缩放 · 指到发光点看主要原因' : '点一下发光点看主要原因'}
          </p>
        </div>
      )}

      {/* 内容声明与模型署名：内容声明放在前面，模型署名是 CC BY-SA 协议要求 */}
      <div className="absolute bottom-2 left-4 max-w-[560px] space-y-0.5">
        <p className="text-[11px] leading-snug text-white/60">
          内容整理自公开医学教材与传统文献，仅供了解参考，不构成诊断或用药建议；症状持续、加重或发生外伤请及时就医。
        </p>
        <p className="text-[10px] leading-tight text-white/40">
          3D 解剖数据：BodyParts3D（CC BY-SA 2.1 JP）/ Z-Anatomy，经 BodyExplorer 整理
        </p>
      </div>
    </div>
  )
}
