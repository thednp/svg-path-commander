/**
 * Splits an extended A (arc-to) segment into two cubic-bezier segments.
 *
 * @param {SVGPathCommander.pathArray} path the `pathArray` this segment belongs to
 * @param {string[]} allPathCommands all previous path commands
 * @param {number} i the segment index
 */

export default function fixArc(path, allPathCommands, i) {
  if (path[i].length > 7) {
    path[i].shift();
    const segment = path[i];
    let ni = i; // ESLint
    while (segment.length) {
      // if created multiple C:s, their original seg is saved
      allPathCommands[i] = 'A';
      // @ts-ignore
      path.splice(ni += 1, 0, ['C', ...segment.splice(0, 6)]);
    }
    path.splice(i, 1);
  }
}
