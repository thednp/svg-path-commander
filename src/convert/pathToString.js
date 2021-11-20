import roundPath from '../process/roundPath.js';

export default function pathToString(pathArray, round) {
  return roundPath(pathArray, round)
    .map((x) => x[0].concat(x.slice(1).join(' '))).join('');
}
