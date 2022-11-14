import { colord, random, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'
import demoPalette from './demo.js'
import apply from './apply.js'
import { generateMenu } from '../lib/menus.js'

extend([mixPlugin])

const textColor = (bgColor) => colord(bgColor).isDark() ? '#fff' : '#000'

const palette = {}

const generateSeed = () => ['S', 'W', 'E'].forEach(x => {
  // TODO: colord("#3296fa").delta("#197dc8"); // 0.099
  palette[x + 'BG'] = random().toHex()
  palette[x + 'FG'] = textColor(palette[x + 'BG'])
})

const makeColor = (hue) => colord(colord('hsl(0, 50%, 50%)').hue(hue).toHex()).mix(palette.SBG, 0.3).toHex()

const paletteHue = { C01: 0, C02: 60, C03: 120, C04: 240, C05: 300, C06: 170 }

const generateColors = () => {
  Object.keys(paletteHue).forEach(x => { palette[x] = makeColor(paletteHue[x]) })
  Array.from({ length: 7 }).forEach((_, i) => {
    if (i === 0) { return }
    const baseName = (i + 8) >= 10 ? `C${i + 8}` : `C0${i + 8}`
    palette[baseName] = colord(palette[`C0${i}`]).lighten(0.2).toHex()
    palette[`CX${i}`] = colord(palette[`C0${i}`]).saturate(0.2).toHex()
    palette[`CY${i}`] = colord(palette[`C0${i}`]).lighten(0.3).toHex()
  })
  palette.C00 = 'WK2'
  palette.C08 = 'WK5'
  palette.C07 = 'WK6'
  palette.C15 = 'WK8'
}
const generateShade = (base) => {
  const shades = colord(palette[`${base}BG`])
    .shades(10)
  palette[`${base}K0`] = shades[9].lighten(0.01).toHex()
  palette[`${base}K1`] = shades[8].desaturate(0.1).darken(0.04).toHex()
  palette[`${base}K2`] = shades[7].desaturate(0.2).darken(0.05).toHex()
  palette[`${base}K3`] = shades[6].desaturate(0.3).darken(0.05).toHex()
  palette[`${base}K4`] = shades[5].desaturate(0.4).darken(0.05).toHex()
  palette[`${base}K5`] = shades[4].desaturate(0.5).darken(0.05).toHex()
  palette[`${base}K6`] = shades[3].desaturate(0.6).darken(0.06).toHex()
  palette[`${base}K7`] = shades[2].desaturate(0.7).darken(0.07).toHex()
  palette[`${base}K8`] = shades[1].desaturate(0.8).darken(0.08).toHex()
  palette[`${base}K9`] = shades[0].desaturate(0.9).darken(0.09).toHex()
  // Array.from({ length: 10 }).forEach((_, i) => {
  //   palette[`${base}K${i}`] = shades[9 - i]
  // })
}
const generateShades = () => {
  generateShade('S')
  generateShade('W')
  generateShade('E')
}

const loadPalette = () => Object
  .keys(palette)
  .forEach(async x => {
    await $`export ${x}='${palette[x]}'`
    // process.env[x] = palette[x]
  })

const init = async() => {
  const action = await generateMenu()
  switch (action) {
    case 'make':
      generateSeed()
      generateColors()
      generateShades()
      loadPalette()
      demoPalette(palette)
      init()
      break
    case 'apply':
      apply(palette)
      break
  }
}

export default async() => {
  init()
}
