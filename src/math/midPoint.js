export default function(a, b, t) {
  let ax = a[0], ay = a[1], bx = b[0], by = b[1]
  return [ ax + (bx - ax) * t, ay + (by - ay) * t];
}