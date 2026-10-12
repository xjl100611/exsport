// 为医学解剖模型（BodyParts3D：肌肉 + 骨骼）计算痛点坐标
// 做法：按解剖学命名匹配网格（如 left patella、occipital bone、proximal phalanx of right index finger），
//      取这些结构的包围盒中心，再按部位需要推到体表方向，输出 Y 轴向上的坐标。
// 需要新增痛点时：在 PARTS 里加一条关键词规则，重新运行本脚本即可。
// 用法: node scripts/build-anchors.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const OUT_PATH = resolve(ROOT, 'src/data/anchors.json')
const MODELS = {
  // 用未压缩的源模型计算（数值是原始测量单位，压缩版在浏览器里几何一致）
  muscle: resolve(ROOT, 'source-models/anatomy.glb'),
  skeleton: resolve(ROOT, 'source-models/skeleton.glb'),
}

// push 决定标记最终落在身体的哪一侧表面：
//   front 身体正面 / back 背面 / side 侧面（左右按结构本身的 x 方向）
const PARTS = {
  neck: { keywords: ['sternocleidomastoid'], push: 'front' },
  occiput: { keywords: ['occipital bone'], push: 'back' },
  temple: { keywords: ['right temporal bone'], push: 'side' },
  jaw: { keywords: ['mandible'], push: 'side' },
  ribcart: { keywords: ['body of sternum'], push: 'front' },
  shoulder: { keywords: ['acromial part of right'], push: 'side' },
  elbow: { keywords: ['right humerus'], mode: 'distal', push: 'side' },
  forearm: { keywords: ['right brachioradialis'], push: 'side' },
  wrist: { keywords: ['flexor retinaculum of right wrist'], push: 'side' },
  finger: { keywords: ['proximal phalanx of right index finger'], push: 'side' },
  thumb: { keywords: ['right first metacarpal bone'], push: 'front' },
  rib: { keywords: ['external intercostal muscle'], push: 'front' },
  upperback: {
    keywords: ['right rhomboid major', 'right rhomboid minor', 'ascending part of right trapezius'],
    push: 'back',
  },
  lowback: { keywords: ['fourth lumbar vertebra', 'third lumbar vertebra'], push: 'back' },
  nerveroot: { keywords: ['fifth lumbar vertebra'], push: 'back' },
  stomach: { keywords: ['right rectus abdominis'], push: 'front' },
  groin: { keywords: ['right adductor longus', 'right pectineus'], push: 'front' },
  hip: { keywords: ['right hip bone'], push: 'side' },
  sacroiliac: { keywords: ['right hip bone'], push: 'back' },
  hipflexor: { keywords: ['right iliacus', 'right psoas major'], push: 'front' },
  hipside: {
    keywords: ['right gluteus medius', 'right gluteus minimus', 'right iliotibial tract'],
    push: 'side',
  },
  thighfront: {
    keywords: ['right rectus femoris', 'right vastus lateralis', 'right vastus medialis'],
    push: 'front',
  },
  thighback: {
    keywords: ['right biceps femoris', 'right semitendinosus', 'right semimembranosus'],
    push: 'back',
  },
  knee: { keywords: ['right patella'], push: 'front' },
  shin: { keywords: ['right tibia'], push: 'inner' },
  shinfront: { keywords: ['right tibialis anterior'], push: 'front' },
  calf: { keywords: ['medial head of right gastrocnemius', 'right soleus'], push: 'back' },
  achilles: { keywords: ['right calcaneal tendon'], push: 'back' },
  ankle: { keywords: ['right talus'], push: 'side' },
  foot: { keywords: ['first plantar interosseous of right foot'], push: 'side' },
  arch: { keywords: ['navicular bone of right foot'], push: 'inner' },
  forefoot: { keywords: ['right first metatarsal bone'], push: 'front' },
  toe: { keywords: ['distal phalanx of right big toe'], push: 'front' },
  trigger: { keywords: ['proximal phalanx of right middle finger'], push: 'front' },
}

function parseGlb(path) {
  const buf = readFileSync(path)
  if (buf.toString('ascii', 0, 4) !== 'glTF') throw new Error(`${path} 不是 GLB 文件`)
  let offset = 12
  let json = null
  while (offset < buf.length) {
    const len = buf.readUInt32LE(offset)
    const type = buf.toString('ascii', offset + 4, offset + 8)
    if (type.trim() === 'JSON') json = JSON.parse(buf.toString('utf8', offset + 8, offset + 8 + len))
    offset += 8 + len + ((4 - (len % 4)) % 4)
  }
  if (!json) throw new Error(`${path} 缺少 JSON chunk`)
  return json
}

const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function multiply(a, b) {
  const out = new Array(16).fill(0)
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let sum = 0
      for (let k = 0; k < 4; k++) sum += a[k * 4 + r] * b[c * 4 + k]
      out[c * 4 + r] = sum
    }
  }
  return out
}

function fromTRS({ translation = [0, 0, 0], rotation = [0, 0, 0, 1], scale = [1, 1, 1] }) {
  const [x, y, z, w] = rotation
  const x2 = x + x, y2 = y + y, z2 = z + z
  const xx = x * x2, xy = x * y2, xz = x * z2
  const yy = y * y2, yz = y * z2, zz = z * z2
  const wx = w * x2, wy = w * y2, wz = w * z2
  const [sx, sy, sz] = scale
  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    translation[0], translation[1], translation[2], 1,
  ]
}

const transformPoint = (m, [x, y, z]) => [
  m[0] * x + m[4] * y + m[8] * z + m[12],
  m[1] * x + m[5] * y + m[9] * z + m[13],
  m[2] * x + m[6] * y + m[10] * z + m[14],
]

function collectMeshes(json) {
  const meshes = []
  const visit = (nodeIndex, parentMatrix) => {
    const node = json.nodes[nodeIndex]
    const world = multiply(parentMatrix, node.matrix ? node.matrix.map(Number) : fromTRS(node))
    if (node.mesh !== undefined) {
      const mesh = json.meshes[node.mesh]
      for (const prim of mesh.primitives || []) {
        const accessor = json.accessors[prim.attributes.POSITION]
        if (!accessor?.min || !accessor?.max) continue
        const [minX, minY, minZ] = accessor.min
        const [maxX, maxY, maxZ] = accessor.max
        const min = [Infinity, Infinity, Infinity]
        const max = [-Infinity, -Infinity, -Infinity]
        const corners = []
        for (const cx of [minX, maxX]) {
          for (const cy of [minY, maxY]) {
            for (const cz of [minZ, maxZ]) {
              const p = transformPoint(world, [cx, cy, cz])
              corners.push(p)
              for (let i = 0; i < 3; i++) {
                min[i] = Math.min(min[i], p[i])
                max[i] = Math.max(max[i], p[i])
              }
            }
          }
        }
        const center = [0, 1, 2].map((i) => corners.reduce((s, c) => s + c[i], 0) / corners.length)
        const volume = (max[0] - min[0]) * (max[1] - min[1]) * (max[2] - min[2])
        meshes.push({ name: mesh.name || node.name || '', min, max, center, volume })
      }
    }
    for (const child of node.children || []) visit(child, world)
  }
  for (const nodeIndex of json.scenes[json.scene || 0].nodes || []) visit(nodeIndex, identity())
  return meshes
}

// Z 轴向上转 Y 轴向上：(x, y, z) -> (x, z, -y)
const toYUp = (p) => [p[0], p[2], -p[1]]
const yUpMesh = (mesh) => ({
  ...mesh,
  min: [mesh.min[0], mesh.min[2], -mesh.max[1]],
  max: [mesh.max[0], mesh.max[2], -mesh.min[1]],
  center: toYUp(mesh.center),
})

const bounds = (meshes) => {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const m of meshes) {
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], m.min[i])
      max[i] = Math.max(max[i], m.max[i])
    }
  }
  return { min, max, size: [0, 1, 2].map((i) => max[i] - min[i]) }
}

const muscle = collectMeshes(parseGlb(MODELS.muscle)).map(yUpMesh)
const skeleton = collectMeshes(parseGlb(MODELS.skeleton)).map(yUpMesh)
const all = [...skeleton, ...muscle]
const box = bounds([...muscle, ...skeleton])
const height = box.size[1]
const axisZ = (box.min[2] + box.max[2]) / 2

console.log(`肌肉网格 ${muscle.length} / 骨骼网格 ${skeleton.length}`)
console.log(`包围盒 Y 高度 ${height.toFixed(1)}，深度中心 ${axisZ.toFixed(1)}`)

const round = (n) => Number(n.toFixed(4))
const parts = {}

for (const [id, rule] of Object.entries(PARTS)) {
  const hits = all.filter((m) => rule.keywords.some((k) => m.name.toLowerCase().includes(k)))
  if (!hits.length) {
    console.warn(`  警告：${id} 未匹配到结构`)
    continue
  }

  let point = [0, 1, 2].map(
    (i) => hits.reduce((s, m) => s + m.center[i] * Math.max(m.volume, 1e-9), 0) /
      hits.reduce((s, m) => s + Math.max(m.volume, 1e-9), 0),
  )

  // 关节类部位取结构的远端（例如肱骨下端就是肘关节所在处）
  if (rule.mode === 'distal') {
    const bottom = Math.min(...hits.map((m) => m.min[1]))
    point[1] = point[1] + (bottom - point[1]) * 0.72
  }

  // 按部位语义把标记推到该结构的外表面：正面 / 背面 / 侧面（右侧结构在 -x 方向）
  const minX = Math.min(...hits.map((m) => m.min[0]))
  const maxX = Math.max(...hits.map((m) => m.max[0]))
  const minZ = Math.min(...hits.map((m) => m.min[2]))
  const maxZ = Math.max(...hits.map((m) => m.max[2]))
  const margin = height * 0.008
  if (rule.push === 'front') point[2] = maxZ + margin
  else if (rule.push === 'back') point[2] = minZ - margin
  else if (rule.push === 'inner') point[0] = point[0] < 0 ? maxX + margin : minX - margin
  else point[0] = (point[0] >= 0 ? maxX + margin : minX - margin)

  parts[id] = point.map(round)
  console.log(`  ${id.padEnd(9)} 命中 ${String(hits.length).padStart(3)} 个（${rule.keywords[0]}）-> [${parts[id].join(', ')}]`)
}

const output = {
  generatedAt: new Date().toISOString(),
  script: 'scripts/build-anchors.mjs',
  model: '/models/anatomy.glb + /models/skeleton.glb',
  attribution: 'BodyParts3D（CC BY-SA 2.1 JP）+ Z-Anatomy 肌肉与骨骼数据，经 BodyExplorer 项目整理',
  orientation: 'Y_UP（由 Z 轴向上转换而来，应用内需把模型绕 X 轴旋转 -90°）',
  box: { min: box.min.map(round), max: box.max.map(round), size: box.size.map(round) },
  parts,
}

mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`\n已写入 ${OUT_PATH}`)
