export default function fixArc(pathArray, allPathCommands, i) {
  if (pathArray[i].length > 7) {
    pathArray[i].shift();
    const pi = pathArray[i];
    // const ni = i + 1;
    let ni = i;
    while (pi.length) {
      // if created multiple C:s, their original seg is saved
      allPathCommands[i] = 'A';
      pathArray.splice(ni += 1, 0, ['C'].concat(pi.splice(0, 6)));
      // pathArray.splice(i += 1, 0, ['C'].concat(pi.splice(0, 6)));
      // pathArray.splice(i++, 0, ['C'].concat(pi.splice(0, 6)));
    }
    pathArray.splice(i, 1);
  }
}
