export default function pathToString(pathArray) {
  return pathArray.map((x) => x[0].concat(x.slice(1).join(' '))).join('');
}
