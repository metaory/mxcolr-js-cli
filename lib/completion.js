import findFile from 'simple-find-file-recursively-up'
import omelette from 'omelette'

class Comp {
  #completion
  #templates
  constructor() {
    this.completion = omelette('mxcolr|mxc <action> <template> ' +
      '<arg> '.repeat(2) + '<flags> <flags>')

    this.setupEvents()
  }

  setupEvents() {
    this.completion.on('action', ({ reply }) => {
      reply(['apply', 'make', 'version', 'reset', 'help', '--force', '--verbose', '--setup-completion', '--clean-completion'])
    })
    this.completion.on('arg', ({ reply, line }) => {
      reply(['--verbose', '--force'].filter(x => !line.includes(x)))
    })

    this.completion.on('template', ({ before, reply }) => {
      reply(before === 'apply' ? this.templates : [])
    })
  }

  init() {
    this.completion.init()
  }

  get config() {
    const configPath = findFile('.mxcolr/config.yml')
    if (!configPath) { return false }
    return fs.readFileSync(configPath, 'utf8')
  }

  get templates() {
    const file = this.config
    return file
      ? Object.keys(YAML.parse(file).templates)
      : ['CONFIG_NOT_FOUND']
  }

  setupShellInitFile() {
    this.completion.setupShellInitFile()
  }

  cleanupShellInitFile() {
    this.completion.cleanupShellInitFile()
  }
}

const comp = new Comp()

comp.init()

switch (process.argv[2]) {
  case '--setup-completion':
    L.warn('setting up shell completion')
    comp.setupShellInitFile()
    break
  case '--clean-completion':
    L.warn('cleaning up up shell completion')
    comp.cleanupShellInitFile()
    break
}
