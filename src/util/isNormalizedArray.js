import paramsCount from './paramsCount.js'

export default function(pathArray){
  return Array.isArray(pathArray) && pathArray.every(seg=>{
    let pathCommand = seg[0].toLowerCase()
    return paramsCount[pathCommand] === seg.length - 1 && /[ACLMQZ]/.test(seg[0]) // achlmrqstvz
  })
}