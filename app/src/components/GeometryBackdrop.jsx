// 浅色渐变 + 几何图形背景，替代照片素材
export default function GeometryBackdrop({ variant = 'hero' }) {
  const shapes =
    variant === 'hero'
      ? [
          { size: 220, left: '6%', top: '12%', color: 'rgba(15,169,160,0.20)', delay: '0s' },
          { size: 140, left: '78%', top: '8%', color: 'rgba(74,124,255,0.22)', delay: '1.4s' },
          { size: 96, left: '70%', top: '68%', color: 'rgba(108,92,231,0.20)', delay: '2.6s' },
          { size: 64, left: '16%', top: '74%', color: 'rgba(74,124,255,0.24)', delay: '3.4s' },
        ]
      : [
          { size: 130, left: '4%', top: '18%', color: 'rgba(15,169,160,0.16)', delay: '0.4s' },
          { size: 80, left: '88%', top: '30%', color: 'rgba(108,92,231,0.18)', delay: '1.8s' },
        ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {shapes.map((shape, index) => (
        <span
          key={index}
          className="geo"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: shape.left,
            top: shape.top,
            background: `radial-gradient(circle at 30% 30%, ${shape.color}, rgba(255,255,255,0))`,
            animationDelay: shape.delay,
          }}
        />
      ))}
      <svg className="absolute inset-x-0 bottom-0 w-full opacity-[0.16]" height="180" viewBox="0 0 1200 180" preserveAspectRatio="none">
        <defs>
          <pattern id="hex" width="60" height="52" patternUnits="userSpaceOnUse">
            <path d="M30 2 L58 17 L58 43 L30 58 L2 43 L2 17 Z" fill="none" stroke="#4a7cff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1200" height="180" fill="url(#hex)" />
      </svg>
    </div>
  )
}
