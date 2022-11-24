import findFile from 'simple-find-file-recursively-up'
import omelette from 'omelette'
const MXF_MAX_ARGS = process.env.MXF_MAX_ARGS ?? 2 // XXX

const getConfig = () => {
  const configPath = findFile('.mxcolr/config.yml')
  if (!configPath) { return false }
  return fs.readFileSync(configPath, 'utf8')
}

const templates = () => {
  const file = getConfig()
  return file
    ? Object.keys(YAML.parse(file).templates)
    : ['CONFIG_NOT_FOUND']
}

const completion = omelette('mxcolr|mxc <action> <template> ' +
  '<arg> '.repeat(MXF_MAX_ARGS) + '<flags> <flags>')

completion.on('action', ({ reply }) => {
  reply(['apply', 'make', 'version', 'reset', 'help', '--force', '--verbose', '--setup-completion', '--clean-completion'])
})
completion.on('arg', ({ reply, line }) => {
  reply(['--verbose', '--force'].filter(x => !line.includes(x)))
})

completion.on('template', ({ before, reply }) => {
  reply(before === 'apply' ? templates() : [])
})

completion.init()

if (argv['setup-completion']) {
  L.warn('setting up shell completion')
  completion.setupShellInitFile()
}

if (argv['clean-completion']) {
  L.warn('cleaning up up shell completion')
  completion.cleanupShellInitFile()
}
