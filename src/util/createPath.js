export default function createPath(path) { // create a <path> when glyph
  let np = document.createElementNS('http://www.w3.org/2000/svg','path'), 
      d = path instanceof SVGElement && ['path','glyph'].indexOf(path.tagName) > -1 ? path.getAttribute('d') : path
  np.setAttribute('d',d);
  return np
}