export default function SVGPathArray(pathString){
  this.segments = []
  this.pathValue = pathString
  this.max = pathString.length
  this.index  = 0
  this.param = 0.0
  this.segmentStart = 0
  this.data = []
  this.err = ''
  return this
}