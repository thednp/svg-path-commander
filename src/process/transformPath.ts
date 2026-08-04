import { getSVGMatrix } from "./getSVGMatrix.ts";
import { projection2d } from "./projection2d.ts";
import { defaultOptions } from "../options/options.ts";
import type {
  AbsoluteArray,
  AbsoluteCommand,
  AbsoluteSegment,
  CSegment,
  HSegment,
  LSegment,
  PathArray,
  PathSegment,
  TransformObjectValues,
  VSegment,
} from "../types.ts";
import type { TransformObject } from "../interface.ts";
import { iterate } from "./iterate.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { absolutizeSegment } from "./absolutizeSegment.ts";
import { arcToCubic } from "./arcToCubic.ts";

/**
 * Applies a 2D transformation to a `PathArray` in a single pass, without
 * absolutizing or copying each segment, returning a new absolute `PathArray`.
 *
 * @param path the parsed path value
 * @param a the `a` value of the matrix
 * @param b the `b` value of the matrix
 * @param c the `c` value of the matrix
 * @param d the `d` value of the matrix
 * @param e the `e` value of the matrix
 * @param f the `f` value of the matrix
 * @param originX the transform origin `x` value
 * @param originY the transform origin `y` value
 * @returns the transformed absolute path
 */
const transform2D = (
  path: PathArray,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  originX: number,
  originY: number,
): AbsoluteArray => {
  const result = [] as unknown as AbsoluteArray;
  let x = 0;
  let y = 0;
  let lx = 0;
  let ly = 0;
  let ox = 0;
  let oy = 0;
  let omx = 0;
  let omy = 0;

  for (let i = 0, len = path.length; i < len; i += 1) {
    const seg = path[i] as PathSegment;
    const pathCommand = seg[0] as string;
    const commandCode = pathCommand.charCodeAt(0);
    const isRelative = commandCode >= 97;
    const absCommand = (isRelative
      ? String.fromCharCode(commandCode - 32)
      : pathCommand) as AbsoluteCommand;
    const outCommand = i === 0 && isRelative ? pathCommand : absCommand;

    if (absCommand === "Z") {
      result.push(["Z"] as AbsoluteSegment);
      ox = omx;
      oy = omy;
      continue;
    }

    if (absCommand === "V") {
      const absY = (seg[1] as number) + (isRelative ? oy : 0);
      lx = (a * ox + c * absY + e - originX) + originX;
      ly = (b * ox + d * absY + f - originY) + originY;
      /* istanbul ignore else @preserve */
      if (x !== lx && y !== ly) {
        result.push(["L", lx, ly] as LSegment);
      } else if (y === ly) {
        result.push(["H", lx] as HSegment);
      } else if (x === lx) {
        result.push(["V", ly] as VSegment);
      } else {
        result.push(["L", ox, absY] as LSegment);
      }
      oy = absY;
      x = lx;
      y = ly;
      continue;
    }

    if (absCommand === "H") {
      const absX = (seg[1] as number) + (isRelative ? ox : 0);
      lx = (a * absX + c * oy + e - originX) + originX;
      ly = (b * absX + d * oy + f - originY) + originY;
      /* istanbul ignore else @preserve */
      if (x !== lx && y !== ly) {
        result.push(["L", lx, ly] as LSegment);
      } else if (y === ly) {
        result.push(["H", lx] as HSegment);
      } else if (x === lx) {
        result.push(["V", ly] as VSegment);
      } else {
        result.push(["L", absX, oy] as LSegment);
      }
      ox = absX;
      x = lx;
      y = ly;
      continue;
    }

    if (absCommand === "A") {
      const absX = (seg[6] as number) + (isRelative ? ox : 0);
      const absY = (seg[7] as number) + (isRelative ? oy : 0);
      const cubics = arcToCubic(
        ox,
        oy,
        seg[1] as number,
        seg[2] as number,
        seg[3] as number,
        seg[4] as number,
        seg[5] as number,
        absX,
        absY,
      );
      const cubicsLen = cubics.length;
      let k = 0;
      /* istanbul ignore else @preserve */
      if (cubicsLen > 0) {
        do {
          const piece = ["C"] as unknown as CSegment;
          const end = k + 6;
          for (let j = k; j < end; j += 2) {
            lx = (a * cubics[j] + c * cubics[j + 1] + e - originX) + originX;
            ly = (b * cubics[j] + d * cubics[j + 1] + f - originY) + originY;
            piece.push(lx, ly);
          }
          result.push(piece);
          k = end;
        } while (k < cubicsLen);
      } else {
        /* istanbul ignore next @preserve */
        result.push(["C"] as unknown as AbsoluteSegment);
      }
      /* istanbul ignore else @preserve */
      if (cubicsLen > 0) {
        ox = cubics[cubicsLen - 2];
        oy = cubics[cubicsLen - 1];
      } else {
        /* istanbul ignore next @preserve */
        ox = absX;
        /* istanbul ignore next @preserve */
        oy = absY;
      }
      x = lx;
      y = ly;
      continue;
    }

    if (absCommand === "L") {
      const absX = (seg[1] as number) + (isRelative ? ox : 0);
      const absY = (seg[2] as number) + (isRelative ? oy : 0);
      lx = (a * absX + c * absY + e - originX) + originX;
      ly = (b * absX + d * absY + f - originY) + originY;
      /* istanbul ignore else @preserve */
      if (x !== lx && y !== ly) {
        result.push(["L", lx, ly] as LSegment);
      } else if (y === ly) {
        result.push(["H", lx] as HSegment);
      } else if (x === lx) {
        result.push(["V", ly] as VSegment);
      } else {
        result.push(["L", absX, absY] as LSegment);
      }
      ox = absX;
      oy = absY;
      x = lx;
      y = ly;
      continue;
    }

    {
      const piece = [outCommand] as [AbsoluteCommand, ...number[]];
      const segLen = seg.length;
      for (let j = 1; j < segLen; j += 2) {
        const absX = (seg[j] as number) + (isRelative ? ox : 0);
        const absY = (seg[j + 1] as number) + (isRelative ? oy : 0);
        lx = (a * absX + c * absY + e - originX) + originX;
        ly = (b * absX + d * absY + f - originY) + originY;
        piece.push(lx, ly);
      }
      result.push(piece as AbsoluteSegment);
      ox = (seg[segLen - 2] as number) + (isRelative ? ox : 0);
      oy = (seg[segLen - 1] as number) + (isRelative ? oy : 0);
      if (absCommand === "M") {
        omx = ox;
        omy = oy;
      }
      x = lx;
      y = ly;
    }
  }

  return result;
};

/**
 * Apply a 2D / 3D transformation to a PathArray.
 *
 * Since SVGElement doesn't support 3D transformation, this function
 * creates a 2D projection of the path element.
 *
 * @param pathInput - The PathArray or path string to transform
 * @param transform - The transform functions object (translate, rotate, skew, scale, origin)
 * @returns The transformed PathArray
 *
 * @example
 * ```ts
 * transformPath('M0 0L100 0L100 100L0 100Z', { translate: [10, 20], scale: 2 })
 * // => [['M', 10, 20], ['L', 210, 20], ['L', 210, 220], ['L', 10, 220], ['Z']]
 * ```
 */
export const transformPath = <T extends PathArray>(
  pathInput: T | string,
  transform?: Partial<TransformObject>,
): T | AbsoluteArray => {
  // transform uses it's own set of params
  const path = parsePathString(pathInput);
  const transformProps = transform && Object.keys(transform);

  // when used as a static method, invalidate somehow
  if (!transform || (transformProps && !transformProps.length)) {
    return path.slice(0) as T;
  }

  // transform origin is extremely important
  if (!transform.origin) {
    Object.assign(transform, { origin: defaultOptions.origin });
  }
  const origin = transform.origin as [number, number, number];
  const matrixInstance = getSVGMatrix(transform as TransformObjectValues);

  if (matrixInstance.isIdentity) return path.slice(0) as T;

  if (matrixInstance.is2D) {
    return transform2D(
      path,
      matrixInstance.a,
      matrixInstance.b,
      matrixInstance.c,
      matrixInstance.d,
      matrixInstance.e,
      matrixInstance.f,
      origin[0],
      origin[1],
    );
  }

  // last x and y transformed values
  let x = 0;
  let y = 0;
  // new x and y transformed
  let lx = 0;
  let ly = 0;
  // segment params iteration index and length
  let j = 0;
  let jj = 0;

  return iterate(path, (seg, index, lastX, lastY) => {
    const [pathCommand] = seg;
    const absCommand = pathCommand.toUpperCase();
    const isRelative = absCommand !== pathCommand;
    const absoluteSegment = isRelative
      ? absolutizeSegment(seg, index, lastX, lastY)
      : (seg.slice(0) as AbsoluteSegment);

    let result = absCommand === "A"
      ? (["C" as string | number].concat(
        arcToCubic(
          lastX,
          lastY,
          absoluteSegment[1] as number,
          absoluteSegment[2] as number,
          absoluteSegment[3] as number,
          absoluteSegment[4] as number,
          absoluteSegment[5] as number,
          absoluteSegment[6] as number,
          absoluteSegment[7] as number,
        ),
      ) as CSegment)
      : absCommand === "V"
      ? (["L", lastX, absoluteSegment[1]] as LSegment)
      : absCommand === "H"
      ? (["L", absoluteSegment[1], lastY] as LSegment)
      : absoluteSegment;

    // update pathCommand
    const isLongArc = result[0] === "C" && result.length > 7;

    if (isLongArc) {
      const tempSegment = result.slice(0, 7) as CSegment;
      path.splice(
        index + 1,
        0,
        ["C" as typeof result[0] | number].concat(
          result.slice(7),
        ) as CSegment,
      );
      result = tempSegment;
    }

    if (result[0] === "L") {
      [lx, ly] = projection2d(
        matrixInstance,
        [(result as LSegment)[1], (result as LSegment)[2]],
        origin,
      );

      /* istanbul ignore else @preserve */
      if (x !== lx && y !== ly) {
        result = ["L", lx, ly];
      } else if (y === ly) {
        result = ["H", lx];
      } else if (x === lx) {
        result = ["V", ly];
      }
    } else {
      for (j = 1, jj = result.length; j < jj; j += 2) {
        [lx, ly] = projection2d(
          matrixInstance,
          [+result[j], +result[j + 1]],
          origin,
        );
        result[j] = lx;
        result[j + 1] = ly;
      }
    }
    // now update x and y
    x = lx;
    y = ly;

    return result;
  }) as AbsoluteArray;
};
