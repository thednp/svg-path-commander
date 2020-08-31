import paramsCount from './paramsCount.js'

export default function(pathArray){
  return Array.isArray(pathArray) && pathArray.every(x=>{
    let pathCommand = x[0].toLowerCase()
    return paramsCount[pathCommand] === x.length - 1 && /[achlmrqstvz]/g.test(pathCommand)
  })
}