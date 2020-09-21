// Given an xyz point and an xyz perspective origin point, this will return the xy projected location
// Using the equation found here: http://en.wikipedia.org/wiki/3D_projection#Diagram
// https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel

export default function(m, point2D, origin){ 
  let point3D = m.transformPoint({x:point2D[0], y:point2D[1], z:0, w:1}),
      originX = origin[0]||0, 
      originY = origin[1]||0, 
      originZ = origin[2]||0,
      relativePositionX = point3D.x - originX,
      relativePositionY = point3D.y - originY,
      relativePositionZ = point3D.z - originZ

  return [
    relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX,
    relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY
  ]
}