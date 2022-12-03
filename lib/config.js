import findFile from 'simple-find-file-recursively-up'
import { resolve } from 'node:path'
import { numberInput, confirmInput } from './prompts.js'

class Base {
  constructor(name) {
    const segment = `./.${name}/config.yml`

    this.config = {}
    this.name = name
    this.path = findFile(segment) ?? resolve(os.homedir(), segment)
    this.dir = this.getDir(this.path)
  }

  init() {
    const isInit = argv.init || argv._.includes('init')
    if (isInit === false && this.path) {
      return this.load()
    }

    return this.collect()
  }

  async load() {
    if (!this.path) return Promise.resolve(false)
    const file = await fs.readFile(this.path, 'utf8')

    $.verbose && log.pass(this.path, 'was loaded!')
    $.verbose && logYaml(file)

    return YAML.parse(file)
  }

  getDir(path) {
    const a = path.split('/')
    a.pop()
    return a.join('/')
  }

  async commit(path, data) {
    await fs.ensureDir(this.dir)
    await fs.writeFile(path, data)

    log.greyDim(fillFrom('━'))
    log.pass(path, 'was created!')
  }

  async backup() {
    await fs.ensureDir(`/tmp/${this.name}`)

    const path = findFile(`.${this.name}/config.yml`)
    const backup = `/tmp/${this.name}/config.yml`

    log.yellowDim('keeping a backup in: ')
    log.yellow(backup + '\n')

    return $$([`cp ${path} ${backup}`])
  }

  async reset() {
    const { resetSystemConfig } = await confirmInput('resetSystemConfig')
    if (resetSystemConfig === false) return

    return Config.remove()
  }

  async remove() {
    const path = findFile(`.${this.name}/config.yml`)

    log.redDim('removing the config:')
    log.red(path + '\n')

    await this.backup()
    await $$([`rm -rf ${path}`])

    log.pass('Config removed.')
  }
}
// import findFile from 'simple-find-file-recursively-up'
// import { resolve } from 'node:path'
export default class Config extends Base {
  async write() {
    spinner.start(C.yellow('configuring...'))

    await sleep(this.config.sleep)

    const yamlConfig = YAML.stringify(this.config)
    logYaml(yamlConfig)
    spinner.succeed('finished.')

    L.warn(C.yellow.dim('system config ') + this.path)
    const { makeSystemCopy } = await confirmInput('makeSystemCopy', 'make a system copy?')
    if (makeSystemCopy) {
      this.commit(this.path, yamlConfig)
    }
  }

  get sample() {
    return {
      test: {
        input: 'test.css',
        output: '/tmp/foo_test.css'
      },
      'foo.css': {
        output: '/tmp/mxc__foo.css'
      },
      'base16.css': {
        output: '/tmp/mxc__base16.css'
      }
    }
  }

  async make() {
    const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
      value: 1000, hint: '(milliseconds)', min: 1
    })

    return {
      version: PKG_VERSION,
      sleep: sleepBetweenCommands,
      exit_on_error: false,
      templates: this.sample
    }
  }

  async collect() {
    head(import.meta, 'new system')

    log.yellowBox('New System!')

    await sleep(100)

    this.config = await this.make()

    await this.write()

    L.loading('config', 'was loaded!')

    return this.config
  }
}
