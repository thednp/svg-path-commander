import util from './util/util.js'
import SVGPathCommander from './class/SVGPathCommander.js'

for (let x in util) { SVGPathCommander[x] = util[x] }

export default SVGPathCommander 