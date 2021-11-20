import Util from './util/util.js';
import SVGPathCommander from './class/SVGPathCommander.js';

Object.keys(Util).forEach((x) => { SVGPathCommander[x] = Util[x]; });

export default SVGPathCommander;
