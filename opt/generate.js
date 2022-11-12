/* eslint-disable */
import { colord, random } from "colord"
import demoPalette from './demo.js'
// import {Chalk} from 'chalk'

// const chalk = new Chalk({level: 3})

const textColor = (bgColor) => colord(bgColor).isDark() ? '#fff' : '#000'
const palette = {}

const generateSeed = () => ['S', 'W', 'E'].forEach(x => {
  palette[x + 'BG'] = random().toHex()
  palette[x + 'FG'] = textColor(palette[x + 'BG'])
})

export default async () => {
  console.log('GENERATE', argv)
  generateSeed()
  demoPalette()
}
