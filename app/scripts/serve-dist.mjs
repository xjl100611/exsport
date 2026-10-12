// 极简静态服务器：只服务 dist 里的构建产物，不带热更新与文件监听，稳定不容易挂
// 用法: node scripts/serve-dist.mjs   （或 npm run serve）
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../dist')
const port = Number(process.env.PORT ?? 5173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const exists = async (path) => {
  const info = await stat(path).catch(() => null)
  return info?.isFile() ? info : null
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost')
    const requested = resolve(join(root, decodeURIComponent(url.pathname)))
    if (!requested.startsWith(root)) {
      response.writeHead(403).end('Forbidden')
      return
    }

    // 命中文件就直接返回；否则回退到 index.html（单页应用路由）
    const direct = await exists(requested)
    const filePath = direct ? requested : join(root, 'index.html')
    if (!direct && !(await exists(filePath))) {
      response.writeHead(404).end('Not found')
      return
    }

    const body = await readFile(filePath)
    response.writeHead(200, {
      'Content-Type': TYPES[extname(filePath)] ?? 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-cache',
    })
    response.end(body)
  } catch (error) {
    response.writeHead(500).end(`Server error: ${error}`)
  }
})

// 端口被占用时不退出：可能已有另一个启动方式把它拉起来了。
// 等待重试而不是崩溃，这样多种自启方式同时存在也不会互相干扰。
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`端口 ${port} 已被占用，10 秒后重试（服务应已在运行）`)
    setTimeout(() => server.listen(port), 10000)
    return
  }
  console.error('服务启动失败：', error)
  process.exit(1)
})

server.listen(port, () => {
  console.log(`exsport 静态预览已启动: http://localhost:${port}`)
})
