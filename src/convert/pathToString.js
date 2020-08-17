export default function(pathArray) {
  return pathArray.map( (c) => {
    if (typeof c === 'string') {
      return c
    } else {
      return c.shift() + c.join(' ') 
    }
  }).join('')
}