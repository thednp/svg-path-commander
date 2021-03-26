import isPathArray from './isPathArray.js';

export default function isRelativeArray(pathInput) {
  return isPathArray(pathInput)
    && pathInput.slice(1).every((seg) => seg[0] === seg[0].toLowerCase());
}
