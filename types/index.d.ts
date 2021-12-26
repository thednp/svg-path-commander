export as namespace SVGPathCommander;
export default SVGPathCommander;

// modules
import './svg-path-commander';
export { default as pathToAbsolute } from "svg-path-commander/src/convert/pathToAbsolute";
export { default as pathToRelative } from "svg-path-commander/src/convert/pathToRelative";
export { default as pathToCurve } from "svg-path-commander/src/convert/pathToCurve";
export { default as pathToString } from "svg-path-commander/src/convert/pathToString";
export { default as distanceSquareRoot } from "svg-path-commander/src/math/distanceSquareRoot";
export { default as epsilon } from "svg-path-commander/src/math/epsilon";
export { default as midPoint } from "svg-path-commander/src/math/midPoint";
export { default as polygonArea } from "svg-path-commander/src/math/polygonArea";
export { default as polygonLength } from "svg-path-commander/src/math/polygonLength";
export { default as rotateVector } from "svg-path-commander/src/math/rotateVector";
export { default as defaultOptions } from "svg-path-commander/src/options/options";
export { default as finalizeSegment } from "svg-path-commander/src/parser/finalizeSegment";
export { default as invalidPathValue } from "svg-path-commander/src/parser/invalidPathValue";
export { default as isArcCommand } from "svg-path-commander/src/parser/isArcCommand";
export { default as isDigit } from "svg-path-commander/src/parser/isDigit";
export { default as isDigitStart } from "svg-path-commander/src/parser/isDigitStart";
export { default as isPathCommand } from "svg-path-commander/src/parser/isPathCommand";
export { default as isSpace } from "svg-path-commander/src/parser/isSpace";
export { default as paramsCount } from "svg-path-commander/src/parser/paramsCount";
export { default as paramsParser } from "svg-path-commander/src/parser/paramsParser";
export { default as parsePathString } from "svg-path-commander/src/parser/parsePathString";
export { default as PathParser } from "svg-path-commander/src/parser/pathParser";
export { default as scanFlag } from "svg-path-commander/src/parser/scanFlag";
export { default as scanParam } from "svg-path-commander/src/parser/scanParam";
export { default as scanSegment } from "svg-path-commander/src/parser/scanSegment";
export { default as skipSpaces } from "svg-path-commander/src/parser/skipSpaces";
export { default as arcToCubic } from "svg-path-commander/src/process/arcToCubic";
export { default as clonePath } from "svg-path-commander/src/process/clonePath";
export { default as fixArc } from "svg-path-commander/src/process/fixArc";
export { default as fixPath } from "svg-path-commander/src/process/fixPath";
export { default as getSVGMatrix } from "svg-path-commander/src/process/getSVGMatrix";
export { default as lineToCubic } from "svg-path-commander/src/process/lineToCubic";
export { default as normalizePath } from "svg-path-commander/src/process/normalizePath";
export { default as normalizeSegment } from "svg-path-commander/src/process/normalizeSegment";
export { default as optimizePath } from "svg-path-commander/src/process/optimizePath";
export { default as projection2d } from "svg-path-commander/src/process/projection2d";
export { default as quadToCubic } from "svg-path-commander/src/process/quadToCubic";
export { default as reverseCurve } from "svg-path-commander/src/process/reverseCurve";
export { default as reversePath } from "svg-path-commander/src/process/reversePath";
export { default as roundPath } from "svg-path-commander/src/process/roundPath";
export { default as segmentToCubic } from "svg-path-commander/src/process/segmentToCubic";
export { default as shortenSegment } from "svg-path-commander/src/process/shortenSegment";
export { default as shorthandToCubic } from "svg-path-commander/src/process/shorthandToCubic";
export { default as shorthandToQuad } from "svg-path-commander/src/process/shorthandToQuad";
export { default as splitCubic } from "svg-path-commander/src/process/splitCubic";
export { default as splitPath } from "svg-path-commander/src/process/splitPath";
export { default as transformEllipse } from "svg-path-commander/src/process/transformEllipse";
export { default as transformPath } from "svg-path-commander/src/process/transformPath";
export { default as createPath } from "svg-path-commander/src/util/createPath";
export { default as getCubicSize } from "svg-path-commander/src/util/getCubicSize";
export { default as getDrawDirection } from "svg-path-commander/src/util/getDrawDirection";
export { default as getPathArea } from "svg-path-commander/src/util/getPathArea";
export { default as getPathBBox } from "svg-path-commander/src/util/getPathBBox";
export { default as getPathLength } from "svg-path-commander/src/util/getPathLength";
export { default as getTotalLength } from "svg-path-commander/src/util/getTotalLength";
export { default as segmentLineFactory } from "svg-path-commander/src/util/segmentLineFactory";
export { default as segmentArcFactory } from "svg-path-commander/src/util/segmentArcFactory";
export { default as segmentCubicFactory } from "svg-path-commander/src/util/segmentCubicFactory";
export { default as segmentQuadFactory } from "svg-path-commander/src/util/segmentQuadFactory";
export { default as getPointAtLength } from "svg-path-commander/src/util/getPointAtLength";
export { default as getPointAtPathLength } from "svg-path-commander/src/util/getPointAtPathLength";
export { default as getPropertiesAtPoint } from "svg-path-commander/src/util/getPropertiesAtPoint";
export { default as getPropertiesAtLength } from "svg-path-commander/src/util/getPropertiesAtLength";
export { default as getClosestPoint } from "svg-path-commander/src/util/getClosestPoint";
export { default as getSegmentAtLength } from "svg-path-commander/src/util/getSegmentAtLength";
export { default as getSegmentOfPoint } from "svg-path-commander/src/util/getSegmentOfPoint";
export { default as isPointInStroke } from "svg-path-commander/src/util/isPointInStroke";
export { default as isAbsoluteArray } from "svg-path-commander/src/util/isAbsoluteArray";
export { default as isCurveArray } from "svg-path-commander/src/util/isCurveArray";
export { default as isNormalizedArray } from "svg-path-commander/src/util/isNormalizedArray";
export { default as isPathArray } from "svg-path-commander/src/util/isPathArray";
export { default as isRelativeArray } from "svg-path-commander/src/util/isRelativeArray";
export { default as isValidPath } from "svg-path-commander/src/util/isValidPath";
export { default as shapeToPath } from "svg-path-commander/src/util/shapeToPath";
export { default as Version } from "svg-path-commander/src/version";

// main
import { default as SVGPathCommander } from 'svg-path-commander/src/svg-path-commander';

// dependency
export {default as CSSMatrix} from "dommatrix";

// custom types
export {
  MCommand, mCommand, LCommand, lCommand,
  VCommand, vCommand, HCommand, hCommand,
  ZCommand, zCommand, CCommand, cCommand,
  SCommand, sCommand, QCommand, qCommand,
  TCommand, tCommand, ACommand, aCommand,
  pathCommand, absoluteCommand, relativeCommand,
  MSegment, mSegment, moveSegment,
  LSegment, lSegment, lineSegment,
  VSegment, vSegment, vertLineSegment,
  HSegment, hSegment, horLineSegment,
  CSegment, cSegment, cubicSegment,
  SSegment, sSegment, shortCubicSegment,
  QSegment, qSegment, quadSegment,
  TSegment, tSegment, shortQuadSegment,
  ZSegment, zSegment, closeSegment,
  segmentProperties,

  shortSegment, absoluteSegment, relativeSegment, normalSegment, pathSegment,
  pathArray, absoluteArray, relativeArray, normalArray,
  curveArray, polygonArray, polylineArray,

  pathTransformList, transformObject,

  shapeTypes, shapeOps,
  lineAttr, polyAttr, circleAttr,
  ellipseAttr, rectAttr, glyphAttr,

  pathBBox,
  segmentLimits,

  options,
  parserParams,
  pointProperties,
} from './more/svg';
