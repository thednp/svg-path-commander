import type { CSegment, PathArray, PathSegment, PointTuple, QSegment } from "../../src/types";

/** The path commands exercised by the reversal matrix. */
export const reverseCommands = ["L", "H", "V", "C", "S", "Q", "T"] as const;

/**
 * Builds a path from a command sequence.
 *
 * The coordinates advance with the command index so that no two consecutive
 * segments can collapse into a degenerate one, which would make the
 * comparison below meaningless.
 */
export const buildReverseCase = (sequence: readonly string[]): string => {
  const parts = ["M10 20"];
  sequence.forEach((command, index) => {
    const step = index + 1;
    const x = 10 + step * 17;
    const y = 20 + step * 13;
    const nextX = 10 + (step + 1) * 17;
    const nextY = 20 + (step + 1) * 13;
    switch (command) {
      case "L":
        parts.push(`L${x} ${y}`);
        break;
      case "H":
        parts.push(`H${x}`);
        break;
      case "V":
        parts.push(`V${y}`);
        break;
      case "C":
        parts.push(`C${x} ${y} ${nextX} ${nextY} ${x + 9} ${y + 7}`);
        break;
      case "S":
        parts.push(`S${x} ${y} ${x + 9} ${y + 7}`);
        break;
      case "Q":
        parts.push(`Q${x} ${y} ${nextX} ${nextY}`);
        break;
      case "T":
        parts.push(`T${x} ${y}`);
        break;
    }
  });
  return parts.join("");
};

/**
 * The mathematically correct reversal of a normalized path.
 *
 * Every segment is traversed backwards, so the control points swap and the
 * segment order is reversed. The `M` stays first and moves to the end of the
 * original path.
 */
export const expectedReverse = (normalized: PathArray): PathArray => {
  const starts: PointTuple[] = [];
  let x = 0;
  let y = 0;
  for (const segment of normalized) {
    if (segment[0] === "M") {
      x = segment[1] as number;
      y = segment[2] as number;
    } else {
      const end = segment.slice(-2) as PointTuple;
      starts.push([x, y]);
      x = end[0];
      y = end[1];
    }
  }

  const expected: PathSegment[] = [["M", x, y]];
  for (let index = normalized.length - 1; index >= 1; index -= 1) {
    const segment = normalized[index];
    const start = starts[index - 1];
    if (segment[0] === "C") {
      expected.push([
        "C",
        segment[3],
        segment[4],
        segment[1],
        segment[2],
        start[0],
        start[1],
      ] as CSegment);
    } else if (segment[0] === "Q") {
      expected.push(["Q", segment[1], segment[2], start[0], start[1]] as QSegment);
    } else {
      expected.push(["L", start[0], start[1]]);
    }
  }
  return expected as PathArray;
};

/** Compares two normalized paths, allowing for floating point noise. */
export const samePath = (left: PathArray, right: PathArray): boolean => {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    const a = left[index];
    const b = right[index];
    if (a[0] !== b[0] || a.length !== b.length) return false;
    for (let param = 1; param < a.length; param += 1) {
      const delta = Math.abs((a[param] as number) - (b[param] as number));
      if (delta > 1e-9) return false;
    }
  }
  return true;
};

const near = (left: number, right: number) => Math.abs(left - right) <= 1e-9;
const samePoint = (left: PointTuple, right: PointTuple) =>
  near(left[0], right[0]) && near(left[1], right[1]);

/**
 * A segment whose control points coincide with its endpoints traces a
 * straight line, so the control point may sit at either end without
 * changing the traced geometry.
 */
const isStraight = (segment: PathSegment, start: PointTuple): boolean => {
  const end = segment.slice(-2) as PointTuple;
  if (segment[0] === "Q") {
    const control = [segment[1], segment[2]] as PointTuple;
    return samePoint(control, start) || samePoint(control, end);
  }
  if (segment[0] === "C") {
    const first = [segment[1], segment[2]] as PointTuple;
    const second = [segment[3], segment[4]] as PointTuple;
    return (
      (samePoint(first, start) || samePoint(first, end)) &&
      (samePoint(second, start) || samePoint(second, end))
    );
  }
  return true;
};

/**
 * Compares the geometry of two normalized paths.
 *
 * The endpoints must match exactly. The control points must match too, except
 * when both segments are straight lines between the same two points — the
 * control point of a straight quadratic may sit at either end without
 * changing the traced curve, it only changes the internal parameterisation.
 */
export const sameGeometry = (expected: PathArray, actual: PathArray): boolean => {
  if (expected.length !== actual.length) return false;
  let expectedStart: PointTuple = [0, 0];
  let actualStart: PointTuple = [0, 0];
  for (let index = 0; index < expected.length; index += 1) {
    const want = expected[index];
    const got = actual[index];
    if (want[0] !== got[0]) return false;
    const wantEnd = want.slice(-2) as PointTuple;
    const gotEnd = got.slice(-2) as PointTuple;
    if (!samePoint(wantEnd, gotEnd)) return false;
    if (index > 0) {
      const wantStraight = isStraight(want, expectedStart);
      const gotStraight = isStraight(got, actualStart);
      for (let param = 1; param < want.length - 2; param += 1) {
        if (near(want[param] as number, got[param] as number)) continue;
        if (wantStraight && gotStraight) break;
        return false;
      }
    } else {
      for (let param = 1; param < want.length; param += 1) {
        if (!near(want[param] as number, got[param] as number)) return false;
      }
    }
    expectedStart = wantEnd;
    actualStart = gotEnd;
  }
  return true;
};

/** Every command sequence of the given length. */
export const commandSequences = (length: number): string[][] => {
  const sequences: string[][] = [];
  const walk = (current: string[]) => {
    if (current.length === length) {
      sequences.push([...current]);
      return;
    }
    for (const command of reverseCommands) {
      current.push(command);
      walk(current);
      current.pop();
    }
  };
  walk([]);
  return sequences;
};
