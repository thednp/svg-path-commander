import { type Point } from '../types';

/**
 * Tools from bezier.js by Mike 'Pomax' Kamermans
 * @see https://github.com/Pomax/bezierjs
 */

const ZERO = { x: 0, y: 0 };

const Tvalues = [
  -0.0640568928626056260850430826247450385909, 0.0640568928626056260850430826247450385909,
  -0.1911188674736163091586398207570696318404, 0.1911188674736163091586398207570696318404,
  -0.3150426796961633743867932913198102407864, 0.3150426796961633743867932913198102407864,
  -0.4337935076260451384870842319133497124524, 0.4337935076260451384870842319133497124524,
  -0.5454214713888395356583756172183723700107, 0.5454214713888395356583756172183723700107,
  -0.6480936519369755692524957869107476266696, 0.6480936519369755692524957869107476266696,
  -0.7401241915785543642438281030999784255232, 0.7401241915785543642438281030999784255232,
  -0.8200019859739029219539498726697452080761, 0.8200019859739029219539498726697452080761,
  -0.8864155270044010342131543419821967550873, 0.8864155270044010342131543419821967550873,
  -0.9382745520027327585236490017087214496548, 0.9382745520027327585236490017087214496548,
  -0.9747285559713094981983919930081690617411, 0.9747285559713094981983919930081690617411,
  -0.9951872199970213601799974097007368118745, 0.9951872199970213601799974097007368118745,
];

const Cvalues = [
  0.1279381953467521569740561652246953718517, 0.1279381953467521569740561652246953718517,
  0.1258374563468282961213753825111836887264, 0.1258374563468282961213753825111836887264,
  0.121670472927803391204463153476262425607, 0.121670472927803391204463153476262425607,
  0.1155056680537256013533444839067835598622, 0.1155056680537256013533444839067835598622,
  0.1074442701159656347825773424466062227946, 0.1074442701159656347825773424466062227946,
  0.0976186521041138882698806644642471544279, 0.0976186521041138882698806644642471544279,
  0.086190161531953275917185202983742667185, 0.086190161531953275917185202983742667185,
  0.0733464814110803057340336152531165181193, 0.0733464814110803057340336152531165181193,
  0.0592985849154367807463677585001085845412, 0.0592985849154367807463677585001085845412,
  0.0442774388174198061686027482113382288593, 0.0442774388174198061686027482113382288593,
  0.0285313886289336631813078159518782864491, 0.0285313886289336631813078159518782864491,
  0.0123412297999871995468056670700372915759, 0.0123412297999871995468056670700372915759,
];

type DerivedPoint = Point & { t: number };
type QuadPoints = [Point, Point, Point, Point, Point, Point];
type CubicPoints = [Point, Point, Point, Point, Point, Point, Point, Point];
type DerivedQuadPoints = [DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint];
type DerivedCubicPoints = [
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
];
export type QuadCoordinates = [number, number, number, number, number, number];
export type CubicCoordinates = [number, number, number, number, number, number, number, number];

type DeriveCallback = (t: number) => Point;

/**
 *
 * @param points
 * @returns
 */
const derive = (points: QuadPoints | CubicPoints) => {
  const dpoints = [] as (DerivedCubicPoints | DerivedQuadPoints)[];
  for (let p = points, d = p.length, c = d - 1; d > 1; d -= 1, c -= 1) {
    const list = [] as unknown as DerivedCubicPoints | DerivedQuadPoints;
    for (let j = 0; j < c; j += 1) {
      list.push({
        x: c * (p[j + 1].x - p[j].x),
        y: c * (p[j + 1].y - p[j].y),
        t: 0,
      });
    }
    dpoints.push(list);
    p = list;
  }
  return dpoints;
};

/**
 *
 * @param points
 * @param t
 */
const compute = (points: DerivedQuadPoints | DerivedCubicPoints, t: number) => {
  // shortcuts
  /* istanbul ignore next @preserve */
  if (t === 0) {
    points[0].t = 0;
    return points[0];
  }

  const order = points.length - 1;

  /* istanbul ignore next @preserve */
  if (t === 1) {
    points[order].t = 1;
    return points[order];
  }

  const mt = 1 - t;
  let p = points as typeof points | [DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint];

  // constant?
  /* istanbul ignore next @preserve */
  if (order === 0) {
    points[0].t = t;
    return points[0];
  }

  // linear?
  /* istanbul ignore else @preserve */
  if (order === 1) {
    return {
      x: mt * p[0].x + t * p[1].x,
      y: mt * p[0].y + t * p[1].y,
      t,
    };
  }

  // quadratic/cubic curve?
  const mt2 = mt * mt;
  const t2 = t * t;
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  /* istanbul ignore else @preserve */
  if (order === 2) {
    p = [p[0], p[1], p[2], ZERO as DerivedPoint];
    a = mt2;
    b = mt * t * 2;
    c = t2;
  } else if (order === 3) {
    a = mt2 * mt;
    b = mt2 * t * 3;
    c = mt * t2 * 3;
    d = t * t2;
  }
  return {
    x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
    y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y,
    t,
  };
};

const arcfn = (derivativeFn: DeriveCallback, t: number) => {
  const d = derivativeFn(t);
  const l = d.x * d.x + d.y * d.y;

  return Math.sqrt(l);
};

const lengthFn = (derivativeFn: DeriveCallback) => {
  const z = 0.5;
  const len = Tvalues.length;

  let sum = 0;

  for (let i = 0, t; i < len; i++) {
    t = z * Tvalues[i] + z;
    sum += Cvalues[i] * arcfn(derivativeFn, t);
  }
  return z * sum;
};

/**
 * Returns the length of CubicBezier / Quad segment.
 * @param curve cubic / quad bezier segment
 */
export const length = (curve: CubicCoordinates | QuadCoordinates) => {
  const points = [] as unknown as CubicPoints | QuadPoints;
  for (let idx = 0, len = curve.length, step = 2; idx < len; idx += step) {
    points.push({
      x: curve[idx],
      y: curve[idx + 1],
    });
  }
  const dpoints = derive(points);
  return lengthFn((t: number) => {
    return compute(dpoints[0], t);
  });
};

// Precision for consider cubic polynom as quadratic one
const CBEZIER_MINMAX_EPSILON = 0.00000001;

/**
 * Returns the most extreme points in a Quad Bezier segment.
 * @param A
 */
// https://github.com/kpym/SVGPathy/blob/acd1a50c626b36d81969f6e98e8602e128ba4302/lib/box.js#L89
export const minmaxQ = (A: [number, number, number]) => {
  const min = Math.min(A[0], A[2]);
  const max = Math.max(A[0], A[2]);

  /* istanbul ignore else @preserve */
  if (A[1] >= A[0] ? A[2] >= A[1] : A[2] <= A[1]) {
    // if no extremum in ]0,1[
    return [min, max] as [number, number];
  }

  // check if the extremum E is min or max
  const E = (A[0] * A[2] - A[1] * A[1]) / (A[0] - 2 * A[1] + A[2]);
  return (E < min ? [E, max] : [min, E]) as [number, number];
};

/**
 * Returns the most extreme points in a Cubic Bezier segment.
 * @param A
 * @see https://github.com/kpym/SVGPathy/blob/acd1a50c626b36d81969f6e98e8602e128ba4302/lib/box.js#L127
 */
export const minmaxC = (A: [number, number, number, number]) => {
  const K = A[0] - 3 * A[1] + 3 * A[2] - A[3];

  // if the polynomial is (almost) quadratic and not cubic
  /* istanbul ignore else @preserve */
  if (Math.abs(K) < CBEZIER_MINMAX_EPSILON) {
    if (A[0] === A[3] && A[0] === A[1]) {
      // no curve, point targeting same location
      return [A[0], A[3]] as [number, number];
    }

    return minmaxQ([A[0], -0.5 * A[0] + 1.5 * A[1], A[0] - 3 * A[1] + 3 * A[2]]);
  }

  // the reduced discriminant of the derivative
  const T = -A[0] * A[2] + A[0] * A[3] - A[1] * A[2] - A[1] * A[3] + A[1] * A[1] + A[2] * A[2];

  // if the polynomial is monotone in [0,1]
  if (T <= 0) {
    return [Math.min(A[0], A[3]), Math.max(A[0], A[3])] as [number, number];
  }
  const S = Math.sqrt(T);

  // potential extrema
  let min = Math.min(A[0], A[3]);
  let max = Math.max(A[0], A[3]);

  const L = A[0] - 2 * A[1] + A[2];
  // check local extrema
  for (let R = (L + S) / K, i = 1; i <= 2; R = (L - S) / K, i++) {
    if (R > 0 && R < 1) {
      // if the extrema is for R in [0,1]
      const Q =
        A[0] * (1 - R) * (1 - R) * (1 - R) +
        A[1] * 3 * (1 - R) * (1 - R) * R +
        A[2] * 3 * (1 - R) * R * R +
        A[3] * R * R * R;
      if (Q < min) {
        min = Q;
      }
      if (Q > max) {
        max = Q;
      }
    }
  }

  return [min, max] as [number, number];
};
