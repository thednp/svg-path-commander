/*!
* SVGPathCommander MORPH v2.4.0 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
// src/parser/paramsCount.ts
/** Segment params length */
const paramsCounts = {
	a: 7,
	c: 6,
	h: 1,
	l: 2,
	m: 2,
	r: 4,
	q: 4,
	s: 4,
	t: 2,
	v: 1,
	z: 0
};
/**
* The number of parameters of every command, by character code.
*
* The parser looks the number of the parameters of a command up for every
* segment it scans, and the lookup by character code spares it the
* lowercasing of the command and the lookup of the string.
*
* @internal
*/
const paramsCountsByCode = new Uint8Array(128);
for (const [command, count] of Object.entries(paramsCounts)) {
	const code = command.charCodeAt(0);
	paramsCountsByCode[code] = count;
	paramsCountsByCode[code - 32] = count;
}
// src/parser/finalizeSegment.ts
/**
* Breaks the parsing of a pathString once a segment is finalized.
*
* @param path - The PathParser instance
*/
const finalizeSegment = (path) => {
	let pathCommand = path.pathValue[path.segmentStart];
	const { data } = path;
	let index = 0;
	let paramCount = paramsCountsByCode[pathCommand.charCodeAt(0) | 32];
	let isMove = pathCommand === "m" || pathCommand === "M";
	while (data.length - index >= paramCount) {
		if (isMove && data.length - index > 2) {
			const segment = new Array(3);
			segment[0] = pathCommand;
			segment[1] = data[index];
			segment[2] = data[index + 1];
			path.segments.push(segment);
			index += 2;
			isMove = false;
			pathCommand = pathCommand === "m" ? "l" : "L";
			paramCount = 2;
		} else {
			const segment = new Array(paramCount + 1);
			segment[0] = pathCommand;
			for (let i = 0; i < paramCount; i += 1) segment[i + 1] = data[index + i];
			path.segments.push(segment);
			index += paramCount;
		}
		if (!paramCount) break;
	}
};
// src/util/error.ts
/** Error prefix used in all SVGPathCommander TypeError messages. */
const error = "SVGPathCommanderError";
// src/parser/scanFlag.ts
/**
* Validates an A (arc-to) specific path command value.
* Usually a `large-arc-flag` or `sweep-flag`.
*
* @param path - The PathParser instance
*/
const scanFlag = (path) => {
	const { index, pathValue } = path;
	const code = pathValue.charCodeAt(index);
	if (code === 48) {
		path.param = 0;
		path.index += 1;
		return;
	}
	if (code === 49) {
		path.param = 1;
		path.index += 1;
		return;
	}
	path.err = `${error}: invalid Arc flag "${pathValue[index]}", expecting 0 or 1 at index ${index}`;
};
// src/parser/isDigit.ts
/**
* Checks if a character is a digit.
*
* @param code the character to check
* @returns check result
*/
const isDigit = (code) => {
	return code >= 48 && code <= 57;
};
// src/parser/invalidPathValue.ts
/** Error message prefix used when a path string cannot be parsed. */
const invalidPathValue = "Invalid path value";
// src/parser/scanParam.ts
/**
* Validates every character of the path string,
* every path command, negative numbers or floating point numbers.
*
* @param path - The PathParser instance
*/
const scanParam = (path) => {
	const { max, pathValue, index: start } = path;
	let index = start;
	let hasCeiling = false;
	let hasDecimal = false;
	let hasDot = false;
	let ch;
	if (index >= max) {
		path.err = `${error}: ${invalidPathValue} at index ${index}, "pathValue" is missing param`;
		return;
	}
	ch = pathValue.charCodeAt(index);
	if (ch === 43 || ch === 45) {
		index += 1;
		ch = pathValue.charCodeAt(index);
	}
	if (!isDigit(ch) && ch !== 46) {
		path.err = `${error}: ${invalidPathValue} at index ${index}, "${pathValue[index]}" is not a number`;
		return;
	}
	if (ch !== 46) {
		index += 1;
		ch = pathValue.charCodeAt(index);
		while (index < max && isDigit(pathValue.charCodeAt(index))) {
			index += 1;
			hasCeiling = true;
		}
		ch = pathValue.charCodeAt(index);
	}
	if (ch === 46) {
		hasDot = true;
		index += 1;
		while (isDigit(pathValue.charCodeAt(index))) {
			index += 1;
			hasDecimal = true;
		}
		ch = pathValue.charCodeAt(index);
	}
	if (ch === 101 || ch === 69) {
		if (hasDot && !hasCeiling && !hasDecimal) {
			path.err = `${error}: ${invalidPathValue} at index ${index}, "${pathValue[index]}" invalid float exponent`;
			return;
		}
		index += 1;
		ch = pathValue.charCodeAt(index);
		if (ch === 43 || ch === 45) index += 1;
		if (index < max && isDigit(pathValue.charCodeAt(index))) while (index < max && isDigit(pathValue.charCodeAt(index))) index += 1;
		else {
			path.err = `${error}: ${invalidPathValue} at index ${index}, "${pathValue[index]}" invalid integer exponent`;
			return;
		}
	}
	path.index = index;
	path.param = scanNumber(pathValue, start, index);
	if (!Number.isFinite(path.param)) path.err = `${error}: ${invalidPathValue} at index ${start}, "${pathValue.slice(start, index)}" is not a finite number`;
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
const scanNumber = (str, start, end) => {
	let i = start;
	let sign = 1;
	let param = 0;
	let decimals = 0;
	let sigDigits = 0;
	let inFraction = false;
	let expSign = 1;
	let exp = 0;
	const ch = str.charCodeAt(i);
	if (ch === 43) i += 1;
	else if (ch === 45) {
		sign = -1;
		i += 1;
	}
	for (; i < end; i += 1) {
		const code = str.charCodeAt(i);
		if (code === 46) inFraction = true;
		else if (code === 101 || code === 69) {
			i += 1;
			const expCode = str.charCodeAt(i);
			if (expCode === 43) i += 1;
			else if (expCode === 45) {
				expSign = -1;
				i += 1;
			}
			for (; i < end; i += 1) exp = exp * 10 + (str.charCodeAt(i) - 48);
		} else {
			const digit = code - 48;
			if (digit !== 0 || param !== 0) sigDigits += 1;
			param = param * 10 + digit;
			if (inFraction) decimals += 1;
		}
	}
	if (sigDigits > 15 || sigDigits === 0) return +str.slice(start, end);
	const scale = expSign * exp - decimals;
	if (scale > 22 || scale < -22) return +str.slice(start, end);
	if (scale >= 0) return sign * param * 10 ** scale;
	return sign * param / 10 ** -scale;
};
// src/parser/isSpace.ts
/**
* The characters the SVG path grammar accepts as white space.
*
* The set is built once, at module level: the parser calls `isSpace` for
* every single character of a path, and building the list on every call
* made the tokenizer allocate its way through a path.
*/
const spaces = new Set([
	5760,
	6158,
	8192,
	8193,
	8194,
	8195,
	8196,
	8197,
	8198,
	8199,
	8200,
	8201,
	8202,
	8239,
	8287,
	12288,
	65279,
	10,
	13,
	8232,
	8233,
	32,
	9,
	11,
	12,
	160
]);
/**
* Checks if the character is a space.
*
* @param ch the character to check
* @returns check result
*/
const isSpace = (ch) => {
	return spaces.has(ch);
};
// src/parser/skipSpaces.ts
/**
* Points the parser to the next character in the
* path string every time it encounters any kind of
* space character.
*
* @param path - The PathParser instance
*/
const skipSpaces = (path) => {
	const { pathValue, max } = path;
	while (path.index < max && isSpace(pathValue.charCodeAt(path.index))) path.index += 1;
};
// src/parser/isPathCommand.ts
/**
* Checks if the character is a path command.
*
* @param code the character to check
* @returns check result
*/
const isPathCommand = (code) => {
	switch (code | 32) {
		case 109:
		case 122:
		case 108:
		case 104:
		case 118:
		case 99:
		case 115:
		case 113:
		case 116:
		case 97: return true;
		default: return false;
	}
};
// src/parser/isDigitStart.ts
/**
* Checks if the character is or belongs to a number.
* [0-9]|+|-|.
*
* @param code the character to check
* @returns check result
*/
const isDigitStart = (code) => {
	return isDigit(code) || code === 43 || code === 45 || code === 46;
};
// src/parser/isArcCommand.ts
/**
* Checks if the character is an A (arc-to) path command.
*
* @param code the character to check
* @returns check result
*/
const isArcCommand = (code) => {
	return (code | 32) === 97;
};
// src/parser/isMoveCommand.ts
/**
* Checks if the character is a MoveTo command.
*
* @param code the character to check
* @returns check result
*/
const isMoveCommand = (code) => {
	switch (code | 32) {
		case 109:
		case 77: return true;
		default: return false;
	}
};
// src/parser/scanSegment.ts
/**
* Scans every character in the path string to determine
* where a segment starts and where it ends.
*
* @param path - The PathParser instance
*/
const scanSegment = (path) => {
	const { max, pathValue, index, segments } = path;
	const cmdCode = pathValue.charCodeAt(index);
	const reqParams = paramsCountsByCode[cmdCode];
	path.segmentStart = index;
	if (!isPathCommand(cmdCode)) {
		path.err = `${error}: ${invalidPathValue} "${pathValue[index]}" is not a path command at index ${index}`;
		return;
	}
	const lastSegment = segments[segments.length - 1];
	if (!isMoveCommand(cmdCode) && lastSegment?.[0]?.toLocaleLowerCase() === "z") {
		path.err = `${error}: ${invalidPathValue} "${pathValue[index]}" is not a MoveTo path command at index ${index}`;
		return;
	}
	path.index += 1;
	skipSpaces(path);
	path.data = [];
	if (!reqParams) {
		finalizeSegment(path);
		return;
	}
	for (;;) {
		for (let i = reqParams; i > 0; i -= 1) {
			if (isArcCommand(cmdCode) && (i === 3 || i === 4)) scanFlag(path);
			else scanParam(path);
			if (path.err.length) return;
			path.data.push(path.param);
			skipSpaces(path);
			if (path.index < max && pathValue.charCodeAt(path.index) === 44) {
				path.index += 1;
				skipSpaces(path);
			}
		}
		if (path.index >= path.max) break;
		if (!isDigitStart(pathValue.charCodeAt(path.index))) break;
	}
	finalizeSegment(path);
};
// src/parser/pathParser.ts
/**
* The `PathParser` is used by the `parsePathString` static method
* to generate a `pathArray`.
*
* @param pathString - The SVG path string to parse
*/
var PathParser = class {
	constructor(pathString) {
		this.segments = [];
		this.pathValue = pathString;
		this.max = pathString.length;
		this.index = 0;
		this.param = 0;
		this.segmentStart = 0;
		this.data = [];
		this.err = "";
	}
};
// src/parser/parsePathString.ts
/**
* Parses a path string value and returns an array
* of segments we like to call `PathArray`.
*
* If parameter value is already a `PathArray`,
* return a clone of it.
*
* A path must begin with a moveto command, so a path that starts with another
* command is in error. A leading relative moveto is a pair of absolute
* coordinates, so it is rewritten as an absolute one.
*
* @example
* parsePathString("M 0 0L50 50")
* // => [["M",0,0],["L",50,50]]
*
* @param pathInput the string to be parsed
* @returns the resulted `pathArray` or error string
*/
const parsePathString = (pathInput) => {
	let path;
	if (typeof pathInput !== "string") path = pathInput.slice(0);
	else {
		const parser = new PathParser(pathInput);
		skipSpaces(parser);
		while (parser.index < parser.max && !parser.err.length) scanSegment(parser);
		if (parser.err.length) throw TypeError(parser.err);
		path = parser.segments;
	}
	const first = path[0];
	if (!first) return path;
	if (typeof first[0] !== "string") throw new TypeError(`${error}: invalid path segment at index 0`);
	if (first[0] === "m")
 /**
	* force absolute first M
	* getPathBBox calculation requires first segment to be absolute
	* @see https://github.com/thednp/svg-path-commander/pull/49
	*/
	path[0] = [
		"M",
		first[1],
		first[2]
	];
	else if (first[0] !== "M") throw new TypeError(`${error}: path data must begin with a moveto command`);
	return path;
};
// src/process/normalizeSegment.ts
/**
* Normalizes a single segment of a `pathArray` object.
*
* @param segment the segment object
* @param params the normalization parameters
* @param prevCommand the command of the previous segment
* @returns the normalized segment
*/
const normalizeSegment = (segment, params, prevCommand) => {
	const [pathCommand] = segment;
	const absCommand = pathCommand.toUpperCase();
	const isRelative = pathCommand !== absCommand;
	const { x, y } = params;
	if (!"TQ".includes(absCommand)) {
		params.qx = null;
		params.qy = null;
	}
	const absolute = (index) => {
		const value = segment[index];
		if (!isRelative) return value;
		return index % 2 === 1 ? value + x : value + y;
	};
	if (absCommand === "A") return [
		"A",
		segment[1],
		segment[2],
		segment[3],
		segment[4],
		segment[5],
		segment[6] + (isRelative ? x : 0),
		segment[7] + (isRelative ? y : 0)
	];
	else if (absCommand === "H") return [
		"L",
		absolute(1),
		y
	];
	else if (absCommand === "V") return [
		"L",
		x,
		segment[1] + (isRelative ? y : 0)
	];
	else if (absCommand === "L") return [
		"L",
		absolute(1),
		absolute(2)
	];
	else if (absCommand === "M") return [
		"M",
		absolute(1),
		absolute(2)
	];
	else if (absCommand === "C") return [
		"C",
		absolute(1),
		absolute(2),
		absolute(3),
		absolute(4),
		absolute(5),
		absolute(6)
	];
	else if (absCommand === "S") {
		const canReflect = prevCommand != null && "CS".includes(prevCommand);
		return [
			"C",
			canReflect && params.x2 != null ? x * 2 - params.x2 : x,
			canReflect && params.y2 != null ? y * 2 - params.y2 : y,
			absolute(1),
			absolute(2),
			absolute(3),
			absolute(4)
		];
	} else if (absCommand === "T") {
		const qx = params.qx != null ? x * 2 - params.qx : x;
		const qy = params.qy != null ? y * 2 - params.qy : y;
		params.qx = qx;
		params.qy = qy;
		return [
			"Q",
			qx,
			qy,
			absolute(1),
			absolute(2)
		];
	} else if (absCommand === "Q") {
		const nqx = absolute(1);
		const nqy = absolute(2);
		params.qx = nqx;
		params.qy = nqy;
		return [
			"Q",
			nqx,
			nqy,
			absolute(3),
			absolute(4)
		];
	} else if (absCommand === "Z") return ["Z"];
	return segment;
};
// src/parser/paramsParser.ts
/**
* Default parser parameters object used to track position state
* while iterating through path segments.
*/
const paramsParser = {
	mx: 0,
	my: 0,
	x1: 0,
	y1: 0,
	x2: null,
	y2: null,
	x: 0,
	y: 0,
	qx: null,
	qy: null
};
// src/process/iterate.ts
/**
* Iterates over a `PathArray`, executing a callback for each segment.
* The callback can:
* - Read current position (`x`, `y`)
* - Modify the segment (return new segment)
* - Stop early (return `false`)
*
* The iterator maintains accurate current point (`x`, `y`) and subpath start (`mx`, `my`)
* while correctly handling relative/absolute commands, including H/V and Z.
*
* **Important**: If the callback returns a new segment with more coordinates (e.g., Q → C),
* the path length may increase, and iteration will continue over new segments.
*
* @template T - Specific PathArray type (e.g., CurveArray, PolylineArray)
* @param path - The source `PathArray` to iterate over
* @param iterator - Callback function for each segment
* @param iterator.segment - Current path segment
* @param iterator.index - Index of current segment
* @param iterator.x - Current X position (after applying relative offset)
* @param iterator.y - Current Y position (after applying relative offset)
* @returns The modified `path` (or original if no changes)
*
* @example
* iterate(path, (seg, i, x, y) => {
*   if (seg[0] === 'L') return ['C', x, y, seg[1], seg[2], seg[1], seg[2]];
* });
*/
const iterate = (path, iterator) => {
	let x = 0;
	let y = 0;
	let mx = 0;
	let my = 0;
	let i = 0;
	while (i < path.length) {
		const segment = path[i];
		const pathCommand = segment[0];
		if (typeof pathCommand !== "string") throw new TypeError(`${error}: invalid path segment at index ${i}`);
		const commandCode = pathCommand.charCodeAt(0);
		const isRelative = commandCode >= 97;
		const absCommand = isRelative ? String.fromCharCode(commandCode - 32) : pathCommand;
		const iteratorResult = iterator(segment, i, x, y);
		if (iteratorResult === false) break;
		if (absCommand === "Z") {
			x = mx;
			y = my;
		} else if (absCommand === "H") x = segment[1] + (isRelative ? x : 0);
		else if (absCommand === "V") y = segment[1] + (isRelative ? y : 0);
		else {
			const segLen = segment.length;
			x = segment[segLen - 2] + (isRelative ? x : 0);
			y = segment[segLen - 1] + (isRelative ? y : 0);
			if (absCommand === "M") {
				mx = x;
				my = y;
			}
		}
		if (iteratorResult) path[i] = iteratorResult;
		i += 1;
	}
	return path;
};
// src/process/normalizePath.ts
/**
* Parses a path string or PathArray, then iterates the result for:
* * converting segments to absolute values
* * converting shorthand commands to their non-shorthand notation
*
* @param pathInput - The path string or PathArray
* @returns The normalized PathArray
*
* @example
* ```ts
* normalizePath('M10 90s20 -80 40 -80s20 80 40 80')
* // => [['M', 10, 90], ['C', 10, 90, 30, 10, 50, 10], ['C', 70, 10, 70, 90, 90, 90]]
* ```
*/
const normalizePath = (pathInput) => {
	const path = parsePathString(pathInput);
	const params = { ...paramsParser };
	let prevCommand = null;
	return iterate(path, (seg, _, lastX, lastY) => {
		params.x = lastX;
		params.y = lastY;
		const result = normalizeSegment(seg, params, prevCommand);
		const seglen = result.length;
		params.x1 = +result[seglen - 2];
		params.y1 = +result[seglen - 1];
		if (result[0] === "C" || result[0] === "Q") {
			params.x2 = +result[seglen - 4];
			params.y2 = +result[seglen - 3];
		} else {
			params.x2 = null;
			params.y2 = null;
		}
		prevCommand = result[0];
		return result;
	});
};
// src/util/isClosedPath.ts
/**
* Check if a PathArray is closed, which means its last segment is a Z.
* @param path
* @returns true if the path is closed
*/
const isClosedPath = (path) => {
	if (!path.length) return false;
	return path[path.length - 1][0].toUpperCase() === "Z";
};
// src/morph/fixPath.ts
/**
* Checks a `PathArray` for an unnecessary `Z` segment
* and removes it. The `PathArray` is modified in place.
* In short, if the segment before `Z` extends to `M`,
* the `Z` segment must be removed.
*
* The `pathInput` must be a single path, without
* sub-paths. For multi-path `<path>` elements,
* use `splitPath` first and apply this utility on each
* sub-path separately.
*
* @param pathInput the `pathArray` source
* @returns void
*/
const fixPath = (pathInput) => {
	const pathArray = parsePathString(pathInput);
	if (isClosedPath(pathArray)) {
		const normalArray = normalizePath(pathArray);
		const length = pathArray.length;
		const segBeforeZ = length - 2;
		const [mx, my] = normalArray[0].slice(1);
		const [x, y] = normalArray[segBeforeZ].slice(-2);
		if (mx === x && my === y) pathArray.splice(length - 1, 1);
	}
};
// src/math/midPoint.ts
/**
* Returns the coordinates of a specified distance
* ratio between two points.
*
* @param a the first point coordinates
* @param b the second point coordinates
* @param t the ratio
* @returns the midpoint coordinates
*/
const midPoint = ([ax, ay], [bx, by], t) => {
	return [ax + (bx - ax) * t, ay + (by - ay) * t];
};
// src/morph/splitCubicSegment.ts
/**
* Split a cubic Bézier into two cubics at parameter t [0–1].
*
* @param x1 - Start point X
* @param y1 - Start point Y
* @param x2 - First control point X
* @param y2 - First control point Y
* @param x3 - Second control point X
* @param y3 - Second control point Y
* @param x4 - End point X
* @param y4 - End point Y
* @param t - Parameter in range [0, 1] at which to split
* @returns Array of two cubic segments, each as [x1,y1, x2,y2, x3,y3, x4,y4]
*/
function splitCubicSegment(x1, y1, x2, y2, x3, y3, x4, y4, t) {
	const [px01, py01] = midPoint([x1, y1], [x2, y2], t);
	const [px12, py12] = midPoint([x2, y2], [x3, y3], t);
	const [px23, py23] = midPoint([x3, y3], [x4, y4], t);
	const [cx0, cy0] = midPoint([px01, py01], [px12, py12], t);
	const [cx1, cy1] = midPoint([px12, py12], [px23, py23], t);
	const [px, py] = midPoint([cx0, cy0], [cx1, cy1], t);
	return [[
		x1,
		y1,
		px01,
		py01,
		cx0,
		cy0,
		px,
		py
	], [
		px,
		py,
		cx1,
		cy1,
		px23,
		py23,
		x4,
		y4
	]];
}
// src/util/isPathArray.ts
/**
* Iterates an array to check if it's an actual `pathArray`.
*
* @param path the `pathArray` to be checked
* @returns iteration result
*/
const isPathArray = (path) => {
	return Array.isArray(path) && path.every((seg) => {
		const command = seg?.[0];
		if (typeof command !== "string") return false;
		const lk = command.toLowerCase();
		return paramsCounts[lk] === seg.length - 1 && "achlmqstvz".includes(lk) && seg.slice(1).every(Number.isFinite);
	}) && path.length > 0;
};
// src/util/isMultiPath.ts
/**
* Determines if an SVG path contains multiple subpaths.
* Accepts path string or PathArray.
* @param path - 'M10,10 L20,20 Z M30,30 L40,40' → true
* @returns boolean
*/
const isMultiPath = (path) => {
	if (typeof path === "string") {
		const matches = path.match(/[Mm]/g);
		return matches ? matches.length > 1 : false;
	}
	if (!Array.isArray(path)) throw new TypeError(error + ": expected string or PathArray");
	if (!isPathArray(path)) return false;
	let moveCount = 0;
	for (const segment of path) if (segment[0].toUpperCase() === "M") {
		moveCount++;
		if (moveCount > 1) return true;
	}
	return false;
};
// src/process/absolutizeSegment.ts
/**
* Returns an absolute segment of a `PathArray` object.
*
* The current point of a path starts at the origin, so the first segment
* of a path is absolutized against `[0, 0]`: a relative moveto at the
* start of a path is an absolute one, as the SVG spec requires.
*
* @param segment the segment object
* @param _index the segment index
* @param lastX the last known X value
* @param lastY the last known Y value
* @returns the absolute segment
*/
const absolutizeSegment = (segment, _index, lastX, lastY) => {
	const [pathCommand] = segment;
	const absCommand = pathCommand.toUpperCase();
	if (absCommand === pathCommand) return segment;
	if (absCommand === "A") return [
		absCommand,
		segment[1],
		segment[2],
		segment[3],
		segment[4],
		segment[5],
		segment[6] + lastX,
		segment[7] + lastY
	];
	else if (absCommand === "V") return [absCommand, segment[1] + lastY];
	else if (absCommand === "H") return [absCommand, segment[1] + lastX];
	else if (absCommand === "L") return [
		absCommand,
		segment[1] + lastX,
		segment[2] + lastY
	];
	else if (absCommand === "C") return [
		absCommand,
		segment[1] + lastX,
		segment[2] + lastY,
		segment[3] + lastX,
		segment[4] + lastY,
		segment[5] + lastX,
		segment[6] + lastY
	];
	else {
		const absValues = [];
		const seglen = segment.length;
		for (let j = 1; j < seglen; j += 1) absValues.push(segment[j] + (j % 2 ? lastX : lastY));
		return [absCommand].concat(absValues);
	}
};
// src/process/splitPath.ts
/**
* Split a path string or PathArray into an array of sub-paths.
*
* In the process, values are converted to absolute
* for visual consistency.
*
* A path must begin with a moveto command, so a path that does not is
* rejected by the parser.
*
* @param pathInput - The source path string or PathArray
* @returns An array of sub-path PathArrays
*
* @example
* ```ts
* splitPath('M0 0L100 0ZM200 0L300 0Z')
* // => [
* //   [['M', 0, 0], ['L', 100, 0], ['Z']],
* //   [['M', 200, 0], ['L', 300, 0], ['Z']]
* // ]
* ```
*/
const splitPath = (pathInput) => {
	const composite = [];
	const segments = parsePathString(pathInput);
	let path = [];
	let pi = -1;
	let x = 0;
	let y = 0;
	let mx = 0;
	let my = 0;
	iterate(segments, (seg, _index, prevX, prevY) => {
		const cmd = seg[0];
		const absCommand = cmd.toUpperCase();
		const isRelative = cmd === cmd.toLowerCase();
		const values = seg.slice(1);
		if (absCommand === "M") {
			pi += 1;
			[x, y] = values;
			x += isRelative ? prevX : 0;
			y += isRelative ? prevY : 0;
			mx = x;
			my = y;
			path = [[
				"M",
				x,
				y
			]];
		} else {
			if (absCommand === "Z") {
				x = mx;
				y = my;
			} else if (absCommand === "H") {
				[, x] = seg;
				x += isRelative ? prevX : 0;
			} else if (absCommand === "V") {
				[, y] = seg;
				y += isRelative ? prevY : 0;
			} else {
				[x, y] = seg.slice(-2);
				x += isRelative ? prevX : 0;
				y += isRelative ? prevY : 0;
			}
			path.push(absolutizeSegment(seg, _index, prevX, prevY));
		}
		composite[pi] = path;
	});
	return composite;
};
// src/math/rotateVector.ts
/**
* Returns an {x,y} vector rotated by a given
* angle in radian.
*
* @param x the initial vector x
* @param y the initial vector y
* @param rad the radian vector angle
* @returns the rotated vector
*/
const rotateVector = (x, y, rad) => {
	const { sin, cos } = Math;
	return {
		x: x * cos(rad) - y * sin(rad),
		y: x * sin(rad) + y * cos(rad)
	};
};
// src/process/lineToCubic.ts
/**
* Converts an L (line-to) segment to C (cubic-bezier).
*
* @param x1 line start x
* @param y1 line start y
* @param x2 line end x
* @param y2 line end y
* @returns the cubic-bezier segment
*/
const lineToCubic = (x1, y1, x2, y2) => {
	const c1 = midPoint([x1, y1], [x2, y2], 1 / 3);
	const c2 = midPoint([x1, y1], [x2, y2], 2 / 3);
	return [
		c1[0],
		c1[1],
		c2[0],
		c2[1],
		x2,
		y2
	];
};
// src/process/arcToCubic.ts
/**
* Converts A (arc-to) segments to C (cubic-bezier-to).
*
* For more information of where this math came from visit:
* http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
*
* @param X1 the starting x position
* @param Y1 the starting y position
* @param RX x-radius of the arc
* @param RY y-radius of the arc
* @param angle x-axis-rotation of the arc
* @param LAF large-arc-flag of the arc
* @param SF sweep-flag of the arc
* @param X2 the ending x position
* @param Y2 the ending y position
* @param recursive the parameters needed to split arc into 2 segments
* @returns the resulting cubic-bezier segment(s)
*/
const arcToCubic = (X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, recursive) => {
	let x1 = X1;
	let y1 = Y1;
	let rx = Math.abs(RX);
	let ry = Math.abs(RY);
	let x2 = X2;
	let y2 = Y2;
	const d120 = Math.PI * 120 / 180;
	if (!recursive && (rx === 0 || ry === 0)) return lineToCubic(X1, Y1, X2, Y2);
	const rad = Math.PI / 180 * (+angle || 0);
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
		let h = x * x / (rx * rx) + y * y / (ry * ry);
		if (h > 1) {
			h = Math.sqrt(h);
			rx *= h;
			ry *= h;
		}
		const rx2 = rx * rx;
		const ry2 = ry * ry;
		const k = (LAF === SF ? -1 : 1) * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x)));
		cx = k * rx * y / ry + (x1 + x2) / 2;
		cy = k * -ry * x / rx + (y1 + y2) / 2;
		f1 = Math.asin(((y1 - cy) / ry * 10 ** 9 >> 0) / 10 ** 9);
		f2 = Math.asin(((y2 - cy) / ry * 10 ** 9 >> 0) / 10 ** 9);
		f1 = x1 < cx ? Math.PI - f1 : f1;
		f2 = x2 < cx ? Math.PI - f2 : f2;
		if (f1 < 0) f1 = Math.PI * 2 + f1;
		if (f2 < 0) f2 = Math.PI * 2 + f2;
		if (SF && f1 > f2) f1 -= Math.PI * 2;
		if (!SF && f2 > f1) f2 -= Math.PI * 2;
	} else [f1, f2, cx, cy] = recursive;
	let df = f2 - f1;
	if (Math.abs(df) > d120) {
		const f2old = f2;
		const x2old = x2;
		const y2old = y2;
		f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
		x2 = cx + rx * Math.cos(f2);
		y2 = cy + ry * Math.sin(f2);
		res = arcToCubic(x2, y2, rx, ry, angle, 0, SF, x2old, y2old, [
			f2,
			f2old,
			cx,
			cy
		]);
	}
	df = f2 - f1;
	const c1 = Math.cos(f1);
	const s1 = Math.sin(f1);
	const c2 = Math.cos(f2);
	const s2 = Math.sin(f2);
	const t = Math.tan(df / 4);
	const hx = 4 / 3 * rx * t;
	const hy = 4 / 3 * ry * t;
	const m1 = [x1, y1];
	const m2 = [x1 + hx * s1, y1 - hy * c1];
	const m3 = [x2 + hx * s2, y2 - hy * c2];
	const m4 = [x2, y2];
	m2[0] = 2 * m1[0] - m2[0];
	m2[1] = 2 * m1[1] - m2[1];
	if (recursive) return [
		m2[0],
		m2[1],
		m3[0],
		m3[1],
		m4[0],
		m4[1]
	].concat(res);
	res = [
		m2[0],
		m2[1],
		m3[0],
		m3[1],
		m4[0],
		m4[1]
	].concat(res);
	const newres = [];
	for (let i = 0, ii = res.length; i < ii; i += 1) newres[i] = i % 2 ? rotateVector(res[i - 1], res[i], rad).y : rotateVector(res[i], res[i + 1], rad).x;
	return newres;
};
// src/process/quadToCubic.ts
/**
* Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
*
* @param x1 curve start x
* @param y1 curve start y
* @param qx control point x
* @param qy control point y
* @param x2 curve end x
* @param y2 curve end y
* @returns the cubic-bezier segment
*/
const quadToCubic = (x1, y1, qx, qy, x2, y2) => {
	const r13 = 1 / 3;
	const r23 = 2 / 3;
	return [
		r13 * x1 + r23 * qx,
		r13 * y1 + r23 * qy,
		r13 * x2 + r23 * qx,
		r13 * y2 + r23 * qy,
		x2,
		y2
	];
};
// src/process/segmentToCubic.ts
/**
* Converts any segment to C (cubic-bezier).
*
* A segment that is already a cubic, or a command the converter does not
* handle, is returned unchanged.
*
* @param segment the source segment
* @param params the source segment parameters
* @returns the cubic-bezier segment
*/
const segmentToCubic = (segment, params) => {
	const pathCommand = segment[0];
	const values = segment.slice(1).map(Number);
	const [x, y] = values;
	const { x1: px1, y1: py1 } = params;
	if (!"TQ".includes(pathCommand)) {
		params.qx = null;
		params.qy = null;
	}
	if (pathCommand === "M") {
		params.mx = x;
		params.my = y;
		params.x = x;
		params.y = y;
		return segment;
	} else if (pathCommand === "A") return ["C"].concat(arcToCubic(px1, py1, values[0], values[1], values[2], values[3], values[4], values[5], values[6]));
	else if (pathCommand === "Q") {
		params.qx = x;
		params.qy = y;
		return ["C"].concat(quadToCubic(px1, py1, values[0], values[1], values[2], values[3]));
	} else if (pathCommand === "L") return ["C"].concat(lineToCubic(px1, py1, x, y));
	else if (pathCommand === "Z") return ["C"].concat(lineToCubic(px1, py1, params.mx, params.my));
	return segment;
};
// src/convert/pathToCurve.ts
/**
* Parses a path string or PathArray and returns a new one
* in which all segments are converted to cubic-bezier.
*
* @param pathInput - The path string or PathArray
* @returns The resulted CurveArray with all segments as cubic beziers
*
* @example
* ```ts
* pathToCurve('M10 50q15 -25 30 0')
* // => [['M', 10, 50], ['C', 20, 33.3333, 30, 33.3333, 40, 50]]
* ```
*/
const pathToCurve = (pathInput) => {
	const params = { ...paramsParser };
	const path = parsePathString(pathInput);
	let prevCommand = null;
	return iterate(path, (seg, index, lastX, lastY) => {
		params.x = lastX;
		params.y = lastY;
		const normalSegment = normalizeSegment(seg, params, prevCommand);
		if (normalSegment[0] === "M") {
			params.mx = normalSegment[1];
			params.my = normalSegment[2];
		}
		let result = segmentToCubic(normalSegment, params);
		if (result[0] === "C" && result.length > 7) {
			const values = result;
			const segments = [];
			for (let i = 7; i < values.length; i += 6) segments.push(["C"].concat(values.slice(i, i + 6)));
			path.splice(index + 1, 0, ...segments);
			result = values.slice(0, 7);
		}
		const seglen = result.length;
		params.x1 = +result[seglen - 2];
		params.y1 = +result[seglen - 1];
		if (normalSegment[0] === "C") {
			params.x2 = +result[seglen - 4];
			params.y2 = +result[seglen - 3];
		} else {
			params.x2 = null;
			params.y2 = null;
		}
		prevCommand = normalSegment[0];
		return result;
	});
};
// src/util/isAbsoluteArray.ts
/**
* Iterates an array to check if it's a `pathArray`
* with all absolute values.
*
* @param path the `pathArray` to be checked
* @returns iteration result
*/
const isAbsoluteArray = (path) => {
	return isPathArray(path) && path.every(([x]) => x === x.toUpperCase());
};
// src/util/isNormalizedArray.ts
/**
* Iterates an array to check if it's a `pathArray`
* with all segments in non-shorthand notation
* with absolute values.
*
* @param path - the array to be checked
* @returns true if the array is a normalized path array
*/
const isNormalizedArray = (path) => {
	return isAbsoluteArray(path) && path.every(([pc]) => "ACLMQZ".includes(pc));
};
// src/util/isPolygonArray.ts
/**
* Checks if a path is a polygon (only M, L, H, V, Z commands).
* @param pathArray PathArray (pre-normalize if needed)
* @returns boolean
*/
const isPolygonArray = (path) => {
	return isNormalizedArray(path) && path.every(([pc]) => "MLVHZ".includes(pc));
};
// src/util/isPolylineArray.ts
/**
* Checks if a path is a polyline (only M, L, H, V commands).
* @param pathArray PathArray (pre-normalize if needed)
* @returns boolean
*/
function isPolylineArray(path) {
	return isNormalizedArray(path) && path.every(([pc]) => "MLVH".includes(pc));
}
// src/morph/pathToPolyline.ts
/**
* Converts any `PolyLineArray`/`PolygonArray` path (closed or open) to an explicit polyline (M + L*).
* If the path is closed (has Z), the Z is replaced with an explicit L back to the initial M point.
* This allows uniform processing without special-casing Z.
*
* @param path string or PathArray
* @returns PolylineArray (M + L*) — never contains Z
*/
const pathToPolyline = (path) => {
	const normal = normalizePath(path);
	if (!isPolygonArray(normal) && !isPolylineArray(normal)) throw TypeError(`${error}: pathValue is not a polyline/polygon`);
	if (!isClosedPath(normal)) return normal;
	const result = [normal[0]];
	const [mx, my] = normal[0].slice(1);
	for (let i = 1; i < normal.length; i++) {
		const seg = normal[i];
		if (seg[0].toUpperCase() === "Z") result.push([
			"L",
			mx,
			my
		]);
		else result.push(seg);
	}
	return result;
};
// src/convert/pathToAbsolute.ts
/**
* Parses a path string value or object and returns an array
* of segments, all converted to absolute values.
*
* @param pathInput - The path string or PathArray
* @returns The resulted PathArray with absolute values
*
* @example
* ```ts
* pathToAbsolute('M10 10l80 80')
* // => [['M', 10, 10], ['L', 90, 90]]
* ```
*/
const pathToAbsolute = (pathInput) => {
	const path = parsePathString(pathInput);
	return iterate(path, absolutizeSegment);
};
// src/process/reversePath.ts
/**
* Reverses the segments of a single sub-path and returns a new PathArray
* with absolute values.
*
* @param absolutePath - The absolute PathArray of a single sub-path
* @returns The reversed PathArray
*/
const reverseSubPath = (absolutePath) => {
	const normalizedPath = normalizePath(absolutePath);
	const pLen = absolutePath.length;
	const isClosed = absolutePath[pLen - 1][0] === "Z";
	const endPoints = [];
	let endX = 0;
	let endY = 0;
	let subX = 0;
	let subY = 0;
	for (const seg of normalizedPath) {
		if (seg[0] === "M") {
			subX = +seg[1];
			subY = +seg[2];
			endX = subX;
			endY = subY;
		} else if (seg[0] === "Z") {
			endX = subX;
			endY = subY;
		} else {
			endX = +seg[seg.length - 2];
			endY = +seg[seg.length - 1];
		}
		endPoints.push([endX, endY]);
	}
	const reversedPath = iterate(absolutePath, (segment, i) => {
		const normalizedSegment = normalizedPath[i];
		const prevSeg = i && absolutePath[i - 1];
		const prevCommand = prevSeg && prevSeg[0];
		const nextSeg = absolutePath[i + 1];
		const nextCommand = nextSeg && nextSeg[0];
		const pathCommand = segment[0];
		const [x, y] = endPoints[i ? i - 1 : pLen - 1];
		let result = segment;
		switch (pathCommand) {
			case "M":
				result = isClosed ? ["Z"] : [
					pathCommand,
					x,
					y
				];
				break;
			case "A":
				result = [
					pathCommand,
					segment[1],
					segment[2],
					segment[3],
					segment[4],
					segment[5] === 1 ? 0 : 1,
					x,
					y
				];
				break;
			case "C":
				if (nextSeg && nextCommand === "S") result = [
					"S",
					segment[1],
					segment[2],
					x,
					y
				];
				else result = [
					pathCommand,
					segment[3],
					segment[4],
					segment[1],
					segment[2],
					x,
					y
				];
				break;
			case "S":
				if (nextSeg && nextCommand === "S") result = [
					pathCommand,
					normalizedSegment[1],
					normalizedSegment[2],
					x,
					y
				];
				else result = [
					"C",
					normalizedSegment[3],
					normalizedSegment[4],
					normalizedSegment[1],
					normalizedSegment[2],
					x,
					y
				];
				break;
			case "Q":
				if (nextSeg && nextCommand === "T") result = [
					"T",
					x,
					y
				];
				else result = [
					pathCommand,
					segment[1],
					segment[2],
					x,
					y
				];
				break;
			case "T": {
				const prevIsQuad = Boolean(prevCommand && "QT".includes(prevCommand));
				if (Boolean(nextSeg && nextCommand === "T") || !prevIsQuad && !Boolean(nextSeg && nextCommand === "Q")) result = [
					pathCommand,
					x,
					y
				];
				else result = [
					"Q",
					normalizedSegment[1],
					normalizedSegment[2],
					x,
					y
				];
				break;
			}
			case "Z":
				result = [
					"M",
					x,
					y
				];
				break;
			case "H":
				result = [pathCommand, x];
				break;
			case "V":
				result = [pathCommand, y];
				break;
			default: result = [pathCommand].concat(segment.slice(1, -2), x, y);
		}
		return result;
	});
	return isClosed ? reversedPath.reverse() : [reversedPath[0]].concat(reversedPath.slice(1).reverse());
};
/**
* Reverses all segments of a PathArray and returns a new PathArray
* with absolute values.
*
* Every sub-path is reversed on its own, so the `M` and the `Z` of a
* sub-path are swapped with each other and the sub-paths keep their
* original order.
*
* @param pathInput - The source PathArray
* @returns The reversed PathArray
*
* @example
* ```ts
* reversePath([['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['Z']])
* // => [['M', 0, 100], ['L', 100, 100], ['L', 100, 0], ['L', 0, 0], ['Z']]
* ```
*/
const reversePath = (pathInput) => {
	const absolutePath = pathToAbsolute(pathInput);
	const subPaths = [];
	let subPath = [];
	for (const segment of absolutePath) {
		if (segment[0] === "M" && subPath.length) {
			subPaths.push(subPath);
			subPath = [];
		}
		subPath.push(segment);
	}
	if (subPath.length) subPaths.push(subPath);
	const reversed = subPaths.map((path) => reverseSubPath(path));
	return reversed.length === 1 ? reversed[0] : reversed.flat();
};
// src/morph/splitLineToCount.ts
/**
* Split a line segment into `count` smaller segments of equal length
* using the same repeated front-cutting strategy as splitCubicToCount.
*
* Does NOT mutate input.
*
* @param x1 - Start point X
* @param y1 - Start point Y
* @param x2 - End point X
* @param y2 - End point Y
* @param count - Number of segments to split into
* @returns Array of `count` line segments, each as [x1, y1, x2, y2]
*/
function splitLineToCount(x1, y1, x2, y2, count) {
	if (count <= 1) return [[
		x1,
		y1,
		x2,
		y2
	]];
	const result = [];
	let currentX = x1;
	let currentY = y1;
	let i = 0;
	while (i < count) {
		const t = 1 / (count - i);
		const nextX = currentX + t * (x2 - currentX);
		const nextY = currentY + t * (y2 - currentY);
		result.push([
			currentX,
			currentY,
			nextX,
			nextY
		]);
		currentX = nextX;
		currentY = nextY;
		i++;
	}
	return result;
}
// src/math/lineTools.ts
/**
* Returns length for line segments (MoveTo, LineTo).
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the line segment length
*/
const getLineLength = (x1, y1, x2, y2) => {
	const dx = x1 - x2;
	const dy = y1 - y2;
	return Math.sqrt(dx * dx + dy * dy);
};
/**
* Returns bounding box for line segments (MoveTo, LineTo).
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the bounding box for line segments
*/
const getLineBBox = (x1, y1, x2, y2) => {
	const { min, max } = Math;
	return [
		min(x1, x2),
		min(y1, y2),
		max(x1, x2),
		max(y1, y2)
	];
};
// src/math/bezier.ts
/**
* Tools from bezier.js by Mike 'Pomax' Kamermans
* @see https://github.com/Pomax/bezierjs
*/
const Tvalues = [
	-.06405689286260563,
	.06405689286260563,
	-.1911188674736163,
	.1911188674736163,
	-.3150426796961634,
	.3150426796961634,
	-.4337935076260451,
	.4337935076260451,
	-.5454214713888396,
	.5454214713888396,
	-.6480936519369755,
	.6480936519369755,
	-.7401241915785544,
	.7401241915785544,
	-.820001985973903,
	.820001985973903,
	-.8864155270044011,
	.8864155270044011,
	-.9382745520027328,
	.9382745520027328,
	-.9747285559713095,
	.9747285559713095,
	-.9951872199970213,
	.9951872199970213
];
/** The weights for the 32-point Gauss-Legendre quadrature. */
const Cvalues = [
	.12793819534675216,
	.12793819534675216,
	.1258374563468283,
	.1258374563468283,
	.12167047292780339,
	.12167047292780339,
	.1155056680537256,
	.1155056680537256,
	.10744427011596563,
	.10744427011596563,
	.09761865210411388,
	.09761865210411388,
	.08619016153195327,
	.08619016153195327,
	.0733464814110803,
	.0733464814110803,
	.05929858491543678,
	.05929858491543678,
	.04427743881741981,
	.04427743881741981,
	.028531388628933663,
	.028531388628933663,
	.0123412297999872,
	.0123412297999872
];
/**
* @param points
* @returns
*/
const deriveBezier = (points) => {
	const dpoints = [];
	for (let p = points, d = p.length, c = d - 1; d > 1; d -= 1, c -= 1) {
		const list = [];
		for (let j = 0; j < c; j += 1) list.push({
			x: c * (p[j + 1].x - p[j].x),
			y: c * (p[j + 1].y - p[j].y),
			t: 0
		});
		dpoints.push(list);
		p = list;
	}
	return dpoints;
};
/**
* @param points
* @param t
*/
const computeBezier = (points, t) => {
	if (t === 0) {
		points[0].t = 0;
		return points[0];
	}
	const order = points.length - 1;
	if (t === 1) {
		points[order].t = 1;
		return points[order];
	}
	const mt = 1 - t;
	let p = points;
	if (order === 0) {
		points[0].t = t;
		return points[0];
	}
	if (order === 1) return {
		x: mt * p[0].x + t * p[1].x,
		y: mt * p[0].y + t * p[1].y,
		t
	};
	const mt2 = mt * mt;
	const t2 = t * t;
	let a = 0;
	let b = 0;
	let c = 0;
	let d = 0;
	if (order === 2) {
		p = [
			p[0],
			p[1],
			p[2],
			{
				x: 0,
				y: 0
			}
		];
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
		t
	};
};
/**
* Returns the speed of a Bezier segment at a given ratio, without allocating
* a point for it.
*
* The quadrature of the length samples the speed of the curve at every one of
* its points, and a point per sample is a lot of garbage for a long path. The
* arithmetic is the one of `computeBezier`, so the length of a curve is the
* same.
*
* @param points the control points of the derivative of the curve
* @param t the sampled point ratio
* @returns the speed of the curve at the ratio
*/
const bezierSpeed = (points, t) => {
	const order = points.length - 1;
	const mt = 1 - t;
	if (order === 1) {
		const x = mt * points[0].x + t * points[1].x;
		const y = mt * points[0].y + t * points[1].y;
		return Math.sqrt(x * x + y * y);
	}
	if (order === 2) {
		const mt2 = mt * mt;
		const t2 = t * t;
		const a = mt2;
		const b = mt * t * 2;
		const c = t2;
		const x = a * points[0].x + b * points[1].x + c * points[2].x;
		const y = a * points[0].y + b * points[1].y + c * points[2].y;
		return Math.sqrt(x * x + y * y);
	}
	const d = computeBezier(points, t);
	return Math.sqrt(d.x * d.x + d.y * d.y);
};
/**
* Returns the arc length of a Bezier segment from its start point
* up to a given `t` ratio, from the control points of its derivative.
*
* The integration of the speed `|B'(t)|` over the `[0, t]` interval is done
* with the Gauss-Legendre quadrature, and the speed is computed without
* allocating a point for it.
*
* @param points the control points of the derivative of the curve
* @param t the sampled point ratio in `[0-1]`
* @returns the arc length up to parameter `t`
*/
const bezierLengthAtPoints = (points, t) => {
	const z = t / 2;
	const len = Tvalues.length;
	let sum = 0;
	for (let i = 0, tMid; i < len; i++) {
		tMid = z * Tvalues[i] + z;
		sum += Cvalues[i] * bezierSpeed(points, tMid);
	}
	return z * sum;
};
/**
* Builds the Bezier points array from a curve coordinates array.
* @param curve cubic / quad bezier segment
*/
const getBezierPoints = (curve) => {
	const points = [];
	for (let idx = 0, len = curve.length, step = 2; idx < len; idx += step) points.push({
		x: curve[idx],
		y: curve[idx + 1]
	});
	return points;
};
/**
* Returns the `t` parameter of a Bezier segment at which the cumulative
* arc length equals the given `distance`, found by interval bisection.
*
* @param curve cubic / quad bezier segment
* @param distance the distance along the segment in `[0, length]`
* @returns the `t` parameter in `[0-1]`
*/
const getTAtBezierLength = (curve, distance) => {
	const points = deriveBezier(getBezierPoints(curve))[0];
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 25; i += 1) {
		const mid = (lo + hi) / 2;
		if (bezierLengthAtPoints(points, mid) < distance) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
};
/**
* Returns the length of CubicBezier / Quad segment.
* @param curve cubic / quad bezier segment
*/
const getBezierLength = (curve) => {
	const points = getBezierPoints(curve);
	const dpoints = deriveBezier(points);
	return bezierLengthAtPoints(dpoints[0], 1);
};
/**
* Returns the most extreme points in a Quad Bezier segment.
* @param A an array which consist of X/Y values
*/
const minmaxQ = ([v1, cp, v2]) => {
	const min = Math.min(v1, v2);
	const max = Math.max(v1, v2);
	if (cp >= v1 ? v2 >= cp : v2 <= cp) return [min, max];
	const E = (v1 * v2 - cp * cp) / (v1 - 2 * cp + v2);
	return E < min ? [E, max] : [min, E];
};
/**
* Returns the most extreme points in a Cubic Bezier segment.
* @param A an array which consist of X/Y values
* @see https://github.com/kpym/SVGPathy/blob/acd1a50c626b36d81969f6e98e8602e128ba4302/lib/box.js#L127
*/
const minmaxC = ([v1, cp1, cp2, v2]) => {
	const K = v1 - 3 * cp1 + 3 * cp2 - v2;
	if (Math.abs(K) < 1e-8) {
		if (v1 === v2 && v1 === cp1) return [v1, v2];
		return minmaxQ([
			v1,
			-.5 * v1 + 1.5 * cp1,
			v1 - 3 * cp1 + 3 * cp2
		]);
	}
	const T = -v1 * cp2 + v1 * v2 - cp1 * cp2 - cp1 * v2 + cp1 * cp1 + cp2 * cp2;
	if (T <= 0) return [Math.min(v1, v2), Math.max(v1, v2)];
	const S = Math.sqrt(T);
	let min = Math.min(v1, v2);
	let max = Math.max(v1, v2);
	const L = v1 - 2 * cp1 + cp2;
	for (let R = (L + S) / K, i = 1; i <= 2; R = (L - S) / K, i++) if (R > 0 && R < 1) {
		const Q = v1 * (1 - R) * (1 - R) * (1 - R) + cp1 * 3 * (1 - R) * (1 - R) * R + cp2 * 3 * (1 - R) * R * R + v2 * R * R * R;
		if (Q < min) min = Q;
		if (Q > max) max = Q;
	}
	return [min, max];
};
// src/math/arcTools.ts
/**
* Returns the signed arc length of an ellipse segment from angle `0` up to
* the given `theta` angle, by integrating the curve speed
* `|sqrt(rx^2 * sin^2(phi) + ry^2 * cos^2(phi))|` over the `[0, theta]`
* interval with Gauss-Legendre quadrature.
*
* @param rx radius along X axis
* @param ry radius along Y axis
* @param theta the angle in radians
* @returns the signed arc length
*/
const arcLengthAtAngle = (rx, ry, theta) => {
	const sign = theta < 0 ? -1 : 1;
	const absTheta = Math.abs(theta);
	const step = Math.PI / 2;
	let total = 0;
	let remaining = absTheta;
	let offset = 0;
	while (remaining > 0) {
		const span = Math.min(step, remaining);
		const z = span / 2;
		let sum = 0;
		for (let i = 0, len = Tvalues.length; i < len; i += 1) {
			const phi = offset + z * Tvalues[i] + z;
			sum += Cvalues[i] * Math.sqrt((rx * Math.sin(phi)) ** 2 + (ry * Math.cos(phi)) ** 2);
		}
		total += z * sum;
		offset += span;
		remaining -= span;
	}
	return sign * total;
};
/**
* Returns the signed arc length of an ellipse segment between two angles.
* @param rx radius along X axis
* @param ry radius along Y axis
* @param from the start angle in radians
* @param to the end angle in radians
* @returns the signed arc length
*/
const arcLengthBetween = (rx, ry, from, to) => {
	return arcLengthAtAngle(rx, ry, to) - arcLengthAtAngle(rx, ry, from);
};
/**
* Find point on ellipse at given angle around ellipse (theta);
* @param cx the center X
* @param cy the center Y
* @param rx the radius X
* @param ry the radius Y
* @param alpha the arc rotation angle in radians
* @param theta the arc sweep angle in radians
* @returns a point around ellipse at given angle
*/
const arcPoint = (cx, cy, rx, ry, alpha, theta) => {
	const { sin, cos } = Math;
	const cosA = cos(alpha);
	const sinA = sin(alpha);
	const x = rx * cos(theta);
	const y = ry * sin(theta);
	return [cx + cosA * x - sinA * y, cy + sinA * x + cosA * y];
};
/**
* Returns the angle between two points.
* @param v0 starting point
* @param v1 ending point
* @returns the angle in radian
*/
const angleBetween = (v0, v1) => {
	const { x: v0x, y: v0y } = v0;
	const { x: v1x, y: v1y } = v1;
	const p = v0x * v1x + v0y * v1y;
	const n = Math.sqrt((v0x ** 2 + v0y ** 2) * (v1x ** 2 + v1y ** 2));
	return (v0x * v1y - v0y * v1x < 0 ? -1 : 1) * Math.acos(Math.min(1, Math.max(-1, p / n)));
};
/**
* Returns the following properties for an Arc segment: center, start angle,
* end angle, and radiuses on X and Y axis.
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param RX the radius on X axis
* @param RY the radius on Y axis
* @param angle the ellipse rotation in degrees
* @param LAF the large arc flag
* @param SF the sweep flag
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns properties specific to Arc segments
*/
const getArcProps = (x1, y1, RX, RY, angle, LAF, SF, x, y) => {
	const { abs, sin, cos, sqrt, PI } = Math;
	let rx = abs(RX);
	let ry = abs(RY);
	const xRotRad = (angle % 360 + 360) % 360 * (PI / 180);
	if (x1 === x && y1 === y) return {
		rx,
		ry,
		startAngle: 0,
		endAngle: 0,
		center: {
			x,
			y
		}
	};
	if (rx === 0 || ry === 0) return {
		rx,
		ry,
		startAngle: 0,
		endAngle: 0,
		center: {
			x: (x + x1) / 2,
			y: (y + y1) / 2
		}
	};
	const dx = (x1 - x) / 2;
	const dy = (y1 - y) / 2;
	const transformedPoint = {
		x: cos(xRotRad) * dx + sin(xRotRad) * dy,
		y: -sin(xRotRad) * dx + cos(xRotRad) * dy
	};
	const radiiCheck = transformedPoint.x ** 2 / rx ** 2 + transformedPoint.y ** 2 / ry ** 2;
	if (radiiCheck > 1) {
		rx *= sqrt(radiiCheck);
		ry *= sqrt(radiiCheck);
	}
	let cRadicand = (rx ** 2 * ry ** 2 - rx ** 2 * transformedPoint.y ** 2 - ry ** 2 * transformedPoint.x ** 2) / (rx ** 2 * transformedPoint.y ** 2 + ry ** 2 * transformedPoint.x ** 2);
	cRadicand = cRadicand < 0 ? 0 : cRadicand;
	const cCoef = (LAF !== SF ? 1 : -1) * sqrt(cRadicand);
	const transformedCenter = {
		x: cCoef * (rx * transformedPoint.y / ry),
		y: cCoef * (-(ry * transformedPoint.x) / rx)
	};
	const center = {
		x: cos(xRotRad) * transformedCenter.x - sin(xRotRad) * transformedCenter.y + (x1 + x) / 2,
		y: sin(xRotRad) * transformedCenter.x + cos(xRotRad) * transformedCenter.y + (y1 + y) / 2
	};
	const startVector = {
		x: (transformedPoint.x - transformedCenter.x) / rx,
		y: (transformedPoint.y - transformedCenter.y) / ry
	};
	const startAngle = angleBetween({
		x: 1,
		y: 0
	}, startVector);
	const endVector = {
		x: (-transformedPoint.x - transformedCenter.x) / rx,
		y: (-transformedPoint.y - transformedCenter.y) / ry
	};
	let sweepAngle = angleBetween(startVector, endVector);
	if (!SF && sweepAngle > 0) sweepAngle -= 2 * PI;
	else if (SF && sweepAngle < 0) sweepAngle += 2 * PI;
	sweepAngle %= 2 * PI;
	return {
		center,
		startAngle,
		endAngle: startAngle + sweepAngle,
		rx,
		ry
	};
};
/**
* Returns the length of an Arc segment.
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param c1x the first control point X
* @param c1y the first control point Y
* @param c2x the second control point X
* @param c2y the second control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the length of the Arc segment
*/
const getArcLength = (x1, y1, RX, RY, angle, LAF, SF, x, y) => {
	const { abs } = Math;
	if (RX === 0 || RY === 0) return abs(Math.sqrt((x - x1) ** 2 + (y - y1) ** 2));
	const { rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
	return Math.abs(arcLengthBetween(rx, ry, startAngle, endAngle));
};
/**
* Returns the extrema for an Arc segment in the following format:
* [MIN_X, MIN_Y, MAX_X, MAX_Y]
*
* @see https://github.com/herrstrietzel/svg-pathdata-getbbox
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param RX the radius on X axis
* @param RY the radius on Y axis
* @param angle the ellipse rotation in degrees
* @param LAF the large arc flag
* @param SF the sweep flag
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the extrema of the Arc segment
*/
const getArcBBox = (x1, y1, RX, RY, angle, LAF, SF, x, y) => {
	const { min, max, tan, atan2, cos, PI } = Math;
	if (x1 === x && y1 === y) return [
		x1,
		y1,
		x,
		y
	];
	if (RX === 0 || RY === 0) return [
		min(x1, x),
		min(y1, y),
		max(x1, x),
		max(y1, y)
	];
	const { center, rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
	const deltaAngle = endAngle - startAngle;
	const { x: cx, y: cy } = center;
	const alpha = angle * PI / 180;
	const tangent = tan(alpha);
	/**
	* find min/max from zeroes of directional derivative along x and y
	* along x axis
	*/
	const theta = atan2(-ry * tangent, rx);
	const angle1 = theta;
	const angle2 = theta + PI;
	const angle3 = atan2(ry, rx * tangent);
	const angle4 = angle3 + PI;
	const flipped = cos(alpha) < 0;
	const rightAngle = flipped ? angle2 : angle1;
	const leftAngle = flipped ? angle1 : angle2;
	const topAngle = flipped ? angle3 : angle4;
	const bottomAngle = flipped ? angle4 : angle3;
	const xArray = [x1, x];
	const yArray = [y1, y];
	const span = Math.abs(deltaAngle);
	const clockwise = deltaAngle >= 0;
	/**
	* tells if an extremum of the ellipse is on the arc, the offset of the
	* extremum is measured from the start of the arc, in the direction of
	* the sweep
	*/
	const isOnArc = (extremum) => {
		return (clockwise ? ((extremum - startAngle) % (2 * PI) + 2 * PI) % (2 * PI) : ((startAngle - extremum) % (2 * PI) + 2 * PI) % (2 * PI)) <= span + 1e-9;
	};
	if (isOnArc(rightAngle)) {
		const p = arcPoint(cx, cy, rx, ry, alpha, rightAngle);
		xArray.push(p[0]);
		yArray.push(p[1]);
	}
	if (isOnArc(leftAngle)) {
		const p = arcPoint(cx, cy, rx, ry, alpha, leftAngle);
		xArray.push(p[0]);
		yArray.push(p[1]);
	}
	if (isOnArc(topAngle)) {
		const p = arcPoint(cx, cy, rx, ry, alpha, topAngle);
		xArray.push(p[0]);
		yArray.push(p[1]);
	}
	if (isOnArc(bottomAngle)) {
		const p = arcPoint(cx, cy, rx, ry, alpha, bottomAngle);
		xArray.push(p[0]);
		yArray.push(p[1]);
	}
	return [
		min(...xArray),
		min(...yArray),
		max(...xArray),
		max(...yArray)
	];
};
// src/math/cubicTools.ts
/**
* Returns a point at a given length of a CubicBezier segment.
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param c1x the first control point X
* @param c1y the first control point Y
* @param c2x the second control point X
* @param c2y the second control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @param t a [0-1] ratio
* @returns the point at cubic-bezier segment length
*/
const getPointAtCubicSegmentLength = ([x1, y1, c1x, c1y, c2x, c2y, x2, y2], t) => {
	const t1 = 1 - t;
	return {
		x: t1 ** 3 * x1 + 3 * t1 ** 2 * t * c1x + 3 * t1 * t ** 2 * c2x + t ** 3 * x2,
		y: t1 ** 3 * y1 + 3 * t1 ** 2 * t * c1y + 3 * t1 * t ** 2 * c2y + t ** 3 * y2
	};
};
/**
* Returns the length of a CubicBezier segment.
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param c1x the first control point X
* @param c1y the first control point Y
* @param c2x the second control point X
* @param c2y the second control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the CubicBezier segment length
*/
const getCubicLength = (x1, y1, c1x, c1y, c2x, c2y, x2, y2) => {
	return getBezierLength([
		x1,
		y1,
		c1x,
		c1y,
		c2x,
		c2y,
		x2,
		y2
	]);
};
/**
* Returns the bounding box of a CubicBezier segment in the following format:
* [MIN_X, MIN_Y, MAX_X, MAX_Y]
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param c1x the first control point X
* @param c1y the first control point Y
* @param c2x the second control point X
* @param c2y the second control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the extrema of the CubicBezier segment
*/
const getCubicBBox = (x1, y1, c1x, c1y, c2x, c2y, x2, y2) => {
	const cxMinMax = minmaxC([
		x1,
		c1x,
		c2x,
		x2
	]);
	const cyMinMax = minmaxC([
		y1,
		c1y,
		c2y,
		y2
	]);
	return [
		cxMinMax[0],
		cyMinMax[0],
		cxMinMax[1],
		cyMinMax[1]
	];
};
// src/math/quadTools.ts
/**
* Returns the {x,y} coordinates of a point at a
* given length of a quadratic-bezier segment.
*
* @see https://github.com/substack/point-at-length
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param cx the control point X
* @param cy the control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @param t a [0-1] ratio
* @returns the requested {x,y} coordinates
*/
const getPointAtQuadSegmentLength = ([x1, y1, cx, cy, x2, y2], t) => {
	const t1 = 1 - t;
	return {
		x: t1 ** 2 * x1 + 2 * t1 * t * cx + t ** 2 * x2,
		y: t1 ** 2 * y1 + 2 * t1 * t * cy + t ** 2 * y2
	};
};
/**
* Returns the length of a QuadraticBezier segment.
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param cx the control point X
* @param cy the control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the QuadraticBezier segment length
*/
const getQuadLength = (x1, y1, cx, cy, x2, y2) => {
	return getBezierLength([
		x1,
		y1,
		cx,
		cy,
		x2,
		y2
	]);
};
/**
* Returns the bounding box of a QuadraticBezier segment in the following format:
* [MIN_X, MIN_Y, MAX_X, MAX_Y]
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param cx the control point X
* @param cy the control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the extrema of the QuadraticBezier segment
*/
const getQuadBBox = (x1, y1, cx, cy, x2, y2) => {
	const cxMinMax = minmaxQ([
		x1,
		cx,
		x2
	]);
	const cyMinMax = minmaxQ([
		y1,
		cy,
		y2
	]);
	return [
		cxMinMax[0],
		cyMinMax[0],
		cxMinMax[1],
		cyMinMax[1]
	];
};
// src/util/measureSegments.ts
/**
* Measures every segment of a path in a single pass.
*
* This is the one source of truth for the length math: it absolutises relative
* segments, rewrites `H`/`V` to `L` and carries the reflectable control-point
* state for `S`/`T`, exactly like `getTotalLength` does. Every consumer that
* needs per-segment lengths reads them from here so they cannot disagree with
* each other.
*
* @param pathInput - the target path string or `PathArray`
* @returns the measured segments, in path order
*/
const measureSegments = (pathInput) => {
	const path = parsePathString(pathInput);
	const measures = [];
	let paramX1 = 0;
	let paramY1 = 0;
	let paramX2 = 0;
	let paramY2 = 0;
	let paramQX = null;
	let paramQY = null;
	let pathCommand = "M";
	let mx = 0;
	let my = 0;
	let totalLength = 0;
	iterate(path, (seg, index, lastX, lastY) => {
		pathCommand = seg[0];
		const absCommand = pathCommand.toUpperCase();
		const absoluteSegment = absCommand !== pathCommand ? absolutizeSegment(seg, index, lastX, lastY) : seg;
		const normalSegment = absCommand === "V" ? [
			"L",
			lastX,
			absoluteSegment[1]
		] : absCommand === "H" ? [
			"L",
			absoluteSegment[1],
			lastY
		] : absoluteSegment;
		pathCommand = normalSegment[0];
		if (!"TQ".includes(absCommand)) {
			paramQX = null;
			paramQY = null;
		}
		let length = 0;
		let geometry = normalSegment;
		if (pathCommand === "M") {
			mx = normalSegment[1];
			my = normalSegment[2];
		} else if (pathCommand === "L") length = getLineLength(lastX, lastY, normalSegment[1], normalSegment[2]);
		else if (pathCommand === "A") length = getArcLength(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4], normalSegment[5], normalSegment[6], normalSegment[7]);
		else if (pathCommand === "S") {
			const cp1x = paramX1 * 2 - paramX2;
			const cp1y = paramY1 * 2 - paramY2;
			geometry = [
				"C",
				cp1x,
				cp1y,
				normalSegment[1],
				normalSegment[2],
				normalSegment[3],
				normalSegment[4]
			];
			length = getCubicLength(lastX, lastY, cp1x, cp1y, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4]);
		} else if (pathCommand === "C") length = getCubicLength(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4], normalSegment[5], normalSegment[6]);
		else if (pathCommand === "T") {
			paramQX = paramQX === null ? lastX : paramX1 * 2 - paramQX;
			paramQY = paramQY === null ? lastY : paramY1 * 2 - paramQY;
			geometry = [
				"Q",
				paramQX,
				paramQY,
				normalSegment[1],
				normalSegment[2]
			];
			length = getQuadLength(lastX, lastY, paramQX, paramQY, normalSegment[1], normalSegment[2]);
		} else if (pathCommand === "Q") {
			paramQX = normalSegment[1];
			paramQY = normalSegment[2];
			length = getQuadLength(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4]);
		} else if (pathCommand === "Z") length = getLineLength(lastX, lastY, mx, my);
		const endX = pathCommand === "Z" ? mx : geometry[geometry.length - 2];
		const endY = pathCommand === "Z" ? my : geometry[geometry.length - 1];
		measures.push({
			segment: seg,
			index,
			length,
			lengthAtSegment: totalLength,
			startX: lastX,
			startY: lastY,
			endX,
			endY,
			geometry
		});
		totalLength += length;
		if (pathCommand === "Z") {
			paramX1 = mx;
			paramY1 = my;
		} else {
			paramX1 = normalSegment[normalSegment.length - 2];
			paramY1 = normalSegment[normalSegment.length - 1];
		}
		if (pathCommand === "C") {
			paramX2 = normalSegment[3];
			paramY2 = normalSegment[4];
		} else if (pathCommand === "S") {
			paramX2 = normalSegment[1];
			paramY2 = normalSegment[2];
		} else {
			paramX2 = paramX1;
			paramY2 = paramY1;
		}
	});
	return measures;
};
// src/morph/getPathSplits.ts
/**
* Determine the right amount of splits for each segment in a given PathArray
* and for a target total amount of sub-segments.
* For a triangle path "M0,0 L600,300 L0,600 Z" we have 3 equal lines,
* we can easily do 4 splits per line and go to town, however, most triangles
* are not even so we need to take side lengths into account.
* @param path The target PathArray
* @param target The total amount of sub-segments
* @returns an array of numbers reprezenting the sub-segment count for each segment
*/
function getPathSplits(path, target) {
	if (!Number.isFinite(target)) throw new TypeError(`${error}: target must be a finite number`);
	if (target < 2) throw new TypeError(`${error}: target must be >= 2`);
	const measures = measureSegments(path);
	const segmentCount = measures.length;
	if (!segmentCount) return [];
	const lengths = measures.map(({ length }) => length);
	const totalLength = lengths.reduce((total, length) => total + length, 0);
	if (!totalLength) return Array(segmentCount).fill(1);
	const effectiveTarget = Math.max(Math.floor(target), segmentCount);
	const idealSegLen = totalLength / effectiveTarget;
	const splits = Array(segmentCount).fill(1);
	let totalAllocated = 1;
	for (let i = 1; i < segmentCount; i += 1) {
		const segLen = lengths[i];
		const desired = segLen > idealSegLen ? Math.round(segLen / idealSegLen) : 1;
		splits[i] = desired;
		totalAllocated += desired;
	}
	let diff = effectiveTarget - totalAllocated;
	if (diff !== 0) {
		const candidates = [];
		for (let i = 1; i < segmentCount; i += 1) if (lengths[i] > 0) candidates.push([i, lengths[i]]);
		if (diff < 0) {
			candidates.sort((a, b) => a[1] - b[1]);
			while (diff < 0) {
				let changed = false;
				for (const [index] of candidates) if (splits[index] > 1) {
					splits[index] -= 1;
					diff += 1;
					changed = true;
					if (diff === 0) break;
				}
				if (!changed) break;
			}
		} else {
			candidates.sort((a, b) => b[1] - a[1]);
			while (diff > 0) for (const [index] of candidates) {
				splits[index] += 1;
				diff -= 1;
				if (diff === 0) break;
			}
		}
	}
	return splits;
}
// src/morph/splitLinePathToCount.ts
/**
* Splits a PolylineArray so that it has exactly `target` line segments.
*
* @param path - The polyline array to split
* @param target - The desired number of line segments
* @returns The modified polyline array with the target segment count
*/
function splitLinePathToCount(path, target) {
	if (path.length < 2 || target <= 1) return path;
	const splits = getPathSplits(path, target);
	let totalAdded = 0;
	const newPath = [path[0]];
	const pathLen = path.length;
	let currentX = path[0][1];
	let currentY = path[0][2];
	for (let i = 1; i < pathLen; i++) {
		const [endX, endY] = path[i].slice(1);
		const count = splits[i];
		if (count >= 1) {
			const subLines = splitLineToCount(currentX, currentY, endX, endY, count);
			for (const sub of subLines) {
				newPath.push([
					"L",
					sub[2],
					sub[3]
				]);
				totalAdded++;
			}
		}
		currentX = endX;
		currentY = endY;
	}
	if (newPath.length !== target) console.warn(`${error}: requested ${target} segments, got ${newPath.length}. Adjusted on last segment.`);
	return newPath;
}
// src/morph/splitCubicToCount.ts
/**
* Split a cubic Bézier into `count` segments of roughly equal parameter length.
* Does NOT mutate input parameters.
*
* @param x1 - Start point X
* @param y1 - Start point Y
* @param x2 - First control point X
* @param y2 - First control point Y
* @param x3 - Second control point X
* @param y3 - Second control point Y
* @param x4 - End point X
* @param y4 - End point Y
* @param count - Number of segments to split into
* @returns Array of `count` cubic segments, each as [x1,y1,x2,y2,x3,y3,x4,y4]
*/
function splitCubicToCount(x1, y1, x2, y2, x3, y3, x4, y4, count) {
	if (count <= 1) return [[
		x1,
		y1,
		x2,
		y2,
		x3,
		y3,
		x4,
		y4
	]];
	const result = [];
	let cx1 = x1;
	let cy1 = y1;
	let cx2 = x2;
	let cy2 = y2;
	let cx3 = x3;
	let cy3 = y3;
	let cx4 = x4;
	let cy4 = y4;
	let i = 0;
	while (i < count) {
		const t = 1 / (count - i);
		const [first, second] = splitCubicSegment(cx1, cy1, cx2, cy2, cx3, cy3, cx4, cy4, t);
		result.push(first);
		[cx1, cy1, cx2, cy2, cx3, cy3, cx4, cy4] = second;
		i++;
	}
	return result;
}
// src/morph/splitCurvePathToCount.ts
/**
* Splits a CurveArray so that it has exactly `target` cubic segments.
*
* @param path - The curve array to split
* @param target - The desired number of cubic segments
* @returns The modified curve array with the target segment count
*/
function splitCurvePathToCount(path, target) {
	if (path.length < 2 || target <= 1) return path;
	const splits = getPathSplits(path, target);
	let totalAdded = 0;
	const newPath = [path[0]];
	const pathLen = path.length;
	let currentX = path[0][1];
	let currentY = path[0][2];
	for (let i = 1; i < pathLen; i++) {
		const seg = path[i];
		const [endX, endY] = seg.slice(-2);
		const count = splits[i];
		if (count >= 1) {
			const subs = splitCubicToCount(currentX, currentY, seg[1], seg[2], seg[3], seg[4], seg[5], seg[6], count);
			for (const sub of subs) {
				newPath.push([
					"C",
					sub[2],
					sub[3],
					sub[4],
					sub[5],
					sub[6],
					sub[7]
				]);
				totalAdded++;
			}
		}
		currentX = endX;
		currentY = endY;
	}
	if (newPath.length !== target) console.warn(`${error}: requested ${target} segments, got ${newPath.length}.`);
	return newPath;
}
// src/morph/samplePolygon.ts
/**
* Samples points from a path to form a polygon approximation.
* Collects endpoints of each segment (M start + ends of L/C/etc).
*
* If `sampleSize` parameter is provided, it will return a polygon
* equivalent to the original `PathArray`.
* @param path `PolygonPathArray` or `CurvePathArray`
* @returns Array of [x, y] points
*/
function samplePolygon(path) {
	const points = [];
	let [mx, my] = [0, 0];
	iterate(path, (seg) => {
		const cmd = seg[0];
		if (cmd === "M") {
			[mx, my] = [seg[1], seg[2]];
			points.push([mx, my]);
		} else if (cmd === "L") points.push([seg[1], seg[2]]);
		else if (cmd === "C") points.push([seg[5], seg[6]]);
		else if (cmd === "Q") points.push([seg[3], seg[4]]);
		else if (cmd === "A") points.push([seg[6], seg[7]]);
		else if (cmd === "Z") points.push([mx, my]);
		else throw new TypeError(`${error}: path command "${String(cmd)}" is not supported`);
	});
	return points;
}
// src/math/polygonTools.ts
/**
* d3-polygon-area
* @see https://github.com/d3/d3-polygon
*
* Returns the area of a polygon.
*
* @param polygon Array of [x, y]
* @returns Signed area
*/
const polygonArea = (polygon) => {
	const n = polygon.length;
	let i = -1;
	let a;
	let b = polygon[n - 1];
	let area = 0;
	while (++i < n) {
		a = b;
		b = polygon[i];
		area += a[1] * b[0] - a[0] * b[1];
	}
	return area / 2;
};
// src/morph/getRotatedPath.ts
/**
* Returns a single rotation of a path (line or curve) by shifting the start point.
* The rotation starts at the end of the segment at `idx` and continues with the
* following segments, wrapping around the end of the path.
*
* @param a PathArray (M + L/C + optional Z) — must be single subpath, normalized
* @param idx the index of the segment the rotation starts at
* @returns PathArray — the rotation of the path
*/
function getRotation(a, idx) {
	const pathLen = a.length;
	const pointCount = pathLen - 1;
	const path = [];
	for (let i = 0; i < pathLen; i++) {
		let oldSegIdx = idx + i;
		let seg;
		if (i === 0 || a[oldSegIdx] && a[oldSegIdx][0] === "M") {
			seg = a[oldSegIdx];
			path.push(["M", ...seg.slice(-2)]);
			continue;
		}
		if (oldSegIdx >= pathLen) oldSegIdx -= pointCount;
		path.push(a[oldSegIdx]);
	}
	return path;
}
/**
* Returns the end coordinates of every segment of a path, flattened.
*
* @param path the path to read
* @returns the end coordinates, two per segment
*/
const getEndCoordinates = (path) => {
	const ends = [];
	for (const segment of path) {
		const end = segment.slice(-2);
		ends.push(end[0], end[1]);
	}
	return ends;
};
/**
* Finds the rotation of `pathA` that matches `pathB` best by minimizing the sum
* of squared distances between corresponding endpoints.
*
* The rotations are not materialized: the endpoint of the segment at index `j` of
* the rotation that starts at `idx` is the endpoint of the segment at index
* `1 + ((idx + i - 1) mod pointCount)` of the source path, so the sum can be
* computed from the source path alone.
*
* A rotation whose running sum is already worse than the best rotation found so
* far cannot become the best one — the terms of the sum are squared distances,
* so the sum only grows — and the rotation is dropped right there.
*
* The rotations are checked in the order of their first term, the distance
* between the start of the rotation and the start of the reference path: the
* rotation that matches best is usually the one that starts closest, so it is
* usually found early and the rest of the rotations are dropped right away.
*
* @param pathA the path to rotate
* @param pathB the reference path
* @returns the index of the best rotation
*/
const getBestRotationIndex = (pathA, pathB) => {
	const pathLen = pathA.length;
	const pointCount = pathLen - 1;
	const endsA = getEndCoordinates(pathA);
	const endsB = getEndCoordinates(pathB);
	const firstTerms = [];
	const order = [];
	for (let idx = 0; idx < pathLen; idx++) {
		const dx = endsA[idx * 2] - endsB[0];
		const dy = endsA[idx * 2 + 1] - endsB[1];
		firstTerms.push(dx * dx + dy * dy);
		order.push(idx);
	}
	order.sort((a, b) => {
		const first = firstTerms[a];
		const second = firstTerms[b];
		if (first < second) return -1;
		if (first > second) return 1;
		return a - b;
	});
	let bestIndex = 0;
	let minDistanceSq = Infinity;
	for (const idx of order) {
		let sumDistSq = firstTerms[idx];
		if (sumDistSq > minDistanceSq) continue;
		for (let i = 1; i < pathLen; i++) {
			const j = 1 + (idx + i - 1) % pointCount;
			const dx = endsA[j * 2] - endsB[i * 2];
			const dy = endsA[j * 2 + 1] - endsB[i * 2 + 1];
			sumDistSq += dx * dx + dy * dy;
			if (sumDistSq > minDistanceSq) break;
		}
		if (sumDistSq < minDistanceSq || sumDistSq === minDistanceSq && idx < bestIndex) {
			minDistanceSq = sumDistSq;
			bestIndex = idx;
		}
	}
	return bestIndex;
};
/**
* Finds the best rotation of pathA to match pathB by minimizing sum of squared distances
* between corresponding endpoints.
*
* Works with both polygon (L) and curve (C) arrays.
*
* @param pathA PathArray to rotate (will be modified in rotation options)
* @param pathB PathArray reference (fixed)
* @returns PathArray — best rotation of pathA
*/
function getRotatedPath(pathA, pathB, computedRotations) {
	if (pathA.length !== pathB.length) throw new TypeError(error + ": paths must have the same number of segments after equalization");
	if (computedRotations) {
		let bestIndex = 0;
		let minDistanceSq = Infinity;
		for (let ri = 0; ri < computedRotations.length; ri++) {
			const rotation = computedRotations[ri];
			let sumDistSq = 0;
			for (let i = 0; i < rotation.length; i++) {
				const segA = rotation[i];
				const segB = pathB[i];
				const endA = segA.slice(-2);
				const endB = segB.slice(-2);
				const dx = endA[0] - endB[0];
				const dy = endA[1] - endB[1];
				sumDistSq += dx * dx + dy * dy;
			}
			if (sumDistSq < minDistanceSq) {
				minDistanceSq = sumDistSq;
				bestIndex = ri;
			}
		}
		return computedRotations[bestIndex];
	}
	return getRotation(pathA, getBestRotationIndex(pathA, pathB));
}
// src/util/getTotalLength.ts
/**
* Returns the total length of a path, equivalent to `shape.getTotalLength()`.
*
* @param pathInput - The target path string or PathArray
* @returns the total length of the path
*
* @example
* ```ts
* getTotalLength('M0 0L100 0L100 100L0 100Z')
* // => 400
* ```
*/
const getTotalLength = (pathInput) => {
	const measures = measureSegments(pathInput);
	const last = measures[measures.length - 1];
	return last ? last.lengthAtSegment + last.length : 0;
};
// src/options/options.ts
/** SVGPathCommander default options */
const defaultOptions = {
	origin: [
		0,
		0,
		0
	],
	round: 4
};
// src/math/roundTo.ts
/**
* Rounds a number to the specified number of decimal places.
*
* @param n - The number to round
* @param round - Number of decimal places
* @returns The rounded number
*/
const roundTo = (n, round) => {
	const pow = round >= 1 ? 10 ** round : 1;
	return round > 0 ? Math.round(n * pow) / pow : Math.round(n);
};
// src/process/roundSegment.ts
/**
* Rounds the numeric values of a path segment to the specified precision.
*
* @param segment - The path segment to round
* @param roundOption - Number of decimal places
* @returns The rounded segment
*/
const roundSegment = (segment, roundOption) => {
	const result = new Array(segment.length);
	for (let i = 0; i < segment.length; i += 1) result[i] = i === 0 ? segment[0] : roundTo(segment[i], roundOption);
	return result;
};
// src/process/roundPath.ts
/**
* Rounds the values of a `pathArray` instance to
* a specified amount of decimals and returns it.
*
* @param path the source `pathArray`
* @param roundOption the amount of decimals to round numbers to
* @returns the resulted `pathArray` with rounded values
*/
const roundPath = (path, roundOption) => {
	let { round } = defaultOptions;
	round = roundOption === "off" ? roundOption : typeof roundOption === "number" && roundOption >= 0 ? roundOption : typeof round === "number" && round >= 0 ? round : "off";
	if (round === "off") return path.slice(0);
	return iterate(path.slice(0), (segment) => {
		return roundSegment(segment, round);
	});
};
// src/util/pathLengthTable.ts
/**
* Measures every segment of a normalized path in a single pass.
*
* A normalized path holds absolute `M`, `L`, `C`, `Q`, `A` and `Z` segments
* only, so no relative offsets and no shorthand control point reflections
* have to be resolved here — the length of a segment is exactly the length
* the point lookup at that distance will use.
*
* @param path - the normalized path to measure
* @returns the length table of the path
*/
const buildPathLengthTable = (path) => {
	const measures = [];
	let x = 0;
	let y = 0;
	let mx = 0;
	let my = 0;
	let totalLength = 0;
	let movetoCount = 0;
	for (const [index, segment] of path.entries()) {
		const command = segment[0];
		const measure = {
			segment,
			index,
			startX: x,
			startY: y,
			endX: x,
			endY: y,
			length: 0,
			lengthAtSegment: totalLength,
			geometry: segment
		};
		if (command === "M") {
			mx = segment[1];
			my = segment[2];
			measure.endX = mx;
			measure.endY = my;
			movetoCount += 1;
		} else if (command === "L") {
			measure.endX = segment[1];
			measure.endY = segment[2];
			measure.length = getLineLength(x, y, measure.endX, measure.endY);
		} else if (command === "C") {
			measure.endX = segment[5];
			measure.endY = segment[6];
			measure.length = getCubicLength(x, y, segment[1], segment[2], segment[3], segment[4], measure.endX, measure.endY);
		} else if (command === "Q") {
			measure.endX = segment[3];
			measure.endY = segment[4];
			measure.length = getQuadLength(x, y, segment[1], segment[2], measure.endX, measure.endY);
		} else if (command === "A") {
			measure.endX = segment[6];
			measure.endY = segment[7];
			measure.length = getArcLength(x, y, segment[1], segment[2], segment[3], segment[4], segment[5], measure.endX, measure.endY);
		} else if (command === "Z") {
			measure.endX = mx;
			measure.endY = my;
			measure.length = getLineLength(x, y, mx, my);
		}
		measures.push(measure);
		totalLength += measure.length;
		x = measure.endX;
		y = measure.endY;
	}
	const [startX, startY] = path[0]?.slice(1) ?? [];
	const last = measures[measures.length - 1];
	const isLoop = movetoCount === 1 && !!last && Math.hypot(last.endX - startX, last.endY - startY) <= 1e-5;
	return {
		measures,
		totalLength,
		startX,
		startY,
		isLoop
	};
};
// src/util/segmentFrame.ts
/**
* Returns a value without a negative zero.
*
* The negative zero is a valid number, but it is a surprise in a result:
* `Object.is(-0, 0)` is false, so a deep comparison of two equal frames
* would fail.
*
* @param value the value to clean
* @returns the value without a negative zero
*/
const cleanZero = (value) => value === 0 ? 0 : value;
/**
* Returns the unit vector of a direction.
*
* A direction without a length has no unit vector, so the zero vector is
* returned for it.
*
* @param x the X component of the direction
* @param y the Y component of the direction
* @returns the unit vector of the direction
*/
const normalizeVector = (x, y) => {
	const length = Math.sqrt(x * x + y * y);
	return length > 0 ? {
		x: cleanZero(x / length),
		y: cleanZero(y / length)
	} : {
		x: 0,
		y: 0
	};
};
/**
* Returns the frame of a point with a given direction.
*
* The normal is the left normal of the tangent, so it points to the left of
* the direction of the path, and the angle is the angle of the tangent in
* degrees, in the `-180` to `180` range.
*
* @param point the point of the frame
* @param x the X component of the direction
* @param y the Y component of the direction
* @returns the frame of the point
*/
const frameFrom = (point, x, y) => {
	const tangent = normalizeVector(x, y);
	return {
		point: {
			x: cleanZero(point.x),
			y: cleanZero(point.y)
		},
		tangent,
		normal: {
			x: cleanZero(-tangent.y),
			y: cleanZero(tangent.x)
		},
		angle: Math.atan2(tangent.y, tangent.x) * 180 / Math.PI
	};
};
/**
* Returns the frame of a line segment at a given distance.
*
* @param startX the X coordinate the segment starts at
* @param startY the Y coordinate the segment starts at
* @param endX the X coordinate the segment ends at
* @param endY the Y coordinate the segment ends at
* @param offset the distance from the start of the segment
* @param length the length of the segment
* @returns the frame of the segment
*/
const lineFrame = (startX, startY, endX, endY, offset, length) => {
	const dx = endX - startX;
	const dy = endY - startY;
	const ratio = length > 0 ? Math.min(Math.max(offset / length, 0), 1) : 0;
	return frameFrom({
		x: startX + dx * ratio,
		y: startY + dy * ratio
	}, dx, dy);
};
/**
* Returns the frame of a cubic Bezier segment at a given distance.
*
* The `t` ratio of the point is found once and shared with the tangent, so
* the point and the frame always describe the very same spot on the curve.
*
* @param coords the coordinates of the segment
* @param offset the distance from the start of the segment
* @param length the length of the segment
* @returns the frame of the segment
*/
const cubicFrame = (coords, offset, length) => {
	const t = offset <= 0 ? 0 : offset >= length ? 1 : getTAtBezierLength(coords, offset);
	const point = getPointAtCubicSegmentLength(coords, t);
	const derivative = computeBezier(deriveBezier(getBezierPoints(coords))[0], t);
	return frameFrom(point, derivative.x, derivative.y);
};
/**
* Returns the frame of a quadratic Bezier segment at a given distance.
*
* @param coords the coordinates of the segment
* @param offset the distance from the start of the segment
* @param length the length of the segment
* @returns the frame of the segment
*/
const quadFrame = (coords, offset, length) => {
	const t = offset <= 0 ? 0 : offset >= length ? 1 : getTAtBezierLength(coords, offset);
	const point = getPointAtQuadSegmentLength(coords, t);
	const derivative = computeBezier(deriveBezier(getBezierPoints(coords))[0], t);
	return frameFrom(point, derivative.x, derivative.y);
};
/**
* Returns the frame of an elliptical arc segment at a given distance.
*
* The parametric angle of the arc is found once and shared with the tangent,
* which is the derivative of the ellipse at that angle.
*
* @param startX the X coordinate the segment starts at
* @param startY the Y coordinate the segment starts at
* @param RX the radius on X axis
* @param RY the radius on Y axis
* @param rotation the ellipse rotation in degrees
* @param LAF the large arc flag
* @param SF the sweep flag
* @param endX the X coordinate the segment ends at
* @param endY the Y coordinate the segment ends at
* @param offset the distance from the start of the segment
* @param length the length of the segment
* @returns the frame of the segment
*/
const arcFrame = (startX, startY, RX, RY, rotation, LAF, SF, endX, endY, offset, length) => {
	const { center, rx, ry, startAngle, endAngle } = getArcProps(startX, startY, RX, RY, rotation, LAF, SF, endX, endY);
	if (rx === 0 || ry === 0) return lineFrame(startX, startY, endX, endY, offset, length);
	const sweepAngle = endAngle - startAngle;
	const { PI, cos, sin } = Math;
	const xRotRad = (rotation % 360 + 360) % 360 * (PI / 180);
	const tangentAt = (alpha) => {
		const cosA = cos(alpha);
		const sinA = sin(alpha);
		return {
			x: -cos(xRotRad) * rx * sinA - sin(xRotRad) * ry * cosA,
			y: -sin(xRotRad) * rx * sinA + cos(xRotRad) * ry * cosA
		};
	};
	const pointAt = (alpha) => {
		const ellipseX = rx * cos(alpha);
		const ellipseY = ry * sin(alpha);
		return {
			x: cos(xRotRad) * ellipseX - sin(xRotRad) * ellipseY + center.x,
			y: sin(xRotRad) * ellipseX + cos(xRotRad) * ellipseY + center.y
		};
	};
	if (length <= 0) return frameFrom({
		x: startX,
		y: startY
	}, 0, 0);
	const direction = sweepAngle < 0 ? -1 : 1;
	if (offset <= 0) {
		const tangent = tangentAt(startAngle);
		return frameFrom({
			x: startX,
			y: startY
		}, direction * tangent.x, direction * tangent.y);
	}
	if (offset >= length) {
		const tangent = tangentAt(endAngle);
		return frameFrom({
			x: endX,
			y: endY
		}, direction * tangent.x, direction * tangent.y);
	}
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 25; i += 1) {
		const mid = (lo + hi) / 2;
		if (Math.abs(arcLengthBetween(rx, ry, startAngle, startAngle + sweepAngle * mid)) < offset) lo = mid;
		else hi = mid;
	}
	const alpha = startAngle + sweepAngle * ((lo + hi) / 2);
	const tangent = tangentAt(alpha);
	return frameFrom(pointAt(alpha), direction * tangent.x, direction * tangent.y);
};
/**
* Returns the frame of a path segment at a given distance.
*
* The segment has to be an absolute one, with the shorthand commands
* expanded, so the geometry and the length of the segment agree.
*
* @param geometry the absolute segment
* @param startX the X coordinate the segment starts at
* @param startY the Y coordinate the segment starts at
* @param endX the X coordinate the segment ends at
* @param endY the Y coordinate the segment ends at
* @param offset the distance from the start of the segment
* @param length the length of the segment
* @returns the frame of the segment
*/
const getSegmentFrame = (geometry, startX, startY, endX, endY, offset, length) => {
	const command = geometry[0];
	if (command === "M") return frameFrom({
		x: endX,
		y: endY
	}, 0, 0);
	if (command === "L" || command === "Z") return lineFrame(startX, startY, endX, endY, offset, length);
	if (command === "C") {
		const coords = [
			startX,
			startY,
			geometry[1],
			geometry[2],
			geometry[3],
			geometry[4],
			endX,
			endY
		];
		return cubicFrame(coords, offset, length);
	}
	if (command === "Q") {
		const coords = [
			startX,
			startY,
			geometry[1],
			geometry[2],
			endX,
			endY
		];
		return quadFrame(coords, offset, length);
	}
	return arcFrame(startX, startY, geometry[1], geometry[2], geometry[3], geometry[4], geometry[5], endX, endY, offset, length);
};
// src/morph/resamplePath.ts
/**
* The angle the direction of a path has to change by to be a corner.
*
* A corner is a place where the path changes its direction abruptly: the
* vertex of a polygon, the point of a star, the tip of a spike. The fine
* structure of a flattened circle is not a corner — its vertices are an
* artifact of the flattening, not a shape — so the angle has to be big
* enough to tell the two apart.
*/
const CORNER_ANGLE = 10 * Math.PI / 180;
/**
* The share of the span of a curve its control points take.
*
* The control points of the cubic that replaces a span of the path sit at a
* third of the span from its ends, the same share the control points of the
* cubic of a circular arc have.
*/
const CONTROL_SHARE = 3;
/**
* Finds the length of the corners of a measured path.
*
* A corner is the end of a segment whose direction differs from the
* direction of the segment that follows it by more than the corner angle.
*
* @param measures - the measured segments of the path
* @returns the length of every corner of the path, in path order
*/
const findCorners = (measures) => {
	const corners = [];
	for (let i = 1; i < measures.length; i += 1) {
		const previous = measures[i - 1];
		const current = measures[i];
		if (previous.length <= 0 || current.length <= 0) continue;
		const incoming = getSegmentFrame(previous.geometry, previous.startX, previous.startY, previous.endX, previous.endY, previous.length, previous.length).tangent;
		const outgoing = getSegmentFrame(current.geometry, current.startX, current.startY, current.endX, current.endY, 0, current.length).tangent;
		if (!incoming.x && !incoming.y) continue;
		if (!outgoing.x && !outgoing.y) continue;
		const dot = incoming.x * outgoing.x + incoming.y * outgoing.y;
		const cross = incoming.x * outgoing.y - incoming.y * outgoing.x;
		if (Math.atan2(Math.abs(cross), dot) > CORNER_ANGLE) corners.push(current.lengthAtSegment);
	}
	return corners;
};
/**
* Distributes a number of intervals among a number of spans.
*
* The intervals are shared in proportion to the length of the spans, so the
* spacing of the intervals stays the same over the whole path. The spans
* that lose a fraction of an interval share it out, the one with the
* biggest fraction gets it.
*
* @param lengths - the length of every span
* @param extra - the number of intervals to distribute
* @returns the number of extra intervals of every span
*/
const distributeIntervals = (lengths, extra) => {
	const shares = lengths.map(() => 0);
	if (extra <= 0) return shares;
	const total = lengths.reduce((sum, length) => sum + length, 0);
	if (total <= 0) return shares;
	const remainders = [];
	let used = 0;
	for (let i = 0; i < lengths.length; i += 1) {
		const exact = lengths[i] / total * extra;
		const whole = Math.floor(exact);
		shares[i] = whole;
		used += whole;
		remainders.push({
			index: i,
			remainder: exact - whole
		});
	}
	remainders.sort((a, b) => b.remainder - a.remainder || a.index - b.index);
	let left = extra - used;
	for (let i = 0; left > 0 && remainders.length; i = (i + 1) % remainders.length) {
		shares[remainders[i].index] += 1;
		left -= 1;
	}
	return shares;
};
/**
* Builds the lengths of the knots of a resampled path.
*
* The knots are spread evenly over the length of the path, but the corners
* of the path are knots too, so the shape of the path keeps its vertices.
* The intervals between the corners are shared in proportion to their
* length, so the spacing of the knots stays the same over the whole path.
*
* When the corners of the path are more than the intervals of the result,
* they cannot all be knots: the knots are spread evenly then, and the shape
* of the path is approximated by its chords.
*
* @param totalLength - the length of the path
* @param intervals - the number of intervals of the result
* @param corners - the length of every corner of the path
* @returns the length of every knot of the result, in path order
*/
const buildKnots = (totalLength, intervals, corners) => {
	const spanCount = corners.length + 1;
	const knots = [];
	if (spanCount > intervals) {
		for (let i = 0; i <= intervals; i += 1) knots.push(totalLength * i / intervals);
		return knots;
	}
	const breakpoints = [
		0,
		...corners,
		totalLength
	];
	const lengths = breakpoints.slice(1).map((value, index) => value - breakpoints[index]);
	const shares = distributeIntervals(lengths, intervals - spanCount);
	for (let i = 0; i < spanCount; i += 1) {
		const from = breakpoints[i];
		const to = breakpoints[i + 1];
		const count = shares[i] + 1;
		for (let j = 0; j < count; j += 1) knots.push(from + (to - from) * j / count);
	}
	knots.push(totalLength);
	return knots;
};
/**
* Finds the index of the segment a distance falls into.
*
* The segment is the last one whose accumulated length is below the
* distance, the same segment the linear walk over the path would have
* stopped at. A distance at the end of a segment belongs to the segment
* before it, so the frame at that distance is the frame at the end of the
* segment.
*
* @param measures - the measured segments of the path
* @param distance - the distance along the path
* @returns the index of the segment
*/
const findSegmentIndex = (measures, distance) => {
	let low = 0;
	let high = measures.length - 1;
	while (low < high) {
		const mid = low + high + 1 >> 1;
		if (measures[mid].lengthAtSegment < distance) low = mid;
		else high = mid - 1;
	}
	return low;
};
/**
* Returns the direction of the path after a segment.
*
* The segments without a direction are skipped, so the direction of the
* path is the direction of the first segment that has one.
*
* @param measures - the measured segments of the path
* @param index - the index of the segment
* @returns the direction of the path, or `null` when the path has none
*/
const findNextDirection = (measures, index) => {
	for (let i = index + 1; i < measures.length; i += 1) {
		const measure = measures[i];
		if (measure.length <= 0) continue;
		const tangent = getSegmentFrame(measure.geometry, measure.startX, measure.startY, measure.endX, measure.endY, 0, measure.length).tangent;
		if (tangent.x || tangent.y) return tangent;
	}
	return null;
};
/**
* The share of the length of a path the end of the path can be over.
*
* The length of a path is the sum of the lengths of its segments, so the end
* of the path can be a fraction over the end of its last segment. The point
* at the end of the path is the end point of the path, not a point a
* fraction before it.
*/
const END_EPSILON = 1e-9;
/**
* Returns the frame of a path at a given length.
*
* @param table - the length table of the path
* @param distance - the distance along the path
* @returns the frame of the path at the given length
*/
const getFrameAt = (table, distance) => {
	const { measures, totalLength } = table;
	const index = findSegmentIndex(measures, distance);
	const measure = measures[index];
	const rawOffset = distance - measure.lengthAtSegment;
	const offset = totalLength - distance <= totalLength * END_EPSILON ? measure.length : Math.min(Math.max(rawOffset, 0), measure.length);
	const frame = getSegmentFrame(measure.geometry, measure.startX, measure.startY, measure.endX, measure.endY, offset, measure.length);
	let outgoing = frame.tangent;
	if (offset >= measure.length) {
		const next = findNextDirection(measures, index);
		if (next) outgoing = next;
	}
	return {
		point: frame.point,
		incoming: frame.tangent,
		outgoing
	};
};
/**
* Returns the number of corners of a measured path.
*
* A corner is a place where the path changes its direction abruptly, so the
* corners of a path are the vertices of its shape.
*
* @param table - the length table of the path
* @returns the number of corners of the path
*/
const getTableCornerCount = (table) => findCorners(table.measures).length;
/**
* Resamples a measured path to a given number of points, spread evenly by
* length.
*
* The path is measured along its length and the points of the result are
* spread evenly over it, so the distance between two points of the result
* is the same over the whole path. The corners of the path are points of
* the result too, so the shape of the path keeps its vertices.
*
* The result is a polyline, or a path of cubic Bezier segments when the
* curve mode is used: every cubic of the result starts at a point of the
* path and ends at the next one, with the direction of the path at both
* ends, so the curve of the path is kept.
*
* @param table - the length table of the path
* @param count - the number of points of the result
* @param mode - the type of the segments of the result
* @returns the resampled path
*/
const resampleFromTable = (table, count, mode) => {
	const { measures, totalLength } = table;
	if (!measures.length) return [];
	const intervals = Math.max(1, Math.floor(count)) - 1;
	if (totalLength <= 0) return [[
		"M",
		measures[0].endX,
		measures[0].endY
	]];
	if (intervals <= 0) return [[
		"M",
		table.startX,
		table.startY
	]];
	const corners = findCorners(measures);
	const knots = buildKnots(totalLength, intervals, corners);
	const frames = knots.map((knot) => getFrameAt(table, knot));
	const start = frames[0].point;
	const result = [[
		"M",
		start.x,
		start.y
	]];
	for (let i = 1; i < knots.length; i += 1) {
		const from = frames[i - 1];
		const to = frames[i];
		if (mode === "curve") {
			const share = (knots[i] - knots[i - 1]) / CONTROL_SHARE;
			const c1x = from.point.x + from.outgoing.x * share;
			const c1y = from.point.y + from.outgoing.y * share;
			const c2x = to.point.x - to.incoming.x * share;
			const c2y = to.point.y - to.incoming.y * share;
			result.push([
				"C",
				c1x,
				c1y,
				c2x,
				c2y,
				to.point.x,
				to.point.y
			]);
		} else result.push([
			"L",
			to.point.x,
			to.point.y
		]);
	}
	return mode === "curve" ? result : result;
};
/**
* Resamples a normalized path to a given number of points, spread evenly by
* length.
*
* @param path - the normalized path to resample
* @param count - the number of points of the result
* @param mode - the type of the segments of the result
* @returns the resampled path
*/
const resampleNormalizedPath = (path, count, mode) => resampleFromTable(buildPathLengthTable(path), count, mode);
/**
* Resamples a path to a given number of points, spread evenly by length.
*
* The path is measured along its length and the points of the result are
* spread evenly over it, so the distance between two points of the result
* is the same over the whole path. The corners of the path are points of
* the result too, so the shape of the path keeps its vertices.
*
* The result is a polyline, or a path of cubic Bezier segments when the
* curve mode is used: every cubic of the result starts at a point of the
* path and ends at the next one, with the direction of the path at both
* ends, so the curve of the path is kept.
*
* @param pathInput - the target path string or PathArray
* @param count - the number of points of the result
* @param mode - the type of the segments of the result
* @returns the resampled path
*
* @example
* ```ts
* resamplePath("M0 0L100 0L100 100", 3)
* // => [['M', 0, 0], ['L', 100, 0], ['L', 100, 100]]
* ```
*/
const resamplePath = (pathInput, count, mode = "line") => resampleNormalizedPath(normalizePath(pathInput), count, mode);
// src/morph/equalizeSegments.ts
const equalizeSegmentsDefaults = {
	mode: "auto",
	strategy: "segment",
	align: true,
	sampleSize: 10,
	roundValues: 4,
	reverse: true,
	close: false,
	target: void 0
};
/**
* Returns the start and the end point of a path.
*
* A closed path ends at the start of its sub-path, so the end point of a
* path that ends with a close command is the start of the sub-path it
* belongs to.
*
* @param path - the path to read
* @returns the start and the end point of the path
*/
const getPathEnds = (path) => {
	const first = path[0];
	const start = {
		x: first[1],
		y: first[2]
	};
	let subStart = start;
	let end = start;
	for (const segment of path) {
		const command = segment[0];
		if (command === "M") {
			subStart = {
				x: segment[1],
				y: segment[2]
			};
			end = subStart;
		} else if (command === "Z") end = subStart;
		else end = {
			x: segment[segment.length - 2],
			y: segment[segment.length - 1]
		};
	}
	return {
		start,
		end
	};
};
/**
* Returns the distance between two points.
*
* @param a - the first point
* @param b - the second point
* @returns the distance between the points
*/
const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
/**
* Returns the number of points the arc length strategy uses.
*
* The number of points of the result is the number of the segments of the
* bigger path, so the result holds as much of the shape of the paths as
* their own segments do. The corners of the paths are points of the result
* too, so the number of points is raised when the corners do not fit.
*
* @param table1 - the length table of the first path
* @param table2 - the length table of the second path
* @param target - the requested number of points
* @returns the number of points of the result
*/
const getArcLengthCount = (table1, table2, target) => {
	if (typeof target === "number") return Math.max(2, Math.floor(target));
	return Math.max(table1.measures.length, table2.measures.length, getTableCornerCount(table1) + 2, getTableCornerCount(table2) + 2);
};
/**
* Equalizes two paths for morphing (single subpath only).
*
* @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
* @param path1 - First path string or PathArray
* @param path2 - Second path string or PathArray
* @param initialCfg - Equalization options
* @returns Tuple of two equalized MorphPathArrays
*
* @example
* ```ts
* const [eq1, eq2] = equalizeSegments('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
* // eq1.length === eq2.length
* ```
*/
const equalizeSegments = (path1, path2, initialCfg = {}) => {
	const { align, close, mode, reverse, roundValues, strategy, target: initialTarget } = {
		...equalizeSegmentsDefaults,
		...initialCfg
	};
	let p1 = normalizePath(path1);
	let p2 = normalizePath(path2);
	fixPath(p1);
	fixPath(p2);
	const bothPoly = (isPolygonArray(p1) || isPolylineArray(p1)) && (isPolygonArray(p2) || isPolylineArray(p2));
	const area1 = polygonArea(samplePolygon(p1));
	const area2 = polygonArea(samplePolygon(p2));
	if (reverse !== false && Math.sign(area1) !== Math.sign(area2)) {
		if (reverse === "auto") {
			const ends1 = getPathEnds(p1);
			const ends2 = getPathEnds(p2);
			if (getDistance(ends1.end, ends2.start) < getDistance(ends1.start, ends2.end)) p1 = reversePath(p1);
			else p2 = reversePath(p2);
		} else p2 = reversePath(p2);
	}
	if (strategy === "arcLength") {
		const table1 = buildPathLengthTable(p1);
		const table2 = buildPathLengthTable(p2);
		const count = getArcLengthCount(table1, table2, initialTarget);
		const resampleMode = mode === "curve" ? "curve" : mode === "line" ? "line" : bothPoly ? "line" : "curve";
		let equalP1 = resampleFromTable(table1, count, resampleMode);
		let equalP2 = resampleFromTable(table2, count, resampleMode);
		if (align !== false) equalP2 = getRotatedPath(equalP2, equalP1);
		if (typeof roundValues === "number" && roundValues !== 4) {
			equalP1 = roundPath(equalP1, roundValues);
			equalP2 = roundPath(equalP2, roundValues);
		}
		if (close) {
			equalP1.push(["Z"]);
			equalP2.push(["Z"]);
		}
		return [equalP1, equalP2];
	}
	let bothPolyline = bothPoly;
	if (bothPolyline && mode !== "curve") {
		p1 = pathToPolyline(p1);
		p2 = pathToPolyline(p2);
	} else {
		bothPolyline = false;
		p1 = pathToCurve(p1);
		p2 = pathToCurve(p2);
	}
	const segCount1 = p1.length;
	const segCount2 = p2.length;
	const minTarget = Math.max(segCount1, segCount2);
	let target = minTarget;
	if (typeof initialTarget !== "number") {
		const avgLen = (getTotalLength(p1) + getTotalLength(p2)) / 2;
		const avgSegLen = avgLen / Math.max(segCount1, segCount2);
		const idealSegCount = Math.max(minTarget, Math.round(avgLen / Math.max(avgSegLen, 1)));
		target = Math.min(idealSegCount, Math.max(segCount1, segCount2) * 3);
	} else if (initialTarget >= minTarget) target = initialTarget;
	else console.warn("equalizeSegments \"target\" option: " + initialTarget + ", expected >= " + minTarget);
	let equalP1 = p1;
	let equalP2 = p2;
	if (bothPolyline) {
		equalP1 = splitLinePathToCount(p1, target);
		equalP2 = splitLinePathToCount(p2, target);
	} else {
		equalP1 = splitCurvePathToCount(p1, target);
		equalP2 = splitCurvePathToCount(p2, target);
	}
	if (align !== false) equalP2 = getRotatedPath(equalP2, equalP1);
	if (typeof roundValues === "number" && roundValues !== 4) {
		equalP1 = roundPath(equalP1, roundValues);
		equalP2 = roundPath(equalP2, roundValues);
	}
	if (close) {
		equalP1.push(["Z"]);
		equalP2.push(["Z"]);
	}
	return [equalP1, equalP2];
};
// src/intersect/isPointInsideBBox.ts
/**
* Checks if a point is inside a bounding box.
*
* @param bbox - The bounding box as [minX, minY, maxX, maxY]
* @param point - The point as [x, y]
* @returns True if the point is inside or on the edge of the bounding box
*/
const isPointInsideBBox = (bbox, [x, y]) => {
	const [minX, minY, maxX, maxY] = bbox;
	return x >= minX && x <= maxX && y >= minY && y <= maxY;
};
// src/intersect/boundingBoxIntersect.ts
/**
* Checks if two bounding boxes intersect.
*
* @param a - First bounding box as [minX, minY, maxX, maxY]
* @param b - Second bounding box as [minX, minY, maxX, maxY]
* @returns True if the bounding boxes overlap
*/
const boundingBoxIntersect = (a, b) => {
	const [ax1, ay1, ax2, ay2] = a;
	const [bx1, by1, bx2, by2] = b;
	return isPointInsideBBox(b, [ax1, ay1]) || isPointInsideBBox(b, [ax2, ay1]) || isPointInsideBBox(b, [ax1, ay2]) || isPointInsideBBox(b, [ax2, ay2]) || isPointInsideBBox(a, [bx1, by1]) || isPointInsideBBox(a, [bx2, by1]) || isPointInsideBBox(a, [bx1, by2]) || isPointInsideBBox(a, [bx2, by2]) || (ax1 < bx2 && ax1 > bx1 || bx1 < ax2 && bx1 > ax1) && (ay1 < by2 && ay1 > by1 || by1 < ay2 && by1 > ay1);
};
// src/morph/createPlaceholder.ts
/**
* Create a degenerate `PathArray` at a given coordinate
* to serve as a pair for another `PathArray`.
* @param param0 An [x, y] tuple for the coordinate
* @returns A new degenerate `PathArray`
*/
const createPlaceholder = ([atx, aty]) => {
	const r = .001;
	return [
		[
			"M",
			atx,
			aty
		],
		[
			"L",
			atx + r,
			aty
		],
		[
			"L",
			atx + r,
			aty + r
		],
		[
			"L",
			atx,
			aty + r
		],
		[
			"L",
			atx,
			aty
		],
		["Z"]
	];
};
// src/morph/matchPaths.ts
function getBestMatch(target, candidates) {
	const targetBBox = target.bbox;
	const potentialCandidates = [];
	for (let i = 0; i < candidates.length; i++) {
		const { bbox, size } = candidates[i];
		const dx = targetBBox.cx - bbox.cx;
		const dy = targetBBox.cy - bbox.cy;
		const centeredDistance = Math.sqrt(dx * dx + dy * dy);
		const sizeDifference = Math.abs(target.size - size) / Math.max(target.size, size, 1e-6);
		const hasOverlap = isPointInsideBBox([
			targetBBox.x,
			targetBBox.y,
			targetBBox.x2,
			targetBBox.y2
		], [bbox.cx, bbox.cy]) || isPointInsideBBox([
			bbox.x,
			bbox.y,
			bbox.x2,
			bbox.y2
		], [targetBBox.cx, targetBBox.cy]);
		const boxIntersect = boundingBoxIntersect([
			targetBBox.x,
			targetBBox.y,
			targetBBox.x2,
			targetBBox.y2
		], [
			bbox.x,
			bbox.y,
			bbox.x2,
			bbox.y2
		]);
		potentialCandidates.push({
			index: i,
			hasOverlap,
			boxIntersect,
			sizeDifference,
			centeredDistance
		});
	}
	const overlaping = potentialCandidates.filter((c) => c.hasOverlap && c.boxIntersect);
	if (overlaping.length > 0) {
		let best = overlaping[0];
		for (let i = 1; i < overlaping.length; i++) if (overlaping[i].centeredDistance < best.centeredDistance) best = overlaping[i];
		return candidates.splice(best.index, 1)[0];
	}
	return null;
}
/**
* Matches paths from two sets by proximity and size similarity.
* Unmatched paths receive placeholder paths at their centroid.
*
* @param fromPaths - Source path features to match from
* @param toPaths - Target path features to match to
* @returns Array of paired NormalArrays [from, to]
*/
function matchPaths(fromPaths, toPaths) {
	const pairs = [];
	const from = [...fromPaths].sort((a, b) => b.size - a.size);
	const to = [...toPaths].sort((a, b) => b.size - a.size);
	while (from.length > 0) {
		const fromPath = from.shift();
		const bestTo = getBestMatch(fromPath, to);
		if (bestTo) pairs.push([fromPath.path, bestTo.path]);
		else {
			const fromCentroid = [fromPath.bbox.cx, fromPath.bbox.cy];
			pairs.push([fromPath.path, createPlaceholder(fromCentroid)]);
		}
	}
	while (to.length > 0) {
		const toPath = to.shift();
		const toCentroid = [toPath.bbox.cx, toPath.bbox.cy];
		pairs.push([createPlaceholder(toCentroid), toPath.path]);
	}
	return pairs;
}
// src/util/getPathBBox.ts
/**
* The bounding box of an empty path.
*/
const emptyBBox = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	x2: 0,
	y2: 0,
	cx: 0,
	cy: 0,
	cz: 0
};
/**
* Calculates the bounding box of a path.
*
* @param pathInput - The path string or PathArray
* @returns An object with width, height, x, y, x2, y2, cx, cy, cz properties
*
* @example
* ```ts
* getPathBBox('M0 0L100 0L100 100L0 100Z')
* // => { x: 0, y: 0, width: 100, height: 100, x2: 100, y2: 100, cx: 50, cy: 50, cz: 150 }
* ```
*/
const getPathBBox = (pathInput) => {
	if (!pathInput) return { ...emptyBBox };
	const path = parsePathString(pathInput);
	if (!path.length) return { ...emptyBBox };
	let pathCommand = "M";
	let mx = 0;
	let my = 0;
	const { max, min } = Math;
	let xMin = Infinity;
	let yMin = Infinity;
	let xMax = -Infinity;
	let yMax = -Infinity;
	let minX = 0;
	let minY = 0;
	let maxX = 0;
	let maxY = 0;
	let paramX1 = 0;
	let paramY1 = 0;
	let paramX2 = 0;
	let paramY2 = 0;
	let paramQX = null;
	let paramQY = null;
	iterate(path, (seg, index, lastX, lastY) => {
		[pathCommand] = seg;
		const commandCode = pathCommand.charCodeAt(0);
		const isRelative = commandCode >= 97;
		const absCommand = isRelative ? String.fromCharCode(commandCode - 32) : pathCommand;
		const absoluteSegment = isRelative ? absolutizeSegment(seg, index, lastX, lastY) : seg;
		const normalSegment = absCommand === "V" ? [
			"L",
			lastX,
			absoluteSegment[1]
		] : absCommand === "H" ? [
			"L",
			absoluteSegment[1],
			lastY
		] : absoluteSegment;
		[pathCommand] = normalSegment;
		if (absCommand !== "T" && absCommand !== "Q") {
			paramQX = null;
			paramQY = null;
		}
		if (pathCommand === "M") {
			[, mx, my] = normalSegment;
			minX = mx;
			minY = my;
			maxX = mx;
			maxY = my;
		} else if (pathCommand === "L") [minX, minY, maxX, maxY] = getLineBBox(lastX, lastY, normalSegment[1], normalSegment[2]);
		else if (pathCommand === "A") [minX, minY, maxX, maxY] = getArcBBox(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4], normalSegment[5], normalSegment[6], normalSegment[7]);
		else if (pathCommand === "S") {
			const cp1x = paramX1 * 2 - paramX2;
			const cp1y = paramY1 * 2 - paramY2;
			[minX, minY, maxX, maxY] = getCubicBBox(lastX, lastY, cp1x, cp1y, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4]);
		} else if (pathCommand === "C") [minX, minY, maxX, maxY] = getCubicBBox(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4], normalSegment[5], normalSegment[6]);
		else if (pathCommand === "T") {
			paramQX = paramQX === null ? lastX : paramX1 * 2 - paramQX;
			paramQY = paramQY === null ? lastY : paramY1 * 2 - paramQY;
			[minX, minY, maxX, maxY] = getQuadBBox(lastX, lastY, paramQX, paramQY, normalSegment[1], normalSegment[2]);
		} else if (pathCommand === "Q") {
			paramQX = normalSegment[1];
			paramQY = normalSegment[2];
			[minX, minY, maxX, maxY] = getQuadBBox(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4]);
		} else if (pathCommand === "Z") [minX, minY, maxX, maxY] = getLineBBox(lastX, lastY, mx, my);
		xMin = min(minX, xMin);
		yMin = min(minY, yMin);
		xMax = max(maxX, xMax);
		yMax = max(maxY, yMax);
		if (pathCommand === "Z") {
			paramX1 = mx;
			paramY1 = my;
		} else {
			const segLen = normalSegment.length;
			paramX1 = normalSegment[segLen - 2];
			paramY1 = normalSegment[segLen - 1];
		}
		if (pathCommand === "C") {
			paramX2 = normalSegment[3];
			paramY2 = normalSegment[4];
		} else if (pathCommand === "S") {
			paramX2 = normalSegment[1];
			paramY2 = normalSegment[2];
		} else {
			paramX2 = paramX1;
			paramY2 = paramY1;
		}
	});
	const width = xMax - xMin;
	const height = yMax - yMin;
	return {
		width,
		height,
		x: xMin,
		y: yMin,
		x2: xMax,
		y2: yMax,
		cx: xMin + width / 2,
		cy: yMin + height / 2,
		cz: Math.max(width, height) + Math.min(width, height) / 2
	};
};
// src/morph/classifyPaths.ts
/**
* Classifies paths into outer (containing) and inner (hole) paths.
*
* A path is an inner path when it is contained by another path of the
* same set. The winding of a contour is not used for the classification:
* the shoelace sign only tells the direction of the contour, and in the
* SVG coordinate system (y pointing down) the usual outer contour has a
* *negative* signed area.
*
* @param paths - Array of normalized path arrays to classify
* @returns Object with `outers` (containing shapes) and `inners` (holes)
*/
const classifyPaths = (paths) => {
	const features = paths.map((path) => {
		const signedArea = polygonArea(samplePolygon(path));
		const bbox = getPathBBox(path);
		return {
			isPoly: isPolygonArray(path) || isPolylineArray(path),
			size: bbox.width * bbox.height,
			path,
			signedArea,
			area: Math.abs(signedArea),
			bbox
		};
	});
	const outers = [];
	const inners = [];
	for (const feature of features) if (features.some((other) => other !== feature && other.area > feature.area && isPointInsideBBox([
		other.bbox.x,
		other.bbox.y,
		other.bbox.x2,
		other.bbox.y2
	], [feature.bbox.cx, feature.bbox.cy]))) inners.push(feature);
	else outers.push(feature);
	return {
		outers,
		inners
	};
};
// src/morph/equalizePaths.ts
const equalizePathsDefaults = {
	mode: "auto",
	strategy: "segment",
	align: true,
	roundValues: 4,
	close: false,
	sampleSize: 10
};
/**
* Equalizes two paths for morphing (single/multi subpath).
*
* @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
* @param pathInput1 - First path string or PathArray
* @param pathInput2 - Second path string or PathArray
* @param initialCfg - Configuration options for equalization
* @returns Tuple of two equalized MorphPathArrays
*
* @example
* ```ts
* const [eq1, eq2] = equalizePaths('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
* // eq1.length === eq2.length — ready for morphing
* ```
*/
const equalizePaths = (pathInput1, pathInput2, initialCfg = {}) => {
	const cfg = {
		...equalizePathsDefaults,
		...initialCfg
	};
	const p1 = normalizePath(pathInput1);
	const p2 = normalizePath(pathInput2);
	const multi1 = isMultiPath(p1);
	const multi2 = isMultiPath(p2);
	if (!multi1 && !multi2) return equalizeSegments(p1, p2, cfg);
	const globalArea1 = polygonArea(samplePolygon(p1));
	const globalArea2 = polygonArea(samplePolygon(p2));
	let path1 = p1;
	let path2 = p2;
	if (cfg.reverse === void 0 || cfg.reverse === true) {
		if (Math.sign(globalArea1) < 0) path1 = reversePath(path1);
		if (Math.sign(globalArea2) < 0) path2 = reversePath(path2);
	}
	const multiPath1 = splitPath(path1);
	const multiPath2 = splitPath(path2);
	const { outers: outers1, inners: inners1 } = classifyPaths(multiPath1);
	const { outers: outers2, inners: inners2 } = classifyPaths(multiPath2);
	const outerPairs = matchPaths(outers1, outers2);
	const innerPairs = matchPaths(inners1, inners2);
	const equalizedPairs = [];
	for (const [from, to] of [...outerPairs, ...innerPairs]) {
		const [eqFrom, eqTo] = equalizeSegments(from, to, {
			...cfg,
			reverse: cfg.reverse === "auto" ? "auto" : false
		});
		equalizedPairs.push([eqFrom, eqTo]);
	}
	return [equalizedPairs.map((p) => p[0]).flat(), equalizedPairs.map((p) => p[1]).flat()];
};
// src/morph/equalize.ts
const equalizeDefaults = {
	points: "auto",
	strategy: "segment",
	align: true,
	reverse: "auto",
	mode: "auto",
	roundValues: 4,
	close: false
};
/**
* Equalizes two paths for morphing.
*
* The two paths are brought to the same shape, so they can be morphed into
* each other: they hold the same number of segments of the same type, their
* winding is the same and their points are aligned.
*
* A path with a single sub-path is equalized on its own, a path with more
* sub-paths is split into sub-paths, the sub-paths are matched by their
* shape and every pair is equalized on its own.
*
* The `strategy` option decides how the points of the paths are placed:
* - `segment` splits the segments of the paths, so the points of the result
*   are the points of the paths;
* - `arcLength` spreads the points of the result evenly over the length of
*   the paths, so the distance between two points of the result is the same
*   over the whole path. The corners of the paths are points of the result
*   too, so the shape of the paths keeps its vertices.
*
* The `points` option is the number of points of the result. The automatic
* mode uses the number of points of the bigger path, raised when the corners
* of the paths do not fit.
*
* The `reverse` option decides what happens when the two paths draw in
* opposite directions: `true` reverses the second path, `false` leaves the
* paths as they are and `auto` reverses the path that leaves the two paths
* closest to each other.
*
* @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
*
* @param pathInput1 - First path string or PathArray
* @param pathInput2 - Second path string or PathArray
* @param initialCfg - Configuration options for equalization
* @returns Tuple of two equalized MorphPathArrays
*
* @example
* ```ts
* const [eq1, eq2] = equalize('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
* // eq1.length === eq2.length — ready for morphing
* ```
*/
const equalize = (pathInput1, pathInput2, initialCfg = {}) => {
	const { align, close, mode, points, reverse, roundValues, strategy } = {
		...equalizeDefaults,
		...initialCfg
	};
	if (typeof points === "number" && (!Number.isFinite(points) || points < 2)) throw new TypeError(`${error}: points must be a number greater than 1`);
	const p1 = normalizePath(pathInput1);
	const p2 = normalizePath(pathInput2);
	if (isMultiPath(p1) || isMultiPath(p2)) return equalizePaths(p1, p2, {
		align,
		close,
		mode,
		reverse,
		roundValues,
		strategy,
		target: typeof points === "number" ? points : void 0
	});
	return equalizeSegments(p1, p2, {
		align,
		close,
		mode,
		reverse,
		roundValues,
		strategy,
		target: typeof points === "number" ? points : void 0
	});
};
export { equalize, equalizePaths, equalizeSegments, fixPath, resamplePath, splitCubicSegment };

//# sourceMappingURL=morph.js.map