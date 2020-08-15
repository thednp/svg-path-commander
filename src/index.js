import SVGPathCommander from './SVGPathCommander.js'
import util from './util/util.js'

for (let x in util) { SVGPathCommander[x] = util[x] }

export default SVGPathCommander 