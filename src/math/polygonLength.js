import distanceSquareRoot from './distanceSquareRoot.js'
// d3-polygon length

export default function(ring){
  return ring.reduce((length, point, i) => 
  i ? length + distanceSquareRoot(ring[i-1],point) : 0, 0 )
}