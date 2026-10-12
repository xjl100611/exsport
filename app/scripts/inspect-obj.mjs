// 检查 OBJ 模型的基本结构：顶点数、面数、包围盒、是否有手指等
// 用法: node scripts/inspect-obj.mjs source-models/makehuman-base.obj
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const file = process.argv[2]
if (!file) {
  console.error('用法: node scripts/inspect-obj.mjs <模型路径>')
  process.exit(1)
}

const text = readFileSync(resolve(file), 'utf8')
const lines = text.split(/\r?\n/)

let v = 0
let vn = 0
let vt = 0
let f = 0
const groups = new Set()
const materials = new Set()
const min = [Infinity, Infinity, Infinity]
const max = [-Infinity, -Infinity, -Infinity]
const points = []

for (const line of lines) {
  if (line.startsWith('v ')) {
    const [, x, y, z] = line.split(/\s+/).map(Number)
    v++
    points.push([x, y, z])
    for (let i = 0; i < 3; i++) {
      const value = [x, y, z][i]
      min[i] = Math.min(min[i], value)
      max[i] = Math.max(max[i], value)
    }
  } else if (line.startsWith('vn ')) vn++
  else if (line.startsWith('vt ')) vt++
  else if (line.startsWith('f ')) f++
  else if (line.startsWith('g ') || line.startsWith('o ')) groups.add(line.slice(2).trim())
  else if (line.startsWith('usemtl ')) materials.add(line.slice(7).trim())
}

const size = [0, 1, 2].map((i) => max[i] - min[i])
console.log(`顶点 ${v} / 法线 ${vn} / UV ${vt} / 面 ${f}`)
console.log(`包围盒 min ${min.map((n) => n.toFixed(3)).join(', ')}`)
console.log(`包围盒 max ${max.map((n) => n.toFixed(3)).join(', ')}`)
console.log(`尺寸 ${size.map((n) => n.toFixed(3)).join(', ')}`)
console.log(`分组 ${groups.size} 个，材质 ${materials.size} 个`)

// 沿高度切片，看每一层的顶点数与横向跨度，用于判断手、脚、手指是否存在
console.log('\n高度分布（从下到上 10 层）：顶点数 / x 跨度 / z 跨度')
const slices = 10
for (let i = 0; i < slices; i++) {
  const low = min[1] + (size[1] * i) / slices
  const high = min[1] + (size[1] * (i + 1)) / slices
  const layer = points.filter((p) => p[1] >= low && p[1] < high)
  if (!layer.length) {
    console.log(`  第 ${i + 1} 层 0 个`)
    continue
  }
  const xs = layer.map((p) => p[0])
  const zs = layer.map((p) => p[2])
  const xSpan = Math.max(...xs) - Math.min(...xs)
  const zSpan = Math.max(...zs) - Math.min(...zs)
  console.log(
    `  第 ${i + 1} 层 高度 ${low.toFixed(2)}~${high.toFixed(2)}  顶点 ${String(layer.length).padStart(5)}  x 跨度 ${xSpan.toFixed(3)}  z 跨度 ${zSpan.toFixed(3)}`,
  )
}

// 手部区域：看 x 方向是否出现多个分离的簇（手指）
const handLow = min[1] + size[1] * 0.4
const handHigh = min[1] + size[1] * 0.55
const hand = points.filter((p) => p[1] >= handLow && p[1] <= handHigh && p[0] > size[0] * 0.15)
if (hand.length) {
  const xs = [...new Set(hand.map((p) => Number(p[0].toFixed(3))))].sort((a, b) => a - b)
  console.log(`\n手部区域顶点 ${hand.length} 个，x 取值 ${xs.length} 种，范围 ${xs[0]} ~ ${xs[xs.length - 1]}`)
}
