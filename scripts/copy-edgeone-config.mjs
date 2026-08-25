import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = path.join(projectRoot, 'dist')

await mkdir(outputDirectory, { recursive: true })
const sourceConfig = JSON.parse(await readFile(path.join(projectRoot, 'edgeone.json'), 'utf8'))

// A direct upload already contains the finished static site. Only deployment
// rules belong in dist; copying build commands would make EdgeOne try to build
// the already-built folder again.
await writeFile(
  path.join(outputDirectory, 'edgeone.json'),
  JSON.stringify({ headers: sourceConfig.headers }, null, 2) + '\n',
  'utf8',
)
