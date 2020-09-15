export default function clonePath(pathArray){
  return pathArray.map(x => 
    Array.isArray(x) 
    ? clonePath(x) 
    : !isNaN(+x) ? +x : x )
}