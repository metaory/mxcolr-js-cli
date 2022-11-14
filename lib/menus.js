/* eslint-disable */
import apply from '../opt/apply.js'
import generate from '../opt/generate.js'
import demoPalette from '../opt/demo.js'

import { toggleInput, stringInput, autocompleteInput, confirmInput } from './prompts.js'

const opts = { apply, generate, demoPalette }

export const mainMenu = async () => {
  const list = [
    { name: 'apply templates', value: 'apply' },
    { name: 'generate palette', value: 'generate' },
    { name: 'demo palette', value: 'demoPalette' },
  ]

  if (argv._[0] === 'apply') {
    return opts.apply()
  }
  if (argv._[0] === 'generate') {
    return opts.generate()
  }
  if (argv._[0] === 'demo') {
    return opts.demoPalette()
  }

  const { operation } = await autocompleteInput('operation', list)
  return opts[operation]()
}

export const generateMenu = async () => {
  const list = [
    { name: 'make', label: '▶ make' },
    { name: 'keep', label: '● keep', disabled: true },
    { name: 'revert', label: '◀ revert', disabled: true },
    { name: 'shuffle', label: '⇄ shuffle', disabled: true },
    { name: 'demo', label: '▼ demo', disabled: true },
    { name: 'apply', label: '▲ apply' },
  ]
  const { action } = await toggleInput('action', {
    enabled: '▶ make', disabled: '▲ apply', initial: true
  })
  return action ? 'make' : 'apply'
  // const { operation } = await autocompleteInput('operation', list)
  // return operation
}

// export default async () => { }
