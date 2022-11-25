import { resolve } from 'node:path'
import { numberInput, confirmInput } from './prompts.js'

class Config {
  #config

  constructor(path) {
    this.path = path
    this.config = {}
  }

  async write() {
    spinner.start(C.yellow('configuring...'))

    await sleep(this.config.sleep)

    const yamlConfig = YAML.stringify(this.config)
    logYaml(yamlConfig)
    spinner.succeed('configured.')

    L.warn(C.yellow.dim('system config ') + this.path)
    const { makeSystemCopy } = await confirmInput('makeSystemCopy', 'make a system copy?')
    if (makeSystemCopy) {
      await fs.ensureDir(`${os.homedir()}/.mxcolr`)
      await fs.writeFile(this.path, yamlConfig)
      log.greyDim(fillFrom('━'))
      log.pass(this.path, 'was created!')
    }
  }

  async collect() {
    head(import.meta, 'new system')

    log.yellowBox('New System!')

    const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
      value: 1000, hint: '(milliseconds)', min: 1
    })

    const config = {
      version: PKG_VERSION,
      sleep: sleepBetweenCommands,
      exit_on_error: false,
      templates: {
        test: {
          input: 'test.css',
          output: '/tmp/foo_test.css'
          // depends: 'build',
        }
      }
    }

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
// --------------------------------------------------------------------------
export default async() => {
  const configPath = resolve(`${os.homedir()}/.mxcolr/config.yml`)

  const config = new Config(configPath)
  console.log('@;', config)
  try {
    fs.statSync(configPath)
    const isInit = argv.init || argv._.includes('init')
    if (isInit) throw new Error()
    return config.load()
  } catch (err) {
    return config.collect()
  }
}
