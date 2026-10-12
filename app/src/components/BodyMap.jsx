import { Component, Suspense, useEffect, useState } from 'react'
import Body2D from './Body2D'
import HumanBody3D from './HumanBody3D'

class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('3D 场景加载失败，已降级为 2D 人体图：', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

// 宽屏且支持 WebGL 时用 3D，否则用 2D 剪影；两条路径的热点行为完全一致
export default function BodyMap({ onModeChange, ...props }) {
  const [mode, setMode] = useState('2d')
  const [ready, setReady] = useState(false)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const decide = () => {
      const next = window.innerWidth >= 768 && supportsWebGL() ? '3d' : '2d'
      setMode(next)
      onModeChange?.(next)
    }
    decide()
    window.addEventListener('resize', decide)
    return () => window.removeEventListener('resize', decide)
  }, [onModeChange])

  // 3D 模型较大时给一个兜底：超过 9 秒还没渲染出来就切回 2D 示意图，避免一直卡在加载条
  useEffect(() => {
    if (mode !== '3d' || ready) return undefined
    const timer = setTimeout(() => setSlow(true), 9000)
    return () => clearTimeout(timer)
  }, [mode, ready])

  if (mode === '2d' || slow) {
    return (
      <div className="h-full w-full">
        <Body2D {...props} />
        {slow && (
          <p className="absolute inset-x-0 bottom-24 mx-auto w-fit rounded-full bg-white/15 px-4 py-1.5 text-xs text-white/80 backdrop-blur">
            3D 模型加载较慢，已先切换为示意图
          </p>
        )}
      </div>
    )
  }

  return (
    <SceneBoundary fallback={<Body2D {...props} />}>
      <Suspense fallback={<Body2D {...props} />}>
        <HumanBody3D
          {...props}
          onReady={() => {
            setReady(true)
            props.onReady?.()
          }}
        />
      </Suspense>
    </SceneBoundary>
  )
}
