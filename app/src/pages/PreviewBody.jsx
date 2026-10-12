// 开发用预览页：对比不同人体模型的效果（不进入正式导航）
// 访问 /preview?v=medical | muscle | skeleton | skin
import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useSearchParams } from 'react-router-dom'
import * as THREE from 'three'

const TARGET_HEIGHT = 2

const VARIANTS = {
  medical: {
    title: '医学解剖双层：肌肉 + 骨骼',
    layers: [
      { url: '/models/anatomy.glb', color: '#b8503f', opacity: 0.5, zUp: true },
      { url: '/models/skeleton.glb', color: '#f2e7d2', opacity: 1, zUp: true },
    ],
  },
  muscle: {
    title: '肌肉层（真实肌肉配色）',
    layers: [{ url: '/models/anatomy.glb', color: '#b8503f', opacity: 1, zUp: true }],
  },
  skeleton: {
    title: '骨骼层',
    layers: [{ url: '/models/skeleton.glb', color: '#f2e7d2', opacity: 1, zUp: true }],
  },
  skin: {
    title: '皮肤人体（当前线上使用）',
    layers: [{ url: '/models/body.glb', color: '#de9d74', opacity: 1, zUp: false }],
  },
}

// Z 轴向上转 Y 轴向上的包围盒换算
const toYUpBox = (box) => {
  const min = [box.min.x, box.min.z, -box.max.y]
  const max = [box.max.x, box.max.z, -box.min.y]
  const size = [0, 1, 2].map((i) => max[i] - min[i])
  const center = [0, 1, 2].map((i) => (min[i] + max[i]) / 2)
  return { size, center }
}

function Layer({ layer, transform }) {
  const { scene } = useGLTF(layer.url)

  useEffect(() => {
    scene.traverse((node) => {
      if (!node.isMesh) return
      node.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(layer.color),
        roughness: 0.55,
        metalness: 0.03,
        transparent: layer.opacity < 1,
        opacity: layer.opacity,
        depthWrite: layer.opacity >= 1,
        side: THREE.DoubleSide,
      })
    })
  }, [scene, layer.color, layer.opacity])

  return (
    <group
      rotation={layer.zUp ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
      scale={transform.scale}
      position={transform.position}
    >
      <primitive object={scene} />
    </group>
  )
}

function Rig({ variant }) {
  const first = variant.layers[0]
  const { scene } = useGLTF(first.url)
  const { camera } = useThree()

  // 用第一层的包围盒做归一化；两层共用同一套坐标（都来自 BodyParts3D），所以位置自然对齐
  const transform = useMemo(() => {
    const raw = new THREE.Box3().setFromObject(scene)
    const size = raw.getSize(new THREE.Vector3())
    const center = raw.getCenter(new THREE.Vector3())
    const box = first.zUp ? toYUpBox(raw) : { size: size.toArray(), center: center.toArray() }
    const scale = TARGET_HEIGHT / box.size[1]
    return { scale, position: box.center.map((c) => -c * scale) }
  }, [scene, first.zUp])

  useEffect(() => {
    camera.position.set(0, 0, TARGET_HEIGHT * 2.1)
    camera.lookAt(0, 0, 0)
  }, [camera, transform])

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2.5, 3.5, 4]} intensity={1.4} color="#fff6ee" />
      <directionalLight position={[-3, 1.5, -2.5]} intensity={0.6} color="#bcd4ff" />
      {variant.layers.map((layer) => (
        <Layer key={layer.url} layer={layer} transform={transform} />
      ))}
      <OrbitControls enablePan={false} enableDamping minDistance={1.5} maxDistance={8} target={[0, 0, 0]} />
    </>
  )
}

export default function PreviewBody() {
  const [params] = useSearchParams()
  const key = params.get('v') ?? 'medical'
  const variant = VARIANTS[key] ?? VARIANTS.medical

  return (
    <div className="flex h-[100svh] flex-col">
      <p className="px-6 pt-5 text-sm text-white/80">{variant.title}</p>
      <div className="min-h-0 flex-1">
        <Canvas camera={{ fov: 32 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <Rig variant={variant} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
