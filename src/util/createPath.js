// create a <path> when glyph
// requires browser
export default function createPath(path) {
  const np = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const d = path instanceof SVGElement && ['path', 'glyph'].indexOf(path.tagName) > -1 ? path.getAttribute('d') : path;
  np.setAttribute('d', d);
  return np;
}
