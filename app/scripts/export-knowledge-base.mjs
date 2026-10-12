// 导出适合喂给 Dify 知识库的 Markdown 资料（每个部位一个文件，便于自动分段检索）
// 输出目录: ../知识库/
// 用法: node scripts/export-knowledge-base.mjs
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { INJURIES } from '../src/data/injuries.js'
import { SPORTS, DISCLAIMER, getSport } from '../src/data/sports.js'
import { TCM, TCM_DISCLAIMER } from '../src/data/tcm.js'
import { MED, MED_SOURCES, MED_DISCLAIMER } from '../src/data/med.js'

const ROOT = resolve(import.meta.dirname, '..')
const OUT = resolve(ROOT, '../知识库')

const REGIONS = [
  { title: '头颈与上肢', ids: ['neck', 'occiput', 'temple', 'jaw', 'shoulder', 'elbow', 'forearm', 'wrist', 'finger', 'trigger', 'thumb'] },
  { title: '躯干', ids: ['ribcart', 'rib', 'upperback', 'nerveroot', 'lowback', 'sacroiliac', 'stomach', 'groin'] },
  { title: '髋与大腿', ids: ['hip', 'hipflexor', 'hipside', 'thighfront', 'thighback'] },
  { title: '膝以下', ids: ['knee', 'shin', 'shinfront', 'calf', 'achilles', 'ankle', 'foot', 'arch', 'forefoot', 'toe'] },
]

const byId = Object.fromEntries(INJURIES.map((item) => [item.id, item]))
const pad = (n) => String(n).padStart(2, '0')

const fileFor = (region, id, index) => {
  const item = byId[id]
  const tcm = TCM[id]
  const med = MED[id]
  const lines = []

  lines.push(`# ${item.name}（${item.en}）`)
  lines.push('')
  lines.push(`所属部位：${region.title}　｜　关键词：${item.name}、${item.en}、${tcm?.pattern ?? ''}`)
  lines.push('')
  lines.push(`一句话说明：${item.brief}`)
  lines.push('')

  lines.push('## 常见原因')
  item.causes.forEach((cause) => lines.push(`- ${cause}`))
  lines.push('')

  lines.push('## 有帮助的运动')
  item.helpful.forEach(({ slug, why }) => {
    lines.push(`- ${getSport(slug)?.name ?? slug}：${why}`)
  })
  lines.push('')

  lines.push('## 日常预防')
  item.prevention.forEach((prevention) => lines.push(`- ${prevention}`))
  lines.push('')

  lines.push('## 就医提示（红旗征）')
  lines.push(item.note)
  lines.push('')

  if (tcm) {
    lines.push('## 中医辨证与穴位参考')
    lines.push(`- 辨证：${tcm.pattern}。${tcm.patternNote}。`)
    lines.push(`- 典籍依据：${tcm.classic}`)
    lines.push('- 可自我按揉的穴位：')
    tcm.points.forEach((point) => {
      lines.push(`  - ${point.name}（${point.meridian}）：${point.method}${point.caution ? `　注意：${point.caution}` : ''}`)
    })
    lines.push(
      `- 经典方剂参考：${tcm.formula.name}（${tcm.formula.source}），适用于${tcm.formula.indication}。${
        tcm.formula.note ?? ''
      }方药须由执业中医师辨证后开具，不提供用法用量。`,
    )
    lines.push('')
  }

  if (med) {
    lines.push('## 现代医学视角')
    MED_SOURCES.forEach((source) => {
      lines.push(`- ${source.role}（${source.book}）：${med[source.key]}`)
    })
    lines.push('')
  }

  lines.push('## 回答这类问题时的口径')
  lines.push('1. 先说明常见原因，再给出可自我执行的运动与预防建议。')
  lines.push('2. 涉及用药与诊断时，只说明药物类别与机制，不给剂量，并提示由医生评估。')
  lines.push('3. 命中红旗征时，优先建议就医，不做运动指导。')
  lines.push('')
  lines.push('## 免责声明')
  lines.push(`${DISCLAIMER}　${TCM_DISCLAIMER}　${MED_DISCLAIMER}`)
  lines.push('')

  return { path: `${region.title}/${pad(index)}-${item.name}.md`, content: lines.join('\n') }
}

rmSync(OUT, { recursive: true, force: true })

const index = []
const regionCount = new Map()

REGIONS.forEach((region) => {
  mkdirSync(resolve(OUT, region.title), { recursive: true })
  region.ids.forEach((id, i) => {
    const { path, content } = fileFor(region, id, i + 1)
    writeFileSync(resolve(OUT, path), content, 'utf8')
    const item = byId[id]
    index.push(`| ${region.title} | ${item.name} | ${item.brief} | ${TCM[id]?.pattern ?? '—'} | ${path} |`)
    regionCount.set(region.title, (regionCount.get(region.title) ?? 0) + 1)
  })
})

// 索引文件：便于人读，也便于智能客服先定位部位
const indexContent = [
  '# exsport 伤痛知识库索引',
  '',
  `收录部位：${INJURIES.length} 个（覆盖 ${SPORTS.length} 项运动的运动方案、中医辨证与穴位参考、现代医学十个维度）`,
  '',
  '| 区域 | 部位 | 一句话说明 | 中医辨证 | 文件 |',
  '|---|---|---|---|---|',
  ...index,
  '',
  '## 使用说明（给智能客服）',
  '1. 用户描述疼痛部位时，先在该表中定位对应文件，再读取该文件的内容作答。',
  '2. 用户描述的是「症状」而非部位时，可用常见原因与红旗征做匹配，必要时追问部位与诱因。',
  '3. 任何情况下不给出具体药物剂量，涉及用药与诊断一律建议就医。',
  '',
  DISCLAIMER,
  '',
].join('\n')

writeFileSync(resolve(OUT, '00-索引.md'), indexContent, 'utf8')

console.log(`已生成知识库文件：${OUT}`)
console.log(`文件数：${INJURIES.length + 1}（${INJURIES.length} 个部位 + 1 个索引）`)
regionCount.forEach((count, region) => console.log(`  ${region}：${count} 个部位`))
