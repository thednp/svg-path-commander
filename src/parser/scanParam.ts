import { isDigit } from "./isDigit.ts";
import { invalidPathValue } from "./invalidPathValue.ts";
import { error } from "../util/error.ts";
import type { PathParser } from "./pathParser.ts";

/**
 * Validates every character of the path string,
 * every path command, negative numbers or floating point numbers.
 *
 * @param path - The PathParser instance
 */
export const scanParam = (path: PathParser) => {
  const { max, pathValue, index: start } = path;
  let index = start;
  let zeroFirst = false;
  let hasCeiling = false;
  let hasDecimal = false;
  let hasDot = false;
  let ch;

  if (index >= max) {
    path.err =
      `${error}: ${invalidPathValue} at index ${index}, "pathValue" is missing param`;
    return;
  }
  ch = pathValue.charCodeAt(index);

  if (ch === 0x2b /* + */ || ch === 0x2d /* - */) {
    index += 1;
    // ch = (index < max) ? pathValue.charCodeAt(index) : 0;
    ch = pathValue.charCodeAt(index);
  }

  // This logic is shamelessly borrowed from Esprima
  // https://github.com/ariya/esprimas
  if (!isDigit(ch) && ch !== 0x2e /* . */) {
    // path.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
    path.err = `${error}: ${invalidPathValue} at index ${index}, "${
      pathValue[index]
    }" is not a number`;
    return;
  }

  if (ch !== 0x2e /* . */) {
    zeroFirst = ch === 0x30 /* 0 */;
    index += 1;

    ch = pathValue.charCodeAt(index);

    if (zeroFirst && index < max) {
      // decimal number starts with '0' such as '09' is illegal.
      if (ch && isDigit(ch)) {
        // path.err = 'SvgPath: numbers started with `0` such as `09`
        // are illegal (at pos ' + start + ')';
        path.err = `${error}: ${invalidPathValue} at index ${start}, "${
          pathValue[start]
        }" illegal number`;
        return;
      }
    }

    while (index < max && isDigit(pathValue.charCodeAt(index))) {
      index += 1;
      hasCeiling = true;
    }

    ch = pathValue.charCodeAt(index);
  }

  if (ch === 0x2e /* . */) {
    hasDot = true;
    index += 1;
    while (isDigit(pathValue.charCodeAt(index))) {
      index += 1;
      hasDecimal = true;
    }

    ch = pathValue.charCodeAt(index);
  }

  if (ch === 0x65 /* e */ || ch === 0x45 /* E */) {
    if (hasDot && !hasCeiling && !hasDecimal) {
      path.err = `${error}: ${invalidPathValue} at index ${index}, "${
        pathValue[index]
      }" invalid float exponent`;
      return;
    }

    index += 1;

    ch = pathValue.charCodeAt(index);

    if (ch === 0x2b /* + */ || ch === 0x2d /* - */) {
      index += 1;
    }
    if (index < max && isDigit(pathValue.charCodeAt(index))) {
      while (index < max && isDigit(pathValue.charCodeAt(index))) {
        index += 1;
      }
    } else {
      path.err = `${error}: ${invalidPathValue} at index ${index}, "${
        pathValue[index]
      }" invalid integer exponent`;
      return;
    }
  }

  path.index = index;
  path.param = scanNumber(pathValue, start, index);
};

/**
 * Converts a validated number substring to a Number without
 * allocating a new string, matching `+str.slice(start, end)`.
 *
 * Falls back to the native conversion when the value cannot be
 * represented exactly with plain double arithmetic (more than 15
 * significant digits or an exponent beyond +-22).
 *
 * @param str - the path string
 * @param start - the index of the first char of the number
 * @param end - the index after the last char of the number
 * @returns the parsed number
 */
const scanNumber = (str: string, start: number, end: number): number => {
  let i = start;
  let sign = 1;
  let param = 0;
  let decimals = 0;
  let sigDigits = 0;
  let inFraction = false;
  let expSign = 1;
  let exp = 0;

  const ch = str.charCodeAt(i);
  if (ch === 0x2b /* + */) {
    i += 1;
  } else if (ch === 0x2d /* - */) {
    sign = -1;
    i += 1;
  }

  for (; i < end; i += 1) {
    const code = str.charCodeAt(i);
    if (code === 0x2e /* . */) {
      inFraction = true;
    } else if (code === 0x65 /* e */ || code === 0x45 /* E */) {
      i += 1;
      const expCode = str.charCodeAt(i);
      if (expCode === 0x2b /* + */) {
        i += 1;
      } else if (expCode === 0x2d /* - */) {
        expSign = -1;
        i += 1;
      }
      for (; i < end; i += 1) {
        exp = exp * 10 + (str.charCodeAt(i) - 0x30);
      }
    } else {
      const digit = code - 0x30;
      if (digit !== 0 || param !== 0) {
        sigDigits += 1;
      }
      param = param * 10 + digit;
      if (inFraction) {
        decimals += 1;
      }
    }
  }

  if (sigDigits > 15 || sigDigits === 0) {
    return +str.slice(start, end);
  }

  const scale = expSign * exp - decimals;
  if (scale > 22 || scale < -22) {
    return +str.slice(start, end);
  }

  if (scale >= 0) {
    return sign * param * 10 ** scale;
  }
  return sign * param / 10 ** -scale;
};
