import midPoint from '../math/midPoint.js'

export default function(pts,t) {
  t = t || 0.5
  let p0 = pts.slice(0,2),
      p1 = pts.slice(2,4),
      p2 = pts.slice(4,6),
      p3 = pts.slice(6,8),
      p4 = midPoint(p0, p1, t),
      p5 = midPoint(p1, p2, t),
      p6 = midPoint(p2, p3, t),
      p7 = midPoint(p4, p5, t),
      p8 = midPoint(p5, p6, t),
      p9 = midPoint(p7, p8, t)

  return [
    ['C'].concat( p4, p7, p9),
    ['C'].concat( p8, p6, p3)
  ]   
}
