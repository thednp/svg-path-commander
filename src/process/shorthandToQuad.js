// returns {qx,qy} for shorthand quadratic bezier segments
export default function(x1,y1,qx,qy,prevCommand){
  return 'QT'.indexOf(prevCommand)>-1 ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy}
                                      : { qx: x1, qy: y1 }
}