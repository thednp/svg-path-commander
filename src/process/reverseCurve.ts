import type { CSegment, CurveArray, MSegment, PathCommand } from '../types';

/**
 * Reverses all segments of a `pathArray`
 * which consists of only C (cubic-bezier) path commands.
 *
 * @param path the source `pathArray`
 * @returns the reversed `pathArray`
 */
const reverseCurve = (path: CurveArray) => {
  const rotatedCurve = path
    .slice(1)
    .map((x, i, curveOnly) =>
      !i ? path[0].slice(1).concat(x.slice(1) as number[]) : curveOnly[i - 1].slice(-2).concat(x.slice(1)),
    )
    .map(x => x.map((_, i) => x[x.length - i - 2 * (1 - (i % 2))]))
    .reverse() as (MSegment | CSegment)[];

  return [['M' as PathCommand | number].concat(rotatedCurve[0].slice(0, 2))].concat(
    rotatedCurve.map(x => ['C' as PathCommand | number].concat(x.slice(2))),
  ) as CurveArray;
};

export default reverseCurve;
