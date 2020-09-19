import pathToString from '../convert/pathToString.js'
import pathToAbsolute from '../convert/pathToAbsolute.js'

export default function(pathInput) {
  return pathToString(pathToAbsolute(pathInput,0))
    .replace( /(m|M)/g, "|$1")
    .split('|')
    .map(s=>s.trim())
    .filter(s=>s)
}