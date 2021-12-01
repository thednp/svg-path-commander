/*!
* SVGPathCommander v0.1.11alpha4 (http://thednp.github.io/svg-path-commander)
* Copyright 2021 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVGPathCommander = factory());
})(this, (function () { 'use strict';

  /**
   * SVGPathCommander default options
   *
   */
  var SVGPCO = {
    origin: [0, 0],
    decimals: 4,
    round: 1,
  };

  /**
   * @type {Object.<string, number>}
   */
  var paramsCount = {
    a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0,
  };

  /**
   * Breaks the parsing of a pathString once a segment is finalized.
   *
   * @param {SVGPathCommander.PathParser} path the `PathParser` instance
   */
  function finalizeSegment(path) {
    var pathCommand = path.pathValue[path.segmentStart];
    var LK = pathCommand.toLowerCase();
    var data = path.data;

    // Process duplicated commands (without comand name)
    if (LK === 'm' && data.length > 2) {
      path.segments.push([pathCommand, data[0], data[1]]);
      data = data.slice(2);
      LK = 'l';
      pathCommand = pathCommand === 'm' ? 'l' : 'L';
    }

    while (data.length >= paramsCount[LK]) {
      // path.segments.push([pathCommand].concat(data.splice(0, paramsCount[LK])));
      path.segments.push([pathCommand ].concat( data.splice(0, paramsCount[LK])));
      if (!paramsCount[LK]) {
        break;
      }
    }
  }

  var invalidPathValue = 'Invalid path value';

  /**
   * Validates an A (arc-to) specific path command value.
   * Usually a `large-arc-flag` or `sweep-flag`.
   *
   * @param {SVGPathCommander.PathParser} path the `PathParser` instance
   */
  function scanFlag(path) {
    var index = path.index;
    var ch = path.pathValue.charCodeAt(index);

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

    path.err = invalidPathValue + ": invalid Arc flag " + ch + ", expecting 0 or 1 at index " + index;
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
    var max = path.max;
    var pathValue = path.pathValue;
    var start = path.index;
    var index = start;
    var zeroFirst = false;
    var hasCeiling = false;
    var hasDecimal = false;
    var hasDot = false;
    var ch;

    if (index >= max) {
      // path.err = 'SvgPath: missed param (at pos ' + index + ')';
      path.err = invalidPathValue + " at " + index + ": missing param " + (pathValue[index]);
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
      path.err = invalidPathValue + " at index " + index + ": " + (pathValue[index]) + " is not a number";
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
          path.err = invalidPathValue + " at index " + start + ": " + (pathValue[start]) + " illegal number";
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
        path.err = invalidPathValue + " at index " + index + ": " + (pathValue[index]) + " invalid float exponent";
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
        path.err = invalidPathValue + " at index " + index + ": " + (pathValue[index]) + " invalid float exponent";
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
    var specialSpaces = [
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
    var pathValue = path.pathValue;
    var max = path.max;
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
      // case 0x72/* r */: // R is not supported
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
    var max = path.max;
    var pathValue = path.pathValue;
    var index = path.index;
    var cmdCode = pathValue.charCodeAt(index);
    var reqParams = paramsCount[pathValue[index].toLowerCase()];

    path.segmentStart = index;

    if (!isPathCommand(cmdCode)) {
      path.err = invalidPathValue + ": " + (pathValue[index]) + " not a path command";
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
      for (var i = reqParams; i > 0; i -= 1) {
        if (isArcCommand(cmdCode) && (i === 3 || i === 4)) { scanFlag(path); }
        else { scanParam(path); }

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
   * @param {SVGPathCommander.pathArray | any[] | string} path the source `pathArray`
   * @returns {any} the cloned `pathArray`
   */
  function clonePath(path) {
    return Array.isArray(path) ? path.map(function (x) {
      if (Array.isArray(x)) {
        return clonePath(x);
      }
      return !Number.isNaN(+x) ? +x : x;
    }) : path;
  }

  /**
   * The `PathParser` used by the parser.
   *
   * @param {string} pathString
   */
  function PathParser(pathString) {
    /** @type {SVGPathCommander.pathArray} */
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
    return Array.isArray(path) && path.every(function (seg) {
      var lk = seg[0].toLowerCase();
      return paramsCount[lk] === seg.length - 1 && /[achlmqstvz]/gi.test(lk);
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
      return clonePath(pathInput);
    }

    var path = new PathParser(("" + pathInput)); // TS expects string

    skipSpaces(path);

    while (path.index < path.max && !path.err.length) {
      scanSegment(path);
    }

    if (path.err.length) {
      path.segments = [];
    } else if (path.segments.length) {
      if (!'mM'.includes(path.segments[0][0])) {
        path.err = invalidPathValue + ": missing M/m";
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
    return Array.isArray(path) && isPathArray(path)
      && path.every(function (x) { return x[0] === x[0].toUpperCase(); });
  }

  /**
   * Parses a path string value or object and returns an array
   * of segments, all converted to absolute values.
   *
   * @param {SVGPathCommander.pathArray | string} pathInput the path string | object
   * @returns {SVGPathCommander.pathArray} the resulted `pathArray` with absolute values
   */
  function pathToAbsolute(pathInput) {
    var assign;

    if (isAbsoluteArray(pathInput)) {
      return clonePath(pathInput);
    }

    var path = parsePathString(pathInput);
    var ii = path.length;
    /** @type {SVGPathCommander.pathArray} */
    var resultArray = [];
    var x = 0;
    var y = 0;
    var mx = 0;
    var my = 0;
    var start = 0;

    if (path[0][0] === 'M') {
      // x = path[0][1];
      // y = path[0][2];
      (assign = path[0].slice(1).map(Number), x = assign[0], y = assign[1]);
      mx = x;
      my = y;
      start += 1;
      resultArray.push(['M', x, y]);
    }

    for (var i = start; i < ii; i += 1) {
      var segment = path[i];
      var pathCommand = segment[0];
      var absCommand = pathCommand.toUpperCase();
      /** @type {SVGPathCommander.pathSegment} */
      // @ts-ignore -- trust me
      var absoluteSegment = [];
      /** @type {number[]} */
      var newSeg = [];
      // do not change order,
      // keep this push at this location
      resultArray.push(absoluteSegment);

      if (pathCommand !== absCommand) {
        absoluteSegment[0] = absCommand;

        switch (absCommand) {
          case 'A':
            // newSeg = segment.slice(1, -2).concat([+segment[6] + x, +segment[7] + y]);
            newSeg = segment.slice(1, -2).map(Number).concat( [segment[6] + x], [segment[7] + y]);
            for (var j = 0; j < newSeg.length; j += 1) {
              absoluteSegment.push(newSeg[j]);
            }
            break;
          case 'V':
            absoluteSegment[1] = segment[1] + y;
            break;
          case 'H':
            absoluteSegment[1] = segment[1] + x;
            break;
          default:
            if (absCommand === 'M') {
              mx = segment[1] + x;
              my = segment[2] + y;
            }
            // for is here to stay for eslint
            for (var j$1 = 1; j$1 < segment.length; j$1 += 1) {
              absoluteSegment.push(+segment[j$1] + (j$1 % 2 ? x : y));
            }
        }
      } else {
        for (var j$2 = 0; j$2 < segment.length; j$2 += 1) {
          absoluteSegment.push(segment[j$2]);
        }
      }

      var segLength = absoluteSegment.length;
      switch (absCommand) {
        case 'Z':
          x = mx;
          y = my;
          break;
        case 'H':
          x = +absoluteSegment[1];
          break;
        case 'V':
          y = +absoluteSegment[1];
          break;
        default:
          x = +absoluteSegment[segLength - 2];
          y = +absoluteSegment[segLength - 1];

          if (absCommand === 'M') {
            mx = x;
            my = y;
          }
      }
    }

    return resultArray;
  }

  /**
   * Iterates an array to check if it's a `pathArray`
   * with relative values.
   *
   * @param {string | SVGPathCommander.pathArray} path the `pathArray` to be checked
   * @returns {boolean} iteration result
   */
  function isRelativeArray(path) {
    return Array.isArray(path) && isPathArray(path)
      && path.slice(1).every(function (seg) { return seg[0] === seg[0].toLowerCase(); });
  }

  /**
   * Parses a path string value or object and returns an array
   * of segments, all converted to relative values.
   *
   * @param {string | SVGPathCommander.pathArray} pathInput the path string | object
   * @returns {SVGPathCommander.pathArray} the resulted `pathArray` with relative values
   */
  function pathToRelative(pathInput) {
    if (isRelativeArray(pathInput)) {
      return clonePath(pathInput);
    }

    var path = parsePathString(pathInput);
    var ii = path.length;
    /** @type {SVGPathCommander.pathArray} */
    var resultArray = [];
    var x = 0;
    var y = 0;
    var mx = 0;
    var my = 0;
    var start = 0;

    if (path[0][0] === 'M') {
      x = +path[0][1];
      y = +path[0][2];
      mx = x;
      my = y;
      start += 1;
      resultArray.push(['M', x, y]);
    }

    for (var i = start; i < ii; i += 1) {
      var segment = path[i];
      var pathCommand = segment[0];
      var relativeCommand = pathCommand.toLowerCase();
      /** @type {SVGPathCommander.pathSegment} */
      // @ts-ignore -- trust me DON'T CHANGE
      var relativeSegment = [];
      /** @type {number[]} */
      var newSeg = [];

      // do not change order
      // keep this push at this location
      resultArray.push(relativeSegment);

      if (pathCommand !== relativeCommand) {
        relativeSegment[0] = relativeCommand;
        switch (relativeCommand) {
          case 'a':
            // newSeg = segment.slice(1, -2).concat([+segment[6] - x, +segment[7] - y]);
            newSeg = segment.slice(1, -2).map(Number).concat( [segment[6] - x], [segment[7] - y]);

            for (var j = 0; j < newSeg.length; j += 1) {
              relativeSegment.push(newSeg[j]);
            }
            break;
          case 'v':
            relativeSegment[1] = +segment[1] - y;
            break;
          default:
            // for is here to stay for eslint
            for (var j$1 = 1; j$1 < segment.length; j$1 += 1) {
              relativeSegment.push(+segment[j$1] - (j$1 % 2 ? x : y));
            }

            if (relativeCommand === 'm') {
              mx = +segment[1];
              my = +segment[2];
            }
        }
      } else {
        if (pathCommand === 'm') {
          mx = +segment[1] + x;
          my = +segment[2] + y;
        }
        for (var j$2 = 0; j$2 < segment.length; j$2 += 1) {
          relativeSegment.push(segment[j$2]);
        }
      }

      var segLength = relativeSegment.length;
      switch (relativeSegment[0]) {
        case 'z':
          x = mx;
          y = my;
          break;
        case 'h':
          x += +relativeSegment[segLength - 1];
          break;
        case 'v':
          y += +relativeSegment[segLength - 1];
          break;
        default:
          x += +resultArray[i][segLength - 2];
          y += +resultArray[i][segLength - 1];
      }
    }

    return resultArray;
  }

  /**
   * Rounds the values of a `pathArray` instance to
   * a specified amount of decimals and returns it.
   *
   * @param {SVGPathCommander.pathArray} path the source `pathArray`
   * @param {number | boolean | null} round the amount of decimals to round numbers to
   * @returns {SVGPathCommander.pathArray} the resulted `pathArray` with rounded values
   */
  function roundPath(path, round) {
    var defaultRound = SVGPCO.round;
    var defaultDecimals = SVGPCO.decimals;
    var decimalsOption = round && !Number.isNaN(+round) ? +round
      : defaultRound && defaultDecimals;

    if (round === false || (!defaultRound && !decimalsOption)) { return clonePath(path); }

    var dc = Math.pow( 10, decimalsOption );
    /** @type {SVGPathCommander.pathArray} */
    var result = [];
    var pl = path.length;
    /** @type {SVGPathCommander.pathSegment} */
    var segment;
    /** @type {number} */
    var n = 0;
    var pi = [];

    // FOR works best with TS
    for (var i = 0; i < pl; i += 1) {
      pi = path[i];
      segment = [''];
      for (var j = 0; j < pi.length; j += 1) {
        if (!j) { segment[j] = pi[j]; }
        else {
          n = +pi[j];
          segment.push(!j || n % 1 === 0 ? n : Math.round(n * dc) / dc);
        }
      }
      result.push(segment);
    }
    return result;
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
      .map(function (x) { return x[0] + (x.slice(1).join(' ')); }).join('');
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
      : { x1: x1, y1: y1 };
  }

  /**
   * Normalizes a single segment of a `pathArray` object.
   *
   * @param {SVGPathCommander.pathSegment} segment the segment object
   * @param {any} params the coordinates of the previous segment
   * @param {string} prevCommand the path command of the previous segment
   * @returns {SVGPathCommander.pathSegment} the normalized segment
   */
  function normalizeSegment(segment, params, prevCommand) {
    var px1 = params.x1;
    var py1 = params.y1;
    var px2 = params.x2;
    var py2 = params.y2;
    var pathCommand = segment[0];
    var values = segment.slice(1).map(Number);
    var x = values[0];
    var y = values[1];
    var result = segment;

    if (!'TQ'.includes(segment[0])) {
      // optional but good to be cautious
      params.qx = null;
      params.qy = null;
    }

    if (pathCommand === 'H') {
      result = ['L', segment[1], py1];
    } else if (pathCommand === 'V') {
      result = ['L', px1, segment[1]];
    } else if (pathCommand === 'S') {
      var ref = shorthandToCubic(px1, py1, px2, py2, prevCommand);
      var x1 = ref.x1;
      var y1 = ref.y1;
      params.x1 = x1;
      params.y1 = y1;
      result = ['C', x1, y1 ].concat( values);
    } else if (pathCommand === 'T') {
      var ref$1 = shorthandToQuad(px1, py1, params.qx, params.qy, prevCommand);
      var qx = ref$1.qx;
      var qy = ref$1.qy;
      params.qx = qx;
      params.qy = qy;
      result = ['Q', qx, qy ].concat( values);
    } else if (pathCommand === 'Q') {
      params.qx = x;
      params.qy = y;
    }
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
    return Array.isArray(path) && isPathArray(path) && path.every(function (seg) {
      var lk = seg[0].toLowerCase();
      return paramsCount[lk] === seg.length - 1 && ('ACLMQZ').includes(seg[0]); // achlmqstvz
    });
  }

  /**
   * Normalizes a `path` object for further processing:
   * * convert segments to absolute values
   * * convert shorthand path commands to their non-shorthand notation
   *
   * @param {string | SVGPathCommander.pathArray} pathInput the string to be parsed or 'pathArray'
   * @returns {SVGPathCommander.pathArray} the normalized `pathArray`
   */
  function normalizePath(pathInput) {
    var assign;
   // path|pathString
    if (isNormalizedArray(pathInput)) {
      return clonePath(pathInput);
    }

    var path = pathToAbsolute(pathInput);
    var params = {
      x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
    };
    var allPathCommands = [];
    var ii = path.length;
    var pathCommand = '';
    var prevCommand = '';
    var segment;
    var seglen;

    for (var i = 0; i < ii; i += 1) {
      // save current path command
      (assign = path[i], pathCommand = assign[0]);

      // Save current path command
      allPathCommands[i] = pathCommand;
      // Get previous path command
      if (i) { prevCommand = allPathCommands[i - 1]; }
      // Previous path command is used to normalizeSegment
      path[i] = normalizeSegment(path[i], params, prevCommand);

      segment = path[i];
      seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }

    return path;
  }

  /**
   * Reverses all segments and their values of a `pathArray`
   * and returns a new instance.
   *
   * @param {SVGPathCommander.pathArray} pathInput the source `pathArray`
   * @returns {SVGPathCommander.pathArray} the reversed `pathArray`
   */
  function reversePath(pathInput) {
    var absolutePath = pathToAbsolute(pathInput);
    var isClosed = absolutePath.slice(-1)[0][0] === 'Z';
    var reversedPath = [];

    reversedPath = normalizePath(absolutePath).map(function (segment, i) {
      var values = segment.slice(1).map(Number);
      var ref = values.slice(-2);
      var x = ref[0];
      var y = ref[1];
      return {
        seg: absolutePath[i], // absolute
        n: segment, // normalized
        c: absolutePath[i][0], // pathCommand
        values: values,
        x: x, // x
        y: y, // y
      };
    }).map(function (seg, i, path) {
      var segment = seg.seg;
      var values = seg.values;
      var data = seg.n;
      var prevSeg = i && path[i - 1];
      var nextSeg = path[i + 1] && path[i + 1];
      var pathCommand = seg.c;
      var pLen = path.length;
      var x = i ? path[i - 1].x : path[pLen - 1].x;
      var y = i ? path[i - 1].y : path[pLen - 1].y;
      /** @type {SVGPathCommander.pathSegment} */
      var result = [''];

      switch (pathCommand) {
        case 'M':
          result = isClosed ? ['Z'] : [pathCommand, x, y];
          break;
        case 'A':
          // result = segment.slice(0, -3).concat([(segment[5] === 1 ? 0 : 1), x, y]);
          result = [pathCommand ].concat( values.slice(0, -3), [(segment[5] === 1 ? 0 : 1)], [x], [y]);
          break;
        case 'C':
          if (nextSeg && nextSeg.c === 'S') {
            result = ['S', segment[1], segment[2], x, y];
          } else {
            result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x, y];
          }
          break;
        case 'S':
          if ((prevSeg && 'CS'.includes(prevSeg.c)) && (!nextSeg || (nextSeg && nextSeg.c !== 'S'))) {
            result = ['C', data[3], data[4], data[1], data[2], x, y];
          } else {
            result = [pathCommand, data[1], data[2], x, y];
          }
          break;
        case 'Q':
          if (nextSeg && nextSeg.c === 'T') {
            result = ['T', x, y];
          } else {
            // result = segment.slice(0, -2).concat([x, y]);
            result = [pathCommand ].concat( values.slice(0, -2), [x], [y]);
          }
          break;
        case 'T':
          if ((prevSeg && 'QT'.includes(prevSeg.c)) && (!nextSeg || (nextSeg && nextSeg.c !== 'T'))) {
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
          // result = segment.slice(0, -2).concat([x, y]);
          result = [pathCommand ].concat( values.slice(0, -2), [x], [y]);
      }

      return result;
    });

    return isClosed ? reversedPath.reverse()
      : [reversedPath[0] ].concat( reversedPath.slice(1).reverse());
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
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s; });
  }

  /**
   * Shorten a single segment of a `pathArray` object.
   *
   * @param {SVGPathCommander.pathSegment} segment the segment object
   * @param {any} params the coordinates of the previous segment
   * @param {string} prevCommand the path command of the previous segment
   * @returns {any} the shortened segment
   */
  function shortenSegment(segment, params, prevCommand) {
    var pathCommand = segment[0];
    var values = segment.slice(1);
    var px1 = params.x1;
    var py1 = params.y1;
    var px2 = params.x2;
    var py2 = params.y2;
    var result = segment.slice();
    var ref = segment.slice(-2);
    var x = ref[0];
    var y = ref[1];

    if (!'TQ'.includes(segment[0])) {
      // optional but good to be cautious
      params.qx = null;
      params.qy = null;
    }

    if (pathCommand === 'L') {
      if (px1 === segment[1]) {
        result = ['V', segment[1]];
      } else if (py1 === segment[2]) {
        result = ['H', segment[2]];
      }
      params.x = +x;
      params.y = +y;
    } else if (pathCommand === 'C') {
      var ref$1 = values.slice(-4);
      var x2 = ref$1[0];
      var y2 = ref$1[1];
      var x1 = values[0];
      var y1 = values[1];

      if (['C', 'S'].includes(prevCommand)
        && x1 === px1 * 2 - px2
        && y1 === py1 * 2 - py2) {
        result = ['S', x2, y2, x, y];
      }
      params.x1 = x1;
      params.y1 = y1;
    } else if (pathCommand === 'Q') {
      var nx = values[0];
      var ny = values[1];
      if (['Q', 'T'].includes(prevCommand)
        && nx === px1 * 2 - px2
        && ny === py1 * 2 - py2) {
        result = ['T', x, y];
      }
      params.qx = nx;
      params.qy = ny;
    }
    return result;
  }

  /**
   * Optimizes a `pathArray` object:
   * * convert segments to shorthand if possible
   * * select shortest segments from absolute and relative `pathArray`s
   *
   * @param {string | SVGPathCommander.pathArray} pathInput a string or `pathArray`
   * @param {number | boolean | null} round the amount of decimals to round values to
   * @returns {SVGPathCommander.pathArray} the optimized `pathArray`
   */
  function optimizePath(pathInput, round) {
    var assign;

    var path = pathToAbsolute(pathInput);
    var params = {
      x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
    };
    var allPathCommands = [];
    var ii = path.length;
    var pathCommand = '';
    var prevCommand = '';
    var segment;
    var seglen;

    for (var i = 0; i < ii; i += 1) {
      // save current path command
      (assign = path[i], pathCommand = assign[0]);

      // Save current path command
      allPathCommands[i] = pathCommand;
      // Get previous path command
      if (i) { prevCommand = allPathCommands[i - 1]; }
      // Previous path command is inputted to processSegment
      path[i] = shortenSegment(path[i], params, prevCommand);

      segment = path[i];
      seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }

    var absolutePath = roundPath(pathToAbsolute(path), round);
    var relativePath = roundPath(pathToRelative(path), round);

    return absolutePath.map(function (x, i) {
      if (i) {
        return x.join('').length < relativePath[i].join('').length
          ? x : relativePath[i];
      }
      return x;
    });
  }

  /**
   * A global namespace for epsilon.
   *
   * @type {number}
   */
  var epsilon = 1e-9;

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
    var X = x * Math.cos(rad) - y * Math.sin(rad);
    var Y = x * Math.sin(rad) + y * Math.cos(rad);
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
    var assign;

    var x1 = X1; var y1 = Y1; var rx = RX; var ry = RY; var x2 = X2; var y2 = Y2;
    // for more information of where this Math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    var d120 = (Math.PI * 120) / 180;

    var rad = (Math.PI / 180) * (+angle || 0);
    /** @type {number[]} */
    var res = [];
    var xy;
    var f1;
    var f2;
    var cx;
    var cy;

    if (!recursive) {
      xy = rotateVector(x1, y1, -rad);
      x1 = xy.x;
      y1 = xy.y;
      xy = rotateVector(x2, y2, -rad);
      x2 = xy.x;
      y2 = xy.y;

      var x = (x1 - x2) / 2;
      var y = (y1 - y2) / 2;
      var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx *= h;
        ry *= h;
      }
      var rx2 = rx * rx;
      var ry2 = ry * ry;

      var k = (LAF === SF ? -1 : 1)
              * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
                  / (rx2 * y * y + ry2 * x * x)));

      cx = ((k * rx * y) / ry) + ((x1 + x2) / 2);
      cy = ((k * -ry * x) / rx) + ((y1 + y2) / 2);
      // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
      f1 = (Math.asin((((y1 - cy) / ry))) * (Math.pow( 10, 9 )) >> 0) / (Math.pow( 10, 9 ));
      // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
      f2 = (Math.asin((((y2 - cy) / ry))) * (Math.pow( 10, 9 )) >> 0) / (Math.pow( 10, 9 ));

      f1 = x1 < cx ? Math.PI - f1 : f1;
      f2 = x2 < cx ? Math.PI - f2 : f2;
      if (f1 < 0) { (f1 = Math.PI * 2 + f1); }
      if (f2 < 0) { (f2 = Math.PI * 2 + f2); }
      if (SF && f1 > f2) {
        f1 -= Math.PI * 2;
      }
      if (!SF && f2 > f1) {
        f2 -= Math.PI * 2;
      }
    } else {
      (assign = recursive, f1 = assign[0], f2 = assign[1], cx = assign[2], cy = assign[3]);
    }
    var df = f2 - f1;
    if (Math.abs(df) > d120) {
      var f2old = f2;
      var x2old = x2;
      var y2old = y2;
      f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = arcToCubic(x2, y2, rx, ry, angle, 0, SF, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1);
    var s1 = Math.sin(f1);
    var c2 = Math.cos(f2);
    var s2 = Math.sin(f2);
    var t = Math.tan(df / 4);
    var hx = (4 / 3) * rx * t;
    var hy = (4 / 3) * ry * t;
    var m1 = [x1, y1];
    var m2 = [x1 + hx * s1, y1 - hy * c1];
    var m3 = [x2 + hx * s2, y2 - hy * c2];
    var m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      // return [m2, m3, m4].concat(res);
      return m2.concat( m3, m4, res);
    }
    // res = [m2, m3, m4].concat(res).join().split(',');
    res = m2.concat( m3, m4, res);
    var newres = [];
    for (var i = 0, ii = res.length; i < ii; i += 1) {
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
    var r13 = 1 / 3;
    var r23 = 2 / 3;
    return [
      r13 * x1 + r23 * qx, // cpx1
      r13 * y1 + r23 * qy, // cpy1
      r13 * x2 + r23 * qx, // cpx2
      r13 * y2 + r23 * qy, // cpy2
      x2, y2 ];
  }

  /**
   * Returns the {x,y} coordinates of a point at a
   * given length of a cubic-bezier segment.
   *
   * @param {number} p1x the starting point X
   * @param {number} p1y the starting point Y
   * @param {number} c1x the first control point X
   * @param {number} c1y the first control point Y
   * @param {number} c2x the second control point X
   * @param {number} c2y the second control point Y
   * @param {number} p2x the ending point X
   * @param {number} p2y the ending point Y
   * @param {number} t a [0-1] ratio
   * @returns {{x: number, y: number}} the requested {x,y} coordinates
   */
  function getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
    var t1 = 1 - t;
    return {
      x: (Math.pow( t1, 3 )) * p1x
        + t1 * t1 * 3 * t * c1x
        + t1 * 3 * t * t * c2x
        + (Math.pow( t, 3 )) * p2x,
      y: (Math.pow( t1, 3 )) * p1y
        + t1 * t1 * 3 * t * c1y
        + t1 * 3 * t * t * c2y
        + (Math.pow( t, 3 )) * p2y,
    };
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
    var ax = a[0];
    var ay = a[1]; var bx = b[0];
    var by = b[1];
    return [ax + (bx - ax) * t, ay + (by - ay) * t];
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
    var t = 0.5;
    /** @type {[number, number]} */
    var p0 = [x1, y1];
    /** @type {[number, number]} */
    var p1 = [x2, y2];
    var p2 = midPoint(p0, p1, t);
    var p3 = midPoint(p1, p2, t);
    var p4 = midPoint(p2, p3, t);
    var p5 = midPoint(p3, p4, t);
    var p6 = midPoint(p4, p5, t);
    // const cp1 = getPointAtSegLength.apply(0, p0.concat(p2, p4, p6, t));
    var seg1 = p0.concat( p2, p4, p6, [t]);
    // @ts-ignore
    var cp1 = getPointAtSegLength.apply(void 0, seg1);
    // const cp2 = getPointAtSegLength.apply(0, p6.concat(p5, p3, p1, 0));
    var seg2 = p6.concat( p5, p3, p1, [0]);
    // @ts-ignore
    var cp2 = getPointAtSegLength.apply(void 0, seg2);

    return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2];
  }

  /**
   * Converts any segment to C (cubic-bezier).
   *
   * @param {SVGPathCommander.pathSegment} segment the source segment
   * @param {SVGPathCommander.parserParams} params the source segment parameters
   * @returns {SVGPathCommander.pathSegment} the cubic-bezier segment
   */
  function segmentToCubic(segment, params) {
    if (!'TQ'.includes(segment[0])) {
      params.qx = null;
      params.qy = null;
    }

    var values = segment.slice(1).map(Number);
    var x = values[0];
    var y = values[1];
    var px1 = params.x1;
    var py1 = params.y1;
    var px = params.x;
    var py = params.y;

    switch (segment[0]) {
      case 'M':
        params.x = x;
        params.y = y;
        return segment;
      case 'A':
        // @ts-ignore
        // return ['C'].concat(arcToCubic.apply(0, [px1, py1].concat(segment.slice(1))));
        return ['C' ].concat( arcToCubic.apply(void 0, [ px1, py1 ].concat( values )));
      case 'Q':
        params.qx = x;
        params.qy = y;
        // @ts-ignore
        // return ['C'].concat(quadToCubic.apply(0, [px1, py1].concat(segment.slice(1))));
        return ['C' ].concat( quadToCubic.apply(void 0, [ px1, py1 ].concat( values )));
      case 'L':

        // return ['C'].concat(lineToCubic(px1, py1, x, y));
        return ['C' ].concat( lineToCubic(px1, py1, x, y));
      case 'Z':
        // return ['C'].concat(lineToCubic(px1, py1, px, py));
        return ['C' ].concat( lineToCubic(px1, py1, px, py));
    }
    return segment;
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
      var segment = path[i];
      var ni = i; // ESLint
      while (segment.length) {
        // if created multiple C:s, their original seg is saved
        allPathCommands[i] = 'A';
        // path.splice(i++, 0, ['C'].concat(segment.splice(0, 6)));

        path.splice(ni += 1, 0, ['C' ].concat( segment.splice(0, 6).map(Number)));
      }
      path.splice(i, 1);
    }
  }

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
    var m = new CSSMatrix();
    var a = Array.from(array);

    if (!a.every(function (n) { return !Number.isNaN(n); })) {
      throw TypeError(("CSSMatrix: \"" + array + "\" must only have numbers."));
    }
    if (a.length === 16) {
      var m11 = a[0];
      var m12 = a[1];
      var m13 = a[2];
      var m14 = a[3];
      var m21 = a[4];
      var m22 = a[5];
      var m23 = a[6];
      var m24 = a[7];
      var m31 = a[8];
      var m32 = a[9];
      var m33 = a[10];
      var m34 = a[11];
      var m41 = a[12];
      var m42 = a[13];
      var m43 = a[14];
      var m44 = a[15];

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
      var M11 = a[0];
      var M12 = a[1];
      var M21 = a[2];
      var M22 = a[3];
      var M41 = a[4];
      var M42 = a[5];

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
    var keys = Object.keys(new CSSMatrix());
    if (typeof m === 'object' && keys.every(function (k) { return k in m; })) {
      return fromArray(
        [m.m11, m.m12, m.m13, m.m14,
          m.m21, m.m22, m.m23, m.m24,
          m.m31, m.m32, m.m33, m.m34,
          m.m41, m.m42, m.m43, m.m44]
      );
    }
    throw TypeError(("CSSMatrix: \"" + m + "\" is not a DOMMatrix / CSSMatrix / JSON compatible object."));
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
      throw TypeError(("CSSMatrix: \"" + source + "\" is not a string."));
    }
    var str = String(source).replace(/\s/g, '');
    var m = new CSSMatrix();
    var invalidStringError = "CSSMatrix: invalid transform string \"" + source + "\"";

    // const px = ['perspective'];
    // const length = ['translate', 'translate3d', 'translateX', 'translateY', 'translateZ'];
    // const deg = ['rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY'];
    // const abs = ['scale', 'scale3d', 'matrix', 'matrix3d'];
    // const transformFunctions = px.concat(length, deg, abs);

    str.split(')').filter(function (f) { return f; }).forEach(function (tf) {
      var ref = tf.split('(');
      var prop = ref[0];
      var value = ref[1];

      // invalidate empty string
      if (!value) { throw TypeError(invalidStringError); }

      var components = value.split(',')
        .map(function (n) { return (n.includes('rad') ? parseFloat(n) * (180 / Math.PI) : parseFloat(n)); });

      var x = components[0];
      var y = components[1];
      var z = components[2];
      var a = components[3];
      var xyz = [x, y, z];
      var xyza = [x, y, z, a];

      // single number value expected
      if (prop === 'perspective' && x && [y, z].every(function (n) { return n === undefined; })) {
        m.m34 = -1 / x;
      // 6/16 number values expected
      } else if (prop.includes('matrix') && [6, 16].includes(components.length)
        && components.every(function (n) { return !Number.isNaN(+n); })) {
        var values = components.map(function (n) { return (Math.abs(n) < 1e-6 ? 0 : n); });
        m = m.multiply(fromArray(values));
      // 3 values expected
      } else if (prop === 'translate3d' && xyz.every(function (n) { return !Number.isNaN(+n); })) {
        m = m.translate(x, y, z);
      // single/double number value(s) expected
      } else if (prop === 'translate' && x && z === undefined) {
        m = m.translate(x, y || 0, 0);
      // all 4 values expected
      } else if (prop === 'rotate3d' && xyza.every(function (n) { return !Number.isNaN(+n); }) && a) {
        m = m.rotateAxisAngle(x, y, z, a);
      // single value expected
      } else if (prop === 'rotate' && x && [y, z].every(function (n) { return n === undefined; })) {
        m = m.rotate(0, 0, x);
      // 4 values expected
      } else if (prop === 'scale3d' && xyz.every(function (n) { return !Number.isNaN(+n); }) && xyz.some(function (n) { return n !== 1; })) {
        m = m.scale(x, y, z);
      // single value expected
      } else if (prop === 'scale' && !Number.isNaN(x) && x !== 1 && z === undefined) {
        var nosy = Number.isNaN(+y);
        var sy = nosy ? x : y;
        m = m.scale(x, sy, 1);
      // single/double value expected
      } else if (prop === 'skew' && x && z === undefined) {
        m = m.skewX(x);
        m = y ? m.skewY(y) : m;
      } else if (/[XYZ]/.test(prop) && x && [y, z].every(function (n) { return n === undefined; }) // a single value expected
        && ['translate', 'rotate', 'scale', 'skew'].some(function (p) { return prop.includes(p); })) {
        if (['skewX', 'skewY'].includes(prop)) {
          // @ts-ignore unfortunately
          m = m[prop](x);
        } else {
          var fn = prop.replace(/[XYZ]/, '');
          var axis = prop.replace(fn, '');
          var idx = ['X', 'Y', 'Z'].indexOf(axis);
          var axeValues = [
            idx === 0 ? x : 0,
            idx === 1 ? x : 0,
            idx === 2 ? x : 0];
          // @ts-ignore unfortunately
          m = m[fn].apply(m, axeValues);
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
    var m = new CSSMatrix();
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
    var m = new CSSMatrix();
    var degToRad = Math.PI / 180;
    var radX = rx * degToRad;
    var radY = ry * degToRad;
    var radZ = rz * degToRad;

    // minus sin() because of right-handed system
    var cosx = Math.cos(radX);
    var sinx = -Math.sin(radX);
    var cosy = Math.cos(radY);
    var siny = -Math.sin(radY);
    var cosz = Math.cos(radZ);
    var sinz = -Math.sin(radZ);

    var m11 = cosy * cosz;
    var m12 = -cosy * sinz;

    m.m11 = m11;
    m.a = m11;

    m.m12 = m12;
    m.b = m12;

    m.m13 = siny;

    var m21 = sinx * siny * cosz + cosx * sinz;
    m.m21 = m21;
    m.c = m21;

    var m22 = cosx * cosz - sinx * siny * sinz;
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
    var m = new CSSMatrix();
    var angle = alpha * (Math.PI / 360);
    var sinA = Math.sin(angle);
    var cosA = Math.cos(angle);
    var sinA2 = sinA * sinA;
    var length = Math.sqrt(x * x + y * y + z * z);
    var X = x;
    var Y = y;
    var Z = z;

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

    var x2 = X * X;
    var y2 = Y * Y;
    var z2 = Z * Z;

    var m11 = 1 - 2 * (y2 + z2) * sinA2;
    m.m11 = m11;
    m.a = m11;

    var m12 = 2 * (X * Y * sinA2 + Z * sinA * cosA);
    m.m12 = m12;
    m.b = m12;

    m.m13 = 2 * (X * Z * sinA2 - Y * sinA * cosA);

    var m21 = 2 * (Y * X * sinA2 - Z * sinA * cosA);
    m.m21 = m21;
    m.c = m21;

    var m22 = 1 - 2 * (z2 + x2) * sinA2;
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
    var m = new CSSMatrix();
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
    var m = new CSSMatrix();
    var radA = (angle * Math.PI) / 180;
    var t = Math.tan(radA);
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
    var m = new CSSMatrix();
    var radA = (angle * Math.PI) / 180;
    var t = Math.tan(radA);
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
    var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41;
    var m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42;
    var m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43;
    var m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44;

    var m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41;
    var m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42;
    var m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43;
    var m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44;

    var m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41;
    var m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42;
    var m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43;
    var m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44;

    var m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41;
    var m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42;
    var m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43;
    var m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;

    return fromArray(
      [m11, m12, m13, m14,
        m21, m22, m23, m24,
        m31, m32, m33, m34,
        m41, m42, m43, m44]
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

  var CSSMatrix = function CSSMatrix() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var m = this;
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
      var ARGS = [16, 6].some(function (l) { return l === args.length; }) ? args : args[0];

      return m.setMatrixValue(ARGS);
    }
    return m;
  };

  var prototypeAccessors = { isIdentity: { configurable: true },is2D: { configurable: true } };

  /**
   * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
   *
   * @param {boolean} value sets a new flag for this property
   */
  prototypeAccessors.isIdentity.set = function (value) {
    this.isIdentity = value;
  };

  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return {boolean} the current property value
   */
  prototypeAccessors.isIdentity.get = function () {
    var m = this;
    return (m.m11 === 1 && m.m12 === 0 && m.m13 === 0 && m.m14 === 0
            && m.m21 === 0 && m.m22 === 1 && m.m23 === 0 && m.m24 === 0
            && m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0
            && m.m41 === 0 && m.m42 === 0 && m.m43 === 0 && m.m44 === 1);
  };

  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return {boolean} the current property value
   */
  prototypeAccessors.is2D.get = function () {
    var m = this;
    return (m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0 && m.m43 === 0 && m.m44 === 1);
  };

  /**
   * Sets a new `Boolean` flag value for `this.is2D` matrix property.
   *
   * @param {boolean} value sets a new flag for this property
   */
  prototypeAccessors.is2D.set = function (value) {
    this.is2D = value;
  };

  /**
   * The `setMatrixValue` method replaces the existing matrix with one computed
   * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
   *
   * The method accepts any *Array* values, the result of
   * `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
   *or `CSSMatrix` instance method `toArray()`.
   *
   * This method expects valid *matrix()* / *matrix3d()* string values, as well
   * as other transform functions like *translateX(10px)*.
   *
   * @param {string | number[] | CSSMatrix | DOMMatrix} source
   * @return {CSSMatrix} the matrix instance
   */
  CSSMatrix.prototype.setMatrixValue = function setMatrixValue (source) {
    var m = this;

    // [Arguments list | Array] come here
    if ([Array, Float64Array, Float32Array].some(function (a) { return source instanceof a; })) {
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
  };

  /**
   * Returns an *Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` property.
   *
   * @return {number[]} an *Array* representation of the matrix
   */
  CSSMatrix.prototype.toArray = function toArray () {
    var m = this;
    var pow = (Math.pow( 10, 6 ));
    var result;

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
    return result.map(function (n) { return (Math.abs(n) < 1e-6 ? 0 : ((n * pow) >> 0) / pow); });
  };

  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
   * using the appropriate `CSS` matrix notation.
   *
   * matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
   * matrix *matrix(a, b, c, d, e, f)*
   *
   * @return {string} a string representation of the matrix
   */
  CSSMatrix.prototype.toString = function toString () {
    var m = this;
    var values = m.toArray();
    var type = m.is2D ? 'matrix' : 'matrix3d';
    return (type + "(" + values + ")");
  };

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
  CSSMatrix.prototype.toJSON = function toJSON () {
    var m = this;
    var is2D = m.is2D;
      var isIdentity = m.isIdentity;
    return Object.assign({}, m, {is2D: is2D, isIdentity: isIdentity});
  };

  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param {CSSMatrix | DOMMatrix | CSSMatrix.JSONMatrix} m2 CSSMatrix
   * @return {CSSMatrix} The resulted matrix.
   */
  CSSMatrix.prototype.multiply = function multiply (m2) {
    return Multiply(this, m2);
  };

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
  CSSMatrix.prototype.translate = function translate (x, y, z) {
    var X = x;
    var Y = y;
    var Z = z;
    if (Z === undefined) { Z = 0; }
    if (Y === undefined) { Y = 0; }
    return Multiply(this, Translate(X, Y, Z));
  };

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
  CSSMatrix.prototype.scale = function scale (x, y, z) {
    var X = x;
    var Y = y;
    var Z = z;
    if (Y === undefined) { Y = x; }
    if (Z === undefined) { Z = 1; } // Z must be 1 if undefined

    return Multiply(this, Scale(X, Y, Z));
  };

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
  CSSMatrix.prototype.rotate = function rotate (rx, ry, rz) {
    var RX = rx;
    var RY = ry;
    var RZ = rz;
    if (RY === undefined) { RY = 0; }
    if (RZ === undefined) { RZ = RX; RX = 0; }
    return Multiply(this, Rotate(RX, RY, RZ));
  };

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
  CSSMatrix.prototype.rotateAxisAngle = function rotateAxisAngle (x, y, z, angle) {
    if ([x, y, z, angle].some(function (n) { return Number.isNaN(n); })) {
      throw new TypeError('CSSMatrix: expecting 4 values');
    }
    return Multiply(this, RotateAxisAngle(x, y, z, angle));
  };

  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The resulted matrix
   */
  CSSMatrix.prototype.skewX = function skewX (angle) {
    return Multiply(this, SkewX(angle));
  };

  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The resulted matrix
   */
  CSSMatrix.prototype.skewY = function skewY (angle) {
    return Multiply(this, SkewY(angle));
  };

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
  CSSMatrix.prototype.transformPoint = function transformPoint (v) {
    var M = this;
    var m = Translate(v.x, v.y, v.z);

    m.m44 = v.w || 1;
    m = M.multiply(m);

    return {
      x: m.m41,
      y: m.m42,
      z: m.m43,
      w: m.m44,
    };
  };

  /**
   * Transforms a specified vector using the matrix, returning a new
   * {x,y,z,w} Tuple *Object* comprising the transformed vector.
   * Neither the matrix nor the original vector are altered.
   *
   * @param {CSSMatrix.PointTuple} t Tuple with `{x,y,z,w}` components
   * @return {CSSMatrix.PointTuple} the resulting Tuple
   */
  CSSMatrix.prototype.transform = function transform (t) {
    var m = this;
    var x = m.m11 * t.x + m.m12 * t.y + m.m13 * t.z + m.m14 * t.w;
    var y = m.m21 * t.x + m.m22 * t.y + m.m23 * t.z + m.m24 * t.w;
    var z = m.m31 * t.x + m.m32 * t.y + m.m33 * t.z + m.m34 * t.w;
    var w = m.m41 * t.x + m.m42 * t.y + m.m43 * t.z + m.m44 * t.w;

    return {
      x: x / w,
      y: y / w,
      z: z / w,
      w: w,
    };
  };

  Object.defineProperties( CSSMatrix.prototype, prototypeAccessors );

  // Add Transform Functions to CSSMatrix object
  // without creating a TypeScript namespace.
  Object.assign(CSSMatrix, {
    Translate: Translate,
    Rotate: Rotate,
    RotateAxisAngle: RotateAxisAngle,
    Scale: Scale,
    SkewX: SkewX,
    SkewY: SkewY,
    Multiply: Multiply,
    fromArray: fromArray,
    fromMatrix: fromMatrix,
    fromString: fromString,
  });

  /**
   * Returns a transformation matrix to apply to `<path>` elements.
   *
   * @see SVGPathCommander.transformObject
   *
   * @param {any} transform the `transformObject`
   * @returns {CSSMatrix} a new transformation matrix
   */
  function getSVGMatrix(transform) {
    var matrix = new CSSMatrix();
    var origin = transform.origin;
    var originX = origin[0];
    var originY = origin[1];
    var translate = transform.translate;
    var rotate = transform.rotate;
    var skew = transform.skew;
    var scale = transform.scale;

    if (rotate || skew || scale) {
      // set SVG transform-origin, always defined
      matrix = matrix.translate(originX, originY);

      // set rotation
      if (Array.isArray(rotate) && rotate.every(function (x) { return !Number.isNaN(+x); })
        && rotate.some(function (x) { return x !== 0; })) {
        matrix = matrix.rotate(rotate[0], rotate[1], rotate[2]);
      } else if (!Number.isNaN(+rotate)) {
        matrix = matrix.rotate(0, 0, rotate);
      }

      // set skew(s)
      if (Array.isArray(skew) && skew.every(function (x) { return !Number.isNaN(+x); })
        && skew.some(function (x) { return x !== 0; })) {
        matrix = skew[0] ? matrix.skewX(skew[0]) : matrix;
        matrix = skew[1] ? matrix.skewY(skew[1]) : matrix;
      } else if (!Number.isNaN(+skew)) {
        matrix = matrix.skewX(skew || 0);
      }

      // set scale
      if (Array.isArray(scale) && scale.every(function (x) { return !Number.isNaN(+x); })
        && scale.some(function (x) { return x !== 1; })) {
        matrix = matrix.scale(scale[0], scale[1], scale[2]);
      } else if (!Number.isNaN(+scale)) {
        matrix = matrix.scale(scale || 1, scale || 1, scale || 1);
      }
      // set SVG transform-origin
      matrix = matrix.translate(-originX, -originY);
    }

    // set translate
    if (Array.isArray(translate) && translate.every(function (x) { return !Number.isNaN(+x); })
      && translate.some(function (x) { return x !== 0; })) {
      matrix = matrix.translate(translate[0] || 0, translate[1] || 0, translate[2] || 0);
    } else if (!Number.isNaN(+translate)) {
      matrix = matrix.translate(translate || 0, 0, 0);
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
    var c = Math.cos((ax * Math.PI) / 180);
    var s = Math.sin((ax * Math.PI) / 180);
    var ma = [
      rx * (m[0] * c + m[2] * s),
      rx * (m[1] * c + m[3] * s),
      ry * (-m[0] * s + m[2] * c),
      ry * (-m[1] * s + m[3] * c) ];

    // ma * transpose(ma) = [ J L ]
    //                      [ L K ]
    // L is calculated later (if the image is not a circle)
    var J = ma[0] * ma[0] + ma[2] * ma[2];
    var K = ma[1] * ma[1] + ma[3] * ma[3];

    // the discriminant of the characteristic polynomial of ma * transpose(ma)
    var D = ((ma[0] - ma[3]) * (ma[0] - ma[3]) + (ma[2] + ma[1]) * (ma[2] + ma[1]))
            * ((ma[0] + ma[3]) * (ma[0] + ma[3]) + (ma[2] - ma[1]) * (ma[2] - ma[1]));

    // the "mean eigenvalue"
    var JK = (J + K) / 2;

    // check if the image is (almost) a circle
    if (D < epsilon * JK) {
      // if it is
      var rxy = Math.sqrt(JK);

      return { rx: rxy, ry: rxy, ax: 0 };
    }

    // if it is not a circle
    var L = ma[0] * ma[1] + ma[2] * ma[3];

    D = Math.sqrt(D);

    // {l1,l2} = the two eigen values of ma * transpose(ma)
    var l1 = JK + D / 2;
    var l2 = JK - D / 2;
    // the x - axis - rotation angle is the argument of the l1 - eigenvector
    var AX = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ? 90
      : Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L
        : ((L / (l1 - K))) * 180) / Math.PI;
    var RX;
    var RY;

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
    var originX = origin[0];
    var originY = origin[1];
    var originZ = origin[2];
    var point3D = m.transformPoint({
      x: point2D[0], y: point2D[1], z: 0, w: 1,
    });

    var relativePositionX = point3D.x - originX;
    var relativePositionY = point3D.y - originY;
    var relativePositionZ = point3D.z - originZ;

    return [
      relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX,
      relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY ];
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
    var assign;

    var x = 0; var y = 0; var i; var j; var ii; var jj; var lx; var ly; var te;
    var absolutePath = pathToAbsolute(path);
    var normalizedPath = normalizePath(absolutePath);
    var matrixInstance = getSVGMatrix(transform);
    var transformProps = Object.keys(transform);
    var origin = transform.origin;
    var a = matrixInstance.a;
    var b = matrixInstance.b;
    var c = matrixInstance.c;
    var d = matrixInstance.d;
    var e = matrixInstance.e;
    var f = matrixInstance.f;
    var matrix2d = [a, b, c, d, e, f];
    var params = {
      x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
    };
    /** @ts-ignore */
    /** @type {SVGPathCommander.pathSegment} */
    var segment = [''];
    var seglen = 0;
    var pathCommand = '';
    /** @type {SVGPathCommander.pathTransformList[]} */
    var transformedPath = [];
    var allPathCommands = []; // needed for arc to curve transformation

    if (!matrixInstance.isIdentity) {
      for (i = 0, ii = absolutePath.length; i < ii; i += 1) {
        segment = absolutePath[i];

        if (absolutePath[i]) { (assign = segment, pathCommand = assign[0]); }

        // REPLACE Arc path commands with Cubic Beziers
        // we don't have any scripting know-how on 3d ellipse transformation
        /// ////////////////////////////////////////
        allPathCommands[i] = pathCommand;

        // Arcs don't work very well with 3D transformations or skews
        if (pathCommand === 'A' && (!matrixInstance.is2D
          || !['skewX', 'skewY'].find(function (p) { return transformProps.includes(p); }))) {
          segment = segmentToCubic(normalizedPath[i], params);

          absolutePath[i] = segmentToCubic(normalizedPath[i], params);
          fixArc(absolutePath, allPathCommands, i);

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
        var result = {
          s: absolutePath[i], c: absolutePath[i][0], x: params.x1, y: params.y1,
        };

        transformedPath = transformedPath.concat( [result]);
      }

      return transformedPath.map(function (seg) {
        var assign, assign$1, assign$2;

        pathCommand = seg.c;
        segment = seg.s;
        switch (pathCommand) {
          case 'A': // only apply to 2D transformations
            te = transformEllipse(matrix2d, +segment[1], +segment[2], +segment[3]);

            if (matrix2d[0] * matrix2d[3] - matrix2d[1] * matrix2d[2] < 0) {
              segment[5] = +segment[5] ? 0 : 1;
            }

            (assign = projection2d(matrixInstance, [+segment[6], +segment[7]], origin), lx = assign[0], ly = assign[1]);

            if ((x === lx && y === ly) || (te.rx < epsilon * te.ry) || (te.ry < epsilon * te.rx)) {
              segment = ['L', lx, ly];
            } else {
              segment = [pathCommand, te.rx, te.ry, te.ax, segment[4], segment[5], lx, ly];
            }

            x = lx; y = ly;
            return segment;

          case 'L':
          case 'H':
          case 'V':
            (assign$1 = projection2d(matrixInstance, [seg.x, seg.y], origin), lx = assign$1[0], ly = assign$1[1]);

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
              (assign$2 = projection2d(matrixInstance, [+segment[j], +segment[j + 1]], origin), x = assign$2[0], y = assign$2[1]);
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
   * Returns the cubic-bezier segment length.
   *
   * @param {number} p1x the starting point X
   * @param {number} p1y the starting point Y
   * @param {number} c1x the first control point X
   * @param {number} c1y the first control point Y
   * @param {number} c2x the second control point X
   * @param {number} c2y the second control point Y
   * @param {number} p2x the ending point X
   * @param {number} p2y the ending point Y
   * @returns {SVGPathCommander.segmentLimits} the length of the cubic-bezier segment
   */
  function getCubicSize(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
    var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x);
    var b = 2 * (c1x - p1x) - 2 * (c2x - c1x);
    var c = p1x - c1x;
    var t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    var t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    var y = [p1y, p2y];
    var x = [p1x, p2x];
    var dot;
    // @ts-ignore
    if (Math.abs(t1) > '1e12') { t1 = 0.5; }
    // @ts-ignore
    if (Math.abs(t2) > '1e12') { t2 = 0.5; }

    if (t1 > 0 && t1 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
      x.push(dot.x);
      y.push(dot.y);
    }
    if (t2 > 0 && t2 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
      x.push(dot.x);
      y.push(dot.y);
    }
    a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
    b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
    c = p1y - c1y;
    t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    // @ts-ignore
    if (Math.abs(t1) > '1e12') { t1 = 0.5; }
    // @ts-ignore
    if (Math.abs(t2) > '1e12') { t2 = 0.5; }

    if (t1 > 0 && t1 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
      x.push(dot.x);
      y.push(dot.y);
    }
    if (t2 > 0 && t2 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
      x.push(dot.x);
      y.push(dot.y);
    }
    return {
      min: { x: Math.min.apply(0, x), y: Math.min.apply(0, y) },
      max: { x: Math.max.apply(0, x), y: Math.max.apply(0, y) },
    };
  }

  /**
   * Iterates an array to check if it's a `pathArray`
   * with all C (cubic bezier) segments.
   *
   * @param {string | SVGPathCommander.pathArray} path the `Array` to be checked
   * @returns {boolean} iteration result
   */
  function isCurveArray(path) {
    return Array.isArray(path) && isPathArray(path)
      && path.slice(1).every(function (seg) { return seg[0] === 'C'; });
  }

  /**
   * Parses a path string value or 'pathArray' and returns a new one
   * in which all segments are converted to cubic-bezier.
   *
   * @param {string | SVGPathCommander.pathArray} pathInput the string to be parsed or object
   * @returns {SVGPathCommander.pathArray} the resulted `pathArray` converted to cubic-bezier
   */
  function pathToCurve(pathInput) {
    var assign;

    if (isCurveArray(pathInput)) {
      return clonePath(pathInput);
    }

    var path = normalizePath(pathInput);
    var params = {
      x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
    };
    var allPathCommands = [];
    var pathCommand = ''; // ts-lint
    var ii = path.length;

    for (var i = 0; i < ii; i += 1) {
      var segment = path[i];
      var seglen = segment.length;
      if (segment) { (assign = segment, pathCommand = assign[0]); }
      allPathCommands[i] = pathCommand;
      path[i] = segmentToCubic(segment, params);

      fixArc(path, allPathCommands, i);
      ii = path.length; // solves curveArrays ending in Z

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }

    return path;
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
        x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0, cx: 0, cy: 0,
      };
    }
    var pathCurve = pathToCurve(path);

    var x = 0; var y = 0;
    /** @type {number[]} */
    var X = [];
    /** @type {number[]} */
    var Y = [];

    pathCurve.forEach(function (segment) {
      var ref = segment.slice(-2).map(Number);
      var s1 = ref[0];
      var s2 = ref[1];
      if (segment[0] === 'M') {
        x = s1;
        y = s2;
        X.push(s1);
        Y.push(s2);
      } else {
        // const dim = getCubicSize.apply(0, [x, y].concat(segment.slice(1)));
        // @ts-ignore -- this should be fine
        var dim = getCubicSize.apply(void 0, [ x, y ].concat( segment.slice(1).map(Number) ));

        // X = X.concat(dim.min.x, dim.max.x);
        X = X.concat( [dim.min.x], [dim.max.x]);

        // Y = Y.concat(dim.min.y, dim.max.y);
        Y = Y.concat( [dim.min.y], [dim.max.y]);
        x = s1;
        y = s2;
      }
    });

    // @ts-ignore
    var xTop = Math.min.apply(0, X);
    // @ts-ignore
    var yTop = Math.min.apply(0, Y);
    // @ts-ignore
    var xBot = Math.max.apply(0, X);
    // @ts-ignore
    var yBot = Math.max.apply(0, Y);
    var width = xBot - xTop;
    var height = yBot - yTop;

    return {
      width: width,
      height: height,
      x: xTop,
      y: yTop,
      x2: xBot,
      y2: yBot,
      cx: xTop + width / 2,
      cy: yTop + height / 2,
    };
  }

  /**
   * Returns the area of a single segment shape.
   *
   * http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
   *
   * @param {number} x0 the starting point X
   * @param {number} y0 the starting point Y
   * @param {number} x1 the first control point X
   * @param {number} y1 the first control point Y
   * @param {number} x2 the second control point X
   * @param {number} y2 the second control point Y
   * @param {number} x3 the ending point X
   * @param {number} y3 the ending point Y
   * @returns {number} the area of the cubic-bezier segment
   */
  function getCubicSegArea(x0, y0, x1, y1, x2, y2, x3, y3) {
    return (3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
             + (y1 * (x0 - x2)) - (x1 * (y0 - y2))
             + (y3 * (x2 + x0 / 3)) - (x3 * (y2 + y0 / 3)))) / 20;
  }

  /**
   * Returns the area of a shape.
   * @author Jürg Lehni & Jonathan Puckey
   *
   * => https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
   *
   * @param {SVGPathCommander.pathArray} path the shape `pathArray`
   * @returns {number} the length of the cubic-bezier segment
   */
  function getPathArea(path) {
    var x = 0; var y = 0;
    var mx = 0; var my = 0;
    var len = 0;
    return pathToCurve(path).map(function (seg) {
      var assign;

      switch (seg[0]) {
        case 'M':
        case 'Z':
          mx = seg[0] === 'M' ? seg[1] : mx; my = seg[0] === 'M' ? seg[2] : my;
          x = mx;
          y = my;
          return 0;
        default:
          // len = getCubicSegArea.apply(0, [x, y].concat(seg.slice(1)));
          // @ts-ignore
          len = getCubicSegArea.apply(void 0, [ x, y ].concat( seg.slice(1).map(Number) ));

          (assign = seg.slice(-2).map(Number), x = assign[0], y = assign[1]);
          return len;
      }
    }).reduce(function (a, b) { return a + b; }, 0);
  }

  /**
   * @param {number} p1
   * @param {number} p2
   * @param {number} p3
   * @param {number} p4
   * @param {number} t a [0-1] ratio
   * @returns {number}
   */
  function base3(p1, p2, p3, p4, t) {
    var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
    var t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
    return t * t2 - 3 * p1 + 3 * p2;
  }

  /**
   * Returns the C (cubic-bezier) segment length.
   *
   * @param {number} x1 the starting point X
   * @param {number} y1 the starting point Y
   * @param {number} x2 the first control point X
   * @param {number} y2 the first control point Y
   * @param {number} x3 the second control point X
   * @param {number} y3 the second control point Y
   * @param {number} x4 the ending point X
   * @param {number} y4 the ending point Y
   * @param {number} z a [0-1] ratio
   * @returns {number} the cubic-bezier segment length
   */
  function getSegCubicLength(x1, y1, x2, y2, x3, y3, x4, y4, z) {
    var Z = z;
    if (z === null || Number.isNaN(+z)) { Z = 1; }

    // Z = Z > 1 ? 1 : Z < 0 ? 0 : Z;
    if (Z > 1) { Z = 1; }
    if (Z < 0) { Z = 0; }

    var z2 = Z / 2; var ct = 0; var xbase = 0; var ybase = 0; var sum = 0;
    var Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678,
      -0.5873, 0.5873, -0.7699, 0.7699,
      -0.9041, 0.9041, -0.9816, 0.9816];
    var Cvalues = [0.2491, 0.2491, 0.2335, 0.2335,
      0.2032, 0.2032, 0.1601, 0.1601,
      0.1069, 0.1069, 0.0472, 0.0472];

    Tvalues.forEach(function (T, i) {
      ct = z2 * T + z2;
      xbase = base3(x1, x2, x3, x4, ct);
      ybase = base3(y1, y2, y3, y4, ct);
      sum += Cvalues[i] * Math.sqrt(xbase * xbase + ybase * ybase);
    });
    return z2 * sum;
  }

  /**
   * Returns the shape total length,
   * or the equivalent to `shape.getTotalLength()`
   * pathToCurve version
   *
   * @param {SVGPathCommander.pathArray} path the ending point Y
   * @returns {number} the shape total length
   */
  function getPathLength(path) {
    var totalLength = 0;
    pathToCurve(path).forEach(function (s, i, curveArray) {
      var args = s[0] !== 'M' ? curveArray[i - 1].slice(-2).concat( s.slice(1)) : [];
      totalLength += s[0] === 'M' ? 0
        // : getSegCubicLength.apply(0, curveArray[i - 1].slice(-2).concat(s.slice(1)));
        // @ts-ignore
        : getSegCubicLength.apply(void 0, args);
    });
    return totalLength;
  }

  /**
   * Check if a path is drawn clockwise and returns true if so,
   * false otherwise.
   *
   * @param {string | SVGPathCommander.pathArray} path the path string or `pathArray`
   * @returns {boolean} true when clockwise or false if not
   */
  function getDrawDirection(path) {
    return getPathArea(pathToCurve(path)) >= 0;
  }

  /**
   * Returns [x,y] coordinates of a point at a given length of a shape.
   *
   * @param {string | SVGPathCommander.pathArray} path the `pathArray` to look into
   * @param {number} length the length of the shape to look at
   * @returns {number[]} the requested [x,y] coordinates
   */
  function getPointAtLength(path, length) {
    var totalLength = 0;
    var segLen;
    var data;
    var result;
    // @ts-ignore
    return pathToCurve(path).map(function (seg, i, curveArray) {
      // data = i ? curveArray[i - 1].slice(-2).concat(seg.slice(1)) : seg.slice(1);
      data = i ? curveArray[i - 1].slice(-2).concat( seg.slice(1)) : seg.slice(1);
      // @ts-ignore
      segLen = i ? getSegCubicLength.apply(void 0, data) : 0;
      totalLength += segLen;

      if (i === 0) {
        result = { x: data[0], y: data[1] };
      } else if (totalLength > length && length > totalLength - segLen) {
        // result = getPointAtSegLength.apply(0, data.concat(1 - (totalLength - length) / segLen));
        var args = data.concat( [1 - (totalLength - length) / segLen]);
        // @ts-ignore
        result = getPointAtSegLength.apply(void 0, args);
      } else {
        result = null;
      }

      return result;
    }).filter(function (x) { return x; }).slice(-1)[0]; // isolate last segment
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

    var path = new PathParser(pathString);

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
  var shapeParams = {
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
    var x1 = attr.x1;
    var y1 = attr.y1;
    var x2 = attr.x2;
    var y2 = attr.y2;
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
    var pathArray = [];
    var points = attr.points.split(/[\s|,]/).map(Number);

    var index = 0;
    while (index < points.length) {
      pathArray.push([(index ? 'L' : 'M'), (points[index]), (points[index + 1])]);
      index += 2;
    }

    return attr.type === 'polygon' ? pathArray.concat( [['z']]) : pathArray;
  }

  /**
   * Returns a new `pathArray` from circle attributes.
   *
   * @param {SVGPathCommander.circleAttr} attr shape configuration
   * @return {SVGPathCommander.pathArray} a circle `pathArray`
   */
  function getCirclePath(attr) {
    var cx = attr.cx;
    var cy = attr.cy;
    var r = attr.r;

    return [
      ['M', (cx - r), cy],
      ['a', r, r, 0, 1, 0, (2 * r), 0],
      ['a', r, r, 0, 1, 0, (-2 * r), 0] ];
  }

  /**
   * Returns a new `pathArray` from ellipse attributes.
   *
   * @param {SVGPathCommander.ellipseAttr} attr shape configuration
   * @return {SVGPathCommander.pathArray} an ellipse `pathArray`
   */
  function getEllipsePath(attr) {
    var cx = attr.cx;
    var cy = attr.cy;
    var rx = attr.rx;
    var ry = attr.ry;

    return [
      ['M', (cx - rx), cy],
      ['a', rx, ry, 0, 1, 0, (2 * rx), 0],
      ['a', rx, ry, 0, 1, 0, (-2 * rx), 0] ];
  }

  /**
   * Returns a new `pathArray` like from rect attributes.
   *
   * @param {SVGPathCommander.rectAttr} attr object with properties above
   * @return {SVGPathCommander.pathArray} a new `pathArray` from `<rect>` attributes
   */
  function getRectanglePath(attr) {
    var x = +attr.x || 0;
    var y = +attr.y || 0;
    var w = +attr.width;
    var h = +attr.height;
    var rx = +attr.rx;
    var ry = +attr.ry;

    // Validity checks from http://www.w3.org/TR/SVG/shapes.html#RectElement:
    if (rx || ry) {
      rx = !rx ? ry : rx;
      ry = !ry ? rx : ry;

      if (rx * 2 > w) { rx -= (rx * 2 - w) / 2; }
      if (ry * 2 > h) { ry -= (ry * 2 - h) / 2; }

      return [
        ['M', x + rx, y],
        ['h', w - rx * 2],
        ['s', rx, 0, rx, ry],
        ['v', h - ry * 2],
        ['s', 0, ry, -rx, ry],
        ['h', -w + rx * 2],
        ['s', -rx, 0, -rx, -ry],
        ['v', -h + ry * 2],
        ['s', 0, -ry, rx, -ry] ];
    }

    return [
      ['M', x, y],
      ['h', w],
      ['v', h],
      ['H', x],
      ['Z'] ];
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
   * @param {boolean} replace option to replace target
   * @return {SVGPathElement | boolean} the newly created `<path>` element
   */
  function shapeToPath(element, replace) {
    var supportedShapes = Object.keys(shapeParams);
    var isElement = element instanceof Element;

    if (isElement && !supportedShapes.some(function (s) { return element.tagName === s; })) {
      throw TypeError(("shapeToPath: \"" + element + "\" is not SVGElement"));
    }

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    /** @type {string} */
    var type = isElement ? element.tagName : element.type;
    /** @type {any} disables TS checking for something that's specific to shape */
    var config = {};
    config.type = type;

    if (isElement) {
      var shapeAttrs = shapeParams[type];
      shapeAttrs.forEach(function (p) { config[p] = element.getAttribute(p); });
      // set no-specific shape attributes: fill, stroke, etc
      Object.values(element.attributes).forEach(function (ref) {
        var name = ref.name;
        var value = ref.value;

        if (!shapeAttrs.includes(name)) { path.setAttribute(name, value); }
      });
    } else {
      Object.assign(config, element);
    }

    // set d
    var description;
    var round = SVGPCO.round;
    var decimals = SVGPCO.decimals;
    var rounding = round && decimals ? decimals : null;

    if (type === 'circle') { description = pathToString(getCirclePath(config), rounding); }
    else if (type === 'ellipse') { description = pathToString(getEllipsePath(config), rounding); }
    else if (['polyline', 'polygon'].includes(type)) { description = pathToString(getPolyPath(config), rounding); }
    else if (type === 'rect') { description = pathToString(getRectanglePath(config), rounding); }
    else if (type === 'line') { description = pathToString(getLinePath(config), rounding); }
    else if (type === 'glyph') { description = isElement ? element.getAttribute('d') : element.type; }

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
   * @param {SVGPathCommander.pathArray} path the source `pathArray`
   * @returns {SVGPathCommander.pathArray} the reversed `pathArray`
   */
  function reverseCurve(path) {
    var rotatedCurve = path.slice(1)
      .map(function (x, i, curveOnly) { return (!i
        ? path[0].slice(1).concat( x.slice(1))
        : curveOnly[i - 1].slice(-2).concat( x.slice(1))); })
      .map(function (x) { return x.map(function (_, i) { return x[x.length - i - 2 * (1 - (i % 2))]; }); })
      .reverse();

    return [['M' ].concat( rotatedCurve[0].slice(0, 2).map(Number)) ].concat( rotatedCurve.map(function (x) { return ['C' ].concat( x.slice(2).map(Number)); }));
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
    var pathArray = parsePathString(pathInput);
    var absoluteArray = pathToAbsolute(pathArray);
    var length = pathArray.length;
    var isClosed = absoluteArray.slice(-1)[0][0] === 'Z';
    var segBeforeZ = isClosed ? length - 2 : length - 1;

    var ref = absoluteArray[0].slice(1);
    var x1 = ref[0];
    var y1 = ref[1];
    var ref$1 = absoluteArray[segBeforeZ].slice(1);
    var x2 = ref$1[0];
    var y2 = ref$1[1];

    if (isClosed && x1 === x2 && y1 === y2) {
      return pathArray.slice(0, -1);
    }
    return pathArray;
  }

  var version = "0.1.11alpha4";

  // @ts-ignore

  /**
   * A global namespace for library version.
   * @type {string}
   */
  var Version = version;

  var Util = {
    CSSMatrix: CSSMatrix,
    parsePathString: parsePathString,
    isPathArray: isPathArray,
    isCurveArray: isCurveArray,
    isAbsoluteArray: isAbsoluteArray,
    isRelativeArray: isRelativeArray,
    isNormalizedArray: isNormalizedArray,
    isValidPath: isValidPath,
    pathToAbsolute: pathToAbsolute,
    pathToRelative: pathToRelative,
    pathToCurve: pathToCurve,
    pathToString: pathToString,
    getDrawDirection: getDrawDirection,
    getPathArea: getPathArea,
    getPathBBox: getPathBBox,
    getPathLength: getPathLength,
    getPointAtLength: getPointAtLength,
    clonePath: clonePath,
    splitPath: splitPath,
    fixPath: fixPath,
    roundPath: roundPath,
    optimizePath: optimizePath,
    reverseCurve: reverseCurve,
    reversePath: reversePath,
    normalizePath: normalizePath,
    transformPath: transformPath,
    getSVGMatrix: getSVGMatrix,
    shapeToPath: shapeToPath,
    options: SVGPCO,
    Version: Version,
  };

  /**
   * Creates a new SVGPathCommander instance.
   *
   * @class SVGPathCommander
   * @author thednp <https://github.com/thednp/svg-path-commander>
   */
  var SVGPathCommander = function SVGPathCommander(pathValue, config) {
    var options = config || {};

    var round = SVGPCO.round;
    var roundOption = options.round;
    if ((roundOption && +roundOption === 0) || roundOption === false) {
      round = 0;
    }

    var ref = round ? (options || SVGPCO) : { decimals: false };
    var decimals = ref.decimals;

    // set instance options
    this.round = decimals;
    // ZERO | FALSE will disable rounding numbers

    /** @type {SVGPathCommander.pathArray} */
    this.segments = parsePathString(pathValue);

    /** * @type {string} */
    this.pathValue = pathValue;

    return this;
  };

  /**
   * Convert path to absolute values
   * @public
   */
  SVGPathCommander.prototype.toAbsolute = function toAbsolute () {
    var ref = this;
      var segments = ref.segments;
    this.segments = pathToAbsolute(segments);
    return this;
  };

  /**
   * Convert path to relative values
   * @public
   */
  SVGPathCommander.prototype.toRelative = function toRelative () {
    var ref = this;
      var segments = ref.segments;
    this.segments = pathToRelative(segments);
    return this;
  };

  /**
   * Reverse the order of the segments and their values.
   * @param {boolean | number} onlySubpath option to reverse all sub-paths except first
   * @public
   */
  SVGPathCommander.prototype.reverse = function reverse (onlySubpath) {
    this.toAbsolute();

    var ref = this;
      var segments = ref.segments;
    var split = splitPath(this.toString());
    var subPath = split.length > 1 ? split : 0;
    /**
     * @param {import("../types").pathArray} x
     * @param {number} i
     */
    var reverser = function (x, i) {
      if (onlySubpath) {
        return i ? reversePath(x) : parsePathString(x);
      }
      return reversePath(x);
    };

    var absoluteMultiPath = subPath && clonePath(subPath).map(reverser);

    var path = [];
    if (subPath) {
      path = absoluteMultiPath.flat(1);
    } else {
      path = onlySubpath ? segments : reversePath(segments);
    }

    this.segments = clonePath(path);
    return this;
  };

  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   * @public
   */
  SVGPathCommander.prototype.normalize = function normalize () {
    var ref = this;
      var segments = ref.segments;
    this.segments = normalizePath(segments);
    return this;
  };

  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   * @public
   */
  SVGPathCommander.prototype.optimize = function optimize () {
    var ref = this;
      var segments = ref.segments;

    this.segments = optimizePath(segments, this.round);
    return this;
  };

  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   * @see SVGPathCommander.transformObject for a quick refference
   *
   * @param {Object.<string, (number | number[])>} source a `transformObject`as described above
   * @public
   */
  SVGPathCommander.prototype.transform = function transform (source) {
    if (!source || typeof source !== 'object' || (typeof source === 'object'
      && !['translate', 'rotate', 'skew', 'scale'].some(function (x) { return x in source; }))) { return this; }

    /** @type {SVGPathCommander.transformObject} */
    var transform = {};
    Object.keys(source).forEach(function (fn) {
      transform[fn] = Array.isArray(source[fn])
        // @ts-ignore
        ? source[fn].map(Number)
        : Number(source[fn]);
    });
    var ref = this;
      var segments = ref.segments;

    // if origin is not specified
    // it's important that we have one
    if (!transform.origin) {
      var BBox = getPathBBox(segments);
      var cx = BBox.cx;
        var cy = BBox.cy;
        var width = BBox.width;
        var height = BBox.height;
      // an estimted guest
      var originZ = Math.max(width, height) + Math.min(width, height) / 2;
      transform.origin = [cx, cy, originZ];
    }

    this.segments = transformPath(segments, transform);
    return this;
  };

  /**
   * Rotate path 180deg horizontally
   * @public
   */
  SVGPathCommander.prototype.flipX = function flipX () {
    this.transform({ rotate: [180, 0, 0] });
    return this;
  };

  /**
   * Rotate path 180deg vertically
   * @public
   */
  SVGPathCommander.prototype.flipY = function flipY () {
    this.transform({ rotate: [0, 180, 0] });
    return this;
  };

  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   * @public
   * @return {String} the path string
   */
  SVGPathCommander.prototype.toString = function toString () {
    return pathToString(this.segments, this.round);
  };

  // Export Util to global
  Object.assign(SVGPathCommander, Util);

  return SVGPathCommander;

}));
