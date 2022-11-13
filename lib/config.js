import { resolve } from 'node:path'
import { numberInput, confirmInput } from './prompts.js'

const configPath = resolve(`${os.homedir()}/.mxcolr/config.yml`)

async function writeConfig(config) {
  spinner.start(C.yellow('configuring...'))

  await sleep(config.sleep)

  const yamlConfig = YAML.stringify(config)
  logYaml(yamlConfig)
  spinner.succeed('configured.')

  L.warn(C.yellow.dim('system config ') + configPath)
  const { makeSystemCopy } = await confirmInput('makeSystemCopy', 'make a system copy?')
  if (makeSystemCopy) {
    await fs.ensureDir(`${os.homedir()}/.mxcolr`)
    await fs.writeFile(configPath, yamlConfig)
    log.greyDim(fillFrom('━'))
    log.pass(configPath, 'was created!')
  }
}

async function loadConfig() {
  const file = await fs.readFile(configPath, 'utf8')

  $.verbose && log.pass(configPath, 'was loaded!')
  $.verbose && logYaml(file)

  return YAML.parse(file)
}

async function collectConfig() {
  head(import.meta, 'new system')

  log.yellowBox('New System!')

  const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
    value: 1000, hint: '(milliseconds)', min: 1
  })

  const config = {
    version: PKG_VERSION,
    sleep: sleepBetweenCommands,
    exit_on_error: false
  }

  await writeConfig(config)

  L.loading('config', 'was loaded!')

  return config
}

function getExistingConfig() {
  head(import.meta, configPath)

  try {
    fs.statSync(configPath)
    return loadConfig(configPath)
  } catch (err) {
    return false
  }
}

export function getConfig() {
  const existingConfig = getExistingConfig()
  if (existingConfig) {
    return existingConfig
  }

  return collectConfig()
}
