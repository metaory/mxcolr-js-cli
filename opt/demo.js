/* eslint-disable */
import { colord, random } from "colord"

const printColors = (colors) => {
  const spaceLength = (process.stdout.columns - colors.length * 2) / 2
  process.stdout.write(' '.repeat(spaceLength))
  colors.forEach(x => {
    process.stdout.write(C.hex(process.env[x])(' '))
  })
  process.stdout.write('\n')
}
const demoColors = () => {
  printColors(['SBG', 'WBG', 'EBG'])
  printColors(['CX1', 'CX2', 'CX3', 'CX4', 'CX5', 'CX6'])
  printColors(['C00', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07'])
  printColors(['C08', 'C09', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15'])
  printColors(['CY1', 'CY2', 'CY3', 'CY4', 'CY5', 'CY6'])
  printColors(['SK0', 'SK1', 'SK2', 'SK3', 'SK4', 'SK5', 'SK6', 'SK7'])
  printColors(['WK0', 'WK1', 'WK2', 'WK3', 'WK4', 'WK5', 'WK6', 'WK7'])
  printColors(['EK0', 'EK1', 'EK2', 'EK3', 'EK4', 'EK5', 'EK6', 'EK7'])
}

export default async () => {
  demoColors()
}

