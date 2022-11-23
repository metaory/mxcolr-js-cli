import { autocompleteInput, confirmInput } from '../lib/prompts.js'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pupa from 'pupa'

// --------------------------------------------------------------------------
const getPath = (path) => resolve(dirname(fileURLToPath(import.meta.url)), path)
// --------------------------------------------------------------------------
const printLine = () => console.log(C.grey(fillFrom('╸')))
// --------------------------------------------------------------------------
const keyGet = (action, tpl) => {
  const key = action ?? tpl
  if (key in cfg.templates === false) {
    L.error('key is missing in templates: ' + key)
  }
  return key
}
// --------------------------------------------------------------------------
const parseOutput = async (key, outputPath, palette) => {
  const tplPath = getPath(`../templates/${key}`)
  const exist = fs.pathExistsSync(tplPath)
  if (exist === false) {
    L.error('tpl path doesnt exists:\n' + tplPath)
  }
  printLine()
  const file = fs.readFileSync(tplPath, { encoding: 'utf8' })

  const parsed = pupa(file, palette ?? process.env)

  L.loading('input', tplPath)

  return parsed
}
// --------------------------------------------------------------------------
const tplsGet = async (action) => {
  if (action) {
    return [getPath(`../templates/${action}`)]
  }
  const tpls = [await autocompleteInput('tpl', ['all', ...Object.keys(cfg.templates)])]
  const [{ tpl }] = tpls
  if (tpl === 'all') {
    const templates = Object.keys(cfg.templates)
    return templates.map(x => ({ tpl: x }))
  }
  return tpls
}
// --------------------------------------------------------------------------
const outputPathsGet = (key) => {
  const { output } = cfg.templates[key]
  return Array.isArray(output) ? output : [output]
}
// --------------------------------------------------------------------------
const writeTplFile = (outputPath, parsed) => {
  fs.writeFileSync(outputPath, parsed)
  L.info('done', outputPath)
}
// --------------------------------------------------------------------------
const writeOutput = async(key, outputPath, parsed) => {
  if (argv.f || argv.force) { return writeTplFile(outputPath, parsed) }

  const { writeTpl } = await confirmInput('writeTpl', `apply ${key}?`, true)
  if (writeTpl) {
    writeTplFile(outputPath, parsed)
  }
}
// --------------------------------------------------------------------------
export default async (palette) => {
  const { _: [, action] } = argv

  const tpls = await tplsGet(action)

  for (const { tpl } of tpls) {
    const key = keyGet(action, tpl)
    const outputPaths = outputPathsGet(key)
    for (const outputPath of outputPaths) {
      const parsed = await parseOutput(key, outputPath, palette)
      await writeOutput(key, outputPath, parsed)
    }
  }
}
// --------------------------------------------------------------------------

// ##########################################################################
// const templates = fs.readdirSync(getPath('../templates/'))
// --------------------------------------------------------------------------
// const { input, output } = cfg.templates[tpl]
// const tplPath = getPath(`../templates/${input}`)
// const file = fs.readFileSync(tplPath, { encoding: 'utf8' })
//
// const parsed = pupa(file, palette)
//
// const { writeTpl } = await confirmInput('writeTpl', `apply ${tpl}?`)
// if (writeTpl) {
//   fs.writeFileSync(output, parsed)
// }
// --------------------------------------------------------------------------
// process.exit()
// const templates = fs.readdirSync(getPath('../templates/'))
// fs.ensureDir('/tmp/mxcolr')

