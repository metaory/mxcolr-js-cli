import { autocompleteInput, confirmInput } from '../lib/prompts.js'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pupa from 'pupa'

// --------------------------------------------------------------------------
const printLine = () => console.log(C.grey(fillFrom('╸')))
// --------------------------------------------------------------------------
const resolvePath = (p) => resolve(dirname(fileURLToPath(import.meta.url)), p)
// --------------------------------------------------------------------------
const writeFile = (p, data) => {
  fs.writeFileSync(p, data)
  L.info('done', p)
}
// --------------------------------------------------------------------------
class Apply {
  #palette
  #action
  #template
  constructor(palette = process.env, action) {
    this.palette = palette
    this.action = action
  }

  get key() {
    const key = this.action ?? this.template
    if (key in cfg.templates === false) {
      L.error('key is missing in templates: ' + key)
    }
    return key
  }

  get outputPaths() {
    const { output } = cfg.templates[this.key]
    return Array.isArray(output) ? output : [output]
  }

  get tpl() {
    return this.template
  }

  set tpl(t) {
    this.template = t
  }

  async tpls() {
    if (this.action) {
      return [resolvePath(`../templates/${this.action}`)]
    }
    const tpls = [
      await autocompleteInput('tpl', ['all', ...Object.keys(cfg.templates)])
    ]
    const [{ tpl }] = tpls
    if (tpl === 'all') {
      return Object.keys(cfg.templates).map(x => ({ tpl: x }))
    }
    return tpls
  }

  get tplPath() {
    const tplPath = resolvePath(`../templates/${this.key}`)
    const exist = fs.pathExistsSync(tplPath)
    if (exist === false) {
      L.error('tpl path doesnt exists:\n' + tplPath)
    }
    return tplPath
  }

  parseOutput(outputPath) {
    L.loading('i', this.tplPath)
    const file = fs.readFileSync(this.tplPath, { encoding: 'utf8' })
    const parsed = pupa(file, this.palette)
    return parsed
  }

  async writeOutput(outputPath, parsed) {
    L.loading('o', outputPath)
    if (argv.f || argv.force) { return writeFile(outputPath, parsed) }
    const { writeTpl } = await confirmInput('writeTpl', `apply ${this.key}?`, true)
    if (writeTpl) {
      writeFile(outputPath, parsed)
    }
  }
}
// --------------------------------------------------------------------------
export default async(palette) => {
  const { _: [, action] } = argv

  const apply = new Apply(palette, action)

  const tpls = await apply.tpls()

  for (const { tpl } of tpls) {
    apply.tpl = tpl
    for (const outputPath of apply.outputPaths) {
      printLine()
      await apply.writeOutput(
        outputPath,
        apply.parseOutput(outputPath)
      )
    }
  }
}
