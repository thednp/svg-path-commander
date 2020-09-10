function cubicLerp(a, b, t) {
  return [a[0]*(1 - t) + b[0]*t, a[1]*(1 - t) + b[1]*t]
}

export default function(pts,t) {
  t = t || 0.5
  let p0 = pts.slice(0,2), 
      p1 = pts.slice(2,4), 
      p2 = pts.slice(4,6), 
      p3 = pts.slice(6,8),
      p4 = cubicLerp(p0, p1, t),
      p5 = cubicLerp(p1, p2, t),
      p6 = cubicLerp(p2, p3, t),
      p7 = cubicLerp(p4, p5, t),
      p8 = cubicLerp(p5, p6, t),
      p9 = cubicLerp(p7, p8, t)

      // firsthalf  = [p0, p4, p7, p9] 
      // secondhalf = [p9, p8, p6, p3]
      // firsthalf  = ['C'].concat( p4, p7, p9), 
      // secondhalf = ['C'].concat( p8, p6, p3);

  return [
    ['C'].concat( p4, p7, p9),
    ['C'].concat( p8, p6, p3)
  ]   
}