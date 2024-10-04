import type { PathArray, PathCommand, PathSegment } from '../types';
import isNormalizedArray from '../util/isNormalizedArray';
import segmentToCubic from './segmentToCubic';
import paramsParser from '../parser/paramsParser';
import normalizePath from './normalizePath';
import fixArc from './fixArc';
import isAbsoluteArray from '../util/isAbsoluteArray';
import pathToAbsolute from '../convert/pathToAbsolute';

const replaceArc = (pathInput: PathArray | string): PathArray => {
  const absolutePath = isAbsoluteArray(pathInput) ? pathInput : pathToAbsolute(pathInput);
  const normalizedPath = isNormalizedArray(absolutePath) ? absolutePath : normalizePath(absolutePath);
  const params = { ...paramsParser };
  const allPathCommands = [] as PathCommand[]; // needed for arc to curve transformation
  let segment = [] as unknown as PathSegment;
  let seglen = 0;
  let pathCommand = '';
  const resultedPath = [] as unknown as PathArray;
  let i = 0;
  let ii = absolutePath.length;

  for (i = 0; i < ii; i += 1) {
    /* istanbul ignore else @preserve */
    if (absolutePath[i]) [pathCommand] = absolutePath[i];
    allPathCommands[i] = pathCommand as PathCommand;

    /* istanbul ignore else @preserve */
    if (pathCommand === 'A') {
      segment = segmentToCubic(normalizedPath[i], params);

      absolutePath[i] = segmentToCubic(normalizedPath[i], params);
      fixArc(absolutePath, allPathCommands, i);

      normalizedPath[i] = segmentToCubic(normalizedPath[i], params);
      fixArc(normalizedPath, allPathCommands, i);
      ii = Math.max(absolutePath.length, normalizedPath.length);
    }

    segment = normalizedPath[i];
    seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +segment[seglen - 4] || params.x1;
    params.y2 = +segment[seglen - 3] || params.y1;

    resultedPath.push(absolutePath[i]);
  }
  return resultedPath;
};

export default replaceArc;
