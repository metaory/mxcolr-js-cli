/* eslint-disable */
import apply from '../opt/apply.js'
import generate from '../opt/generate.js'
import demoPalette from '../opt/demo.js'

import { stringInput, autocompleteInput, confirmInput } from './prompts.js'

const opts = { apply, generate, demoPalette }

const list = [
  { name: 'apply templates', value: 'apply' },
  { name: 'generate palette', value: 'generate' },
  { name: 'demo palette', value: 'demoPalette' },
]

export const mainMenu = async () => {
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

// export default async () => { }
