import { colord, random, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'
import labPlugin from 'colord/plugins/lab'
import demoPalette from './demo.js'
import apply from './apply.js'
import { generateMenu } from '../lib/menus.js'
extend([mixPlugin, labPlugin])

class Generate {
  #palette
  #count
  #MAX_REDO
  #HUE
  #ALPHA_DISTANCE
  #DELTA_DISTANCE
  constructor() {
    this.palette = {}
    this.count = 0
    this.MAX_REDO = 100
    this.HUE = { C01: 0, C02: 60, C03: 120, C04: 240, C05: 300, C06: 170 }
    this.ALPHA_DISTANCE = Number(process.env.MXC_ALPHA_DISTANCE) || 0.8
    this.DELTA_DISTANCE = Number(process.env.MXC_DELTA_DISTANCE) || 0.3
  }

  make(hue) {
    return colord(colord('hsl(0, 50%, 50%)').hue(hue).toHex())
      .mix(this.palette.SBG, 0.3)
      .toHex()
  }

  textColor(bgColor) {
    return colord(bgColor).isDark() ? '#fff' : '#000'
  }

  get alpha() {
    return [
      colord(this.palette.SBG).alpha(),
      colord(this.palette.SBG).alpha(),
      colord(this.palette.WBG).alpha()
    ]
  }

  get delta() {
    return [
      colord(this.palette.SBG).delta(this.palette.WBG),
      colord(this.palette.SBG).delta(this.palette.EBG),
      colord(this.palette.WBG).delta(this.palette.EBG)
    ]
  }

  seed() {
    for (const base of ['S', 'W', 'E']) {
      this.palette[base + 'BG'] = random().toHex()
      this.palette[base + 'FG'] = this.textColor(this.palette[base + 'BG'])
    }

    // MAX REDO COUNT
    if (this.count >= this.MAX_REDO) {
      L.warn('reached maximum redo: ' + this.MAX_REDO)
      return
    }

    // VIOLATIONS
    const alphaViolation = this.alpha.every(x => x < this.ALPHA_DISTANCE)
    const deltaViolation = this.delta.some(x => x < this.DELTA_DISTANCE)

    if (alphaViolation || deltaViolation) {
      this.count++
      return this.seed()
    } else {
      L.loading('redo', this.count)
      this.count = 0
    }
  }

  colors() {
    Object.keys(this.HUE).forEach(x => { this.palette[x] = this.make(this.HUE[x]) })
    Array.from({ length: 7 }).forEach((_, i) => {
      if (i === 0) { return }
      const baseName = (i + 8) >= 10 ? `C${i + 8}` : `C0${i + 8}`
      this.palette[baseName] = colord(this.palette[`C0${i}`]).lighten(0.2).toHex()
      this.palette[`CX${i}`] = colord(this.palette[`C0${i}`]).saturate(0.2).toHex()
      this.palette[`CY${i}`] = colord(this.palette[`C0${i}`]).lighten(0.3).toHex()
    })
    this.palette.C00 = this.palette.WK2
    this.palette.C08 = this.palette.WK5
    this.palette.C07 = this.palette.WK6
    this.palette.C15 = this.palette.WK8
  }

  shade(base) {
    const shades = colord(this.palette[`${base}BG`]).shades(10)
    this.palette[`${base}K0`] = shades[9].lighten(0.01).toHex()
    this.palette[`${base}K1`] = shades[8].desaturate(0.1).darken(0.04).toHex()
    this.palette[`${base}K2`] = shades[7].desaturate(0.2).darken(0.05).toHex()
    this.palette[`${base}K3`] = shades[6].desaturate(0.3).darken(0.05).toHex()
    this.palette[`${base}K4`] = shades[5].desaturate(0.4).darken(0.05).toHex()
    this.palette[`${base}K5`] = shades[4].desaturate(0.5).darken(0.05).toHex()
    this.palette[`${base}K6`] = shades[3].desaturate(0.6).darken(0.06).toHex()
    this.palette[`${base}K7`] = shades[2].desaturate(0.7).darken(0.07).toHex()
    this.palette[`${base}K8`] = shades[1].desaturate(0.8).darken(0.08).toHex()
    this.palette[`${base}K9`] = shades[0].desaturate(0.9).darken(0.09).toHex()
    // Array.from({ length: 10 }).forEach((_, i) => { palette[`${base}K${i}`] = shades[9 - i] })
  }

  shades() {
    this.shade('S')
    this.shade('W')
    this.shade('E')
  }

  load() {
    return Object
      .keys(this.palette)
      .forEach(async x => {
        const exp = `export ${x}='${this.palette[x]}'`
        const { verbose } = $
        $.verbose = false
        await $([exp])
        $.verbose = verbose
        process.env[x] = this.palette[x]
      })
  }
}

const generate = new Generate()

const init = async(action) => {
  action = action ?? await generateMenu()

  switch (action) {
    case 'next':
      generate.seed()
      generate.shades()
      generate.colors()
      generate.load()
      demoPalette(generate.palette)
      init()
      break
    case 'apply':
      apply(generate.palette)
      break
  }
}

export default () => init('next')
