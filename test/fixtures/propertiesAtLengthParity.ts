import type { PathArray, PathSegment } from "../../src/types.ts";

/**
 * A parity case of the length lookup.
 */
export type PropertiesAtLengthCase = {
  /** the path of the case */
  path: string | PathArray;
  /** the distance of the case, a missing distance is no distance at all */
  distance?: number;
  /** the expected segment metadata */
  expected: {
    /** the segment the lookup has to answer */
    segment: PathSegment;
    /** the index of the segment */
    index: number;
    /** the length of the segment */
    length: number;
    /** the length of the path before the segment */
    lengthAtSegment: number;
  };
};

/**
 * The parity cases of the length lookup.
 *
 * The expected values are the ones of the implementation as it was before the
 * lookup was rewritten on top of the shared measurement pass, so they are the
 * contract of the tool and not a snapshot of the current code.
 */
export const propertiesAtLengthCases: PropertiesAtLengthCase[] = [
  {
    path: "",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: 0.0001,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: 1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: Number.POSITIVE_INFINITY,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  { path: "", expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 } },
  {
    path: "M0 0L10 10",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: 0.0001,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: 3.5355339059327378,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: 7.0710678118654755,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: 10.606601717798213,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: 14.142135623730951,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: 15.142135623730951,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: Number.POSITIVE_INFINITY,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: 0.0001,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: 10.606601717798213,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: 21.213203435596427,
    expected: {
      segment: ["L", 20, 20],
      index: 2,
      length: 14.142135623730951,
      lengthAtSegment: 14.142135623730951,
    },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: 31.81980515339464,
    expected: {
      segment: ["L", 30, 30],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: 42.42640687119285,
    expected: {
      segment: ["L", 30, 30],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: 43.42640687119285,
    expected: {
      segment: ["L", 30, 30],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["L", 30, 30],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20L30 30",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: 0.0001,
    expected: {
      segment: ["Q", 5, 5, 10, 0],
      index: 1,
      length: 11.477935746963196,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: 8.905017842673537,
    expected: {
      segment: ["Q", 5, 5, 10, 0],
      index: 1,
      length: 11.477935746963196,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: 17.810035685347074,
    expected: {
      segment: ["L", 10, 10],
      index: 2,
      length: 10.000000000000002,
      lengthAtSegment: 11.477935746963196,
    },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: 26.71505352802061,
    expected: {
      segment: ["L", 20, 20],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 21.477935746963198,
    },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: 35.62007137069415,
    expected: {
      segment: ["L", 20, 20],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 21.477935746963198,
    },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: 36.62007137069415,
    expected: {
      segment: ["L", 20, 20],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 21.477935746963198,
    },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["L", 20, 20],
      index: 3,
      length: 14.142135623730951,
      lengthAtSegment: 21.477935746963198,
    },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0Q5 5 10 0L10 10L20 20",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: 0.0001,
    expected: {
      segment: ["C", 10, 10, 20, 20, 30, 0],
      index: 1,
      length: 39.340662762794466,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: 19.67033140562044,
    expected: {
      segment: ["C", 10, 10, 20, 20, 30, 0],
      index: 1,
      length: 39.340662762794466,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: 39.34066281124088,
    expected: {
      segment: ["S", 50, 20, 60, 0],
      index: 2,
      length: 39.3406628596873,
      lengthAtSegment: 39.340662762794466,
    },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: 59.01099421686132,
    expected: {
      segment: ["S", 50, 20, 60, 0],
      index: 2,
      length: 39.3406628596873,
      lengthAtSegment: 39.340662762794466,
    },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: 78.68132562248176,
    expected: {
      segment: ["S", 50, 20, 60, 0],
      index: 2,
      length: 39.3406628596873,
      lengthAtSegment: 39.340662762794466,
    },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: 79.68132562248176,
    expected: {
      segment: ["S", 50, 20, 60, 0],
      index: 2,
      length: 39.3406628596873,
      lengthAtSegment: 39.340662762794466,
    },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["S", 50, 20, 60, 0],
      index: 2,
      length: 39.3406628596873,
      lengthAtSegment: 39.340662762794466,
    },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0C10 10 20 20 30 0S50 20 60 0",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: 0.0001,
    expected: { segment: ["T", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: 16.153284219107398,
    expected: {
      segment: ["T", 20, 0],
      index: 2,
      length: 21.783097779670214,
      lengthAtSegment: 14.142135623730951,
    },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: 32.306568438214796,
    expected: {
      segment: ["T", 20, 0],
      index: 2,
      length: 21.783097779670214,
      lengthAtSegment: 14.142135623730951,
    },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: 48.459852657322195,
    expected: {
      segment: ["T", 30, 10],
      index: 3,
      length: 28.687903473028427,
      lengthAtSegment: 35.925233403401165,
    },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: 64.61313687642959,
    expected: {
      segment: ["T", 30, 10],
      index: 3,
      length: 28.687903473028427,
      lengthAtSegment: 35.925233403401165,
    },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: 65.61313687642959,
    expected: {
      segment: ["T", 30, 10],
      index: 3,
      length: 28.687903473028427,
      lengthAtSegment: 35.925233403401165,
    },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["T", 30, 10],
      index: 3,
      length: 28.687903473028427,
      lengthAtSegment: 35.925233403401165,
    },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0T10 10T20 0T30 10",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: 0.0001,
    expected: { segment: ["h", 10], index: 1, length: 10, lengthAtSegment: 0 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: 10,
    expected: { segment: ["v", 10], index: 2, length: 10, lengthAtSegment: 10 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: 20,
    expected: { segment: ["h", -10], index: 3, length: 10, lengthAtSegment: 20 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: 30,
    expected: { segment: ["z"], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: 40,
    expected: { segment: ["z"], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: 41,
    expected: { segment: ["z"], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: Number.POSITIVE_INFINITY,
    expected: { segment: ["z"], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: "M0 0h10v10h-10z",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0h10v10h-10z",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: 0.0001,
    expected: {
      segment: ["A", 25, 25, 0, 1, 1, 50, 0],
      index: 1,
      length: 78.53981633974485,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: 19.63495408493621,
    expected: {
      segment: ["A", 25, 25, 0, 1, 1, 50, 0],
      index: 1,
      length: 78.53981633974485,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: 39.26990816987242,
    expected: {
      segment: ["A", 25, 25, 0, 1, 1, 50, 0],
      index: 1,
      length: 78.53981633974485,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: 58.904862254808634,
    expected: {
      segment: ["A", 25, 25, 0, 1, 1, 50, 0],
      index: 1,
      length: 78.53981633974485,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: 78.53981633974485,
    expected: {
      segment: ["A", 25, 25, 0, 1, 1, 50, 0],
      index: 1,
      length: 78.53981633974485,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: 79.53981633974485,
    expected: {
      segment: ["A", 25, 25, 0, 1, 1, 50, 0],
      index: 1,
      length: 78.53981633974485,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["A", 25, 25, 0, 1, 1, 50, 0],
      index: 1,
      length: 78.53981633974485,
      lengthAtSegment: 0,
    },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0A25 25 0 1 1 50 0",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: 0.0001,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: 10.606601717798213,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: 21.213203435596427,
    expected: {
      segment: ["Z"],
      index: 2,
      length: 14.142135623730951,
      lengthAtSegment: 14.142135623730951,
    },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: 31.81980515339464,
    expected: {
      segment: ["L", 30, 30],
      index: 4,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: 42.42640687119285,
    expected: {
      segment: ["L", 30, 30],
      index: 4,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: 43.42640687119285,
    expected: {
      segment: ["L", 30, 30],
      index: 4,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["L", 30, 30],
      index: 4,
      length: 14.142135623730951,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10ZM20 20L30 30",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: 0.0001,
    expected: { segment: ["L", 10, 10], index: 3, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: 3.5355339059327378,
    expected: { segment: ["L", 10, 10], index: 3, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: 7.0710678118654755,
    expected: { segment: ["L", 10, 10], index: 3, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: 10.606601717798213,
    expected: { segment: ["L", 10, 10], index: 3, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: 14.142135623730951,
    expected: { segment: ["L", 10, 10], index: 3, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: 15.142135623730951,
    expected: { segment: ["L", 10, 10], index: 3, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: Number.POSITIVE_INFINITY,
    expected: { segment: ["L", 10, 10], index: 3, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L0 0L0 0L10 10",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: 0,
    expected: { segment: ["M", 10, 10], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: -1,
    expected: { segment: ["M", 10, 10], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: 0.0001,
    expected: { segment: ["l", 20, 20], index: 1, length: 28.284271247461902, lengthAtSegment: 0 },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: 17.67766952966369,
    expected: { segment: ["l", 20, 20], index: 1, length: 28.284271247461902, lengthAtSegment: 0 },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: 35.35533905932738,
    expected: {
      segment: ["l", 30, 30],
      index: 2,
      length: 42.42640687119285,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: 53.033008588991066,
    expected: {
      segment: ["l", 30, 30],
      index: 2,
      length: 42.42640687119285,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: 70.71067811865476,
    expected: {
      segment: ["l", 30, 30],
      index: 2,
      length: 42.42640687119285,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: 71.71067811865476,
    expected: {
      segment: ["l", 30, 30],
      index: 2,
      length: 42.42640687119285,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["l", 30, 30],
      index: 2,
      length: 42.42640687119285,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "m10 10l20 20l30 30",
    distance: Number.NaN,
    expected: { segment: ["M", 10, 10], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "m10 10l20 20l30 30",
    expected: { segment: ["M", 10, 10], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: 0.0001,
    expected: { segment: ["L", 10, 10], index: 1, length: 14.142135623730951, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: 14.142135623730951,
    expected: {
      segment: ["L", 20, 20],
      index: 2,
      length: 14.142135623730951,
      lengthAtSegment: 14.142135623730951,
    },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: 28.284271247461902,
    expected: {
      segment: ["Z"],
      index: 3,
      length: 28.284271247461902,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: 42.42640687119285,
    expected: {
      segment: ["Z"],
      index: 3,
      length: 28.284271247461902,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: 56.568542494923804,
    expected: {
      segment: ["Z"],
      index: 3,
      length: 28.284271247461902,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: 57.568542494923804,
    expected: {
      segment: ["Z"],
      index: 3,
      length: 28.284271247461902,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: Number.POSITIVE_INFINITY,
    expected: {
      segment: ["Z"],
      index: 3,
      length: 28.284271247461902,
      lengthAtSegment: 28.284271247461902,
    },
  },
  {
    path: "M0 0L10 10L20 20Z",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L10 10L20 20Z",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: 0.0001,
    expected: { segment: ["L", 100, 0], index: 1, length: 100, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: 100,
    expected: { segment: ["L", 100, 100], index: 2, length: 100, lengthAtSegment: 100 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: 200,
    expected: { segment: ["L", 0, 100], index: 3, length: 100, lengthAtSegment: 200 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: 300,
    expected: { segment: ["Z"], index: 4, length: 100, lengthAtSegment: 300 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: 400,
    expected: { segment: ["Z"], index: 4, length: 100, lengthAtSegment: 300 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: 401,
    expected: { segment: ["Z"], index: 4, length: 100, lengthAtSegment: 300 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: Number.POSITIVE_INFINITY,
    expected: { segment: ["Z"], index: 4, length: 100, lengthAtSegment: 300 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: "M0 0L100 0L100 100L0 100Z",
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: 0,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: -1,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: 0.0001,
    expected: { segment: ["H", 10], index: 1, length: 10, lengthAtSegment: 0 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: 10,
    expected: { segment: ["V", 10], index: 2, length: 10, lengthAtSegment: 10 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: 20,
    expected: { segment: ["h", -10], index: 3, length: 10, lengthAtSegment: 20 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: 30,
    expected: { segment: ["v", -10], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: 40,
    expected: { segment: ["v", -10], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: 41,
    expected: { segment: ["v", -10], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: Number.POSITIVE_INFINITY,
    expected: { segment: ["v", -10], index: 4, length: 10, lengthAtSegment: 30 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    distance: Number.NaN,
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
  {
    path: [
      ["M", 0, 0],
      ["H", 10],
      ["V", 10],
      ["h", -10],
      ["v", -10],
    ],
    expected: { segment: ["M", 0, 0], index: 0, length: 0, lengthAtSegment: 0 },
  },
];
