// 把 OBJ 转成 GLB（带平滑法线、UV 与按分组区分的材质），供网页加载使用
// 用法: node scripts/obj-to-glb.mjs source-models/makehuman-base.obj public/models/body.glb
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [, , input, output] = process.argv
if (!input || !output) {
  console.error('用法: node scripts/obj-to-glb.mjs <输入.obj> <输出.glb>')
  process.exit(1)
}

// MakeHuman 基础网格里除了人体，还有衣服、头发等 helper 网格。
// 这里只保留人体 + 紧身运动裤 + 眼球，并给不同分组不同的材质。
const GROUPS = [
  { match: 'body', material: 'Skin' },
  { match: 'helper-tights', material: 'Sportswear' },
  { match: 'helper-l-eye', material: 'Eye' },
  { match: 'helper-r-eye', material: 'Eye' },
]

const MATERIALS = {
  Skin: { baseColorFactor: [0.87, 0.65, 0.5, 1], metallicFactor: 0, roughnessFactor: 0.62 },
  // 紧身内层与皮肤同色：既遮住敏感部位，又保持「正常肤色的人体」外观
  Sportswear: { baseColorFactor: [0.87, 0.65, 0.5, 1], metallicFactor: 0, roughnessFactor: 0.64 },
  Eye: { baseColorFactor: [0.94, 0.95, 0.97, 1], metallicFactor: 0, roughnessFactor: 0.25 },
}

const materialFor = (group) => GROUPS.find((g) => group === g.match || group.startsWith(`${g.match}-`))?.material

const positions = []
const uvs = []
const groupFaces = new Map() // material -> faces

const resolveIndex = (raw, total) => {
  const value = Number(raw)
  return value > 0 ? value - 1 : total + value
}

let currentGroup = ''
for (const line of readFileSync(resolve(input), 'utf8').split(/\r?\n/)) {
  if (line.startsWith('v ')) {
    const [, x, y, z] = line.split(/\s+/)
    positions.push([Number(x), Number(y), Number(z)])
  } else if (line.startsWith('vt ')) {
    const [, u, v] = line.split(/\s+/)
    uvs.push([Number(u), Number(v)])
  } else if (line.startsWith('g ') || line.startsWith('o ')) {
    currentGroup = line.slice(2).trim()
  } else if (line.startsWith('f ')) {
    const material = materialFor(currentGroup)
    if (!material) continue
    const corners = line
      .split(/\s+/)
      .slice(1)
      .map((token) => {
        const [v, vt] = token.split('/')
        return { v: resolveIndex(v, positions.length), vt: vt ? resolveIndex(vt, uvs.length) : -1 }
      })
    if (!groupFaces.has(material)) groupFaces.set(material, [])
    groupFaces.get(material).push(corners)
  }
}

const faceNormal = (a, b, c) => {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
  const length = Math.hypot(n[0], n[1], n[2]) || 1
  return [n[0] / length, n[1] / length, n[2] / length]
}

// 每个材质单独一组顶点（三角化 + 平滑法线）
const meshes = []
for (const [material, faces] of groupFaces) {
  const vertexMap = new Map()
  const outPositions = []
  const outUvs = []
  const normalAccum = []
  const indices = []

  for (const corners of faces) {
    for (let i = 1; i + 1 < corners.length; i++) {
      const triangle = [corners[0], corners[i], corners[i + 1]]
      const points = triangle.map((corner) => positions[corner.v])
      const normal = faceNormal(points[0], points[1], points[2])
      for (const corner of triangle) {
        const key = `${corner.v}/${corner.vt}`
        let index = vertexMap.get(key)
        if (index === undefined) {
          index = outPositions.length
          vertexMap.set(key, index)
          outPositions.push(positions[corner.v])
          outUvs.push(corner.vt >= 0 ? uvs[corner.vt] : [0, 0])
          normalAccum.push([0, 0, 0])
        }
        normalAccum[index][0] += normal[0]
        normalAccum[index][1] += normal[1]
        normalAccum[index][2] += normal[2]
        indices.push(index)
      }
    }
  }

  const normals = normalAccum.map((n) => {
    const length = Math.hypot(n[0], n[1], n[2]) || 1
    return [n[0] / length, n[1] / length, n[2] / length]
  })
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const p of outPositions) {
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], p[i])
      max[i] = Math.max(max[i], p[i])
    }
  }
  meshes.push({ material, outPositions, outUvs, normals, indices, min, max })
}

// ---- 二进制缓冲 ----
const chunks = []
let byteLength = 0
const addBuffer = (typedArray) => {
  const buffer = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)
  const padding = (4 - (byteLength % 4)) % 4
  if (padding) {
    chunks.push(Buffer.alloc(padding))
    byteLength += padding
  }
  const offset = byteLength
  chunks.push(buffer)
  byteLength += buffer.length
  return { offset, length: buffer.length }
}

const accessors = []
const bufferViews = []
const primitives = []
const materials = []

for (const mesh of meshes) {
  const vertexCount = mesh.outPositions.length
  const positionView = addBuffer(new Float32Array(mesh.outPositions.flat()))
  const normalView = addBuffer(new Float32Array(mesh.normals.flat()))
  const uvView = addBuffer(new Float32Array(mesh.outUvs.flat()))
  const useUint32 = vertexCount > 65535
  const indexView = addBuffer(useUint32 ? new Uint32Array(mesh.indices) : new Uint16Array(mesh.indices))

  bufferViews.push(
    { buffer: 0, byteOffset: positionView.offset, byteLength: positionView.length, target: 34962 },
    { buffer: 0, byteOffset: normalView.offset, byteLength: normalView.length, target: 34962 },
    { buffer: 0, byteOffset: uvView.offset, byteLength: uvView.length, target: 34962 },
    { buffer: 0, byteOffset: indexView.offset, byteLength: indexView.length, target: 34963 },
  )

  const base = bufferViews.length - 4
  accessors.push(
    {
      bufferView: base,
      componentType: 5126,
      count: vertexCount,
      type: 'VEC3',
      min: mesh.min,
      max: mesh.max,
    },
    { bufferView: base + 1, componentType: 5126, count: vertexCount, type: 'VEC3' },
    { bufferView: base + 2, componentType: 5126, count: vertexCount, type: 'VEC2' },
    {
      bufferView: base + 3,
      componentType: useUint32 ? 5125 : 5123,
      count: mesh.indices.length,
      type: 'SCALAR',
    },
  )

  const accessorBase = accessors.length - 4
  const materialIndex = materials.findIndex((m) => m.name === mesh.material)
  const resolvedMaterial =
    materialIndex >= 0
      ? materialIndex
      : materials.push({ name: mesh.material, pbrMetallicRoughness: MATERIALS[mesh.material] }) - 1

  primitives.push({
    attributes: { POSITION: accessorBase, NORMAL: accessorBase + 1, TEXCOORD_0: accessorBase + 2 },
    indices: accessorBase + 3,
    material: resolvedMaterial,
  })

  console.log(
    `  ${mesh.material.padEnd(11)} 顶点 ${String(vertexCount).padStart(6)}  三角形 ${String(mesh.indices.length / 3).padStart(6)}`,
  )
}

const bin = Buffer.concat(chunks)

const gltf = {
  asset: { version: '2.0', generator: 'exsport obj-to-glb', copyright: 'MakeHuman base mesh (CC0)' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ name: 'Body', mesh: 0 }],
  meshes: [{ name: 'Body', primitives }],
  materials,
  buffers: [{ byteLength: bin.length }],
  bufferViews,
  accessors,
}

// ---- GLB 封装 ----
const jsonBuffer = Buffer.from(JSON.stringify(gltf), 'utf8')
const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4
const jsonChunk = Buffer.concat([jsonBuffer, Buffer.alloc(jsonPadding, 0x20)])
const binPadding = (4 - (bin.length % 4)) % 4
const binChunk = Buffer.concat([bin, Buffer.alloc(binPadding, 0)])

const header = Buffer.alloc(12)
header.write('glTF', 0, 'ascii')
header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8)

const jsonHeader = Buffer.alloc(8)
jsonHeader.writeUInt32LE(jsonChunk.length, 0)
jsonHeader.write('JSON', 4, 'ascii')

const binHeader = Buffer.alloc(8)
binHeader.writeUInt32LE(binChunk.length, 0)
binHeader.write('BIN\0', 4, 'ascii')

writeFileSync(resolve(output), Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]))
console.log(`已写入 ${output}`)
