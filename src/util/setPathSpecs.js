export default function(pathArray) {
  pathArray.isClosed = 'isClosed' in pathArray ? pathArray.isClosed : pathArray[pathArray.length-1][0].toUpperCase() ==='Z'
  pathArray.isAbsolute = 'isAbsolute' in pathArray ? pathArray.isClosed : pathArray.every(x=>x[0]===x[0].toUpperCase())
}