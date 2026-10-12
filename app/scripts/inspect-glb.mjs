// 读取 GLB 文件的结构摘要：节点名、网格名、是否压缩、包围盒范围
// 用法: node scripts/inspect-glb.mjs public/models/anatomy.glb
import { readFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) {
  console.error('用法: node scripts/inspect-glb.mjs <模型路径>')
  process.exit(1)
}

const buf = readFileSync(file)
const magic = buf.toString('ascii', 0, 4)
const version = buf.readUInt32LE(4)
const total = buf.readUInt32LE(8)
console.log(`文件: ${file}`)
console.log(`magic=${magic} version=${version} 声明长度=${total} 实际长度=${buf.length}`)

let offset = 12
let json = null
const chunks = []
while (offset < buf.length) {
  const len = buf.readUInt32LE(offset)
  const type = buf.toString('ascii', offset + 4, offset + 8)
  chunks.push({ type, len })
  if (type.trim() === 'JSON') {
    json = JSON.parse(buf.toString('utf8', offset + 8, offset + 8 + len))
  }
  offset += 8 + len + ((4 - (len % 4)) % 4)
}

console.log('chunk:', chunks.map((c) => `${c.type.trim()}:${c.len}`).join(' '))
if (!json) {
  console.error('未找到 JSON chunk')
  process.exit(1)
}

const n = (v) => (Array.isArray(v) ? v.length : 0)
console.log(`节点 ${n(json.nodes)} / 网格 ${n(json.meshes)} / 材质 ${n(json.materials)} / 皮肤 ${n(json.skins)}`)
console.log(`扩展: ${(json.extensionsUsed || []).join(', ') || '无'}`)
console.log(`生成器: ${json.asset?.generator || '未知'}`)

const keywords = process.argv[3]
  ? process.argv[3].split(',').map((s) => s.trim().toLowerCase())
  : [
      'neck', 'shoulder', 'elbow', 'wrist', 'lumbar', 'waist', 'hip', 'knee',
      'ankle', 'foot', 'plantar', 'calf', 'achilles', 'spine', 'vertebra',
    ]

const names = (json.meshes || []).map((m) => m.name || '(未命名)')
console.log(`\n网格名前 25 个:`)
names.slice(0, 25).forEach((name, i) => console.log(`  ${i + 1}. ${name}`))

console.log(`\n部位关键词命中情况:`)
for (const key of keywords) {
  const hit = names.filter((name) => name.toLowerCase().includes(key))
  console.log(`  ${key.padEnd(10)} ${hit.length} 个  ${hit.slice(0, 3).join(' | ')}`)
}
