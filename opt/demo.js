/* eslint-disable */
import { colord } from "colord"

const padLeft = (len) => {
  const spaceLength = (process.stdout.columns - len) / 2
  process.stdout.write(' '.repeat(spaceLength))
}
const textColor = (bgColor) => colord(bgColor).isDark() ? '#fff' : '#000'

const print = {
  dots: (colors, palette) => {
    padLeft(colors.length * 2)
    colors.forEach(x => {
      process.stdout.write(C.hex(palette[x])(' '))
    })
    process.stdout.write('\n')
  },
  hex: (colors, palette) => {
    padLeft(colors.length * 7)
    colors.forEach(x => {
      const bg = palette[x]
      process.stdout.write(C.hex(bg)(bg.substring(1, bg.length)) + ' ')
    })
    process.stdout.write('\n')
  }
}

const demoSeed = (palette) => {
  padLeft(12)
  process.stdout.write(C.hex(palette.SBG)('▄▄█'))
  process.stdout.write(C.hex(palette.WBG)('██'))
  process.stdout.write(C.hex(palette.EBG)('█▀▀'))
  process.stdout.write('\n')
}
const colorNames = [
  ['SBG', 'WBG', 'EBG'],
  ['CX1', 'CX2', 'CX3', 'CX4', 'CX5', 'CX6'],
  ['C00', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07'],
  ['C08', 'C09', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15'],
  ['CY1', 'CY2', 'CY3', 'CY4', 'CY5', 'CY6'],
  ['SK0', 'SK1', 'SK2', 'SK3', 'SK4', 'SK5', 'SK6', 'SK7'],
  ['WK0', 'WK1', 'WK2', 'WK3', 'WK4', 'WK5', 'WK6', 'WK7'],
  ['EK0', 'EK1', 'EK2', 'EK3', 'EK4', 'EK5', 'EK6', 'EK7']
]
const demoHex = (palette) => {
  colorNames.forEach(x => print.hex(x, palette))
}
const demoDots = (palette) => {
  demoSeed(palette)
  colorNames.forEach(x => print.dots(x, palette))
}

export default async (palette) => {
  demoDots(palette)
  demoHex(palette)
}
