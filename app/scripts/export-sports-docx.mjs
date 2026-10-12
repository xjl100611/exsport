// 把 src/data/sports.js 里的十项运动资料导出成 Word 文档所需的 XML 部件
// 输出目录: .docx-build/（随后由 PowerShell 打包成 .docx）
// 用法: node scripts/export-sports-docx.mjs
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SPORTS, DISCLAIMER } from '../src/data/sports.js'

const ROOT = resolve(import.meta.dirname, '..')
const OUT = resolve(ROOT, '.docx-build')
const NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

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

// 列表段落：numId 指向 numbering.xml 里的编号定义
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
let nextNumId = 10

const uniqueNumId = () => {
  const id = nextNumId++
  numberingDefs.push(`<w:num w:numId="${id}"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`)
  return id
}

// ---- 封面 ----
body.push(para(`exsport 运动资料（${SPORTS.length} 项）`, { style: 'Title' }))
body.push(
  para('面向运动爱好者与「想动还没动」人群的运动科普底稿：规则、入门步骤、装备、训练要点与常见错误', {
    size: 22,
    color: '5B6B84',
    spacing: [0, 240],
  }),
)
body.push(
  table(
    [
      ['整理日期', '2026-09-23'],
      ['来源', 'exsport 网站演示版内容数据（src/data/sports.js）'],
      ['内容性质', 'AI 生成底稿，正式发布前需人工审校'],
      ['免责声明', DISCLAIMER],
    ],
    [1800, 7200],
  ),
)

// ---- 一览表 ----
body.push(para(`${SPORTS.length} 项运动一览`, { style: 'Heading1' }))
body.push(
  table(
    [
      ['运动', '分类', '难度', '主要场地', '花费', '每次时长'],
      ...SPORTS.map((s) => [s.name, s.group, s.difficulty, s.venue, s.cost, s.duration]),
    ],
    [1100, 800, 1100, 2400, 2000, 1600],
  ),
)

// ---- 每项运动 ----
SPORTS.forEach((sport, index) => {
  body.push(para(`${index + 1}. ${sport.name}　${sport.en}`, { style: 'Heading1' }))
  body.push(
    table(
      [
        ['分类', sport.group, '难度', sport.difficulty],
        ['场地', sport.venue, '花费', sport.cost],
        ['适合人群', sport.audience, '每次时长', sport.duration],
      ],
      [1200, 3300, 1200, 3300],
    ),
  )

  body.push(para('简介', { style: 'Heading2' }))
  body.push(spaced(sport.intro))

  body.push(para('规则说明', { style: 'Heading2' }))
  sport.rules.forEach((item) => body.push(listItem(item, 1)))

  body.push(para('入门五步', { style: 'Heading2' }))
  const stepsNumId = uniqueNumId()
  sport.steps.forEach((item) => body.push(listItem(item, stepsNumId)))

  body.push(para('装备清单', { style: 'Heading2' }))
  body.push(table([['装备', '说明'], ...sport.gear.map((g) => [g.name, g.note])], [2200, 6800]))

  body.push(para('训练要点', { style: 'Heading2' }))
  sport.tips.forEach((item) => body.push(listItem(item, 1)))

  body.push(para('常见错误', { style: 'Heading2' }))
  sport.mistakes.forEach((item) => body.push(listItem(item, 1)))

  body.push(para('相关运动', { style: 'Heading2' }))
  body.push(
    spaced(
      sport.related
        .map((slug) => SPORTS.find((item) => item.slug === slug)?.name)
        .filter(Boolean)
        .join('、'),
    ),
  )
})

body.push(para('版权与素材说明', { style: 'Heading1' }))
body.push(
  spaced(
    '本资料为 exsport 网站演示版的内容底稿，其中运动知识与伤痛相关内容均为科普性质，不构成医疗建议；如有持续疼痛或伤病，请咨询医生或专业康复师。',
  ),
)

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${NS}"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="851" w:footer="992" w:gutter="0"/></w:sectPr></w:body></w:document>`

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="${NS}">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI" w:eastAsia="微软雅黑" w:cs="Segoe UI"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:rPrDefault>
  <w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="0" w:after="120"/></w:pPr><w:rPr><w:rFonts w:eastAsia="微软雅黑"/><w:b/><w:color w:val="0F172A"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="360" w:after="160"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="0B8079"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="0F172A"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
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
  <dc:title>exsport 十项运动资料</dc:title>
  <dc:creator>exsport</dc:creator>
  <cp:lastModifiedBy>exsport</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-09-23T00:00:00Z</dcterms:created>
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

console.log(`已生成 ${SPORTS.length} 项运动的文档部件：${OUT}`)
console.log(`段落数约 ${body.length}，编号列表 ${numberingDefs.length + 1} 组`)
