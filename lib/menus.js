import apply from '../opt/apply.js'
import generate from '../opt/generate.js'
import demoPalette from '../opt/demo.js'

import { toggleInput, autocompleteInput } from './prompts.js'

const opts = { apply, generate, demoPalette }

export default async() => {
  const list = [
    { name: 'generate palette', value: 'generate' },
    { name: 'apply templates', value: 'apply' },
    { name: 'demo palette', value: 'demoPalette' }
  ]
  const { _: [action] } = argv

  switch (action) {
    case 'apply':
      return apply()
    case 'next':
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
    enabled: '▶ next', disabled: '▲ apply', initial: true
  })
  return action ? 'next' : 'apply'
}
