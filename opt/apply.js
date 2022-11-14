import { autocompleteInput, confirmInput } from '../lib/prompts.js'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pupa from 'pupa'

export default async(palette) => {
  console.log('APPLY')

  const getPath = (path) => resolve(
    dirname(fileURLToPath(import.meta.url)),
    path)

  fs.ensureDir('/tmp/mxcolr')

  const { tpl } = await autocompleteInput('tpl', Object.keys(cfg.templates))

  const { input, output } = cfg.templates[tpl]
  const tplPath = getPath(`../templates/${input}`)
  const file = fs.readFileSync(tplPath, { encoding: 'utf8' })

  const parsed = pupa(file, palette)

  const { writeTpl } = await confirmInput('writeTpl', `apply ${tpl}?`)
  if (writeTpl) {
    fs.writeFileSync(output, parsed)
  }
}

// const templates = fs.readdirSync(getPath('../templates/'))

