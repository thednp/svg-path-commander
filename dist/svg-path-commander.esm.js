/*!
* SVGPathCommander v0.1.24 (http://thednp.github.io/svg-path-commander)
* Copyright 2021 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
/**
 * SVGPathCommander default options
 * @type {SVGPathCommander.options}
 */
const defaultOptions = {
  origin: [0, 0, 0],
  round: 4,
};

/**
 * Segment params length
 * @type {Record<string, number>}
 */
const paramsCount = {
  a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0,
};

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param {SVGPathCommander.PathParser} path the `PathParser` instance
 */
function finalizeSegment(path) {
  let pathCommand = path.pathValue[path.segmentStart];
  let LK = pathCommand.toLowerCase();
  let { data } = path;

  // Process duplicated commands (without comand name)
  if (LK === 'm' && data.length > 2) {
    // @ts-ignore
    path.segments.push([pathCommand, data[0], data[1]]);
    data = data.slice(2);
    LK = 'l';
    pathCommand = pathCommand === 'm' ? 'l' : 'L';
  }

  // @ts-ignore
  while (data.length >= paramsCount[LK]) {
    // path.segments.push([pathCommand].concat(data.splice(0, paramsCount[LK])));
    // @ts-ignore
    path.segments.push([pathCommand, ...data.splice(0, paramsCount[LK])]);
    // @ts-ignore
    if (!paramsCount[LK]) {
      break;
    }
  }
}

const invalidPathValue = 'Invalid path value';

/**
 * Validates an A (arc-to) specific path command value.
 * Usually a `large-arc-flag` or `sweep-flag`.
 *
 * @param {SVGPathCommander.PathParser} path the `PathParser` instance
 */
function scanFlag(path) {
  const { index } = path;
  const ch = path.pathValue.charCodeAt(index);

  if (ch === 0x30/* 0 */) {
    path.param = 0;
    path.index += 1;
    return;
  }

  if (ch === 0x31/* 1 */) {
    path.param = 1;
    path.index += 1;
    return;
  }

  path.err = `${invalidPathValue}: invalid Arc flag "${ch}", expecting 0 or 1 at index ${index}`;
}

/**
 * Checks if a character is a digit.
 *
 * @param {number} code the character to check
 * @returns {boolean} check result
 */
function isDigit(code) {
  return (code >= 48 && code <= 57); // 0..9
}

/**
 * Validates every character of the path string,
 * every path command, negative numbers or floating point numbers.
 *
 * @param {SVGPathCommander.PathParser} path the `PathParser` instance
 */
function scanParam(path) {
  const { max, pathValue, index: start } = path;
  let index = start;
  let zeroFirst = false;
  let hasCeiling = false;
  let hasDecimal = false;
  let hasDot = false;
  let ch;

  if (index >= max) {
    // path.err = 'SvgPath: missed param (at pos ' + index + ')';
    path.err = `${invalidPathValue} at ${index}: missing param ${pathValue[index]}`;
    return;
  }
  ch = pathValue.charCodeAt(index);

  if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
    index += 1;
    ch = (index < max) ? pathValue.charCodeAt(index) : 0;
  }

  // This logic is shamelessly borrowed from Esprima
  // https://github.com/ariya/esprimas
  if (!isDigit(ch) && ch !== 0x2E/* . */) {
    // path.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
    path.err = `${invalidPathValue} at index ${index}: ${pathValue[index]} is not a number`;
    return;
  }

  if (ch !== 0x2E/* . */) {
    zeroFirst = (ch === 0x30/* 0 */);
    index += 1;

    ch = (index < max) ? pathValue.charCodeAt(index) : 0;

    if (zeroFirst && index < max) {
      // decimal number starts with '0' such as '09' is illegal.
      if (ch && isDigit(ch)) {
        // path.err = 'SvgPath: numbers started with `0` such as `09`
        // are illegal (at pos ' + start + ')';
        path.err = `${invalidPathValue} at index ${start}: ${pathValue[start]} illegal number`;
        return;
      }
    }

    while (index < max && isDigit(pathValue.charCodeAt(index))) {
      index += 1;
      hasCeiling = true;
    }
    ch = (index < max) ? pathValue.charCodeAt(index) : 0;
  }

  if (ch === 0x2E/* . */) {
    hasDot = true;
    index += 1;
    while (isDigit(pathValue.charCodeAt(index))) {
      index += 1;
      hasDecimal = true;
    }
    ch = (index < max) ? pathValue.charCodeAt(index) : 0;
  }

  if (ch === 0x65/* e */ || ch === 0x45/* E */) {
    if (hasDot && !hasCeiling && !hasDecimal) {
      path.err = `${invalidPathValue} at index ${index}: ${pathValue[index]} invalid float exponent`;
      return;
    }

    index += 1;

    ch = (index < max) ? pathValue.charCodeAt(index) : 0;
    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      index += 1;
    }
    if (index < max && isDigit(pathValue.charCodeAt(index))) {
      while (index < max && isDigit(pathValue.charCodeAt(index))) {
        index += 1;
      }
    } else {
      // path.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      path.err = `${invalidPathValue} at index ${index}: ${pathValue[index]} invalid float exponent`;
      return;
    }
  }

  path.index = index;
  path.param = +path.pathValue.slice(start, index);
}

/**
 * Checks if the character is a space.
 *
 * @param {number} ch the character to check
 * @returns {boolean} check result
 */
function isSpace(ch) {
  const specialSpaces = [
    0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
    0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF];
  return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) // Line terminators
    // White spaces
    || (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0)
    || (ch >= 0x1680 && specialSpaces.indexOf(ch) >= 0);
}

/**
 * Points the parser to the next character in the
 * path string every time it encounters any kind of
 * space character.
 *
 * @param {SVGPathCommander.PathParser} path the `PathParser` instance
 */
function skipSpaces(path) {
  const { pathValue, max } = path;
  while (path.index < max && isSpace(pathValue.charCodeAt(path.index))) {
    path.index += 1;
  }
}

/**
 * Checks if the character is a path command.
 *
 * @param {any} code the character to check
 * @returns {boolean} check result
 */
function isPathCommand(code) {
  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  switch (code | 0x20) {
    case 0x6D/* m */:
    case 0x7A/* z */:
    case 0x6C/* l */:
    case 0x68/* h */:
    case 0x76/* v */:
    case 0x63/* c */:
    case 0x73/* s */:
    case 0x71/* q */:
    case 0x74/* t */:
    case 0x61/* a */:
    // case 0x72/* r */:
      return true;
    default:
      return false;
  }
}

/**
 * Checks if the character is or belongs to a number.
 * [0-9]|+|-|.
 *
 * @param {number} code the character to check
 * @returns {boolean} check result
 */
function isDigitStart(code) {
  return (code >= 48 && code <= 57) /* 0..9 */
    || code === 0x2B /* + */
    || code === 0x2D /* - */
    || code === 0x2E; /* . */
}

/**
 * Checks if the character is an A (arc-to) path command.
 *
 * @param {number} code the character to check
 * @returns {boolean} check result
 */
function isArcCommand(code) {
  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  return (code | 0x20) === 0x61;
}

/**
 * Scans every character in the path string to determine
 * where a segment starts and where it ends.
 *
 * @param {SVGPathCommander.PathParser} path the `PathParser` instance
 */
function scanSegment(path) {
  const { max, pathValue, index } = path;
  const cmdCode = pathValue.charCodeAt(index);
  const reqParams = paramsCount[pathValue[index].toLowerCase()];

  path.segmentStart = index;

  if (!isPathCommand(cmdCode)) {
    path.err = `${invalidPathValue}: ${pathValue[index]} not a path command`;
    return;
  }

  path.index += 1;
  skipSpaces(path);

  path.data = [];

  if (!reqParams) {
    // Z
    finalizeSegment(path);
    return;
  }

  for (;;) {
    for (let i = reqParams; i > 0; i -= 1) {
      if (isArcCommand(cmdCode) && (i === 3 || i === 4)) scanFlag(path);
      else scanParam(path);

      if (path.err.length) {
        return;
      }
      path.data.push(path.param);

      skipSpaces(path);

      // after ',' param is mandatory
      if (path.index < max && pathValue.charCodeAt(path.index) === 0x2C/* , */) {
        path.index += 1;
        skipSpaces(path);
      }
    }

    if (path.index >= path.max) {
      break;
    }

    // Stop on next segment
    if (!isDigitStart(pathValue.charCodeAt(path.index))) {
      break;
    }
  }

  finalizeSegment(path);
}

/**
 * Returns a clone of an existing `pathArray`.
 *
 * @param {SVGPathCommander.pathArray | SVGPathCommander.pathSegment} path the source `pathArray`
 * @returns {any} the cloned `pathArray`
 */
function clonePath(path) {
  return path.map((x) => (Array.isArray(x) ? [...x] : x));
}

/**
 * The `PathParser` is used by the `parsePathString` static method
 * to generate a `pathArray`.
 *
 * @param {string} pathString
 */
function PathParser(pathString) {
  /** @type {SVGPathCommander.pathArray} */
  // @ts-ignore
  this.segments = [];
  /** @type {string} */
  this.pathValue = pathString;
  /** @type {number} */
  this.max = pathString.length;
  /** @type {number} */
  this.index = 0;
  /** @type {number} */
  this.param = 0.0;
  /** @type {number} */
  this.segmentStart = 0;
  /** @type {any} */
  this.data = [];
  /** @type {string} */
  this.err = '';
}

/**
 * Iterates an array to check if it's an actual `pathArray`.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
function isPathArray(path) {
  return Array.isArray(path) && path.every((seg) => {
    const lk = seg[0].toLowerCase();
    return paramsCount[lk] === seg.length - 1 && 'achlmqstvz'.includes(lk);
  });
}

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param {SVGPathCommander.pathArray | string} pathInput the string to be parsed
 * @returns {SVGPathCommander.pathArray} the resulted `pathArray`
 */
function parsePathString(pathInput) {
  if (isPathArray(pathInput)) {
    // @ts-ignore -- isPathArray also checks if it's an `Array`
    return clonePath(pathInput);
  }

  // @ts-ignore -- pathInput is now string
  const path = new PathParser(pathInput);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  if (path.err.length) {
    // @ts-ignore
    path.segments = [];
  } else if (path.segments.length) {
    if (!'mM'.includes(path.segments[0][0])) {
      path.err = `${invalidPathValue}: missing M/m`;
      // @ts-ignore
      path.segments = [];
    } else {
      path.segments[0][0] = 'M';
    }
  }

  return path.segments;
}

/**
 * Iterates an array to check if it's a `pathArray`
 * with all absolute values.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
function isAbsoluteArray(path) {
  return isPathArray(path)
    // @ts-ignore -- `isPathArray` also checks if it's `Array`
    && path.every((x) => x[0] === x[0].toUpperCase());
}

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the path string | object
 * @returns {SVGPathCommander.absoluteArray} the resulted `pathArray` with absolute values
 */
function pathToAbsolute(pathInput) {
  if (isAbsoluteArray(pathInput)) {
    // @ts-ignore -- `isAbsoluteArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  const path = parsePathString(pathInput);
  let x = 0; let y = 0;
  let mx = 0; let my = 0;

  // @ts-ignore -- the `absoluteSegment[]` is for sure an `absolutePath`
  return path.map((segment) => {
    const values = segment.slice(1).map(Number);
    const [pathCommand] = segment;
    /** @type {SVGPathCommander.absoluteCommand} */
    // @ts-ignore
    const absCommand = pathCommand.toUpperCase();

    if (pathCommand === 'M') {
      [x, y] = values;
      mx = x;
      my = y;
      return ['M', x, y];
    }
    /** @type {SVGPathCommander.absoluteSegment} */
    // @ts-ignore
    let absoluteSegment = [];

    if (pathCommand !== absCommand) {
      switch (absCommand) {
        case 'A':
          absoluteSegment = [
            absCommand, values[0], values[1], values[2],
            values[3], values[4], values[5] + x, values[6] + y];
          break;
        case 'V':
          absoluteSegment = [absCommand, values[0] + y];
          break;
        case 'H':
          absoluteSegment = [absCommand, values[0] + x];
          break;
        default: {
          // use brakets for `eslint: no-case-declaration`
          // https://stackoverflow.com/a/50753272/803358
          const absValues = values.map((n, j) => n + (j % 2 ? y : x));
          // @ts-ignore for n, l, c, s, q, t
          absoluteSegment = [absCommand, ...absValues];
        }
      }
    } else {
      // @ts-ignore
      absoluteSegment = [absCommand, ...values];
    }

    const segLength = absoluteSegment.length;
    switch (absCommand) {
      case 'Z':
        x = mx;
        y = my;
        break;
      case 'H':
        // @ts-ignore
        [, x] = absoluteSegment;
        break;
      case 'V':
        // @ts-ignore
        [, y] = absoluteSegment;
        break;
      default:
        // @ts-ignore
        x = absoluteSegment[segLength - 2];
        // @ts-ignore
        y = absoluteSegment[segLength - 1];

        if (absCommand === 'M') {
          mx = x;
          my = y;
        }
    }
    return absoluteSegment;
  });
}

/**
 * Iterates an array to check if it's a `pathArray`
 * with relative values.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
function isRelativeArray(path) {
  return isPathArray(path)
    // @ts-ignore -- `isPathArray` checks if it's `Array`
    && path.slice(1).every((seg) => seg[0] === seg[0].toLowerCase());
}

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the path string | object
 * @returns {SVGPathCommander.relativeArray} the resulted `pathArray` with relative values
 */
function pathToRelative(pathInput) {
  if (isRelativeArray(pathInput)) {
    // @ts-ignore -- `isRelativeArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  const path = parsePathString(pathInput);
  let x = 0; let y = 0;
  let mx = 0; let my = 0;

  // @ts-ignore -- this is actually a `relativeArray`
  return path.map((segment) => {
    const values = segment.slice(1).map(Number);
    const [pathCommand] = segment;
    /** @type {SVGPathCommander.relativeCommand} */
    // @ts-ignore
    const relativeCommand = pathCommand.toLowerCase();

    if (pathCommand === 'M') {
      [x, y] = values;
      mx = x;
      my = y;
      return ['M', x, y];
    }

    /** @type {SVGPathCommander.relativeSegment} */
    // @ts-ignore -- trust me DON'T CHANGE
    let relativeSegment = [];

    if (pathCommand !== relativeCommand) {
      switch (relativeCommand) {
        case 'a':
          relativeSegment = [
            relativeCommand, values[0], values[1], values[2],
            values[3], values[4], values[5] - x, values[6] - y];
          break;
        case 'v':
          relativeSegment = [relativeCommand, values[0] - y];
          break;
        case 'h':
          relativeSegment = [relativeCommand, values[0] - x];
          break;
        default: {
          // use brakets for `eslint: no-case-declaration`
          // https://stackoverflow.com/a/50753272/803358
          const relValues = values.map((n, j) => n - (j % 2 ? y : x));
          // @ts-ignore for M, L, C, S, Q, T
          relativeSegment = [relativeCommand, ...relValues];

          if (relativeCommand === 'm') {
            [x, y] = values;
            mx = x;
            my = y;
          }
        }
      }
    } else {
      if (pathCommand === 'm') {
        mx = values[0] + x;
        my = values[1] + y;
      }
      // @ts-ignore
      relativeSegment = [relativeCommand, ...values];
    }

    const segLength = relativeSegment.length;
    switch (relativeCommand) {
      case 'z':
        x = mx;
        y = my;
        break;
      case 'h':
        // @ts-ignore
        x += relativeSegment[1];
        break;
      case 'v':
        // @ts-ignore
        y += relativeSegment[1];
        break;
      default:
        // @ts-ignore
        x += relativeSegment[segLength - 2];
        // @ts-ignore
        y += relativeSegment[segLength - 1];
    }
    return relativeSegment;
  });
}

/**
 * Splits an extended A (arc-to) segment into two cubic-bezier segments.
 *
 * @param {SVGPathCommander.pathArray} path the `pathArray` this segment belongs to
 * @param {string[]} allPathCommands all previous path commands
 * @param {number} i the segment index
 */

function fixArc(path, allPathCommands, i) {
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

/**
 * Returns the missing control point from an
 * T (shorthand quadratic bezier) segment.
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} qx control point x
 * @param {number} qy control point y
 * @param {string} prevCommand the previous path command
 * @returns {{qx: number, qy: number}}} the missing control point
 */
function shorthandToQuad(x1, y1, qx, qy, prevCommand) {
  return 'QT'.includes(prevCommand)
    ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy }
    : { qx: x1, qy: y1 };
}

/**
 * Returns the missing control point from an
 * S (shorthand cubic bezier) segment.
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} x2 curve end x
 * @param {number} y2 curve end y
 * @param {string} prevCommand the previous path command
 * @returns {{x1: number, y1: number}}} the missing control point
 */
function shorthandToCubic(x1, y1, x2, y2, prevCommand) {
  return 'CS'.includes(prevCommand)
    ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2 }
    : { x1, y1 };
}

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param {SVGPathCommander.pathSegment} segment the segment object
 * @param {any} params the coordinates of the previous segment
 * @param {string} prevCommand the path command of the previous segment
 * @returns {SVGPathCommander.normalSegment} the normalized segment
 */
function normalizeSegment(segment, params, prevCommand) {
  const [pathCommand] = segment;
  const {
    x1: px1, y1: py1, x2: px2, y2: py2,
  } = params;
  const values = segment.slice(1).map(Number);
  let result = segment;

  if (!'TQ'.includes(pathCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === 'H') {
    result = ['L', segment[1], py1];
  } else if (pathCommand === 'V') {
    result = ['L', px1, segment[1]];
  } else if (pathCommand === 'S') {
    const { x1, y1 } = shorthandToCubic(px1, py1, px2, py2, prevCommand);
    params.x1 = x1;
    params.y1 = y1;
    // @ts-ignore
    result = ['C', x1, y1, ...values];
  } else if (pathCommand === 'T') {
    const { qx, qy } = shorthandToQuad(px1, py1, params.qx, params.qy, prevCommand);
    params.qx = qx;
    params.qy = qy;
    // @ts-ignore
    result = ['Q', qx, qy, ...values];
  } else if (pathCommand === 'Q') {
    const [nqx, nqy] = values;
    params.qx = nqx;
    params.qy = nqy;
  }

  // @ts-ignore -- we-re switching `pathSegment` type
  return result;
}

/**
 * Iterates an array to check if it's a `pathArray`
 * with all segments are in non-shorthand notation
 * with absolute values.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
function isNormalizedArray(path) {
  // @ts-ignore -- `isAbsoluteArray` also checks if it's `Array`
  return isAbsoluteArray(path) && path.every((seg) => 'ACLMQZ'.includes(seg[0]));
}

/**
 * @type {SVGPathCommander.parserParams}
 */
const paramsParser = {
  x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
};

/**
 * Normalizes a `path` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the string to be parsed or 'pathArray'
 * @returns {SVGPathCommander.normalArray} the normalized `pathArray`
 */
function normalizePath(pathInput) {
  if (isNormalizedArray(pathInput)) {
    // @ts-ignore -- `isNormalizedArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  /** @type {SVGPathCommander.normalArray} */
  // @ts-ignore -- `absoluteArray` will become a `normalArray`
  const path = pathToAbsolute(pathInput);
  const params = { ...paramsParser };
  const allPathCommands = [];
  const ii = path.length;
  let pathCommand = '';
  let prevCommand = '';

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    // Get previous path command
    if (i) prevCommand = allPathCommands[i - 1];
    // Previous path command is used to normalizeSegment
    // @ts-ignore -- expected on normalization
    path[i] = normalizeSegment(path[i], params, prevCommand);

    const segment = path[i];
    const seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }

  return path;
}

/**
 * Checks a `pathArray` for an unnecessary `Z` segment
 * and returns a new `pathArray` without it.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param {SVGPathCommander.pathArray | string} pathInput the `pathArray` source
 * @return {SVGPathCommander.pathArray} a fixed `pathArray`
 */
function fixPath(pathInput) {
  const pathArray = parsePathString(pathInput);
  const normalArray = normalizePath(pathArray);
  const { length } = pathArray;
  const isClosed = normalArray.slice(-1)[0][0] === 'Z';
  const segBeforeZ = isClosed ? length - 2 : length - 1;

  const [mx, my] = normalArray[0].slice(1);
  const [x, y] = normalArray[segBeforeZ].slice(-2);

  if (isClosed && mx === x && my === y) {
    // @ts-ignore -- `pathSegment[]` is quite a `pathArray`
    return pathArray.slice(0, -1);
  }
  return pathArray;
}

/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param {string | SVGPathCommander.pathArray} path the `Array` to be checked
 * @returns {boolean} iteration result
 */
function isCurveArray(path) {
  // @ts-ignore -- `isPathArray` also checks if it's `Array`
  return isPathArray(path) && path.every((seg) => 'MC'.includes(seg[0]));
}

/**
 * Returns an {x,y} vector rotated by a given
 * angle in radian.
 *
 * @param {number} x the initial vector x
 * @param {number} y the initial vector y
 * @param {number} rad the radian vector angle
 * @returns {{x: number, y: number}} the rotated vector
 */
function rotateVector(x, y, rad) {
  const X = x * Math.cos(rad) - y * Math.sin(rad);
  const Y = x * Math.sin(rad) + y * Math.cos(rad);
  return { x: X, y: Y };
}

/**
 * Converts A (arc-to) segments to C (cubic-bezier-to).
 *
 * For more information of where this math came from visit:
 * http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
 *
 * @param {number} X1 the starting x position
 * @param {number} Y1 the starting y position
 * @param {number} RX x-radius of the arc
 * @param {number} RY y-radius of the arc
 * @param {number} angle x-axis-rotation of the arc
 * @param {number} LAF large-arc-flag of the arc
 * @param {number} SF sweep-flag of the arc
 * @param {number} X2 the ending x position
 * @param {number} Y2 the ending y position
 * @param {number[]=} recursive the parameters needed to split arc into 2 segments
 * @return {number[]} the resulting cubic-bezier segment(s)
 */
function arcToCubic(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, recursive) {
  let x1 = X1; let y1 = Y1; let rx = RX; let ry = RY; let x2 = X2; let y2 = Y2;
  // for more information of where this Math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  const d120 = (Math.PI * 120) / 180;

  const rad = (Math.PI / 180) * (+angle || 0);
  /** @type {number[]} */
  let res = [];
  let xy;
  let f1;
  let f2;
  let cx;
  let cy;

  if (!recursive) {
    xy = rotateVector(x1, y1, -rad);
    x1 = xy.x;
    y1 = xy.y;
    xy = rotateVector(x2, y2, -rad);
    x2 = xy.x;
    y2 = xy.y;

    const x = (x1 - x2) / 2;
    const y = (y1 - y2) / 2;
    let h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx *= h;
      ry *= h;
    }
    const rx2 = rx * rx;
    const ry2 = ry * ry;

    const k = (LAF === SF ? -1 : 1)
            * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
                / (rx2 * y * y + ry2 * x * x)));

    cx = ((k * rx * y) / ry) + ((x1 + x2) / 2);
    cy = ((k * -ry * x) / rx) + ((y1 + y2) / 2);
    // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
    f1 = (Math.asin((((y1 - cy) / ry))) * (10 ** 9) >> 0) / (10 ** 9);
    // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
    f2 = (Math.asin((((y2 - cy) / ry))) * (10 ** 9) >> 0) / (10 ** 9);

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    if (f1 < 0) (f1 = Math.PI * 2 + f1);
    if (f2 < 0) (f2 = Math.PI * 2 + f2);
    if (SF && f1 > f2) {
      f1 -= Math.PI * 2;
    }
    if (!SF && f2 > f1) {
      f2 -= Math.PI * 2;
    }
  } else {
    [f1, f2, cx, cy] = recursive;
  }
  let df = f2 - f1;
  if (Math.abs(df) > d120) {
    const f2old = f2;
    const x2old = x2;
    const y2old = y2;
    f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = arcToCubic(x2, y2, rx, ry, angle, 0, SF, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  const c1 = Math.cos(f1);
  const s1 = Math.sin(f1);
  const c2 = Math.cos(f2);
  const s2 = Math.sin(f2);
  const t = Math.tan(df / 4);
  const hx = (4 / 3) * rx * t;
  const hy = (4 / 3) * ry * t;
  const m1 = [x1, y1];
  const m2 = [x1 + hx * s1, y1 - hy * c1];
  const m3 = [x2 + hx * s2, y2 - hy * c2];
  const m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [...m2, ...m3, ...m4, ...res];
  }
  res = [...m2, ...m3, ...m4, ...res];
  const newres = [];
  for (let i = 0, ii = res.length; i < ii; i += 1) {
    newres[i] = i % 2
      ? rotateVector(res[i - 1], res[i], rad).y
      : rotateVector(res[i], res[i + 1], rad).x;
  }
  return newres;
}

/**
 * Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} qx control point x
 * @param {number} qy control point y
 * @param {number} x2 curve end x
 * @param {number} y2 curve end y
 * @returns {number[]} the cubic-bezier segment
 */
function quadToCubic(x1, y1, qx, qy, x2, y2) {
  const r13 = 1 / 3;
  const r23 = 2 / 3;
  return [
    r13 * x1 + r23 * qx, // cpx1
    r13 * y1 + r23 * qy, // cpy1
    r13 * x2 + r23 * qx, // cpx2
    r13 * y2 + r23 * qy, // cpy2
    x2, y2, // x,y
  ];
}

/**
 * Returns the coordinates of a specified distance
 * ratio between two points.
 *
 * @param {[number, number]} a the first point coordinates
 * @param {[number, number]} b the second point coordinates
 * @param {number} t the ratio
 * @returns {[number, number]} the midpoint coordinates
 */
function midPoint(a, b, t) {
  const [ax, ay] = a; const [bx, by] = b;
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
}

/**
 * Returns the square root of the distance
 * between two given points.
 *
 * @param {[number, number]} a the first point coordinates
 * @param {[number, number]} b the second point coordinates
 * @returns {number} the distance value
 */
function distanceSquareRoot(a, b) {
  return Math.sqrt(
    (a[0] - b[0]) * (a[0] - b[0])
    + (a[1] - b[1]) * (a[1] - b[1]),
  );
}

/**
 * Returns the length of a line (L,V,H,Z) segment,
 * or a point at a given length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the distance to point
 * @returns {{x: number, y: number} | number} the segment length or point
 */
function segmentLineFactory(x1, y1, x2, y2, distance) {
  const length = distanceSquareRoot([x1, y1], [x2, y2]);
  const margin = 0.001;

  if (typeof distance === 'number') {
    if (distance < margin) {
      return { x: x1, y: y1 };
    }
    if (distance > length) {
      return { x: x2, y: y2 };
    }
    const [x, y] = midPoint([x1, y1], [x2, y2], distance / length);
    return { x, y };
  }
  return length;
}

/**
 * Converts an L (line-to) segment to C (cubic-bezier).
 *
 * @param {number} x1 line start x
 * @param {number} y1 line start y
 * @param {number} x2 line end x
 * @param {number} y2 line end y
 * @returns {number[]} the cubic-bezier segment
 */
function lineToCubic(x1, y1, x2, y2) {
  const t = 0.5;
  /** @type {[number, number]} */
  const p0 = [x1, y1];
  /** @type {[number, number]} */
  const p1 = [x2, y2];
  const p2 = midPoint(p0, p1, t);
  const p3 = midPoint(p1, p2, t);
  const p4 = midPoint(p2, p3, t);
  const p5 = midPoint(p3, p4, t);
  const p6 = midPoint(p4, p5, t);
  const seg1 = [...p0, ...p2, ...p4, ...p6, t];
  // @ts-ignore
  const cp1 = segmentLineFactory(...seg1);
  const seg2 = [...p6, ...p5, ...p3, ...p1, 0];
  // @ts-ignore
  const cp2 = segmentLineFactory(...seg2);

  // @ts-ignore
  return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2];
}

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param {SVGPathCommander.pathSegment} segment the source segment
 * @param {SVGPathCommander.parserParams} params the source segment parameters
 * @returns {SVGPathCommander.cubicSegment | SVGPathCommander.MSegment} the cubic-bezier segment
 */
function segmentToCubic(segment, params) {
  const [pathCommand] = segment;
  const values = segment.slice(1).map((n) => +n);
  const [x, y] = values;
  let args;
  const {
    x1: px1, y1: py1, x: px, y: py,
  } = params;

  if (!'TQ'.includes(pathCommand)) {
    params.qx = null;
    params.qy = null;
  }

  switch (pathCommand) {
    case 'M':
      params.x = x;
      params.y = y;
      return segment;
    case 'A':
      args = [px1, py1, ...values];
      // @ts-ignore -- relax, the utility will return 6 numbers
      return ['C', ...arcToCubic(...args)];
    case 'Q':
      params.qx = x;
      params.qy = y;
      args = [px1, py1, ...values];
      // @ts-ignore -- also returning 6 numbers
      return ['C', ...quadToCubic(...args)];
    case 'L':
      // @ts-ignore -- also returning 6 numbers
      return ['C', ...lineToCubic(px1, py1, x, y)];
    case 'Z':
      // @ts-ignore -- also returning 6 numbers
      return ['C', ...lineToCubic(px1, py1, px, py)];
  }
  // @ts-ignore -- we're switching `pathSegment` type
  return segment;
}

/**
 * Parses a path string value or 'pathArray' and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * In addition, un-necessary `Z` segment is removed if previous segment
 * extends to the `M` segment.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the string to be parsed or 'pathArray'
 * @returns {SVGPathCommander.curveArray} the resulted `pathArray` converted to cubic-bezier
 */
function pathToCurve(pathInput) {
  if (isCurveArray(pathInput)) {
    // @ts-ignore -- `isCurveArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  const path = fixPath(normalizePath(pathInput));
  const params = { ...paramsParser };
  const allPathCommands = [];
  let pathCommand = ''; // ts-lint
  let ii = path.length;

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];
    allPathCommands[i] = pathCommand;

    path[i] = segmentToCubic(path[i], params);

    fixArc(path, allPathCommands, i);
    ii = path.length;

    const segment = path[i];
    const seglen = segment.length;
    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }

  // @ts-ignore
  return path;
}

/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param {SVGPathCommander.pathArray} path the source `pathArray`
 * @param {number | boolean} roundOption the amount of decimals to round numbers to
 * @returns {SVGPathCommander.pathArray} the resulted `pathArray` with rounded values
 */
function roundPath(path, roundOption) {
  let { round } = defaultOptions;
  if (roundOption === false || round === false) return clonePath(path);
  round = roundOption >= 1 ? roundOption : round;
  // to round values to the power
  // the `round` value must be integer
  // @ts-ignore
  const pow = round >= 1 ? (10 ** round) : 1;

  // @ts-ignore -- `pathSegment[]` is `pathArray`
  return path.map((pi) => {
    const values = pi.slice(1).map(Number)
      .map((n) => (n % 1 === 0 ? n : Math.round(n * pow) / pow));
    return [pi[0], ...values];
  });
}

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param {SVGPathCommander.pathArray} path the `pathArray` object
 * @param {any} round amount of decimals to round values to
 * @returns {string} the concatenated path string
 */
function pathToString(path, round) {
  return roundPath(path, round)
    .map((x) => x[0] + x.slice(1).join(' ')).join('');
}

/**
 * Reverses all segments and their values of a `pathArray`
 * and returns a new instance.
 *
 * @param {SVGPathCommander.pathArray} pathInput the source `pathArray`
 * @returns {SVGPathCommander.pathArray} the reversed `pathArray`
 */
function reversePath(pathInput) {
  const absolutePath = pathToAbsolute(pathInput);
  const isClosed = absolutePath.slice(-1)[0][0] === 'Z';

  const reversedPath = normalizePath(absolutePath).map((segment, i) => {
    const [x, y] = segment.slice(-2).map(Number);
    return {
      seg: absolutePath[i], // absolute
      n: segment, // normalized
      c: absolutePath[i][0], // pathCommand
      x, // x
      y, // y
    };
  }).map((seg, i, path) => {
    const segment = seg.seg;
    const data = seg.n;
    const prevSeg = i && path[i - 1];
    const nextSeg = path[i + 1] && path[i + 1];
    const pathCommand = seg.c;
    const pLen = path.length;
    /** @type {number} */
    const x = i ? path[i - 1].x : path[pLen - 1].x;
    const y = i ? path[i - 1].y : path[pLen - 1].y;
    /** @type {SVGPathCommander.pathSegment} */
    // @ts-ignore
    let result = [];

    switch (pathCommand) {
      case 'M':
        result = isClosed ? ['Z'] : [pathCommand, x, y];
        break;
      case 'A':
        // @ts-ignore -- expected on reverse
        result = [pathCommand, ...segment.slice(1, -3), (segment[5] === 1 ? 0 : 1), x, y];
        break;
      case 'C':
        if (nextSeg && nextSeg.c === 'S') {
          // @ts-ignore -- expected on reverse
          result = ['S', segment[1], segment[2], x, y];
        } else {
          // @ts-ignore -- expected on reverse
          result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x, y];
        }
        break;
      case 'S':
        if ((prevSeg && 'CS'.includes(prevSeg.c)) && (!nextSeg || (nextSeg && nextSeg.c !== 'S'))) {
          // @ts-ignore -- expected on reverse
          result = ['C', data[3], data[4], data[1], data[2], x, y];
        } else {
          // @ts-ignore -- expected on reverse
          result = [pathCommand, data[1], data[2], x, y];
        }
        break;
      case 'Q':
        if (nextSeg && nextSeg.c === 'T') {
          result = ['T', x, y];
        } else {
          // @ts-ignore -- expected on reverse
          result = [pathCommand, ...segment.slice(1, -2), x, y];
        }
        break;
      case 'T':
        if ((prevSeg && 'QT'.includes(prevSeg.c)) && (!nextSeg || (nextSeg && nextSeg.c !== 'T'))) {
          // @ts-ignore -- expected on reverse
          result = ['Q', data[1], data[2], x, y];
        } else {
          result = [pathCommand, x, y];
        }
        break;
      case 'Z':
        result = ['M', x, y];
        break;
      case 'H':
        result = [pathCommand, x];
        break;
      case 'V':
        result = [pathCommand, y];
        break;
      default:
        // @ts-ignore -- expected on reverse
        result = [pathCommand, ...segment.slice(1, -2), x, y];
    }

    return result;
  });

  // @ts-ignore -- `pathSegment[]` is definitely `pathArray`
  return isClosed ? reversedPath.reverse()
    : [reversedPath[0], ...reversedPath.slice(1).reverse()];
}

/**
 * Split a path into an `Array` of sub-path strings.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param {SVGPathCommander.pathArray | string} pathInput the source `pathArray`
 * @return {string[]} an array with all sub-path strings
 */
function splitPath(pathInput) {
  return pathToString(pathToAbsolute(pathInput), 0)
    .replace(/(m|M)/g, '|$1')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s);
}

/**
 * Shorten a single segment of a `pathArray` object.
 *
 * @param {SVGPathCommander.absoluteSegment} segment the `absoluteSegment` object
 * @param {SVGPathCommander.normalSegment} normalSegment the `normalSegment` object
 * @param {any} params the coordinates of the previous segment
 * @param {string} prevCommand the path command of the previous segment
 * @returns {SVGPathCommander.shortSegment | SVGPathCommander.pathSegment} the shortened segment
 */
function shortenSegment(segment, normalSegment, params, prevCommand) {
  const [pathCommand] = segment;
  const round4 = (/** @type {number} */n) => Math.round(n * (10 ** 4)) / 10 ** 4;
  const segmentValues = segment.slice(1).map((n) => +n);
  const normalValues = normalSegment.slice(1).map((n) => +n);
  const {
    x1: px1, y1: py1, x2: px2, y2: py2, x: px, y: py,
  } = params;
  let result = segment;
  const [x, y] = normalValues.slice(-2);

  if (!'TQ'.includes(pathCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (['V', 'H', 'S', 'T', 'Z'].includes(pathCommand)) {
    // @ts-ignore -- expected when so many types are included
    result = [pathCommand, ...segmentValues];
  } else if (pathCommand === 'L') {
    if (round4(px) === round4(x)) {
      result = ['V', y];
    } else if (round4(py) === round4(y)) {
      result = ['H', x];
    }
  } else if (pathCommand === 'C') {
    const [x1, y1] = normalValues;

    if ('CS'.includes(prevCommand)
      && round4(x1) === round4(px1 * 2 - px2)
      && round4(y1) === round4(py1 * 2 - py2)) {
      // @ts-ignore -- the amount of numbers should suffice
      result = ['S', ...normalValues.slice(-4)];
    }
    params.x1 = x1;
    params.y1 = y1;
  } else if (pathCommand === 'Q') {
    const [qx, qy] = normalValues;
    params.qx = qx;
    params.qy = qy;

    if ('QT'.includes(prevCommand)
      && round4(qx) === round4(px1 * 2 - px2)
      && round4(qy) === round4(py1 * 2 - py2)) {
      // @ts-ignore -- the amount of numbers should suffice
      result = ['T', ...normalValues.slice(-2)];
    }
  }

  return result;
}

/**
 * Optimizes a `pathArray` object:
 * * convert segments to shorthand if possible
 * * select shortest segments from absolute and relative `pathArray`s
 *
 * TO DO
 * * implement `auto` for rounding values based on pathBBox
 * * also revers path check if it's smaller string, maybe?
 *
 * @param {SVGPathCommander.pathArray} pathInput a string or `pathArray`
 * @param {number | boolean} round the amount of decimals to round values to
 * @returns {SVGPathCommander.pathArray} the optimized `pathArray`
 */
function optimizePath(pathInput, round) {
  const path = pathToAbsolute(pathInput);
  const normalPath = normalizePath(path);
  const params = { ...paramsParser };
  const allPathCommands = [];
  const ii = path.length;
  let pathCommand = '';
  let prevCommand = '';
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    // Get previous path command for `shortenSegment`
    if (i) prevCommand = allPathCommands[i - 1];
    // @ts-ignore -- expected when switching `pathSegment` type
    path[i] = shortenSegment(path[i], normalPath[i], params, prevCommand);

    const segment = path[i];
    const seglen = segment.length;

    // update C, S, Q, T specific params
    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;

    // update x, y params
    switch (pathCommand) {
      case 'Z':
        x = mx;
        y = my;
        break;
      case 'H':
        // @ts-ignore
        [, x] = segment;
        break;
      case 'V':
        // @ts-ignore
        [, y] = segment;
        break;
      default:
        [x, y] = segment.slice(-2).map(Number);

        if (pathCommand === 'M') {
          mx = x;
          my = y;
        }
    }
    params.x = x;
    params.y = y;
  }

  const absolutePath = roundPath(path, round);
  const relativePath = roundPath(pathToRelative(path), round);

  // @ts-ignore - it's expected an optimized `pathArray` to contain all kinds of segments
  return absolutePath.map((a, i) => {
    if (i) {
      return a.join('').length < relativePath[i].join('').length
        ? a : relativePath[i];
    }
    return a;
  });
}

/**
 * A global namespace for epsilon.
 *
 * @type {number}
 */
const epsilon = 1e-9;

// DOMMatrix Static methods
// * `fromFloat64Array` and `fromFloat32Array are not implemented;
// * `fromArray` is a more simple implementation, should also accept Float[32/64]Array;
// * `fromMatrix` load values from another CSSMatrix/DOMMatrix instance or JSON object;
// * `fromString` parses and loads values from any valid CSS transform string (TransformList).

/**
 * Creates a new mutable `CSSMatrix` instance given an array of 16/6 floating point values.
 * This static method invalidates arrays that contain non-number elements.
 *
 * If the array has six values, the result is a 2D matrix; if the array has 16 values,
 * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
 *
 * @param {number[]} array an `Array` to feed values from.
 * @return {CSSMatrix} the resulted matrix.
 */
function fromArray(array) {
  const m = new CSSMatrix();
  const a = Array.from(array);

  if (!a.every((n) => !Number.isNaN(n))) {
    throw TypeError(`CSSMatrix: "${array}" must only have numbers.`);
  }
  if (a.length === 16) {
    const [m11, m12, m13, m14,
      m21, m22, m23, m24,
      m31, m32, m33, m34,
      m41, m42, m43, m44] = a;

    m.m11 = m11;
    m.a = m11;

    m.m21 = m21;
    m.c = m21;

    m.m31 = m31;

    m.m41 = m41;
    m.e = m41;

    m.m12 = m12;
    m.b = m12;

    m.m22 = m22;
    m.d = m22;

    m.m32 = m32;

    m.m42 = m42;
    m.f = m42;

    m.m13 = m13;
    m.m23 = m23;
    m.m33 = m33;
    m.m43 = m43;
    m.m14 = m14;
    m.m24 = m24;
    m.m34 = m34;
    m.m44 = m44;
  } else if (a.length === 6) {
    const [M11, M12, M21, M22, M41, M42] = a;

    m.m11 = M11;
    m.a = M11;

    m.m12 = M12;
    m.b = M12;

    m.m21 = M21;
    m.c = M21;

    m.m22 = M22;
    m.d = M22;

    m.m41 = M41;
    m.e = M41;

    m.m42 = M42;
    m.f = M42;
  } else {
    throw new TypeError('CSSMatrix: expecting an Array of 6/16 values.');
  }
  return m;
}

/**
 * Creates a new mutable `CSSMatrix` instance given an existing matrix or a
 * `DOMMatrix` instance which provides the values for its properties.
 *
 * @param {CSSMatrix | DOMMatrix | CSSMatrix.JSONMatrix} m the source matrix to feed values from.
 * @return {CSSMatrix} the resulted matrix.
 */
function fromMatrix(m) {
  const keys = Object.keys(new CSSMatrix());
  if (typeof m === 'object' && keys.every((k) => k in m)) {
    return fromArray(
      [m.m11, m.m12, m.m13, m.m14,
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44],
    );
  }
  throw TypeError(`CSSMatrix: "${m}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
}

/**
 * Creates a new mutable `CSSMatrix` given any valid CSS transform string,
 * or what we call `TransformList`:
 *
 * * `matrix(a, b, c, d, e, f)` - valid matrix() transform function
 * * `matrix3d(m11, m12, m13, ...m44)` - valid matrix3d() transform function
 * * `translate(tx, ty) rotateX(alpha)` - any valid transform function(s)
 *
 * @copyright thednp © 2021
 *
 * @param {string} source valid CSS transform string syntax.
 * @return {CSSMatrix} the resulted matrix.
 */
function fromString(source) {
  if (typeof source !== 'string') {
    throw TypeError(`CSSMatrix: "${source}" is not a string.`);
  }
  const str = String(source).replace(/\s/g, '');
  let m = new CSSMatrix();
  const invalidStringError = `CSSMatrix: invalid transform string "${source}"`;

  // const px = ['perspective'];
  // const length = ['translate', 'translate3d', 'translateX', 'translateY', 'translateZ'];
  // const deg = ['rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY'];
  // const abs = ['scale', 'scale3d', 'matrix', 'matrix3d'];
  // const transformFunctions = px.concat(length, deg, abs);

  str.split(')').filter((f) => f).forEach((tf) => {
    const [prop, value] = tf.split('(');

    // invalidate empty string
    if (!value) throw TypeError(invalidStringError);

    const components = value.split(',')
      .map((n) => (n.includes('rad') ? parseFloat(n) * (180 / Math.PI) : parseFloat(n)));

    const [x, y, z, a] = components;
    const xyz = [x, y, z];
    const xyza = [x, y, z, a];

    // single number value expected
    if (prop === 'perspective' && x && [y, z].every((n) => n === undefined)) {
      m.m34 = -1 / x;
    // 6/16 number values expected
    } else if (prop.includes('matrix') && [6, 16].includes(components.length)
      && components.every((n) => !Number.isNaN(+n))) {
      const values = components.map((n) => (Math.abs(n) < 1e-6 ? 0 : n));
      m = m.multiply(fromArray(values));
    // 3 values expected
    } else if (prop === 'translate3d' && xyz.every((n) => !Number.isNaN(+n))) {
      m = m.translate(x, y, z);
    // single/double number value(s) expected
    } else if (prop === 'translate' && x && z === undefined) {
      m = m.translate(x, y || 0, 0);
    // all 4 values expected
    } else if (prop === 'rotate3d' && xyza.every((n) => !Number.isNaN(+n)) && a) {
      m = m.rotateAxisAngle(x, y, z, a);
    // single value expected
    } else if (prop === 'rotate' && x && [y, z].every((n) => n === undefined)) {
      m = m.rotate(0, 0, x);
    // 4 values expected
    } else if (prop === 'scale3d' && xyz.every((n) => !Number.isNaN(+n)) && xyz.some((n) => n !== 1)) {
      m = m.scale(x, y, z);
    // single value expected
    } else if (prop === 'scale' && !Number.isNaN(x) && x !== 1 && z === undefined) {
      const nosy = Number.isNaN(+y);
      const sy = nosy ? x : y;
      m = m.scale(x, sy, 1);
    // single/double value expected
    } else if (prop === 'skew' && x && z === undefined) {
      m = m.skewX(x);
      m = y ? m.skewY(y) : m;
    } else if (/[XYZ]/.test(prop) && x && [y, z].every((n) => n === undefined) // a single value expected
      && ['translate', 'rotate', 'scale', 'skew'].some((p) => prop.includes(p))) {
      if (['skewX', 'skewY'].includes(prop)) {
        // @ts-ignore unfortunately
        m = m[prop](x);
      } else {
        const fn = prop.replace(/[XYZ]/, '');
        const axis = prop.replace(fn, '');
        const idx = ['X', 'Y', 'Z'].indexOf(axis);
        const axeValues = [
          idx === 0 ? x : 0,
          idx === 1 ? x : 0,
          idx === 2 ? x : 0];
        // @ts-ignore unfortunately
        m = m[fn](...axeValues);
      }
    } else {
      throw TypeError(invalidStringError);
    }
  });

  return m;
}

// Transform Functions
// https://www.w3.org/TR/css-transforms-1/#transform-functions

/**
 * Creates a new `CSSMatrix` for the translation matrix and returns it.
 * This method is equivalent to the CSS `translate3d()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
 *
 * @param {number} x the `x-axis` position.
 * @param {number} y the `y-axis` position.
 * @param {number} z the `z-axis` position.
 * @return {CSSMatrix} the resulted matrix.
 */
function Translate(x, y, z) {
  const m = new CSSMatrix();
  m.m41 = x;
  m.e = x;
  m.m42 = y;
  m.f = y;
  m.m43 = z;
  return m;
}

/**
 * Creates a new `CSSMatrix` for the rotation matrix and returns it.
 *
 * http://en.wikipedia.org/wiki/Rotation_matrix
 *
 * @param {number} rx the `x-axis` rotation.
 * @param {number} ry the `y-axis` rotation.
 * @param {number} rz the `z-axis` rotation.
 * @return {CSSMatrix} the resulted matrix.
 */
function Rotate(rx, ry, rz) {
  const m = new CSSMatrix();
  const degToRad = Math.PI / 180;
  const radX = rx * degToRad;
  const radY = ry * degToRad;
  const radZ = rz * degToRad;

  // minus sin() because of right-handed system
  const cosx = Math.cos(radX);
  const sinx = -Math.sin(radX);
  const cosy = Math.cos(radY);
  const siny = -Math.sin(radY);
  const cosz = Math.cos(radZ);
  const sinz = -Math.sin(radZ);

  const m11 = cosy * cosz;
  const m12 = -cosy * sinz;

  m.m11 = m11;
  m.a = m11;

  m.m12 = m12;
  m.b = m12;

  m.m13 = siny;

  const m21 = sinx * siny * cosz + cosx * sinz;
  m.m21 = m21;
  m.c = m21;

  const m22 = cosx * cosz - sinx * siny * sinz;
  m.m22 = m22;
  m.d = m22;

  m.m23 = -sinx * cosy;

  m.m31 = sinx * sinz - cosx * siny * cosz;
  m.m32 = sinx * cosz + cosx * siny * sinz;
  m.m33 = cosx * cosy;

  return m;
}

/**
 * Creates a new `CSSMatrix` for the rotation matrix and returns it.
 * This method is equivalent to the CSS `rotate3d()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
 *
 * @param {number} x the `x-axis` vector length.
 * @param {number} y the `y-axis` vector length.
 * @param {number} z the `z-axis` vector length.
 * @param {number} alpha the value in degrees of the rotation.
 * @return {CSSMatrix} the resulted matrix.
 */
function RotateAxisAngle(x, y, z, alpha) {
  const m = new CSSMatrix();
  const angle = alpha * (Math.PI / 360);
  const sinA = Math.sin(angle);
  const cosA = Math.cos(angle);
  const sinA2 = sinA * sinA;
  const length = Math.sqrt(x * x + y * y + z * z);
  let X = x;
  let Y = y;
  let Z = z;

  if (length === 0) {
    // bad vector length, use something reasonable
    X = 0;
    Y = 0;
    Z = 1;
  } else {
    X /= length;
    Y /= length;
    Z /= length;
  }

  const x2 = X * X;
  const y2 = Y * Y;
  const z2 = Z * Z;

  const m11 = 1 - 2 * (y2 + z2) * sinA2;
  m.m11 = m11;
  m.a = m11;

  const m12 = 2 * (X * Y * sinA2 + Z * sinA * cosA);
  m.m12 = m12;
  m.b = m12;

  m.m13 = 2 * (X * Z * sinA2 - Y * sinA * cosA);

  const m21 = 2 * (Y * X * sinA2 - Z * sinA * cosA);
  m.m21 = m21;
  m.c = m21;

  const m22 = 1 - 2 * (z2 + x2) * sinA2;
  m.m22 = m22;
  m.d = m22;

  m.m23 = 2 * (Y * Z * sinA2 + X * sinA * cosA);
  m.m31 = 2 * (Z * X * sinA2 + Y * sinA * cosA);
  m.m32 = 2 * (Z * Y * sinA2 - X * sinA * cosA);
  m.m33 = 1 - 2 * (x2 + y2) * sinA2;

  return m;
}

/**
 * Creates a new `CSSMatrix` for the scale matrix and returns it.
 * This method is equivalent to the CSS `scale3d()` function, except it doesn't
 * accept {x, y, z} transform origin parameters.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
 *
 * @param {number} x the `x-axis` scale.
 * @param {number} y the `y-axis` scale.
 * @param {number} z the `z-axis` scale.
 * @return {CSSMatrix} the resulted matrix.
 */
function Scale(x, y, z) {
  const m = new CSSMatrix();
  m.m11 = x;
  m.a = x;

  m.m22 = y;
  m.d = y;

  m.m33 = z;
  return m;
}

/**
 * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
 * returns it. This method is equivalent to the CSS `skewX()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
 *
 * @param {number} angle the angle in degrees.
 * @return {CSSMatrix} the resulted matrix.
 */
function SkewX(angle) {
  const m = new CSSMatrix();
  const radA = (angle * Math.PI) / 180;
  const t = Math.tan(radA);
  m.m21 = t;
  m.c = t;
  return m;
}

/**
 * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
 * returns it. This method is equivalent to the CSS `skewY()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
 *
 * @param {number} angle the angle in degrees.
 * @return {CSSMatrix} the resulted matrix.
 */
function SkewY(angle) {
  const m = new CSSMatrix();
  const radA = (angle * Math.PI) / 180;
  const t = Math.tan(radA);
  m.m12 = t;
  m.b = t;
  return m;
}

/**
 * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
 * and returns it. Both matrixes are not changed.
 *
 * @param {CSSMatrix} m1 the first matrix.
 * @param {CSSMatrix} m2 the second matrix.
 * @return {CSSMatrix} the resulted matrix.
 */
function Multiply(m1, m2) {
  const m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41;
  const m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42;
  const m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43;
  const m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44;

  const m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41;
  const m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42;
  const m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43;
  const m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44;

  const m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41;
  const m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42;
  const m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43;
  const m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44;

  const m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41;
  const m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42;
  const m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43;
  const m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;

  return fromArray(
    [m11, m12, m13, m14,
      m21, m22, m23, m24,
      m31, m32, m33, m34,
      m41, m42, m43, m44],
  );
}

/**
 * Creates and returns a new `DOMMatrix` compatible instance
 * with equivalent instance.
 * @class CSSMatrix
 *
 * @author thednp <https://github.com/thednp/DOMMatrix/>
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
 */

class CSSMatrix {
  /**
   * @constructor
   * @param {any} args accepts all parameter configurations:
   * * valid CSS transform string,
   * * CSSMatrix/DOMMatrix instance,
   * * a 6/16 elements *Array*.
   */
  constructor(...args) {
    const m = this;
    // array 6
    m.a = 1; m.b = 0;
    m.c = 0; m.d = 1;
    m.e = 0; m.f = 0;
    // array 16
    m.m11 = 1; m.m12 = 0; m.m13 = 0; m.m14 = 0;
    m.m21 = 0; m.m22 = 1; m.m23 = 0; m.m24 = 0;
    m.m31 = 0; m.m32 = 0; m.m33 = 1; m.m34 = 0;
    m.m41 = 0; m.m42 = 0; m.m43 = 0; m.m44 = 1;

    if (args && args.length) {
      const ARGS = [16, 6].some((l) => l === args.length) ? args : args[0];

      return m.setMatrixValue(ARGS);
    }
    return m;
  }

  /**
   * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
   *
   * @param {boolean} value sets a new flag for this property
   */
  set isIdentity(value) {
    this.isIdentity = value;
  }

  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return {boolean} the current property value
   */
  get isIdentity() {
    const m = this;
    return (m.m11 === 1 && m.m12 === 0 && m.m13 === 0 && m.m14 === 0
            && m.m21 === 0 && m.m22 === 1 && m.m23 === 0 && m.m24 === 0
            && m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0
            && m.m41 === 0 && m.m42 === 0 && m.m43 === 0 && m.m44 === 1);
  }

  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return {boolean} the current property value
   */
  get is2D() {
    const m = this;
    return (m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0 && m.m43 === 0 && m.m44 === 1);
  }

  /**
   * Sets a new `Boolean` flag value for `this.is2D` matrix property.
   *
   * @param {boolean} value sets a new flag for this property
   */
  set is2D(value) {
    this.is2D = value;
  }

  /**
   * The `setMatrixValue` method replaces the existing matrix with one computed
   * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
   *
   * The method accepts any *Array* values, the result of
   * `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
   *  or `CSSMatrix` instance method `toArray()`.
   *
   * This method expects valid *matrix()* / *matrix3d()* string values, as well
   * as other transform functions like *translateX(10px)*.
   *
   * @param {string | number[] | CSSMatrix | DOMMatrix} source
   * @return {CSSMatrix} the matrix instance
   */
  setMatrixValue(source) {
    const m = this;

    // [Arguments list | Array] come here
    if ([Array, Float64Array, Float32Array].some((a) => source instanceof a)) {
      return fromArray(source);
    }
    // CSS transform string source - TransformList
    if (typeof source === 'string' && source.length && source !== 'none') {
      return fromString(source);
    }
    // new CSSMatrix(CSSMatrix | DOMMatrix | JSON)
    if (typeof source === 'object') {
      return fromMatrix(source);
    }
    return m;
  }

  /**
   * Returns an *Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` property.
   *
   * @return {number[]} an *Array* representation of the matrix
   */
  toArray() {
    const m = this;
    const pow = (10 ** 6);
    let result;

    if (m.is2D) {
      result = [m.a, m.b, m.c, m.d, m.e, m.f];
    } else {
      result = [m.m11, m.m12, m.m13, m.m14,
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44];
    }
    // clean up the numbers
    // eslint-disable-next-line -- no-bitwise
    return result.map((n) => (Math.abs(n) < 1e-6 ? 0 : ((n * pow) >> 0) / pow));
  }

  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
   * using the appropriate `CSS` matrix notation.
   *
   * matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
   * matrix *matrix(a, b, c, d, e, f)*
   *
   * @return {string} a string representation of the matrix
   */
  toString() {
    const m = this;
    const values = m.toArray();
    const type = m.is2D ? 'matrix' : 'matrix3d';
    return `${type}(${values})`;
  }

  /**
   * Returns a JSON representation of the `CSSMatrix` instance, a standard *Object*
   * that includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties as well
   * as the `is2D` & `isIdentity` properties.
   *
   * The result can also be used as a second parameter for the `fromMatrix` static method
   * to load values into another matrix instance.
   *
   * @return {CSSMatrix.JSONMatrix} an *Object* with all matrix values.
   */
  toJSON() {
    const m = this;
    const { is2D, isIdentity } = m;
    return { ...m, is2D, isIdentity };
  }

  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param {CSSMatrix | DOMMatrix | CSSMatrix.JSONMatrix} m2 CSSMatrix
   * @return {CSSMatrix} The resulted matrix.
   */
  multiply(m2) {
    return Multiply(this, m2);
  }

  /**
   * The translate method returns a new matrix which is this matrix post
   * multiplied by a translation matrix containing the passed values. If the z
   * component is undefined, a 0 value is used in its place. This matrix is not
   * modified.
   *
   * @param {number} x X component of the translation value.
   * @param {number=} y Y component of the translation value.
   * @param {number=} z Z component of the translation value.
   * @return {CSSMatrix} The resulted matrix
   */
  translate(x, y, z) {
    const X = x;
    let Y = y;
    let Z = z;
    if (Z === undefined) Z = 0;
    if (Y === undefined) Y = 0;
    return Multiply(this, Translate(X, Y, Z));
  }

  /**
   * The scale method returns a new matrix which is this matrix post multiplied by
   * a scale matrix containing the passed values. If the z component is undefined,
   * a 1 value is used in its place. If the y component is undefined, the x
   * component value is used in its place. This matrix is not modified.
   *
   * @param {number} x The X component of the scale value.
   * @param {number=} y The Y component of the scale value.
   * @param {number=} z The Z component of the scale value.
   * @return {CSSMatrix} The resulted matrix
   */
  scale(x, y, z) {
    const X = x;
    let Y = y;
    let Z = z;
    if (Y === undefined) Y = x;
    if (Z === undefined) Z = 1; // Z must be 1 if undefined

    return Multiply(this, Scale(X, Y, Z));
  }

  /**
   * The rotate method returns a new matrix which is this matrix post multiplied
   * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
   * If the y and z components are undefined, the x value is used to rotate the
   * object about the z axis, as though the vector (0,0,x) were passed. All
   * rotation values are in degrees. This matrix is not modified.
   *
   * @param {number} rx The X component of the rotation, or Z if Y and Z are null.
   * @param {number=} ry The (optional) Y component of the rotation value.
   * @param {number=} rz The (optional) Z component of the rotation value.
   * @return {CSSMatrix} The resulted matrix
   */
  rotate(rx, ry, rz) {
    let RX = rx;
    let RY = ry;
    let RZ = rz;
    if (RY === undefined) RY = 0;
    if (RZ === undefined) { RZ = RX; RX = 0; }
    return Multiply(this, Rotate(RX, RY, RZ));
  }

  /**
   * The rotateAxisAngle method returns a new matrix which is this matrix post
   * multiplied by a rotation matrix with the given axis and `angle`. The right-hand
   * rule is used to determine the direction of rotation. All rotation values are
   * in degrees. This matrix is not modified.
   *
   * @param {number} x The X component of the axis vector.
   * @param {number} y The Y component of the axis vector.
   * @param {number} z The Z component of the axis vector.
   * @param {number} angle The angle of rotation about the axis vector, in degrees.
   * @return {CSSMatrix} The resulted matrix
   */
  rotateAxisAngle(x, y, z, angle) {
    if ([x, y, z, angle].some((n) => Number.isNaN(n))) {
      throw new TypeError('CSSMatrix: expecting 4 values');
    }
    return Multiply(this, RotateAxisAngle(x, y, z, angle));
  }

  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The resulted matrix
   */
  skewX(angle) {
    return Multiply(this, SkewX(angle));
  }

  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The resulted matrix
   */
  skewY(angle) {
    return Multiply(this, SkewY(angle));
  }

  /**
   * Transforms a specified point using the matrix, returning a new
   * Tuple *Object* comprising of the transformed point.
   * Neither the matrix nor the original point are altered.
   *
   * The method is equivalent with `transformPoint()` method
   * of the `DOMMatrix` constructor.
   *
   * @copyright thednp © 2021
   *
   * @param {CSSMatrix.PointTuple | DOMPoint} v Tuple or DOMPoint
   * @return {CSSMatrix.PointTuple} the resulting Tuple
   */
  transformPoint(v) {
    const M = this;
    let m = Translate(v.x, v.y, v.z);

    m.m44 = v.w || 1;
    m = M.multiply(m);

    return {
      x: m.m41,
      y: m.m42,
      z: m.m43,
      w: m.m44,
    };
  }

  /**
   * Transforms a specified vector using the matrix, returning a new
   * {x,y,z,w} Tuple *Object* comprising the transformed vector.
   * Neither the matrix nor the original vector are altered.
   *
   * @param {CSSMatrix.PointTuple} t Tuple with `{x,y,z,w}` components
   * @return {CSSMatrix.PointTuple} the resulting Tuple
   */
  transform(t) {
    const m = this;
    const x = m.m11 * t.x + m.m12 * t.y + m.m13 * t.z + m.m14 * t.w;
    const y = m.m21 * t.x + m.m22 * t.y + m.m23 * t.z + m.m24 * t.w;
    const z = m.m31 * t.x + m.m32 * t.y + m.m33 * t.z + m.m34 * t.w;
    const w = m.m41 * t.x + m.m42 * t.y + m.m43 * t.z + m.m44 * t.w;

    return {
      x: x / w,
      y: y / w,
      z: z / w,
      w,
    };
  }
}

// Add Transform Functions to CSSMatrix object
// without creating a TypeScript namespace.
Object.assign(CSSMatrix, {
  Translate,
  Rotate,
  RotateAxisAngle,
  Scale,
  SkewX,
  SkewY,
  Multiply,
  fromArray,
  fromMatrix,
  fromString,
});

var version$1 = "0.0.24";

// @ts-ignore

/**
 * A global namespace for library version.
 * @type {string}
 */
const Version$1 = version$1;

Object.assign(CSSMatrix, { Version: Version$1 });

/**
 * Returns a transformation matrix to apply to `<path>` elements.
 *
 * @see SVGPathCommander.transformObject
 *
 * @param {SVGPathCommander.transformObject} transform the `transformObject`
 * @returns {CSSMatrix} a new transformation matrix
 */
function getSVGMatrix(transform) {
  let matrix = new CSSMatrix();
  const { origin } = transform;
  const [originX, originY] = origin;
  const { translate } = transform;
  const { rotate } = transform;
  const { skew } = transform;
  const { scale } = transform;

  // set translate
  if (Array.isArray(translate) && translate.every((x) => !Number.isNaN(+x))
    && translate.some((x) => x !== 0)) {
    matrix = matrix.translate(translate[0] || 0, translate[1] || 0, translate[2] || 0);
  } else if (typeof translate === 'number' && !Number.isNaN(+translate)) {
    matrix = matrix.translate(translate || 0, 0, 0);
  }

  if (rotate || skew || scale) {
    // set SVG transform-origin, always defined
    matrix = matrix.translate(originX, originY);

    // set rotation
    if (Array.isArray(rotate) && rotate.every((x) => !Number.isNaN(+x))
      && rotate.some((x) => x !== 0)) {
      matrix = matrix.rotate(rotate[0], rotate[1], rotate[2]);
    } else if (typeof rotate === 'number' && !Number.isNaN(+rotate)) {
      matrix = matrix.rotate(0, 0, rotate);
    }

    // set skew(s)
    if (Array.isArray(skew) && skew.every((x) => !Number.isNaN(+x))
      && skew.some((x) => x !== 0)) {
      matrix = skew[0] ? matrix.skewX(skew[0]) : matrix;
      matrix = skew[1] ? matrix.skewY(skew[1]) : matrix;
    } else if (typeof skew === 'number' && !Number.isNaN(+skew)) {
      matrix = matrix.skewX(skew || 0);
    }

    // set scale
    if (Array.isArray(scale) && scale.every((x) => !Number.isNaN(+x))
      && scale.some((x) => x !== 1)) {
      matrix = matrix.scale(scale[0], scale[1], scale[2]);
    } else if (typeof scale === 'number' && !Number.isNaN(+scale)) {
      matrix = matrix.scale(scale || 1, scale || 1, scale || 1);
    }
    // set SVG transform-origin
    matrix = matrix.translate(-originX, -originY);
  }

  return matrix;
}

/**
 * Apply a 2D transformation matrix to an ellipse.
 *
 * @param {number[]} m the 2D transformation matrix
 * @param {number} rx ellipse radius X
 * @param {number} ry ellipse radius Y
 * @param {number} ax ellipse rotation angle
 */
function transformEllipse(m, rx, ry, ax) {
  // We consider the current ellipse as image of the unit circle
  // by first scale(rx,ry) and then rotate(ax) ...
  // So we apply ma =  m x rotate(ax) x scale(rx,ry) to the unit circle.
  const c = Math.cos((ax * Math.PI) / 180);
  const s = Math.sin((ax * Math.PI) / 180);
  const ma = [
    rx * (m[0] * c + m[2] * s),
    rx * (m[1] * c + m[3] * s),
    ry * (-m[0] * s + m[2] * c),
    ry * (-m[1] * s + m[3] * c),
  ];

  // ma * transpose(ma) = [ J L ]
  //                      [ L K ]
  // L is calculated later (if the image is not a circle)
  const J = ma[0] * ma[0] + ma[2] * ma[2];
  const K = ma[1] * ma[1] + ma[3] * ma[3];

  // the discriminant of the characteristic polynomial of ma * transpose(ma)
  let D = ((ma[0] - ma[3]) * (ma[0] - ma[3]) + (ma[2] + ma[1]) * (ma[2] + ma[1]))
          * ((ma[0] + ma[3]) * (ma[0] + ma[3]) + (ma[2] - ma[1]) * (ma[2] - ma[1]));

  // the "mean eigenvalue"
  const JK = (J + K) / 2;

  // check if the image is (almost) a circle
  if (D < epsilon * JK) {
    // if it is
    const rxy = Math.sqrt(JK);

    return { rx: rxy, ry: rxy, ax: 0 };
  }

  // if it is not a circle
  const L = ma[0] * ma[1] + ma[2] * ma[3];

  D = Math.sqrt(D);

  // {l1,l2} = the two eigen values of ma * transpose(ma)
  const l1 = JK + D / 2;
  const l2 = JK - D / 2;
  // the x - axis - rotation angle is the argument of the l1 - eigenvector
  let AX = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ? 90
    : Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L
      : ((L / (l1 - K))) * 180) / Math.PI;
  let RX;
  let RY;

  // if ax > 0 => rx = sqrt(l1), ry = sqrt(l2), else exchange axes and ax += 90
  if (AX >= 0) {
    // if ax in [0,90]
    RX = Math.sqrt(l1);
    RY = Math.sqrt(l2);
  } else {
    // if ax in ]-90,0[ => exchange axes
    AX += 90;
    RX = Math.sqrt(l2);
    RY = Math.sqrt(l1);
  }

  return { rx: RX, ry: RY, ax: AX };
}

/**
 * Returns the [x,y] projected coordinates for a given an [x,y] point
 * and an [x,y,z] perspective origin point.
 *
 * Equation found here =>
 * http://en.wikipedia.org/wiki/3D_projection#Diagram
 * Details =>
 * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
 *
 * @param {SVGPathCommander.CSSMatrix} m the transformation matrix
 * @param {[number, number]} point2D the initial [x,y] coordinates
 * @param {number[]} origin the initial [x,y] coordinates
 * @returns {[number, number]} the projected [x,y] coordinates
 */
function projection2d(m, point2D, origin) {
  const [px, py] = point2D;
  const [originX, originY, originZ] = origin;
  const point3D = m.transformPoint({
    x: px, y: py, z: 0, w: 1,
  });

  const relativePositionX = point3D.x - originX;
  const relativePositionY = point3D.y - originY;
  const relativePositionZ = point3D.z - originZ;

  return [
    relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX,
    relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY,
  ];
}

/**
 * Apply a 2D / 3D transformation to a `pathArray` instance.
 *
 * Since *SVGElement* doesn't support 3D transformation, this function
 * creates a 2D projection of the <path> element.
 *
 * @param {SVGPathCommander.pathArray} path the `pathArray` to apply transformation
 * @param {SVGPathCommander.transformObject} transform the transform functions `Object`
 * @returns {SVGPathCommander.pathArray} the resulted `pathArray`
 */
function transformPath(path, transform) {
  let x = 0; let y = 0; let i; let j; let ii; let jj; let lx; let ly; let te;
  const absolutePath = pathToAbsolute(path);
  const normalizedPath = normalizePath(absolutePath);
  const matrixInstance = getSVGMatrix(transform);
  const transformProps = Object.keys(transform);
  const { origin } = transform;
  const {
    a, b, c, d, e, f,
  } = matrixInstance;
  const matrix2d = [a, b, c, d, e, f];
  const params = { ...paramsParser };
  /** @ts-ignore */
  /** @type {SVGPathCommander.pathSegment} */
  // @ts-ignore
  let segment = [];
  let seglen = 0;
  let pathCommand = '';
  /** @type {SVGPathCommander.pathTransformList[]} */
  let transformedPath = [];
  const allPathCommands = []; // needed for arc to curve transformation

  if (!matrixInstance.isIdentity) {
    for (i = 0, ii = absolutePath.length; i < ii; i += 1) {
      segment = absolutePath[i];

      if (absolutePath[i]) [pathCommand] = segment;

      // REPLACE Arc path commands with Cubic Beziers
      // we don't have any scripting know-how on 3d ellipse transformation
      /// ////////////////////////////////////////
      allPathCommands[i] = pathCommand;

      // Arcs don't work very well with 3D transformations or skews
      if (pathCommand === 'A' && (!matrixInstance.is2D
        || !['skewX', 'skewY'].find((p) => transformProps.includes(p)))) {
        segment = segmentToCubic(normalizedPath[i], params);

        // @ts-ignore -- expected when switching `pathSegment` type
        absolutePath[i] = segmentToCubic(normalizedPath[i], params);
        fixArc(absolutePath, allPathCommands, i);

        // @ts-ignore -- expected when switching `pathSegment` type
        normalizedPath[i] = segmentToCubic(normalizedPath[i], params);
        fixArc(normalizedPath, allPathCommands, i);
        ii = Math.max(absolutePath.length, normalizedPath.length);
      }
      /// ////////////////////////////////////////

      segment = normalizedPath[i];
      seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;

      /** @type {SVGPathCommander.pathTransformList} */
      const result = {
        s: absolutePath[i], c: absolutePath[i][0], x: params.x1, y: params.y1,
      };

      transformedPath = [...transformedPath, ...[result]];
    }

    // @ts-ignore
    return transformedPath.map((seg) => {
      pathCommand = seg.c;
      segment = seg.s;
      switch (pathCommand) {
        case 'A': // only apply to 2D transformations
          // @ts-ignore
          te = transformEllipse(matrix2d, segment[1], segment[2], segment[3]);

          if (matrix2d[0] * matrix2d[3] - matrix2d[1] * matrix2d[2] < 0) {
            segment[5] = segment[5] ? 0 : 1;
          }

          // @ts-ignore
          [lx, ly] = projection2d(matrixInstance, [+segment[6], +segment[7]], origin);

          if ((x === lx && y === ly) || (te.rx < epsilon * te.ry) || (te.ry < epsilon * te.rx)) {
            segment = ['L', lx, ly];
          } else {
            // @ts-ignore
            segment = [pathCommand, te.rx, te.ry, te.ax, segment[4], segment[5], lx, ly];
          }

          x = lx; y = ly;
          return segment;

        case 'L':
        case 'H':
        case 'V':
          [lx, ly] = projection2d(matrixInstance, [seg.x, seg.y], origin);

          if (x !== lx && y !== ly) {
            segment = ['L', lx, ly];
          } else if (y === ly) {
            segment = ['H', lx];
          } else if (x === lx) {
            segment = ['V', ly];
          }

          x = lx; y = ly; // now update x and y

          return segment;
        default:

          for (j = 1, jj = segment.length; j < jj; j += 2) {
            // compute line coordinates without altering previous coordinates
            [x, y] = projection2d(matrixInstance, [+segment[j], +segment[j + 1]], origin);
            segment[j] = x;
            segment[j + 1] = y;
          }

          return segment;
      }
    });
  }
  return clonePath(absolutePath);
}

/**
 * Returns a point at a given length of a C (cubic-bezier) segment.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number} t a [0-1] ratio
 * @returns {{x: number, y: number}} the cubic-bezier segment length
 */
function getPointAtCubicSegmentLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t) {
  const t1 = 1 - t;
  return {
    x: (t1 ** 3) * x1
      + 3 * (t1 ** 2) * t * c1x
      + 3 * t1 * (t ** 2) * c2x
      + (t ** 3) * x2,
    y: (t1 ** 3) * y1
      + 3 * (t1 ** 2) * t * c1y
      + 3 * t1 * (t ** 2) * c2y
      + (t ** 3) * y2,
  };
}

/**
 * Returns the length of a C (cubic-bezier) segment,
 * or an {x,y} point at a given length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the point distance
 * @returns {{x: number, y: number} | number} the segment length or point
 */
function segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, distance) {
  const distanceIsNumber = typeof distance === 'number';
  const lengthMargin = 0.001;
  let x = x1; let y = y1;
  let totalLength = 0;
  let prev = [x1, y1, totalLength];
  /** @type {[number, number]} */
  let cur = [x1, y1];
  let t = 0;

  if (distanceIsNumber && distance < lengthMargin) {
    return { x, y };
  }

  const n = 100;
  for (let j = 0; j <= n; j += 1) {
    t = j / n;

    ({ x, y } = getPointAtCubicSegmentLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t));
    totalLength += distanceSquareRoot(cur, [x, y]);
    cur = [x, y];

    if (distanceIsNumber && totalLength >= distance) {
      const dv = (totalLength - distance) / (totalLength - prev[2]);

      return {
        x: cur[0] * (1 - dv) + prev[0] * dv,
        y: cur[1] * (1 - dv) + prev[1] * dv,
      };
    }
    prev = [x, y, totalLength];
  }

  if (distanceIsNumber && distance >= totalLength) {
    return { x: x2, y: y2 };
  }
  return totalLength;
}

/**
 * Returns the cubic-bezier segment bounding box.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @returns {SVGPathCommander.segmentLimits} the bounding box of the cubic-bezier segment
 */
function getCubicSize(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
  let a = (c2x - 2 * c1x + x1) - (x2 - 2 * c2x + c1x);
  let b = 2 * (c1x - x1) - 2 * (c2x - c1x);
  let c = x1 - c1x;
  let t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  let t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  const X = [x1, x2];
  const Y = [y1, y2];
  let x = 0;
  let y = 0;

  if (Math.abs(t1) > 1e12) t1 = 0.5;
  if (Math.abs(t2) > 1e12) t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t1));
    X.push(x);
    Y.push(y);
  }
  if (t2 > 0 && t2 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t2));
    X.push(x);
    Y.push(y);
  }
  a = (c2y - 2 * c1y + y1) - (y2 - 2 * c2y + c1y);
  b = 2 * (c1y - y1) - 2 * (c2y - c1y);
  c = y1 - c1y;
  t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  if (Math.abs(t1) > 1e12) t1 = 0.5;
  if (Math.abs(t2) > 1e12) t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t1));
    X.push(x);
    Y.push(y);
  }
  if (t2 > 0 && t2 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t2));
    X.push(x);
    Y.push(y);
  }
  return {
    min: { x: Math.min(...X), y: Math.min(...Y) },
    max: { x: Math.max(...X), y: Math.max(...Y) },
  };
}

/**
 * Returns the bounding box of a shape.
 *
 * @param {SVGPathCommander.pathArray} path the shape `pathArray`
 * @returns {SVGPathCommander.pathBBox} the length of the cubic-bezier segment
 */
function getPathBBox(path) {
  if (!path) {
    return {
      x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0, cx: 0, cy: 0, cz: 0,
    };
  }
  const pathCurve = pathToCurve(path);

  let x = 0; let y = 0;
  /** @type {number[]} */
  let X = [];
  /** @type {number[]} */
  let Y = [];

  pathCurve.forEach((segment) => {
    const [s1, s2] = segment.slice(-2).map(Number);
    if (segment[0] === 'M') {
      x = s1;
      y = s2;
      X.push(s1);
      Y.push(s2);
    } else {
      const sizeArgs = [x, y, ...segment.slice(1)];
      // @ts-ignore -- this should be fine
      const dim = getCubicSize(...sizeArgs);

      X = [...X, ...[dim.min.x, dim.max.x]];
      Y = [...Y, ...[dim.min.y, dim.max.y]];
      x = s1;
      y = s2;
    }
  });

  const xTop = Math.min(...X);
  const yTop = Math.min(...Y);
  const xBot = Math.max(...X);
  const yBot = Math.max(...Y);
  const width = xBot - xTop;
  const height = yBot - yTop;

  // an estimted guess
  const cz = Math.max(width, height) + Math.min(width, height) / 2;
  return {
    width,
    height,
    x: xTop,
    y: yTop,
    x2: xBot,
    y2: yBot,
    cx: xTop + width / 2,
    cy: yTop + height / 2,
    cz,
  };
}

/**
 * Creates a new SVGPathCommander instance with the following properties:
 * * segments: `pathArray`
 * * round: number
 * * origin: [number, number, number?]
 *
 * @class
 * @author thednp <https://github.com/thednp/svg-path-commander>
 * @returns {SVGPathCommander} a new SVGPathCommander instance
 */
class SVGPathCommander {
  /**
   * @constructor
   * @param {string} pathValue the path string
   * @param {any} config instance options
   */
  constructor(pathValue, config) {
    const instanceOptions = config || {};

    /**
     * @type {SVGPathCommander.pathArray}
     */
    this.segments = parsePathString(pathValue);
    const BBox = getPathBBox(this.segments);
    const {
      width,
      height,
      cx,
      cy,
      cz,
    } = BBox;

    // set instance options.round
    let { round, origin } = defaultOptions;
    const { round: roundOption, origin: originOption } = instanceOptions;

    if (roundOption === 'auto') {
      const pathScale = (`${Math.floor(Math.max(width, height))}`).length;
      round = pathScale >= 4 ? 0 : 4 - pathScale;
    } else if ((Number.isInteger(roundOption) && roundOption >= 1) || roundOption === false) {
      round = roundOption;
    }

    // set instance options.origin
    if (Array.isArray(originOption) && originOption.length >= 2) {
      const [originX, originY, originZ] = originOption.map(Number);
      origin = [
        !Number.isNaN(originX) ? originX : cx,
        !Number.isNaN(originY) ? originY : cy,
        originZ || cz,
      ];
    } else {
      origin = [cx, cy, cz];
    }

    /**
     * @type {number | boolean}
     * @default 4
     */
    this.round = round;
    this.origin = origin;

    return this;
  }

  /**
   * Convert path to absolute values
   * @public
   */
  toAbsolute() {
    const { segments } = this;
    this.segments = pathToAbsolute(segments);
    return this;
  }

  /**
   * Convert path to relative values
   * @public
   */
  toRelative() {
    const { segments } = this;
    this.segments = pathToRelative(segments);
    return this;
  }

  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments } = this;
    this.segments = pathToCurve(segments);
    return this;
  }

  /**
   * Reverse the order of the segments and their values.
   * @param {boolean | number} onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(onlySubpath) {
    this.toAbsolute();

    const { segments } = this;
    const split = splitPath(this.toString());
    const subPath = split.length > 1 ? split : 0;

    // @ts-ignore
    const absoluteMultiPath = subPath && clonePath(subPath).map((x, i) => {
      if (onlySubpath) {
        return i ? reversePath(x) : parsePathString(x);
      }
      return reversePath(x);
    });

    let path = [];
    if (subPath) {
      path = absoluteMultiPath.flat(1);
    } else {
      path = onlySubpath ? segments : reversePath(segments);
    }

    this.segments = clonePath(path);
    return this;
  }

  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   * @public
   */
  normalize() {
    const { segments } = this;
    this.segments = normalizePath(segments);
    return this;
  }

  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   * @public
   */
  optimize() {
    const { segments } = this;

    this.segments = optimizePath(segments, this.round);
    return this;
  }

  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   * @see SVGPathCommander.transformObject for a quick refference
   *
   * @param {SVGPathCommander.transformObject} source a `transformObject`as described above
   * @public
   */
  transform(source) {
    if (!source || typeof source !== 'object' || (typeof source === 'object'
      && !['translate', 'rotate', 'skew', 'scale'].some((x) => x in source))) return this;

    /** @type {SVGPathCommander.transformObject} */
    const transform = {};
    Object.keys(source).forEach((fn) => {
      // @ts-ignore
      transform[fn] = Array.isArray(source[fn]) ? [...source[fn]] : Number(source[fn]);
    });
    const { segments } = this;

    // if origin is not specified
    // it's important that we have one
    const { origin } = transform;
    if (origin && origin.length >= 2) {
      const [originX, originY, originZ] = origin.map(Number);
      const [cx, cy, cz] = this.origin;
      transform.origin = [
        !Number.isNaN(originX) ? originX : cx,
        !Number.isNaN(originY) ? originY : cy,
        originZ || cz,
      ];
    } else {
      // @ts-ignore
      transform.origin = { ...this.origin };
    }

    this.segments = transformPath(segments, transform);
    return this;
  }

  /**
   * Rotate path 180deg horizontally
   * @public
   */
  flipX() {
    this.transform({ rotate: [180, 0, 0] });
    return this;
  }

  /**
   * Rotate path 180deg vertically
   * @public
   */
  flipY() {
    this.transform({ rotate: [0, 180, 0] });
    return this;
  }

  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   * @public
   * @return {String} the path string
   */
  toString() {
    return pathToString(this.segments, this.round);
  }
}

/**
 * Returns the area of a single cubic-bezier segment.
 *
 * http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @returns {number} the area of the cubic-bezier segment
 */
function getCubicSegArea(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
  return (3 * ((y2 - y1) * (c1x + c2x) - (x2 - x1) * (c1y + c2y)
           + (c1y * (x1 - c2x)) - (c1x * (y1 - c2y))
           + (y2 * (c2x + x1 / 3)) - (x2 * (c2y + y1 / 3)))) / 20;
}

/**
 * Returns the area of a shape.
 * @author Jürg Lehni & Jonathan Puckey
 *
 * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
 *
 * @param {SVGPathCommander.pathArray} path the shape `pathArray`
 * @returns {number} the length of the cubic-bezier segment
 */
function getPathArea(path) {
  let x = 0; let y = 0; let len = 0;

  return pathToCurve(path).map((seg) => {
    switch (seg[0]) {
      case 'M':
        [, x, y] = seg;
        return 0;
      default:
        // @ts-ignore -- the utility will have proper amount of params
        len = getCubicSegArea(x, y, ...seg.slice(1));
        // @ts-ignore -- the segment always has numbers
        [x, y] = seg.slice(-2);
        return len;
    }
  }).reduce((a, b) => a + b, 0);
}

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * This is the `pathToCurve` version which is faster and more efficient for
 * paths that are `curveArray`.
 *
 * @param {string | SVGPathCommander.curveArray} path the target `pathArray`
 * @returns {number} the `curveArray` total length
 */
function getPathLength(path) {
  let totalLength = 0;
  pathToCurve(path).forEach((s, i, curveArray) => {
    const args = s[0] !== 'M' ? [...curveArray[i - 1].slice(-2), ...s.slice(1)] : [];
    // @ts-ignore
    totalLength += s[0] === 'M' ? 0 : segmentCubicFactory(...args);
  });
  return totalLength;
}

/**
 * Returns the length of a A (arc-to) segment,
 * or an {x,y} point at a given length.
 *
 * @param {number} X1 the starting x position
 * @param {number} Y1 the starting y position
 * @param {number} RX x-radius of the arc
 * @param {number} RY y-radius of the arc
 * @param {number} angle x-axis-rotation of the arc
 * @param {number} LAF large-arc-flag of the arc
 * @param {number} SF sweep-flag of the arc
 * @param {number} X2 the ending x position
 * @param {number} Y2 the ending y position
 * @param {number} distance the point distance
 * @returns {{x: number, y: number} | number} the segment length or point
 */
function segmentArcFactory(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, distance) {
  const cubicSeg = arcToCubic(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2);
  const distanceIsNumber = typeof distance === 'number';
  let [x, y] = [X1, Y1];
  const lengthMargin = 0.001;
  let totalLength = 0;
  let cubicSubseg = [];
  let argsc = [];
  let segLen = 0;

  if (distanceIsNumber && distance < lengthMargin) {
    return { x, y };
  }

  for (let i = 0, ii = cubicSeg.length; i < ii; i += 6) {
    cubicSubseg = cubicSeg.slice(i, i + 6);
    argsc = [x, y, ...cubicSubseg];
    // @ts-ignore
    segLen = segmentCubicFactory(...argsc);
    if (distanceIsNumber && totalLength + segLen >= distance) {
      // @ts-ignore -- this is a `cubicSegment`
      return segmentCubicFactory(...argsc, distance - totalLength);
    }
    totalLength += segLen;
    [x, y] = cubicSubseg.slice(-2);
  }

  if (distanceIsNumber && distance >= totalLength) {
    return { x: X2, y: Y2 };
  }

  return totalLength;
}

/**
 * Returns the {x,y} coordinates of a point at a
 * given length of a quad-bezier segment.
 *
 * @see https://github.com/substack/point-at-length
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} cx the control point X
 * @param {number} cy the control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number} t a [0-1] ratio
 * @returns {{x: number, y: number}} the requested {x,y} coordinates
 */
function getPointAtQuadSegmentLength(x1, y1, cx, cy, x2, y2, t) {
  const t1 = 1 - t;
  return {
    x: (t1 ** 2) * x1
      + 2 * t1 * t * cx
      + (t ** 2) * x2,
    y: (t1 ** 2) * y1
      + 2 * t1 * t * cy
      + (t ** 2) * y2,
  };
}

/**
 * Returns the Q (quadratic-bezier) segment length,
 * or an {x,y} point at a given length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} qx the control point X
 * @param {number} qy the control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the distance to point
 * @returns {{x: number, y: number} | number} the segment length or point
 */
function segmentQuadFactory(x1, y1, qx, qy, x2, y2, distance) {
  const distanceIsNumber = typeof distance === 'number';
  const lengthMargin = 0.001;
  let x = x1; let y = y1;
  let totalLength = 0;
  let prev = [x1, y1, totalLength];
  /** @type {[number, number]} */
  let cur = [x1, y1];
  let t = 0;

  if (distanceIsNumber && distance < lengthMargin) {
    return { x, y };
  }

  const n = 100;
  for (let j = 0; j <= n; j += 1) {
    t = j / n;

    ({ x, y } = getPointAtQuadSegmentLength(x1, y1, qx, qy, x2, y2, t));
    totalLength += distanceSquareRoot(cur, [x, y]);
    cur = [x, y];

    if (distanceIsNumber && totalLength >= distance) {
      const dv = (totalLength - distance) / (totalLength - prev[2]);

      return {
        x: cur[0] * (1 - dv) + prev[0] * dv,
        y: cur[1] * (1 - dv) + prev[1] * dv,
      };
    }
    prev = [x, y, totalLength];
  }
  if (distanceIsNumber && distance >= totalLength) {
    return { x: x2, y: y2 };
  }
  return totalLength;
}

/**
 * Returns a {x,y} point at a given length of a shape or the shape total length.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the `pathArray` to look into
 * @param {number=} distance the length of the shape to look at
 * @returns {{x: number, y: number} | number} the total length or point
 */
function pathLengthFactory(pathInput, distance) {
  const path = fixPath(normalizePath(pathInput));
  const distanceIsNumber = typeof distance === 'number';
  let totalLength = 0;
  let isM = true;
  /** @type {number[]} */
  let data = [];
  let pathCommand = 'M';
  let segLen = 0;
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let seg;

  for (let i = 0, ll = path.length; i < ll; i += 1) {
    seg = path[i];
    [pathCommand] = seg;
    isM = pathCommand === 'M';
    // @ts-ignore
    data = !isM ? [x, y, ...seg.slice(1)] : data;

    // this segment is always ZERO
    if (isM) {
      // remember mx, my for Z
      // @ts-ignore
      [, mx, my] = seg;
      if (distanceIsNumber && distance < 0.001) {
        return { x: mx, y: my };
      }
    } else if (pathCommand === 'L') {
      // @ts-ignore
      segLen = segmentLineFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentLineFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'A') {
      // @ts-ignore
      segLen = segmentArcFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentArcFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'C') {
      // @ts-ignore
      segLen = segmentCubicFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentCubicFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'Q') {
      // @ts-ignore
      segLen = segmentQuadFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentQuadFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'Z') {
      data = [x, y, mx, my];
      // @ts-ignore
      segLen = segmentLineFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentLineFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    }

    // @ts-ignore -- needed for the below
    [x, y] = pathCommand !== 'Z' ? seg.slice(-2) : [mx, my];
  }

  // native `getPointAtLength` behavior when the given distance
  // is higher than total length
  if (distanceIsNumber && distance >= totalLength) {
    return { x, y };
  }

  return totalLength;
}

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * The `normalizePath` version is lighter, faster, more efficient and more accurate
 * with paths that are not `curveArray`.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the target `pathArray`
 * @returns {number} the shape total length
 */
function getTotalLength(pathInput) {
  // @ts-ignore - it's fine
  return pathLengthFactory(pathInput);
}

/**
 * Check if a path is drawn clockwise and returns true if so,
 * false otherwise.
 *
 * @param {SVGPathCommander.pathArray} path the path string or `pathArray`
 * @returns {boolean} true when clockwise or false if not
 */
function getDrawDirection(path) {
  return getPathArea(pathToCurve(path)) >= 0;
}

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the `pathArray` to look into
 * @param {number} distance the length of the shape to look at
 * @returns {{x: number, y: number}} the requested {x, y} point coordinates
 */
function getPointAtLength(pathInput, distance) {
  // @ts-ignore
  return pathLengthFactory(pathInput, distance);
}

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 * `pathToCurve` version.
 *
 * @deprecated
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the `pathArray` to look into
 * @param {number} distance the length of the shape to look at
 * @returns {{x: number, y: number}} the requested {x, y} point coordinates
 */
function getPointAtPathLength(pathInput, distance) {
  return getPointAtLength(pathInput, distance);
}

/**
 * Returns the segment, its index and length as well as
 * the length to that segment at a given length in a path.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput target `pathArray`
 * @param {number=} distance the given length
 * @returns {SVGPathCommander.segmentProperties=} the requested properties
 */
function getPropertiesAtLength(pathInput, distance) {
  const pathArray = parsePathString(pathInput);
  const segments = [];

  let pathTemp = [...pathArray];
  // @ts-ignore
  let pathLength = getTotalLength(pathTemp);
  let index = pathTemp.length - 1;
  let lengthAtSegment = 0;
  let length = 0;
  /** @type {SVGPathCommander.pathSegment} */
  let segment = pathArray[0];
  const [x, y] = segment.slice(-2);
  const point = { x, y };

  // If the path is empty, return 0.
  if (index <= 0 || !distance || !Number.isFinite(distance)) {
    return {
      // @ts-ignore
      segment, index: 0, length, point, lengthAtSegment,
    };
  }

  if (distance >= pathLength) {
    pathTemp = pathArray.slice(0, -1);
    // @ts-ignore
    lengthAtSegment = getTotalLength(pathTemp);
    // @ts-ignore
    length = pathLength - lengthAtSegment;
    return {
      // @ts-ignore
      segment: pathArray[index], index, length, lengthAtSegment,
    };
  }

  while (index > 0) {
    segment = pathTemp[index];
    pathTemp = pathTemp.slice(0, -1);
    // @ts-ignore -- `pathTemp` === `pathSegment[]` === `pathArray`
    lengthAtSegment = getTotalLength(pathTemp);
    // @ts-ignore
    length = pathLength - lengthAtSegment;
    pathLength = lengthAtSegment;
    segments.push({
      segment, index, length, lengthAtSegment,
    });
    index -= 1;
  }

  // @ts-ignore
  return segments.find(({ lengthAtSegment: l }) => l <= distance);
}

/**
 * Returns the point and segment in path closest to a given point as well as
 * the distance to the path stroke.
 * @see https://bl.ocks.org/mbostock/8027637
 *
 * @param {string | SVGPathCommander.pathArray} pathInput target `pathArray`
 * @param {{x: number, y: number}} point the given point
 * @returns {SVGPathCommander.pointProperties} the requested properties
 */
function getPropertiesAtPoint(pathInput, point) {
  const path = fixPath(parsePathString(pathInput));
  const normalPath = normalizePath(path);
  const pathLength = getTotalLength(path);
  /** @param {{x: number, y: number}} p */
  const distanceTo = (p) => {
    const dx = p.x - point.x;
    const dy = p.y - point.y;
    return dx * dx + dy * dy;
  };
  let precision = 8;
  let scan = { x: 0, y: 0 };
  let scanDistance = 0;
  let closest = scan;
  let bestLength = 0;
  let bestDistance = Infinity;

  // linear scan for coarse approximation
  for (let scanLength = 0; scanLength <= pathLength; scanLength += precision) {
    scan = getPointAtLength(normalPath, scanLength);
    scanDistance = distanceTo(scan);
    if (scanDistance < bestDistance) {
      closest = scan;
      bestLength = scanLength;
      bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  let before = { x: 0, y: 0 };
  let after = before;
  let beforeLength = 0;
  let afterLength = 0;
  let beforeDistance = 0;
  let afterDistance = 0;

  while (precision > 0.5) {
    beforeLength = bestLength - precision;
    before = getPointAtLength(normalPath, beforeLength);
    beforeDistance = distanceTo(before);
    afterLength = bestLength + precision;
    after = getPointAtLength(normalPath, afterLength);
    afterDistance = distanceTo(after);
    if (beforeLength >= 0 && beforeDistance < bestDistance) {
      closest = before;
      bestLength = beforeLength;
      bestDistance = beforeDistance;
    } else if (afterLength <= pathLength && afterDistance < bestDistance) {
      closest = after;
      bestLength = afterLength;
      bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  const segment = getPropertiesAtLength(path, bestLength);
  const distance = Math.sqrt(bestDistance);

  return { closest, distance, segment };
}

/**
 * Returns the point in path closest to a given point.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput target `pathArray`
 * @param {{x: number, y: number}} point the given point
 * @returns {{x: number, y: number}} the best match
 */
function getClosestPoint(pathInput, point) {
  return getPropertiesAtPoint(pathInput, point).closest;
}

/**
 * Returns the path segment which contains a given point.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to look into
 * @param {{x: number, y: number}} point the point of the shape to look for
 * @returns {SVGPathCommander.pathSegment?} the requested segment
 */
function getSegmentOfPoint(path, point) {
  const props = getPropertiesAtPoint(path, point);
  const { segment } = props;
  return typeof segment !== 'undefined' ? segment.segment : null;
}

/**
 * Returns the segment at a given length.
 * @param {string | SVGPathCommander.pathArray} pathInput the target `pathArray`
 * @param {number} distance the distance in path to look at
 * @returns {SVGPathCommander.pathSegment?} the requested segment
 */
function getSegmentAtLength(pathInput, distance) {
  const props = getPropertiesAtLength(pathInput, distance);
  const { segment } = typeof props !== 'undefined' ? props : { segment: null };
  return segment;
}

/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput target path
 * @param {{x: number, y: number}} point
 * @returns {boolean} the query result
 */
function isPointInStroke(pathInput, point) {
  const { distance } = getPropertiesAtPoint(pathInput, point);
  return Math.abs(distance) < 0.01;
}

/**
 * Parses a path string value to determine its validity
 * then returns true if it's valid or false otherwise.
 *
 * @param {string} pathString the path string to be parsed
 * @returns {boolean} the path string validity
 */
function isValidPath(pathString) {
  if (typeof pathString !== 'string') {
    return false;
  }

  const path = new PathParser(pathString);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  return !path.err.length && 'mM'.includes(path.segments[0][0]);
}

/**
 * Supported shapes and their specific parameters.
 * @type {Object.<string, string[]>}
 */
const shapeParams = {
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  rect: ['width', 'height', 'x', 'y', 'rx', 'ry'],
  polygon: ['points'],
  polyline: ['points'],
  glyph: [],
};

/**
 * Returns a new `pathArray` from line attributes.
 *
 * @param {SVGPathCommander.lineAttr} attr shape configuration
 * @returns {SVGPathCommander.pathArray} a new line `pathArray`
 */
function getLinePath(attr) {
  const {
    x1, y1, x2, y2,
  } = attr;
  return [['M', x1, y1], ['L', x2, y2]];
}

/**
 * Returns a new `pathArray` like from polyline/polygon attributes.
 *
 * @param {SVGPathCommander.polyAttr} attr shape configuration
 * @return {SVGPathCommander.pathArray} a new polygon/polyline `pathArray`
 */
function getPolyPath(attr) {
  /** @type {SVGPathCommander.pathArray} */
  // @ts-ignore -- it's an empty `pathArray`
  const pathArray = [];
  const points = attr.points.split(/[\s|,]/).map(Number);

  let index = 0;
  while (index < points.length) {
    pathArray.push([(index ? 'L' : 'M'), (points[index]), (points[index + 1])]);
    index += 2;
  }
  // @ts-ignore -- it's a `pathArray`
  return attr.type === 'polygon' ? [...pathArray, ['z']] : pathArray;
}

/**
 * Returns a new `pathArray` from circle attributes.
 *
 * @param {SVGPathCommander.circleAttr} attr shape configuration
 * @return {SVGPathCommander.pathArray} a circle `pathArray`
 */
function getCirclePath(attr) {
  const {
    cx, cy, r,
  } = attr;

  return [
    ['M', (cx - r), cy],
    ['a', r, r, 0, 1, 0, (2 * r), 0],
    ['a', r, r, 0, 1, 0, (-2 * r), 0],
  ];
}

/**
 * Returns a new `pathArray` from ellipse attributes.
 *
 * @param {SVGPathCommander.ellipseAttr} attr shape configuration
 * @return {SVGPathCommander.pathArray} an ellipse `pathArray`
 */
function getEllipsePath(attr) {
  const {
    cx, cy, rx, ry,
  } = attr;

  return [
    ['M', (cx - rx), cy],
    ['a', rx, ry, 0, 1, 0, (2 * rx), 0],
    ['a', rx, ry, 0, 1, 0, (-2 * rx), 0],
  ];
}

/**
 * Returns a new `pathArray` like from rect attributes.
 *
 * @param {SVGPathCommander.rectAttr} attr object with properties above
 * @return {SVGPathCommander.pathArray} a new `pathArray` from `<rect>` attributes
 */
function getRectanglePath(attr) {
  const x = +attr.x || 0;
  const y = +attr.y || 0;
  const w = +attr.width;
  const h = +attr.height;
  let rx = +attr.rx;
  let ry = +attr.ry;

  // Validity checks from http://www.w3.org/TR/SVG/shapes.html#RectElement:
  if (rx || ry) {
    rx = !rx ? ry : rx;
    ry = !ry ? rx : ry;

    if (rx * 2 > w) rx -= (rx * 2 - w) / 2;
    if (ry * 2 > h) ry -= (ry * 2 - h) / 2;

    return [
      ['M', x + rx, y],
      ['h', w - rx * 2],
      ['s', rx, 0, rx, ry],
      ['v', h - ry * 2],
      ['s', 0, ry, -rx, ry],
      ['h', -w + rx * 2],
      ['s', -rx, 0, -rx, -ry],
      ['v', -h + ry * 2],
      ['s', 0, -ry, rx, -ry],
    ];
  }

  return [
    ['M', x, y],
    ['h', w],
    ['v', h],
    ['H', x],
    ['Z'],
  ];
}

/**
 * Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
 * is `true`, it will replace the target.
 *
 * It can also work with an options object,
 * @see SVGPathCommander.shapeOps
 *
 * The newly created `<path>` element keeps all non-specific
 * attributes like `class`, `fill`, etc.
 *
 * @param {SVGPathCommander.shapeTypes | SVGPathCommander.shapeOps} element target shape
 * @param {boolean=} replace option to replace target
 * @return {SVGPathElement | boolean} the newly created `<path>` element
 */
function shapeToPath(element, replace) {
  const supportedShapes = Object.keys(shapeParams);
  const isElement = element instanceof Element;

  if (isElement && !supportedShapes.some((s) => element.tagName === s)) {
    throw TypeError(`shapeToPath: "${element}" is not SVGElement`);
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  /** @type {string} */
  const type = isElement ? element.tagName : element.type;
  /** @type {any} disables TS checking for something that's specific to shape */
  const config = {};
  config.type = type;

  if (isElement) {
    const shapeAttrs = shapeParams[type];
    shapeAttrs.forEach((p) => { config[p] = element.getAttribute(p); });
    // set no-specific shape attributes: fill, stroke, etc
    Object.values(element.attributes).forEach(({ name, value }) => {
      if (!shapeAttrs.includes(name)) path.setAttribute(name, value);
    });
  } else {
    Object.assign(config, element);
  }

  // set d
  let description;
  const { round } = defaultOptions;

  if (type === 'circle') description = pathToString(getCirclePath(config), round);
  else if (type === 'ellipse') description = pathToString(getEllipsePath(config), round);
  else if (['polyline', 'polygon'].includes(type)) description = pathToString(getPolyPath(config), round);
  else if (type === 'rect') description = pathToString(getRectanglePath(config), round);
  else if (type === 'line') description = pathToString(getLinePath(config), round);
  else if (type === 'glyph') description = isElement ? element.getAttribute('d') : element.type;

  // replace target element
  if (description) {
    path.setAttribute('d', description);
    if (replace && isElement) {
      element.before(path, element);
      element.remove();
    }
    return path;
  }
  return false;
}

/**
 * Reverses all segments and their values from a `pathArray`
 * which consists of only C (cubic-bezier) path commands.
 *
 * @param {SVGPathCommander.curveArray} path the source `pathArray`
 * @returns {SVGPathCommander.curveArray} the reversed `pathArray`
 */
function reverseCurve(path) {
  const rotatedCurve = path.slice(1)
    .map((x, i, curveOnly) => (!i
      ? [...path[0].slice(1), ...x.slice(1)]
      : [...curveOnly[i - 1].slice(-2), ...x.slice(1)]))
    .map((x) => x.map((_, i) => x[x.length - i - 2 * (1 - (i % 2))]))
    .reverse();

  // @ts-ignore -- expected on reverse operations
  return [['M', ...rotatedCurve[0].slice(0, 2)],
    ...rotatedCurve.map((x) => ['C', ...x.slice(2)])];
}

/**
 * @interface
 */
const Util = {
  CSSMatrix,
  parsePathString,
  isPathArray,
  isCurveArray,
  isAbsoluteArray,
  isRelativeArray,
  isNormalizedArray,
  isValidPath,
  pathToAbsolute,
  pathToRelative,
  pathToCurve,
  pathToString,
  getDrawDirection,
  getPathArea,
  getPathBBox,
  getTotalLength,
  getPathLength,
  getPointAtLength,
  getPointAtPathLength,
  getClosestPoint,
  getSegmentOfPoint,
  getPropertiesAtPoint,
  getPropertiesAtLength,
  getSegmentAtLength,
  isPointInStroke,
  clonePath,
  splitPath,
  fixPath,
  roundPath,
  optimizePath,
  reverseCurve,
  reversePath,
  normalizePath,
  transformPath,
  shapeToPath,
  options: defaultOptions,
};

var version = "0.1.24";

// @ts-ignore

/**
 * A global namespace for library version.
 * @type {string}
 */
const Version = version;

// Export to global
Object.assign(SVGPathCommander, Util, { Version });

export { SVGPathCommander as default };
