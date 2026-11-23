import type { CSegment, Point } from "../types.ts";

const MAX_ITERATIONS = 4;

const subtract = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y });
const scale = (point: Point, value: number): Point => ({
  x: point.x * value,
  y: point.y * value,
});
const dot = (a: Point, b: Point): number => a.x * b.x + a.y * b.y;
const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);
const normalize = (point: Point): Point => {
  const length = Math.hypot(point.x, point.y);
  return length ? scale(point, 1 / length) : { x: 0, y: 0 };
};
const negate = (point: Point): Point => ({ x: -point.x, y: -point.y });

const chordParameters = (points: Point[]): number[] => {
  const parameters = [0];
  for (let i = 1; i < points.length; i += 1) {
    parameters.push(parameters[i - 1] + distance(points[i - 1], points[i]));
  }
  const total = parameters[parameters.length - 1];
  return parameters.map((parameter) => parameter / total);
};

const evaluate = (curve: Point[], t: number): Point => {
  const u = 1 - t;
  return add(
    add(scale(curve[0], u ** 3), scale(curve[1], 3 * u * u * t)),
    add(scale(curve[2], 3 * u * t * t), scale(curve[3], t ** 3)),
  );
};

const generateCurve = (
  points: Point[],
  parameters: number[],
  leftTangent: Point,
  rightTangent: Point,
): Point[] => {
  const first = points[0];
  const last = points[points.length - 1];
  const segmentLength = distance(first, last);

  if (points.length === 2) {
    const handle = segmentLength / 3;
    return [
      first,
      add(first, scale(leftTangent, handle)),
      add(last, scale(rightTangent, handle)),
      last,
    ];
  }

  let c00 = 0;
  let c01 = 0;
  let c11 = 0;
  let x0 = 0;
  let x1 = 0;

  for (let i = 0; i < points.length; i += 1) {
    const t = parameters[i];
    const u = 1 - t;
    const b0 = u ** 3;
    const b1 = 3 * u * u * t;
    const b2 = 3 * u * t * t;
    const b3 = t ** 3;
    const a0 = scale(leftTangent, b1);
    const a1 = scale(rightTangent, b2);
    const tmp = subtract(points[i], add(scale(first, b0 + b1), scale(last, b2 + b3)));
    c00 += dot(a0, a0);
    c01 += dot(a0, a1);
    c11 += dot(a1, a1);
    x0 += dot(a0, tmp);
    x1 += dot(a1, tmp);
  }

  const determinant = c00 * c11 - c01 * c01;
  let alphaLeft = determinant ? (x0 * c11 - x1 * c01) / determinant : 0;
  let alphaRight = determinant ? (c00 * x1 - c01 * x0) / determinant : 0;
  const epsilon = 1e-6 * segmentLength;
  if (alphaLeft < epsilon || alphaRight < epsilon) {
    alphaLeft = segmentLength / 3;
    alphaRight = alphaLeft;
  }

  return [
    first,
    add(first, scale(leftTangent, alphaLeft)),
    add(last, scale(rightTangent, alphaRight)),
    last,
  ];
};

const findMaxError = (
  points: Point[],
  curve: Point[],
  parameters: number[],
): { error: number; split: number } => {
  let error = 0;
  let split = points.length >> 1;
  for (let i = 1; i < points.length - 1; i += 1) {
    const point = evaluate(curve, parameters[i]);
    const current = (point.x - points[i].x) ** 2 + (point.y - points[i].y) ** 2;
    if (current > error) {
      error = current;
      split = i;
    }
  }
  return { error, split };
};

const refineParameter = (curve: Point[], point: Point, parameter: number): number => {
  const t = parameter;
  const u = 1 - t;
  const q = evaluate(curve, t);
  const q1 = add(
    add(
      scale(subtract(curve[1], curve[0]), 3 * u * u),
      scale(subtract(curve[2], curve[1]), 6 * u * t),
    ),
    scale(subtract(curve[3], curve[2]), 3 * t * t),
  );
  const q2 = add(
    scale(add(subtract(curve[2], scale(curve[1], 2)), curve[0]), 6 * u),
    scale(add(subtract(curve[3], scale(curve[2], 2)), curve[1]), 6 * t),
  );
  const difference = subtract(q, point);
  const denominator = dot(q1, q1) + dot(q2, difference);
  return denominator ? t - dot(q1, difference) / denominator : t;
};

const reparameterize = (curve: Point[], points: Point[], parameters: number[]): number[] =>
  parameters.map((parameter, index) =>
    index === 0 || index === points.length - 1
      ? parameter
      : refineParameter(curve, points[index], parameter),
  );

const toSegments = (curves: Point[][]): CSegment[] =>
  curves.map((curve) => [
    "C",
    curve[1].x,
    curve[1].y,
    curve[2].x,
    curve[2].y,
    curve[3].x,
    curve[3].y,
  ]);

export const fitCubic = (points: Point[], tolerance: number): CSegment[] => {
  const error = tolerance * tolerance;
  const curves: Point[][] = [];

  const fit = (range: Point[], leftTangent: Point, rightTangent: Point): void => {
    const parameters = chordParameters(range);
    let curve = generateCurve(range, parameters, leftTangent, rightTangent);
    let maximum = findMaxError(range, curve, parameters);

    if (maximum.error <= error || range.length === 2) {
      curves.push(curve);
      return;
    }

    let currentParameters = parameters;
    for (let i = 0; i < MAX_ITERATIONS; i += 1) {
      currentParameters = reparameterize(curve, range, currentParameters);
      curve = generateCurve(range, currentParameters, leftTangent, rightTangent);
      maximum = findMaxError(range, curve, currentParameters);
      if (maximum.error <= error) {
        curves.push(curve);
        return;
      }
    }

    const split = maximum.split;
    const centerTangent = normalize(subtract(range[split - 1], range[split + 1]));
    fit(range.slice(0, split + 1), leftTangent, centerTangent);
    fit(range.slice(split), negate(centerTangent), rightTangent);
  };

  fit(
    points,
    normalize(subtract(points[1], points[0])),
    normalize(subtract(points[points.length - 2], points[points.length - 1])),
  );
  return toSegments(curves);
};
