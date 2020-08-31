export default function(pathString) {
  return pathString
    .replace( /(m|M)/g, "|$1")
    .split('|')
    .map(s=>s.trim())
    .filter(s=>s)
}