/**
 * Reverses all segments of a `pathArray`
 * which consists of only C (cubic-bezier) path commands.
 *
 * @param {SVGPath.curveArray} path the source `pathArray`
 * @returns {SVGPath.curveArray} the reversed `pathArray`
 */
export default function reverseCurve(path) {
  const rotatedCurve = path.slice(1)
    .map((x, i, curveOnly) => (!i
      ? [...path[0].slice(1), ...x.slice(1)]
      : [...curveOnly[i - 1].slice(-2), ...x.slice(1)]))
    .map((x) => x.map((_, i) => x[x.length - i - 2 * (1 - (i % 2))]))
    .reverse();

  return [['M', ...rotatedCurve[0].slice(0, 2)],
    ...rotatedCurve.map((x) => ['C', ...x.slice(2)])];
}
