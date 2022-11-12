import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pupa from 'pupa'

export default (palette) => {
  console.log('APPLY')

  const getPath = (path) => resolve(
    dirname(fileURLToPath(import.meta.url)),
    path)

  const templates = fs.readdirSync(getPath('../templates/'))

  fs.ensureDir('/tmp/mxc')

  for (const tpl of templates) {
    const tplPath = getPath(`../templates/${tpl}`)

    const file = fs.readFileSync(tplPath, { encoding: 'utf8' })

    const parsed = pupa(file, process.env)

    fs.writeFileSync(`/tmp/mxc/${tpl}`, parsed)
  }
}
