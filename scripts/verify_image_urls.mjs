import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = path.join(projectRoot, 'dist')
const origin = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const method = (process.argv[3] || 'GET').toUpperCase()
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(absolute))
    else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) files.push(absolute)
  }
  return files
}

const files = await walk(outputDirectory)
const queue = files.map((file) => '/' + path.relative(outputDirectory, file).split(path.sep).join('/'))
const results = []
const workerCount = Math.min(16, queue.length)

async function worker() {
  while (queue.length) {
    const pathname = queue.shift()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15_000)
    try {
      const response = await fetch(origin + pathname, { method, signal: controller.signal })
      const contentType = response.headers.get('content-type') || ''
      const contentLength = Number(response.headers.get('content-length') || 0)
      const bodyBytes = method === 'HEAD' ? contentLength : (await response.arrayBuffer()).byteLength
      results.push({ pathname, status: response.status, contentType, bytes: bodyBytes })
    } catch (error) {
      results.push({ pathname, status: 0, contentType: '', bytes: 0, error: error.message })
    } finally {
      clearTimeout(timeout)
    }
  }
}

await Promise.all(Array.from({ length: workerCount }, () => worker()))

const failures = results.filter((item) => (
  item.status !== 200
  || !item.contentType.startsWith('image/')
  || item.bytes <= 0
))
const totalBytes = results.reduce((sum, item) => sum + item.bytes, 0)

console.log(JSON.stringify({
  origin,
  method,
  checked: results.length,
  failures: failures.length,
  totalBytes,
  failureDetails: failures.slice(0, 30),
}, null, 2))

if (failures.length) process.exitCode = 1
