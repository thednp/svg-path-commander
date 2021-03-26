import isPathArray from './isPathArray.js';

export default function isAbsoluteArray(pathInput) {
  return isPathArray(pathInput) && pathInput.every((x) => x[0] === x[0].toUpperCase());
}
