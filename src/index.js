import Util from './util/util';
import SVGPathCommander from './class/svg-path-commander';

Object.keys(Util).forEach((x) => { SVGPathCommander[x] = Util[x]; });

/**
 * @typedef {import("../types/types")} SVGPC shows types in src/ sources
 */
export default SVGPathCommander;
