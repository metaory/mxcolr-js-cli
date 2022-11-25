import apply from '../opt/apply.js'
import generate from '../opt/generate.js'
import demoPalette from '../opt/demo.js'

import { toggleInput, autocompleteInput } from './prompts.js'

const opts = { apply, generate, demoPalette }

export const mainMenu = async() => {
  const list = [
    { name: 'apply templates', value: 'apply' },
    { name: 'generate palette', value: 'generate' },
    { name: 'demo palette', value: 'demoPalette' }
  ]
  const { _: [action] } = argv

  switch (action) {
    case 'apply':
      return apply()
    case 'make':
    case 'generate':
      return generate()
    case 'demo':
      return demoPalette()
  }

  const { operation } = await autocompleteInput('operation', list)
  return opts[operation]()
}

export const generateMenu = async() => {
  const { action } = await toggleInput('action', {
    enabled: '▶ make', disabled: '▲ apply', initial: true
  })
  return action ? 'make' : 'apply'
}

// export default async () => { }
// const list = [
//   { name: 'make', label: '▶ make' },
//   { name: 'keep', label: '● keep', disabled: true },
//   { name: 'revert', label: '◀ revert', disabled: true },
//   { name: 'shuffle', label: '⇄ shuffle', disabled: true },
//   { name: 'demo', label: '▼ demo', disabled: true },
//   { name: 'apply', label: '▲ apply' }
// ]
// const { operation } = await autocompleteInput('operation', list)
// return operation
