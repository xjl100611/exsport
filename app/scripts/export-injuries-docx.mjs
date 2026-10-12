// 把伤痛知识（src/data/injuries.js）导出成 Word 文档所需的 XML 部件
// 输出目录: .docx-build-injuries/（随后打包成 .docx）
// 用法: node scripts/export-injuries-docx.mjs
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { INJURIES } from '../src/data/injuries.js'
import { SPORTS, DISCLAIMER, getSport } from '../src/data/sports.js'
import { TCM, TCM_CANON, TCM_DISCLAIMER } from '../src/data/tcm.js'
import { MED, MED_SOURCES, MED_DISCLAIMER } from '../src/data/med.js'
import anchors from '../src/data/anchors.json' with { type: 'json' }

const ROOT = resolve(import.meta.dirname, '..')
const OUT = resolve(ROOT, '.docx-build-injuries')
const NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

// 按身体区域分组，方便检索
const REGIONS = [
  {
    title: '一、头颈与上肢',
    ids: ['neck', 'occiput', 'temple', 'jaw', 'shoulder', 'elbow', 'forearm', 'wrist', 'finger', 'trigger', 'thumb'],
  },
  {
    title: '二、躯干',
    ids: ['ribcart', 'rib', 'upperback', 'nerveroot', 'lowback', 'sacroiliac', 'stomach', 'groin'],
  },
  { title: '三、髋与大腿', ids: ['hip', 'hipflexor', 'hipside', 'thighfront', 'thighback'] },
  {
    title: '四、膝以下',
    ids: ['knee', 'shin', 'shinfront', 'calf', 'achilles', 'ankle', 'foot', 'arch', 'forefoot', 'toe'],
  },
]

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const run = (text, { bold = false, size = 22, color = null } = {}) =>
  `<w:r><w:rPr>${bold ? '<w:b/>' : ''}${color ? `<w:color w:val="${color}"/>` : ''}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`

const para = (text, { style = null, bold = false, size = 22, color = null, spacing = null } = {}) =>
  `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ''}${spacing ? `<w:spacing w:before="${spacing[0]}" w:after="${spacing[1]}"/>` : ''}</w:pPr>${run(text, { bold, size, color })}</w:p>`

const listItem = (text, numId) =>
  `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${numId}"/></w:numPr></w:pPr>${run(text)}</w:p>`

const cell = (text, { width, bold = false, shading = null } = {}) =>
  `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${shading ? `<w:shd w:val="clear" w:color="auto" w:fill="${shading}"/>` : ''}<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar></w:tcPr>${para(text, { bold, size: 20 })}</w:tc>`

const table = (rows, widths) => {
  const borders =
    '<w:tblBorders>' +
    ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
      .map((side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="D6DEE8"/>`)
      .join('') +
    '</w:tblBorders>'
  const body = rows
    .map(
      (row, index) =>
        `<w:tr>${row
          .map((value, column) =>
            cell(value, { width: widths[column], bold: index === 0, shading: index === 0 ? 'F2F7FF' : null }),
          )
          .join('')}</w:tr>`,
    )
    .join('')
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/>${borders}<w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${widths
    .map((w) => `<w:gridCol w:w="${w}"/>`)
    .join('')}</w:tblGrid>${body}</w:tbl>`
}

const spaced = (text, options = {}) => para(text, { spacing: [60, 120], ...options })

const body = []
const numberingDefs = []

const byId = Object.fromEntries(INJURIES.map((item) => [item.id, item]))
const orderedIds = REGIONS.flatMap((region) => region.ids)

// ---- 封面 ----
body.push(para('exsport 伤痛知识手册', { style: 'Title' }))
body.push(
  para('34 个常见不适部位：成因、运动方案、中医辨证与现代医学机制', {
    size: 22,
    color: '5B6B84',
    spacing: [0, 240],
  }),
)
body.push(
  table(
    [
      ['整理日期', '2026-10-08'],
      ['对应项目', 'exsport 网站首页 3D 人体伤痛地图'],
      [
        '覆盖范围',
        `${INJURIES.length} 个部位 · ${REGIONS.length} 个身体区域 · ${SPORTS.length} 项运动 · 每部位含中医辨证与现代医学 10 个维度`,
      ],
      ['内容性质', 'AI 生成底稿，发布前需人工审校'],
      ['免责声明', DISCLAIMER],
    ],
    [1800, 7200],
  ),
)

// ---- 使用说明 ----
body.push(para('怎么用这份手册', { style: 'Heading1' }))
body.push(
  spaced(
    '手册按身体区域编排：先看区域一览表定位部位，再翻到对应章节查看「常见原因 → 有帮助的运动 → 日常预防 → 就医提示 → 中医辨证与穴位参考」。中医部分只给辨证思路、穴位手法与经典方剂出处，不给用法用量。附录里还有一张反查表，可以从你正在练的运动反查需要注意的部位。',
  ),
)

// ---- 中医总论 ----
body.push(para('中医部分怎么看', { style: 'Heading1' }))
body.push(
  spaced(
    '中医看疼痛先辨虚实寒热：新伤多瘀属实，久痛多虚或入络；遇冷加重偏寒，红肿灼热偏湿热；酸软无力多属肝肾不足。本手册引用的典籍各有分工，见下表。',
  ),
)
body.push(
  table([['典籍', '在本手册中的作用'], ...TCM_CANON.map((item) => [item.book, item.role])], [2200, 6800]),
)
body.push(para('特殊人群提醒', { style: 'Heading3' }))
body.push(
  spaced(
    '孕妇应避免按压合谷、三阴交、昆仑、至阴等穴位，也不宜自行服用活血化瘀类方药；经期与产后气血偏虚，运动量与穴位刺激都应减少，日常调养可参考《傅青主女科》重视气血的思路；儿童骨骼尚未成熟，损伤评估与用药应由儿科或骨伤科医师处理（《小儿药证直诀》为儿科经典方书）；老年人久痛多兼肝肾不足，宜先补益、再通络。',
    { size: 20 },
  ),
)
body.push(spaced(TCM_DISCLAIMER, { color: 'B03A2E', size: 20 }))

// ---- 现代医学总论 ----
body.push(para('现代医学部分怎么看', { style: 'Heading1' }))
body.push(
  spaced(
    '每个部位都按十个维度整理：解剖结构、生理机制、病理改变、生化基础、药理类别、免疫机制、微生物风险、诊断要点、内科鉴别与外科指征。药理一栏只写药物类别与作用机制，不含剂量与用法。',
  ),
)
body.push(
  table(
    [['教材', '在手册中的维度'], ...MED_SOURCES.map((item) => [item.book, item.role])],
    [4400, 4600],
  ),
)
body.push(spaced(MED_DISCLAIMER, { color: 'B03A2E', size: 20 }))

// ---- 一览表 ----
body.push(para('三十四个部位一览', { style: 'Heading1' }))
body.push(
  table(
    [
      ['区域', '部位', '一句话说明', '相关运动数'],
      ...REGIONS.flatMap((region) =>
        region.ids.map((id) => {
          const item = byId[id]
          return [
            region.title.replace(/^[一二三四]、/, ''),
            item.name,
            item.brief,
            String(item.helpful.length),
            TCM[id]?.pattern ?? '—',
          ]
        }),
      ),
    ],
    [1100, 1000, 4200, 1100, 1600],
  ),
)

// ---- 正文 ----
REGIONS.forEach((region) => {
  body.push(para(region.title, { style: 'Heading1' }))
  region.ids.forEach((id, index) => {
    const item = byId[id]
    body.push(para(`${region.title.match(/^[一二三四]/)[0]}.${index + 1}　${item.name}　${item.en}`, { style: 'Heading2' }))
    body.push(spaced(item.brief, { color: '5B6B84' }))

    body.push(para('常见原因', { style: 'Heading3' }))
    item.causes.forEach((cause) => body.push(listItem(cause, 1)))

    body.push(para('有帮助的运动', { style: 'Heading3' }))
    body.push(
      table(
        [
          ['运动', '为什么适合'],
          ...item.helpful.map(({ slug, why }) => [getSport(slug)?.name ?? slug, why]),
        ],
        [2000, 7000],
      ),
    )

    body.push(para('日常预防', { style: 'Heading3' }))
    item.prevention.forEach((prevention) => body.push(listItem(prevention, 1)))

    body.push(para('就医提示', { style: 'Heading3' }))
    body.push(spaced(item.note, { color: 'B03A2E' }))

    const tcm = TCM[id]
    if (tcm) {
      body.push(para('中医辨证与穴位参考', { style: 'Heading3' }))
      body.push(spaced(`辨证：${tcm.pattern}。${tcm.patternNote}。`))
      body.push(spaced(tcm.classic, { size: 20, color: '5B6B84' }))
      body.push(
        table(
          [
            ['穴位', '归经', '手法', '注意'],
            ...tcm.points.map((point) => [point.name, point.meridian, point.method, point.caution ?? '—']),
          ],
          [1300, 1700, 4200, 1800],
        ),
      )
      body.push(
        spaced(
          `经典方剂参考：${tcm.formula.name}（${tcm.formula.source}），适用于${tcm.formula.indication}。${
            tcm.formula.note ?? ''
          }方药须由执业中医师辨证后开具，本手册不提供用法用量。`,
          { color: '16204A' },
        ),
      )
    }

    const med = MED[id]
    if (med) {
      body.push(para('现代医学视角', { style: 'Heading3' }))
      body.push(
        table(
          [
            ['维度与教材', '要点'],
            ...MED_SOURCES.map((source) => [`${source.role}（${source.book}）`, med[source.key]]),
          ],
          [3000, 6000],
        ),
      )
    }
  })
})

// ---- 反查表 ----
body.push(para('附录一：从运动反查需要注意的部位', { style: 'Heading1' }))
body.push(
  table(
    [
      ['运动', '常被推荐给这些部位'],
      ...SPORTS.map((sport) => {
        const names = INJURIES.filter((item) => item.helpful.some((entry) => entry.slug === sport.slug)).map(
          (item) => item.name,
        )
        return [sport.name, names.length ? names.join('、') : '—']
      }),
    ],
    [1600, 7400],
  ),
)

// ---- 坐标附录 ----
body.push(para('附录二：3D 人体锚点坐标（供网站维护使用）', { style: 'Heading1' }))
body.push(
  spaced(
    '坐标由 scripts/build-anchors.mjs 按解剖结构自动计算，单位是模型原始坐标（Y 轴向上）。新增痛点时在脚本里补一条关键词规则后重新运行即可。',
    { color: '5B6B84', size: 20 },
  ),
)
body.push(
  table(
    [
      ['部位', 'x', 'y', 'z'],
      ...orderedIds.map((id) => {
        const point = anchors.parts[id] ?? [0, 0, 0]
        return [byId[id].name, point[0].toFixed(1), point[1].toFixed(1), point[2].toFixed(1)]
      }),
    ],
    [2600, 2100, 2200, 2100],
  ),
)

body.push(para('内容来源与免责', { style: 'Heading1' }))
body.push(spaced(DISCLAIMER))
body.push(
  spaced('3D 人体解剖数据来自 BodyParts3D（CC BY-SA 2.1 JP）与 Z-Anatomy，经 BodyExplorer 项目整理。', {
    size: 20,
    color: '5B6B84',
  }),
)

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${NS}"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="851" w:footer="992" w:gutter="0"/></w:sectPr></w:body></w:document>`

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="${NS}">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI" w:eastAsia="微软雅黑" w:cs="Segoe UI"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:rPrDefault>
  <w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="0" w:after="120"/></w:pPr><w:rPr><w:b/><w:color w:val="0F172A"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="360" w:after="160"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="0B8079"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="300" w:after="120"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="16204A"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="80"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:color w:val="3F4A63"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60"/><w:contextualSpacing/></w:pPr></w:style>
</w:styles>`

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="${NS}">
  <w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/>
    <w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="425" w:hanging="284"/></w:pPr><w:rPr><w:rFonts w:ascii="Segoe UI Symbol" w:hAnsi="Segoe UI Symbol" w:hint="default"/></w:rPr></w:lvl>
  </w:abstractNum>
  <w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/>
    <w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="425" w:hanging="284"/></w:pPr></w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
  ${numberingDefs.join('\n  ')}
</w:numbering>`

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`

const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`

const documentRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`

const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>exsport 伤痛知识手册</dc:title>
  <dc:creator>exsport</dc:creator>
  <cp:lastModifiedBy>exsport</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-10-08T00:00:00Z</dcterms:created>
</cp:coreProperties>`

const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>exsport</Application></Properties>`

rmSync(OUT, { recursive: true, force: true })
mkdirSync(resolve(OUT, '_rels'), { recursive: true })
mkdirSync(resolve(OUT, 'word/_rels'), { recursive: true })
mkdirSync(resolve(OUT, 'docProps'), { recursive: true })

writeFileSync(resolve(OUT, '[Content_Types].xml'), contentTypes, 'utf8')
writeFileSync(resolve(OUT, '_rels/.rels'), rootRels, 'utf8')
writeFileSync(resolve(OUT, 'word/document.xml'), documentXml, 'utf8')
writeFileSync(resolve(OUT, 'word/styles.xml'), stylesXml, 'utf8')
writeFileSync(resolve(OUT, 'word/numbering.xml'), numberingXml, 'utf8')
writeFileSync(resolve(OUT, 'word/_rels/document.xml.rels'), documentRels, 'utf8')
writeFileSync(resolve(OUT, 'docProps/core.xml'), coreXml, 'utf8')
writeFileSync(resolve(OUT, 'docProps/app.xml'), appXml, 'utf8')

console.log(`已生成 ${INJURIES.length} 个部位的文档部件：${OUT}`)
console.log(`段落数约 ${body.length}，表格 ${(documentXml.match(/<w:tbl>/g) || []).length} 张`)
