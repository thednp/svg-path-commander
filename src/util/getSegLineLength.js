import distanceSquareRoot from '../math/distanceSquareRoot.js'

// returns the line segment length
export default function(ax, ay, bx, by) {
  return distanceSquareRoot([ax,ay],[bx,by])
}