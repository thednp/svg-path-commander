import roundPath from './roundPath.js';
import pathToAbsolute from '../convert/pathToAbsolute.js';
import pathToRelative from '../convert/pathToRelative.js';

export default function optimizePath(pathArray, round) {
  const absolutePath = roundPath(pathToAbsolute(pathArray), round);
  const relativePath = roundPath(pathToRelative(pathArray), round);
  return absolutePath.map((x, i) => {
    if (i) {
      return x.join('').length < relativePath[i].join('').length ? x : relativePath[i];
    }
    return x;
  });
}
