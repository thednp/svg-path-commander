import Util from './util/util';
import SVGPathCommander from './svg-path-commander';

Object.keys(Util).forEach((x) => { SVGPathCommander[x] = Util[x]; });

export default SVGPathCommander;
