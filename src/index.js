/** @typedef {import('../types/index')} */

import SVGPathCommander from './svg-path-commander';
import Util from './util/util';
import Version from './version';

// Export to global
Object.assign(SVGPathCommander, Util, { Version });

export default SVGPathCommander;
