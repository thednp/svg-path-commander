// Given an xyz point and an xyz perspective origin point, this will return the xy projected location
// Using the equation found here: http://en.wikipedia.org/wiki/3D_projection#Diagram
// https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
export default function(m, point2D, origin){ 
  let point3D = m.transformPoint({x:point2D[0], y:point2D[1], z:0, w:1}),
      originX = origin[0]||0, originY = origin[1]||0, originZ = origin[2]||0,
      projectedPoint = {}, relativePosition = {};

  // First, we take our given point and locate it relative to the perspective origin, rather than the screen
  relativePosition.x = point3D.x - originX;
  relativePosition.y = point3D.y - originY;
  relativePosition.z = point3D.z - originZ;

  // Then we take this object and project it onto our 2d plane
  projectedPoint.x = relativePosition.x * (Math.abs(originZ) / Math.abs(relativePosition.z));
  projectedPoint.y = relativePosition.y * (Math.abs(originZ) / Math.abs(relativePosition.z));

  // Then we take this and locate it relative to the screen again, instead of the perspective origin
  return [
    projectedPoint.x + originX,
    projectedPoint.y + originY
  ]
}