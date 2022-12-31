import type { PathArray, PathSegment } from '../types';

/**
 * The `PathParser` is used by the `parsePathString` static method
 * to generate a `pathArray`.
 *
 * @param pathString
 */
export default class PathParser {
  declare segments: PathArray | PathSegment[];
  declare pathValue: string;
  declare max: number;
  declare index: number;
  declare param: number;
  declare segmentStart: number;
  declare data: any[];
  declare err: string;

  constructor(pathString: string) {
    this.segments = [];
    this.pathValue = pathString;
    this.max = pathString.length;
    this.index = 0;
    this.param = 0.0;
    this.segmentStart = 0;
    this.data = [];
    this.err = '';
  }
}
