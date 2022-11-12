/* eslint-disable */
import { colord, random, extend } from "colord";
import mixPlugin from "colord/plugins/mix";

extend([mixPlugin]);

import demoPalette from './demo.js'
// import {Chalk} from 'chalk'

// const chalk = new Chalk({level: 3})

const textColor = (bgColor) => colord(bgColor).isDark() ? '#fff' : '#000'

const palette = {}

const generateSeed = () => ['S', 'W', 'E'].forEach(x => {
  // colord("#3296fa").delta("#197dc8"); // 0.099
  palette[x + 'BG'] = random().toHex()
  palette[x + 'FG'] = textColor(palette[x + 'BG'])
})

// const getMixed = (base, color, ratio = 0.5) => colord(base).mix(color, ratio).toHex()
// const getHued = (color, hue) => color.hue(hue).toHex()
// const makeColor = (hue) => getMixed(getHued(colord('hsl(0, 50%, 50%)'), hue), palette.SBG, 0.3)

const makeColor = (hue) => colord(colord('hsl(0, 50%, 50%)').hue(hue).toHex()).mix(palette.SBG, 0.3).toHex()
//
// colord("#cd853f").mix("#eee8aa", 0.6).toHex(); // "#e3c07e"
// colord("#008080").mix("#808000", 0.35).toHex(); // "#50805d"
// const color = colord("#ff0000");
// color.tones(3).map((c) => c.toHex()); // ["#ff0000", "#c86147", "#808080"];

const paletteHue = { 'C01': 0, 'C02': 60, 'C03': 120, 'C04': 240, 'C05': 300, 'C06': 170 }

const generateColors = () => {
 Object.keys(paletteHue).forEach(x => { palette[x] = makeColor(paletteHue[x])})
 Array.from({ length: 6 }).forEach((x, i) => {
    if (i === 0) { return }
    const name = (i + 8) >= 10 ? `C${i + 8}` : `C0${i + 8}`
    palette[name] = colord(palette[`C0${i}`]).lighten(0.2).toHex()

    palette[`CY${i}`] = colord(palette[`C0${i}`]).lighten(0.3).toHex()
    palette[`CX${i}`] = colord(palette[`C0${i}`]).saturate(0.2).toHex()

    console.log(i, '>>>', `C0${i}`, name)
  })
}

const loadPalette = () => Object
  .keys(palette)
  .forEach(x => process.env[x] = palette[x])

export default async () => {
  console.log('GENERATE', argv)
  generateSeed()
  generateColors()
  loadPalette()
  demoPalette()
}
