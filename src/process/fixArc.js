/**
 * Splits an extended A (arc-to) segment into two cubic-bezier segments.
 *
 * @param {svgpcNS.pathArray} path the `pathArray` this segment belongs to
 * @param {string[]} allPathCommands all previous path commands
 * @param {Number} i the index of the segment
 */

export default function fixArc(path, allPathCommands, i) {
  if (path[i].length > 7) {
    path[i].shift();
    const segment = path[i];
    let ni = i; // ESLint
    while (segment.length) {
      // if created multiple C:s, their original seg is saved
      allPathCommands[i] = 'A';
      // path.splice(i++, 0, ['C'].concat(segment.splice(0, 6)));
      // @ts-ignore -- cannot fix
      path.splice(ni += 1, 0, ['C'].concat(segment.splice(0, 6)));
    }
    path.splice(i, 1);
  }
}
