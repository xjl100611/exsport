// 列出 OBJ 里的分组（对象）名称与顶点数，用于筛掉衣服、头发等非人体部分
// 用法: node scripts/list-obj-groups.mjs source-models/makehuman-base.obj
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const file = process.argv[2]
if (!file) {
  console.error('用法: node scripts/list-obj-groups.mjs <模型路径>')
  process.exit(1)
}

const stats = new Map()
const positions = []
let current = '(未分组)'

for (const line of readFileSync(resolve(file), 'utf8').split(/\r?\n/)) {
  if (line.startsWith('g ') || line.startsWith('o ')) {
    current = line.slice(2).trim() || '(空名)'
    if (!stats.has(current)) stats.set(current, { v: 0, f: 0, used: new Set() })
    continue
  }
  if (line.startsWith('v ')) {
    const [, x, y, z] = line.split(/\s+/)
    positions.push([Number(x), Number(y), Number(z)])
  }
  if (!stats.has(current)) stats.set(current, { v: 0, f: 0, used: new Set() })
  const entry = stats.get(current)
  if (line.startsWith('v ')) entry.v++
  else if (line.startsWith('f ')) {
    entry.f++
    for (const token of line.split(/\s+/).slice(1)) {
      const raw = Number(token.split('/')[0])
      entry.used.add(raw > 0 ? raw - 1 : positions.length + raw)
    }
  }
}

const rows = [...stats.entries()].sort((a, b) => b[1].v - a[1].v)
console.log(`共 ${rows.length} 个分组：`)
for (const [name, { v, f, used }] of rows) {
  if (!used.size) {
    console.log(`  ${String(v).padStart(6)} 顶点 ${String(f).padStart(6)} 面   ${name}`)
    continue
  }
  const ys = [...used].map((i) => positions[i][1])
  const low = Math.min(...ys).toFixed(2)
  const high = Math.max(...ys).toFixed(2)
  console.log(`  ${String(v).padStart(6)} 顶点 ${String(f).padStart(6)} 面   高度 ${low} ~ ${high}   ${name}`)
}
