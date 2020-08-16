export default function(pathArray) {
  let len = pathArray.length
  pathArray.isClosed = pathArray.slice(1).every(x=>x[0]==='C') && pathArray[len-1][1] === pathArray[0][1] && pathArray[len-1][2] === pathArray[0][2] // the only way to find out on curveArray
                      || 'isClosed' in pathArray ? pathArray.isClosed : pathArray[len-1][0] && pathArray[len-1][0].toUpperCase() ==='Z'
  pathArray.isAbsolute = 'isAbsolute' in pathArray ? pathArray.isClosed : pathArray.every(x=>x[0]===x[0].toUpperCase())
}