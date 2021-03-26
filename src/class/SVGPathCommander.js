import SVGPCO from '../options/options.js';

import pathToAbsolute from '../convert/pathToAbsolute.js';
import pathToRelative from '../convert/pathToRelative.js';
import pathToString from '../convert/pathToString.js';

import parsePathString from '../process/parsePathString.js';
import reversePath from '../process/reversePath.js';

import clonePath from '../process/clonePath.js';
import splitPath from '../process/splitPath.js';
import optimizePath from '../process/optimizePath.js';
import normalizePath from '../process/normalizePath.js';
import transformPath from '../process/transformPath.js';
import getPathBBox from '../util/getPathBBox.js';

export default class SVGPathCommander {
  constructor(pathValue, ops) {
    const options = ops || {};
    // check for either true or > 0
    const roundOption = +options.round === 0 || options.round === false ? 0 : SVGPCO.round;
    const decimalsOption = roundOption && (options.decimals || SVGPCO.decimals);
    const originOption = options.origin;
    const path = parsePathString(pathValue, this.round);

    // set instance options
    this.round = roundOption === 0 ? 0 : decimalsOption; // ZERO will disable rounding numbers
    this.origin = originOption && !Number.isNaN(originOption.x) && !Number.isNaN(originOption.y)
      ? originOption : null;

    this.segments = clonePath(path);
    this.pathValue = pathValue;
    return this;
  }
}

const SVGPCProto = SVGPathCommander.prototype;

SVGPCProto.toAbsolute = function toAbsolute() {
  const path = pathToAbsolute(this.segments, this.round);
  this.segments = clonePath(path);
  return this;
};
SVGPCProto.toRelative = function toRelative() {
  const path = pathToRelative(this.segments, this.round);
  this.segments = clonePath(path);
  return this;
};
SVGPCProto.reverse = function reverse(onlySubpath) {
  this.toAbsolute();

  const subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString());
  const absoluteMultiPath = subPath && clonePath(subPath)
    .map((x, i) => {
      if (onlySubpath) {
        return i ? reversePath(x) : parsePathString(x);
      }
      return reversePath(x);
    });

  let path = [];
  if (subPath) {
    path = absoluteMultiPath.flat(1);
  } else {
    path = onlySubpath ? this.segments : reversePath(this.segments, this.round);
  }

  this.segments = clonePath(path);
  return this;
};
SVGPCProto.normalize = function normalize() {
  const path = normalizePath(this.segments, this.round);
  this.segments = clonePath(path);
  return this;
};
SVGPCProto.optimize = function optimize() {
  const path = optimizePath(this.segments, this.round);
  this.segments = clonePath(path);
  return this;
};
SVGPCProto.transform = function transform(transformInput) {
  const transformObject = transformInput || {};
  if (!transformObject.origin) {
    const BBox = getPathBBox(this.segments);
    transformObject.origin = [BBox.cx, BBox.cy, BBox.cx];
  }

  const path = transformPath(
    this.segments, // the pathArray
    transformObject, // transform functions object, now includes the transform origin
    this.round, // decimals option
  );

  this.segments = clonePath(path);
  return this;
};
SVGPCProto.flipX = function flipX() {
  this.transform({ rotate: [180, 0, 0] });
  return this;
};
SVGPCProto.flipY = function flipY() {
  this.transform({ rotate: [0, 180, 0] });
  return this;
};
SVGPCProto.toString = function toString() {
  return pathToString(this.segments);
};
