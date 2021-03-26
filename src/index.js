import util from './util/util.js';
import SVGPathCommander from './class/SVGPathCommander.js';

Object.keys(util).forEach((x) => { SVGPathCommander[x] = util[x]; });

export default SVGPathCommander;
