export default function(pathArray, allPathCommands, i) {
  if (pathArray[i].length > 7) {
    pathArray[i].shift();
    let pi = pathArray[i];
    while (pi.length) {
      allPathCommands[i] = "A"; // if created multiple C:s, their original seg is saved
      pathArray.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
    }
    pathArray.splice(i, 1);
  }
}