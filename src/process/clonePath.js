export default function clonePath(pathArray) {
  return pathArray.map((x) => {
    if (Array.isArray(x)) {
      return clonePath(x);
    }
    return !Number.isNaN(+x) ? +x : x;
  });
}
