import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import anchors from '../data/anchors.json'
import { INJURY_MAP, INJURIES } from '../data/injuries'
import { useReducedMotion } from '../hooks/useReducedMotion'
import InjuryPopup from './InjuryPopup'

// 肌肉 + 骨骼双层医学模型，来自 BodyParts3D（CC BY-SA）
const MUSCLE_URL = '/models/anatomy.glb'
const SKELETON_URL = '/models/skeleton.glb'
const TARGET_HEIGHT = 2
// 不要把相机放进模型内部：0.5 大约相当于模型深度的两倍
const MIN_DISTANCE = 0.5
const MAX_DISTANCE = 6
const REFERENCE_DISTANCE = 3.55
const MARKER_RADIUS = 0.018
const CARD_WIDTH = 320

const sourceBox = anchors.box
const normalized = Object.fromEntries(
  Object.entries(anchors.parts).map(([id, p]) => [
    id,
    [0, 1, 2].map((i) => (p[i] - sourceBox.min[i]) / sourceBox.size[i]),
  ]),
)

function useLayerMaterials() {
  return useMemo(
    () => ({
      muscle: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#b8503f'),
        roughness: 0.5,
        metalness: 0.03,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      bone: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f2e7d2'),
        roughness: 0.42,
        metalness: 0.02,
      }),
    }),
    [],
  )
}

function Body({ onReady }) {
  const muscle = useGLTF(MUSCLE_URL)
  const skeleton = useGLTF(SKELETON_URL)
  const materials = useLayerMaterials()

  useEffect(() => {
    muscle.scene.traverse((node) => {
      if (node.isMesh) node.material = materials.muscle
    })
    skeleton.scene.traverse((node) => {
      if (node.isMesh) node.material = materials.bone
    })
    onReady?.(muscle.scene, skeleton.scene)
  }, [muscle.scene, skeleton.scene, materials, onReady])

  return (
    <>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={muscle.scene} />
      </group>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={skeleton.scene} />
      </group>
    </>
  )
}

function Hotspot({ part, position, normal, active, dim, onSelect, onHover, popupPart, popupHandlers }) {
  const coreRef = useRef(null)
  const haloRef = useRef(null)
  const labelRef = useRef(null)
  const facingRef = useRef(1)
  const lastLabelRef = useRef(-1)
  const reducedMotion = useReducedMotion()
  const { camera, size } = useThree()

  useFrame((state) => {
    const world = new THREE.Vector3(...position)
    const view = camera.position.clone().sub(world).normalize()
    const opacity = THREE.MathUtils.smoothstep(normal.dot(view), 0.02, 0.45)
    facingRef.current = opacity

    // 标记按距离缩放，保证屏幕上始终是同样大小，放大到手指时不会盖住别的关节
    const screenScale = THREE.MathUtils.clamp(
      state.camera.position.distanceTo(world) / REFERENCE_DISTANCE,
      0.06,
      3,
    )

    if (coreRef.current) {
      coreRef.current.material.opacity = dim ? opacity * 0.35 : opacity
      coreRef.current.material.color.set(active ? '#ffffff' : '#3bf0cf')
      const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2.4 + part.name.length) * 0.12
      coreRef.current.scale.setScalar(screenScale * (active ? 1.25 : 1) * pulse)
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = (active ? 0.34 : 0.18) * opacity
      haloRef.current.scale.setScalar(screenScale * (active ? 1.9 : 1.6))
    }
    // 名称标注跟着一起淡入淡出，避免背面的点也显示名字
    if (labelRef.current && Math.abs(opacity - lastLabelRef.current) > 0.08) {
      labelRef.current.style.opacity = String(Math.round(opacity * 0.9 * 100) / 100)
      lastLabelRef.current = opacity
    }
  })

  // 卡片永远放在人体两侧的留白区：屏幕左半边的痛点显示在左侧，右半边的显示在右侧
  const popupPlacement = (() => {
    const projected = new THREE.Vector3(...position).project(camera)
    const screenX = (projected.x * 0.5 + 0.5) * size.width
    const screenY = (-projected.y * 0.5 + 0.5) * size.height
    const cardWidth = Math.min(CARD_WIDTH, size.width * 0.42)
    const edge = Math.max(16, size.width * 0.05)
    const cardHalfHeight = 115
    const targetX =
      screenX < size.width / 2 ? edge + cardWidth / 2 : size.width - edge - cardWidth / 2
    const targetY = THREE.MathUtils.clamp(
      screenY,
      cardHalfHeight + 12,
      size.height - cardHalfHeight - 12,
    )
    return {
      transform: `translate(${(targetX - screenX).toFixed(1)}px, ${(targetY - screenY).toFixed(1)}px)`,
      pointerEvents: 'auto',
    }
  })()

  return (
    <group position={position}>
      <mesh
        ref={coreRef}
        renderOrder={3}
        onPointerOver={(event) => {
          if (facingRef.current < 0.35) return
          event.stopPropagation()
          onHover(part.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = ''
        }}
        onClick={(event) => {
          if (facingRef.current < 0.35) return
          event.stopPropagation()
          onSelect(active ? null : part.id)
        }}
      >
        <sphereGeometry args={[MARKER_RADIUS, 20, 20]} />
        <meshBasicMaterial color="#3bf0cf" transparent opacity={1} />
      </mesh>

      <mesh ref={haloRef} renderOrder={2}>
        <sphereGeometry args={[MARKER_RADIUS, 16, 16]} />
        <meshBasicMaterial color="#3bf0cf" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {/* 关节点名称标注，平时就显示，方便一眼看清位置 */}
      <Html center style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none translate-x-3 whitespace-nowrap text-[11px] font-medium text-white"
          style={{
            opacity: 0,
            textShadow: '0 1px 4px rgba(10,12,40,.85), 0 0 2px rgba(10,12,40,.9)',
          }}
        >
          {part.name}
        </div>
      </Html>

      {popupPart && (
        // 外层不接收鼠标事件，否则会盖住痛点本体造成提示闪烁
        <Html center zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
          <div style={popupPlacement}>
            <InjuryPopup
              part={popupPart}
              onShowRelated={popupHandlers.onShowRelated}
              onMouseEnter={popupHandlers.onEnter}
              onMouseLeave={popupHandlers.onLeave}
            />
          </div>
        </Html>
      )}
    </group>
  )
}

function Scene({ selectedId, hoveredId, onSelect, onHover, popupHandlers, apiRef, onReady }) {
  const reducedMotion = useReducedMotion()
  const controls = useRef(null)
  const [runtimeBox, setRuntimeBox] = useState(null)
  const onReadyRef = useRef(onReady)
  const activeRef = useRef(null)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  const activeId = hoveredId || selectedId
  useEffect(() => {
    activeRef.current = activeId
  }, [activeId])
  const activePart = activeId ? INJURY_MAP[activeId] : null

  const handleReady = useCallback((muscleScene, skeletonScene) => {
    const box = new THREE.Box3().setFromObject(muscleScene)
    box.union(new THREE.Box3().setFromObject(skeletonScene))
    const yUpMin = new THREE.Vector3(box.min.x, box.min.z, -box.max.y)
    const yUpMax = new THREE.Vector3(box.max.x, box.max.z, -box.min.y)
    setRuntimeBox((prev) => prev ?? new THREE.Box3(yUpMin, yUpMax))
    onReadyRef.current?.()
  }, [])

  const transform = useMemo(() => {
    if (!runtimeBox) return null
    const size = runtimeBox.getSize(new THREE.Vector3())
    const center = runtimeBox.getCenter(new THREE.Vector3())
    return { scale: TARGET_HEIGHT / size.y, center, size }
  }, [runtimeBox])

  const hotspots = useMemo(() => {
    if (!transform) return []
    return INJURIES.map((part) => {
      const n = normalized[part.id]
      const position = [
        (n[0] - 0.5) * transform.size.x * transform.scale,
        (n[1] - 0.5) * transform.size.y * transform.scale,
        (n[2] - 0.5) * transform.size.z * transform.scale,
      ]
      const flat = new THREE.Vector3(position[0], 0, position[2])
      const normal = flat.lengthSq() > 1e-6 ? flat.normalize() : new THREE.Vector3(0, 0, 1)
      return { part, position, normal }
    })
  }, [transform])

  // 暴露缩放 / 聚焦接口给外层按钮。
  // 约定：zoom(1.35) 表示放大（相机靠近），zoom(1/1.35) 表示缩小。
  useEffect(() => {
    if (!apiRef) return
    apiRef.current = {
      zoom: (factor) => {
        const c = controls.current
        if (!c) return
        const target = hotspots.find((h) => h.part.id === activeRef.current)
        if (target) c.target.lerp(new THREE.Vector3(...target.position), 0.7)
        const cam = c.object
        const dir = cam.position.clone().sub(c.target).normalize()
        const distance = THREE.MathUtils.clamp(
          cam.position.distanceTo(c.target) / factor,
          MIN_DISTANCE,
          MAX_DISTANCE,
        )
        cam.position.copy(c.target).add(dir.multiplyScalar(distance))
        c.update()
      },
      reset: () => {
        const c = controls.current
        if (!c) return
        // 关掉阻尼并清掉残留增量，否则视角会被上一次拖动的惯性拉回去
        const damping = c.enableDamping
        c.enableDamping = false
        c.sphericalDelta?.set(0, 0, 0)
        c.panOffset?.set(0, 0, 0)
        c.scale = 1
        c.target.set(0, 0, 0)
        c.object.position.set(0, 0, REFERENCE_DISTANCE)
        c.update()
        c.enableDamping = damping
      },
      focus: (partId) => {
        const c = controls.current
        const target = hotspots.find((h) => h.part.id === partId)
        if (!c || !target) return
        const point = new THREE.Vector3(...target.position)
        c.target.copy(point)
        c.object.position
          .copy(point)
          .add(target.normal.clone().multiplyScalar(0.6))
          .add(new THREE.Vector3(0, 0.12, 0))
        c.update()
      },
    }
  }, [apiRef, hotspots])

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.5, 3.5, 4]} intensity={1.4} color="#fff6ee" />
      <directionalLight position={[-3, 1.5, -2.5]} intensity={0.6} color="#bcd4ff" />
      <hemisphereLight args={['#ffffff', '#5a5ce0', 0.4]} />

      <group
        scale={transform?.scale ?? 1}
        position={
          transform
            ? [
                -transform.center.x * transform.scale,
                -transform.center.y * transform.scale,
                -transform.center.z * transform.scale,
              ]
            : [0, 0, 0]
        }
      >
        <Body onReady={handleReady} />
      </group>

      {hotspots.map(({ part, position, normal }) => (
        <Hotspot
          key={part.id}
          part={part}
          position={position}
          normal={normal}
          active={activeId === part.id}
          dim={Boolean(activeId) && activeId !== part.id}
          onSelect={onSelect}
          onHover={onHover}
          popupPart={activePart?.id === part.id ? activePart : null}
          popupHandlers={popupHandlers}
        />
      ))}

      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={MIN_DISTANCE}
        maxDistance={MAX_DISTANCE}
        // 用官方实现：缩放时跟随光标，且不会把旋转中心拖进模型内部
        zoomToCursor
        autoRotate={!reducedMotion && !activeId}
        autoRotateSpeed={0.22}
        target={[0, 0, 0]}
      />
    </>
  )
}

export default function HumanBody3D({ onReady, ...props }) {
  const { progress, active } = useProgress()
  const [ready, setReady] = useState(false)
  const apiRef = props.apiRef

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, REFERENCE_DISTANCE], fov: 32 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        onPointerMissed={() => {
          props.onHover?.(null)
          props.onSelect?.(null)
        }}
        // 双击恢复初始视角，作为「还原」的快捷方式
        onDoubleClick={() => props.apiRef?.current?.reset()}
      >
        <Suspense fallback={null}>
          <Scene
            {...props}
            apiRef={apiRef}
            onReady={() => {
              setReady(true)
              onReady?.()
            }}
          />
        </Suspense>
      </Canvas>

      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/25">
            <div className="loading-bar h-full rounded-full" style={{ width: `${Math.max(progress, 6)}%` }} />
          </div>
          <p className="text-xs text-white/70">
            {active ? `正在加载解剖模型 ${progress.toFixed(0)}%` : '正在准备解剖模型…'}
          </p>
        </div>
      )}
    </div>
  )
}

useGLTF.preload(MUSCLE_URL)
useGLTF.preload(SKELETON_URL)
