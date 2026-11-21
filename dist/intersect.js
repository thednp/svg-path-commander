/*!
* SVGPathCommander INTERSECT v2.4.0 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
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
// src/util/error.ts
/** Error prefix used in all SVGPathCommander TypeError messages. */
const error = "SVGPathCommanderError";
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
* Returns the point along a CubicBezier segment at a given distance.
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param c1x the first control point X
* @param c1y the first control point Y
* @param c2x the second control point X
* @param c2y the second control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @param distance the distance to look at
* @returns the point at CubicBezier length
*/
const getPointAtCubicLength = (x1, y1, c1x, c1y, c2x, c2y, x2, y2, distance) => {
	const distanceIsNumber = typeof distance === "number";
	let point = {
		x: x1,
		y: y1
	};
	if (distanceIsNumber) {
		const coords = [
			x1,
			y1,
			c1x,
			c1y,
			c2x,
			c2y,
			x2,
			y2
		];
		const currentLength = getBezierLength(coords);
		if (distance <= 0) {} else if (distance >= currentLength) point = {
			x: x2,
			y: y2
		};
		else {
			const t = getTAtBezierLength(coords, distance);
			point = getPointAtCubicSegmentLength(coords, t);
		}
	}
	return point;
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
// src/util/distanceEpsilon.ts
/** Small threshold value used for floating-point distance comparisons in path calculations. */
const DISTANCE_EPSILON = 1e-5;
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
// src/intersect/interHelper.ts
const intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
	if (Math.max(x1, x2) < Math.min(x3, x4) || Math.min(x1, x2) > Math.max(x3, x4) || Math.max(y1, y2) < Math.min(y3, y4) || Math.min(y1, y2) > Math.max(y3, y4)) return;
	const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4), ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4), denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	if (!denominator) return;
	const px = nx / denominator, py = ny / denominator, px2 = roundTo(px, 2), py2 = roundTo(py, 2);
	if (px2 < roundTo(Math.min(x1, x2), 2) || px2 > roundTo(Math.max(x1, x2), 2) || px2 < roundTo(Math.min(x3, x4), 2) || px2 > roundTo(Math.max(x3, x4), 2) || py2 < roundTo(Math.min(y1, y2), 2) || py2 > roundTo(Math.max(y1, y2), 2) || py2 < roundTo(Math.min(y3, y4), 2) || py2 > roundTo(Math.max(y3, y4), 2)) return;
	return {
		x: px,
		y: py
	};
};
/**
* Returns the intersection point(s) of two cubic Bezier curves.
*
* @param bez1 the coordinates of the first cubic Bezier segment
* @param bez2 the coordinates of the second cubic Bezier segment
* @param config optional intersection options
* @returns the intersection points, or `undefined` if the curves do not intersect
*/
const interHelper = (bez1, bez2, config) => {
	const bbox1 = getCubicBBox(...bez1);
	const bbox2 = getCubicBBox(...bez2);
	const { justCount, epsilon } = Object.assign({
		justCount: true,
		epsilon: DISTANCE_EPSILON
	}, config);
	if (!boundingBoxIntersect(bbox1, bbox2)) return justCount ? 0 : [];
	const l1 = getCubicLength(...bez1), l2 = getCubicLength(...bez2), n1 = Math.max(l1 / 5 >> 0, 1), n2 = Math.max(l2 / 5 >> 0, 1), points1 = [], points2 = [], xy = {};
	let res = justCount ? 0 : [];
	for (let i = 0; i < n1 + 1; i++) {
		const p = getPointAtCubicLength(...bez1, i / n1 * l1);
		points1.push({
			x: p.x,
			y: p.y,
			t: i / n1
		});
	}
	for (let i = 0; i < n2 + 1; i++) {
		const p = getPointAtCubicLength(...bez2, i / n2 * l2);
		points2.push({
			x: p.x,
			y: p.y,
			t: i / n2
		});
	}
	for (let i = 0; i < n1; i++) for (let j = 0; j < n2; j++) {
		const maxLimit = 1 + epsilon, di = points1[i], di1 = points1[i + 1], dj = points2[j], dj1 = points2[j + 1], ci = Math.abs(di1.x - di.x) < .001 ? "y" : "x", cj = Math.abs(dj1.x - dj.x) < .001 ? "y" : "x", is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
		if (is) {
			if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) continue;
			xy[is.x.toFixed(4)] = is.y.toFixed(4);
			const t1 = di.t + Math.abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t), t2 = dj.t + Math.abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
			if (t1 >= 0 && t1 <= maxLimit && t2 >= 0 && t2 <= maxLimit) {
				if (justCount) res++;
				else res.push({
					x: is.x,
					y: is.y,
					t1: Math.min(t1, 1),
					t2: Math.min(t2, 1)
				});
			}
		}
	}
	return res;
};
// src/intersect/pathIntersection.ts
/**
* Finds intersection points between two paths.
*
* @param pathInput1 - First path string or PathArray
* @param pathInput2 - Second path string or PathArray
* @param justCount - If true, returns the count of intersections; if false, returns the intersection points
* @returns The number of intersections (when justCount is true) or an array of IntersectionPoint objects
*
* @example
* ```ts
* pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', true)
* // => 1
* pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', false)
* // => [{ x: 80.4136, y: 19.5864, t1: 0.7262, t2: 0.2738 }]
* ```
*/
const pathsIntersection = (pathInput1, pathInput2, justCount = true) => {
	const path1 = pathToCurve(pathInput1);
	const path2 = pathToCurve(pathInput2);
	let x1 = 0, y1 = 0, x2 = 0, y2 = 0, x1m = 0, y1m = 0, x2m = 0, y2m = 0, bez1 = [
		x1,
		y1,
		x1,
		y1,
		x1m,
		y1m,
		x1m,
		y1m
	], bez2 = [
		x2,
		y2,
		x2,
		y2,
		x2m,
		y2m,
		x2m,
		y2m
	], countResult = 0;
	const pointsResult = [];
	const pathLen1 = path1.length;
	const pathLen2 = path2.length;
	for (let i = 0; i < pathLen1; i++) {
		const seg1 = path1[i];
		if (seg1[0] == "M") {
			x1 = seg1[1];
			y1 = seg1[2];
			x1m = x1;
			y1m = y1;
		} else {
			if (seg1[0] == "C") {
				bez1 = [
					x1,
					y1,
					seg1[1],
					seg1[2],
					seg1[3],
					seg1[4],
					seg1[5],
					seg1[6]
				];
				x1 = bez1[6];
				y1 = bez1[7];
			} else {
				bez1 = [
					x1,
					y1,
					x1,
					y1,
					x1m,
					y1m,
					x1m,
					y1m
				];
				x1 = x1m;
				y1 = y1m;
			}
			for (let j = 0; j < pathLen2; j++) {
				const seg2 = path2[j];
				if (seg2[0] == "M") {
					x2 = seg2[1];
					y2 = seg2[2];
					x2m = x2;
					y2m = y2;
				} else if (seg2[0] == "C") {
					bez2 = [
						x2,
						y2,
						seg2[1],
						seg2[2],
						seg2[3],
						seg2[4],
						seg2[5],
						seg2[6]
					];
					x2 = bez2[6];
					y2 = bez2[7];
				}
				const intr = interHelper(bez1, bez2, { justCount });
				if (justCount) countResult += intr;
				else pointsResult.push(...intr);
			}
		}
	}
	return justCount ? countResult : pointsResult;
};
export { boundingBoxIntersect, isPointInsideBBox, pathsIntersection };

//# sourceMappingURL=intersect.js.map