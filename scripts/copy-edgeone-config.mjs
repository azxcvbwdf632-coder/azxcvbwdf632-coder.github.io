import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = path.join(projectRoot, 'dist')

await mkdir(outputDirectory, { recursive: true })
await copyFile(path.join(projectRoot, 'edgeone.json'), path.join(outputDirectory, 'edgeone.json'))
