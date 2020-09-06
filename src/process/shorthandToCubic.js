// returns {x1,x2} for shorthand cubic bezier segments
export default function(x1,y1,x2,y2,prevCommand){
  return 'CS'.indexOf(prevCommand)>-1 ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2}
                                      : { x1: x1, y1: y1 }
}