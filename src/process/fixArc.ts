import { CSegment, PathArray, PathCommand } from '../types';

/**
 * Splits an extended A (arc-to) segment into two cubic-bezier segments.
 *
 * @param path the `pathArray` this segment belongs to
 * @param allPathCommands all previous path commands
 * @param i the segment index
 */
const fixArc = (path: PathArray, allPathCommands: PathCommand[], i: number) => {
  if (path[i].length > 7) {
    path[i].shift();
    const segment = path[i];
    let ni = i; // ESLint
    while (segment.length) {
      // if created multiple C:s, their original seg is saved
      allPathCommands[i] = 'A';
      path.splice((ni += 1), 0, ['C', ...segment.splice(0, 6)] as CSegment);
    }
    path.splice(i, 1);
  }
};
export default fixArc;
