import findFile from 'simple-find-file-recursively-up'
import { numberInput, confirmInput } from './prompts.js'

export default class Config {
  constructor() {
    this.config = {}
    this.path = findFile('.mxcolr/config.yml')
  }

  init() {
    const isInit = argv.init || argv._.includes('init')
    if (isInit === false && this.path) {
      return this.load()
    }

    return this.collect()
  }

  async commit(data) {
    await fs.ensureDir(`${os.homedir()}/.mxcolr`)
    await fs.writeFile(this.path, data)
    log.greyDim(fillFrom('━'))
    log.pass(this.path, 'was created!')
  }

  async write() {
    spinner.start(C.yellow('configuring...'))

    await sleep(this.config.sleep)

    const yamlConfig = YAML.stringify(this.config)
    logYaml(yamlConfig)
    spinner.succeed('finished.')

    L.warn(C.yellow.dim('system config ') + this.path)
    const { makeSystemCopy } = await confirmInput('makeSystemCopy', 'make a system copy?')
    if (makeSystemCopy) {
      this.commit(yamlConfig)
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

    const config = await this.make()

    await this.write(config)

    L.loading('config', 'was loaded!')

    return config
  }

  async load() {
    const file = await fs.readFile(this.path, 'utf8')

    $.verbose && log.pass(this.path, 'was loaded!')
    $.verbose && logYaml(file)

    return YAML.parse(file)
  }
}
