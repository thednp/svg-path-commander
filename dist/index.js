/*!
* SVGPathCommander v2.2.0 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
import CSSMatrix from "@thednp/dommatrix";
//#region package.json
var version = "2.2.0";
//#endregion
//#region src/math/midPoint.ts
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
//#endregion
//#region src/math/distanceSquareRoot.ts
/**
* Returns the square root of the distance
* between two given points.
*
* @param a the first point coordinates
* @param b the second point coordinates
* @returns the distance value
*/
const distanceSquareRoot = (a, b) => {
	return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
};
//#endregion
//#region src/math/lineTools.ts
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
	return distanceSquareRoot([x1, y1], [x2, y2]);
};
/**
* Returns a point along the line segments (MoveTo, LineTo).
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @param distance the distance to point in [0-1] range
* @returns the point at length
*/
const getPointAtLineLength = (x1, y1, x2, y2, distance) => {
	let point = {
		x: x1,
		y: y1
	};
	if (typeof distance === "number") {
		const length = distanceSquareRoot([x1, y1], [x2, y2]);
		if (distance <= 0) point = {
			x: x1,
			y: y1
		};
		else if (distance >= length) point = {
			x: x2,
			y: y2
		};
		else {
			const [x, y] = midPoint([x1, y1], [x2, y2], distance / length);
			point = {
				x,
				y
			};
		}
	}
	return point;
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
const lineTools = {
	getLineBBox,
	getLineLength,
	getPointAtLineLength
};
//#endregion
//#region src/math/arcTools.ts
/**
* Returns the Arc segment length.
* @param rx radius along X axis
* @param ry radius along Y axis
* @param theta the angle in radians
* @returns the arc length
*/
const arcLength = (rx, ry, theta) => {
	const halfTheta = theta / 2;
	const sinHalfTheta = Math.sin(halfTheta);
	const cosHalfTheta = Math.cos(halfTheta);
	const term1 = rx ** 2 * sinHalfTheta ** 2;
	const term2 = ry ** 2 * cosHalfTheta ** 2;
	const length = Math.sqrt(term1 + term2) * theta;
	return Math.abs(length);
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
	return (v0x * v1y - v0y * v1x < 0 ? -1 : 1) * Math.acos(p / n);
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
	let sweepAngle = angleBetween(startVector, {
		x: (-transformedPoint.x - transformedCenter.x) / rx,
		y: (-transformedPoint.y - transformedCenter.y) / ry
	});
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
	const { rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
	return arcLength(rx, ry, endAngle - startAngle);
};
/**
* Returns a point along an Arc segment at a given distance.
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
* @param distance the distance along the arc
* @returns a point along the Arc segment
*/
const getPointAtArcLength = (x1, y1, RX, RY, angle, LAF, SF, x, y, distance) => {
	let point = {
		x: x1,
		y: y1
	};
	const { center, rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
	if (typeof distance === "number") {
		const length = arcLength(rx, ry, endAngle - startAngle);
		if (distance <= 0) point = {
			x: x1,
			y: y1
		};
		else if (distance >= length) point = {
			x,
			y
		};
		else {
			if (x1 === x && y1 === y) return {
				x,
				y
			};
			if (rx === 0 || ry === 0) return getPointAtLineLength(x1, y1, x, y, distance);
			const { PI, cos, sin } = Math;
			const sweepAngle = endAngle - startAngle;
			const xRotRad = (angle % 360 + 360) % 360 * (PI / 180);
			const alpha = startAngle + sweepAngle * (distance / length);
			const ellipseComponentX = rx * cos(alpha);
			const ellipseComponentY = ry * sin(alpha);
			point = {
				x: cos(xRotRad) * ellipseComponentX - sin(xRotRad) * ellipseComponentY + center.x,
				y: sin(xRotRad) * ellipseComponentX + cos(xRotRad) * ellipseComponentY + center.y
			};
		}
	}
	return point;
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
	const { center, rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
	const deltaAngle = endAngle - startAngle;
	const { min, max, tan, atan2, PI } = Math;
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
	const xArray = [x];
	const yArray = [y];
	let xMin = min(x1, x);
	let xMax = max(x1, x);
	let yMin = min(y1, y);
	let yMax = max(y1, y);
	const pP2 = arcPoint(cx, cy, rx, ry, alpha, endAngle - deltaAngle * 1e-5);
	const pP3 = arcPoint(cx, cy, rx, ry, alpha, endAngle - deltaAngle * .99999);
	/**
	* expected extremes
	* if leaving inner bounding box
	* (between segment start and end point)
	* otherwise exclude elliptic extreme points
	*/
	if (pP2[0] > xMax || pP3[0] > xMax) {
		const p1 = arcPoint(cx, cy, rx, ry, alpha, angle1);
		xArray.push(p1[0]);
		yArray.push(p1[1]);
	}
	if (pP2[0] < xMin || pP3[0] < xMin) {
		const p2 = arcPoint(cx, cy, rx, ry, alpha, angle2);
		xArray.push(p2[0]);
		yArray.push(p2[1]);
	}
	if (pP2[1] < yMin || pP3[1] < yMin) {
		const p4 = arcPoint(cx, cy, rx, ry, alpha, angle4);
		xArray.push(p4[0]);
		yArray.push(p4[1]);
	}
	if (pP2[1] > yMax || pP3[1] > yMax) {
		const p3 = arcPoint(cx, cy, rx, ry, alpha, angle3);
		xArray.push(p3[0]);
		yArray.push(p3[1]);
	}
	xMin = min.apply([], xArray);
	yMin = min.apply([], yArray);
	xMax = max.apply([], xArray);
	yMax = max.apply([], yArray);
	return [
		xMin,
		yMin,
		xMax,
		yMax
	];
};
const arcTools = {
	angleBetween,
	arcLength,
	arcPoint,
	getArcBBox,
	getArcLength,
	getArcProps,
	getPointAtArcLength
};
//#endregion
//#region src/math/bezier.ts
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
const calculateBezier = (derivativeFn, t) => {
	const d = derivativeFn(t);
	const l = d.x * d.x + d.y * d.y;
	return Math.sqrt(l);
};
const bezierLength = (derivativeFn) => {
	const z = .5;
	const len = Tvalues.length;
	let sum = 0;
	for (let i = 0, t; i < len; i++) {
		t = z * Tvalues[i] + z;
		sum += Cvalues[i] * calculateBezier(derivativeFn, t);
	}
	return z * sum;
};
/**
* Returns the length of CubicBezier / Quad segment.
* @param curve cubic / quad bezier segment
*/
const getBezierLength = (curve) => {
	const points = [];
	for (let idx = 0, len = curve.length, step = 2; idx < len; idx += step) points.push({
		x: curve[idx],
		y: curve[idx + 1]
	});
	const dpoints = deriveBezier(points);
	return bezierLength((t) => {
		return computeBezier(dpoints[0], t);
	});
};
const CBEZIER_MINMAX_EPSILON = 1e-8;
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
const bezierTools = {
	bezierLength,
	calculateBezier,
	CBEZIER_MINMAX_EPSILON,
	computeBezier,
	Cvalues,
	deriveBezier,
	getBezierLength,
	minmaxC,
	minmaxQ,
	Tvalues
};
//#endregion
//#region src/math/cubicTools.ts
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
		const currentLength = getBezierLength([
			x1,
			y1,
			c1x,
			c1y,
			c2x,
			c2y,
			x2,
			y2
		]);
		if (distance <= 0) {} else if (distance >= currentLength) point = {
			x: x2,
			y: y2
		};
		else point = getPointAtCubicSegmentLength([
			x1,
			y1,
			c1x,
			c1y,
			c2x,
			c2y,
			x2,
			y2
		], distance / currentLength);
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
const cubicTools = {
	getCubicBBox,
	getCubicLength,
	getPointAtCubicLength,
	getPointAtCubicSegmentLength
};
//#endregion
//#region src/math/quadTools.ts
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
* Returns the point along a QuadraticBezier segment at a given distance.
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param cx the control point X
* @param cy the control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @param distance the distance to look at
* @returns the point at QuadraticBezier length
*/
const getPointAtQuadLength = (x1, y1, cx, cy, x2, y2, distance) => {
	const distanceIsNumber = typeof distance === "number";
	let point = {
		x: x1,
		y: y1
	};
	if (distanceIsNumber) {
		const currentLength = getBezierLength([
			x1,
			y1,
			cx,
			cy,
			x2,
			y2
		]);
		if (distance <= 0) {} else if (distance >= currentLength) point = {
			x: x2,
			y: y2
		};
		else point = getPointAtQuadSegmentLength([
			x1,
			y1,
			cx,
			cy,
			x2,
			y2
		], distance / currentLength);
	}
	return point;
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
const quadTools = {
	getPointAtQuadLength,
	getPointAtQuadSegmentLength,
	getQuadBBox,
	getQuadLength
};
//#endregion
//#region src/math/polygonTools.ts
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
/**
* d3-polygon-length
* https://github.com/d3/d3-polygon
*
* Returns the perimeter of a polygon.
*
* @param polygon an array of coordinates
* @returns the polygon length
*/
const polygonLength = (polygon) => {
	return polygon.reduce((length, point, i) => {
		if (i) return length + distanceSquareRoot(polygon[i - 1], point);
		return 0;
	}, 0);
};
/**
* Computes the centroid (geometric center) of a polygon.
* Uses average of all endpoint coordinates (robust for polygons and curves).
*
* @param polygon A polygon with consists of [x, y] tuples
* @returns [x, y] centroid
*/
const polygonCentroid = (polygon) => {
	if (polygon.length === 0) return [0, 0];
	let sumX = 0;
	let sumY = 0;
	for (const [x, y] of polygon) {
		sumX += x;
		sumY += y;
	}
	const count = polygon.length;
	return [sumX / count, sumY / count];
};
const polygonTools = {
	polygonArea,
	polygonLength,
	polygonCentroid
};
//#endregion
//#region src/math/rotateVector.ts
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
//#endregion
//#region src/math/roundTo.ts
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
//#endregion
//#region src/options/options.ts
/** SVGPathCommander default options */
const defaultOptions = {
	origin: [
		0,
		0,
		0
	],
	round: 4
};
//#endregion
//#region src/parser/paramsCount.ts
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
//#endregion
//#region src/parser/finalizeSegment.ts
/**
* Breaks the parsing of a pathString once a segment is finalized.
*
* @param path - The PathParser instance
*/
const finalizeSegment = (path) => {
	let pathCommand = path.pathValue[path.segmentStart];
	let relativeCommand = pathCommand.toLowerCase();
	const { data } = path;
	while (data.length >= paramsCounts[relativeCommand]) {
		if (relativeCommand === "m" && data.length > 2) {
			path.segments.push([pathCommand].concat(data.splice(0, 2)));
			relativeCommand = "l";
			pathCommand = pathCommand === "m" ? "l" : "L";
		} else path.segments.push([pathCommand].concat(data.splice(0, paramsCounts[relativeCommand])));
		if (!paramsCounts[relativeCommand]) break;
	}
};
//#endregion
//#region src/util/error.ts
/** Error prefix used in all SVGPathCommander TypeError messages. */
const error = "SVGPathCommanderError";
//#endregion
//#region src/parser/scanFlag.ts
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
//#endregion
//#region src/parser/isDigit.ts
/**
* Checks if a character is a digit.
*
* @param code the character to check
* @returns check result
*/
const isDigit = (code) => {
	return code >= 48 && code <= 57;
};
//#endregion
//#region src/parser/invalidPathValue.ts
/** Error message prefix used when a path string cannot be parsed. */
const invalidPathValue = "Invalid path value";
//#endregion
//#region src/parser/scanParam.ts
/**
* Validates every character of the path string,
* every path command, negative numbers or floating point numbers.
*
* @param path - The PathParser instance
*/
const scanParam = (path) => {
	const { max, pathValue, index: start } = path;
	let index = start;
	let zeroFirst = false;
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
		zeroFirst = ch === 48;
		index += 1;
		ch = pathValue.charCodeAt(index);
		if (zeroFirst && index < max) {
			if (ch && isDigit(ch)) {
				path.err = `${error}: ${invalidPathValue} at index ${start}, "${pathValue[start]}" illegal number`;
				return;
			}
		}
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
	path.param = +path.pathValue.slice(start, index);
};
//#endregion
//#region src/parser/isSpace.ts
/**
* Checks if the character is a space.
*
* @param ch the character to check
* @returns check result
*/
const isSpace = (ch) => {
	return [
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
	].includes(ch);
};
//#endregion
//#region src/parser/skipSpaces.ts
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
//#endregion
//#region src/parser/isPathCommand.ts
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
//#endregion
//#region src/parser/isDigitStart.ts
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
//#endregion
//#region src/parser/isArcCommand.ts
/**
* Checks if the character is an A (arc-to) path command.
*
* @param code the character to check
* @returns check result
*/
const isArcCommand = (code) => {
	return (code | 32) === 97;
};
//#endregion
//#region src/parser/isMoveCommand.ts
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
//#endregion
//#region src/parser/scanSegment.ts
/**
* Scans every character in the path string to determine
* where a segment starts and where it ends.
*
* @param path - The PathParser instance
*/
const scanSegment = (path) => {
	const { max, pathValue, index, segments } = path;
	const cmdCode = pathValue.charCodeAt(index);
	const reqParams = paramsCounts[pathValue[index].toLowerCase()];
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
//#endregion
//#region src/parser/pathParser.ts
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
//#endregion
//#region src/parser/parsePathString.ts
/**
* Parses a path string value and returns an array
* of segments we like to call `PathArray`.
*
* If parameter value is already a `PathArray`,
* return a clone of it.

* @example
* parsePathString("M 0 0L50 50")
* // => [["M",0,0],["L",50,50]]
*
* @param pathInput the string to be parsed
* @returns the resulted `pathArray` or error string
*/
const parsePathString = (pathInput) => {
	if (typeof pathInput !== "string") return pathInput.slice(0);
	const path = new PathParser(pathInput);
	skipSpaces(path);
	while (path.index < path.max && !path.err.length) scanSegment(path);
	if (!path.err.length) {
		if (path.segments.length)
 /**
		* force absolute first M
		* getPathBBox calculation requires first segment to be absolute
		* @see https://github.com/thednp/svg-path-commander/pull/49
		*/
		path.segments[0][0] = "M";
	} else throw TypeError(path.err);
	return path.segments;
};
//#endregion
//#region src/process/absolutizeSegment.ts
/**
* Returns an absolute segment of a `PathArray` object.
*
* @param segment the segment object
* @param index the segment index
* @param lastX the last known X value
* @param lastY the last known Y value
* @returns the absolute segment
*/
const absolutizeSegment = (segment, index, lastX, lastY) => {
	const [pathCommand] = segment;
	const absCommand = pathCommand.toUpperCase();
	if (index === 0 || absCommand === pathCommand) return segment;
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
	else {
		const absValues = [];
		const seglen = segment.length;
		for (let j = 1; j < seglen; j += 1) absValues.push(segment[j] + (j % 2 ? lastX : lastY));
		return [absCommand].concat(absValues);
	}
};
//#endregion
//#region src/process/iterate.ts
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
		const [pathCommand] = segment;
		const absCommand = pathCommand.toUpperCase();
		const isRelative = absCommand !== pathCommand;
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
//#endregion
//#region src/convert/pathToAbsolute.ts
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
	return iterate(parsePathString(pathInput), absolutizeSegment);
};
//#endregion
//#region src/process/relativizeSegment.ts
/**
* Returns a relative segment of a `PathArray` object.
*
* @param segment the segment object
* @param index the segment index
* @param lastX the last known X value
* @param lastY the last known Y value
* @returns the relative segment
*/
const relativizeSegment = (segment, index, lastX, lastY) => {
	const [pathCommand] = segment;
	const relCommand = pathCommand.toLowerCase();
	if (index === 0 || pathCommand === relCommand) return segment;
	if (relCommand === "a") return [
		relCommand,
		segment[1],
		segment[2],
		segment[3],
		segment[4],
		segment[5],
		segment[6] - lastX,
		segment[7] - lastY
	];
	else if (relCommand === "v") return [relCommand, segment[1] - lastY];
	else if (relCommand === "h") return [relCommand, segment[1] - lastX];
	else if (relCommand === "l") return [
		relCommand,
		segment[1] - lastX,
		segment[2] - lastY
	];
	else {
		const relValues = [];
		const seglen = segment.length;
		for (let j = 1; j < seglen; j += 1) relValues.push(segment[j] - (j % 2 ? lastX : lastY));
		return [relCommand].concat(relValues);
	}
};
//#endregion
//#region src/convert/pathToRelative.ts
/**
* Parses a path string value or object and returns an array
* of segments, all converted to relative values.
*
* @param pathInput - The path string or PathArray
* @returns The resulted PathArray with relative values
*
* @example
* ```ts
* pathToRelative('M10 10L90 90')
* // => [['M', 10, 10], ['l', 80, 80]]
* ```
*/
const pathToRelative = (pathInput) => {
	return iterate(parsePathString(pathInput), relativizeSegment);
};
//#endregion
//#region src/process/arcToCubic.ts
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
	let rx = RX;
	let ry = RY;
	let x2 = X2;
	let y2 = Y2;
	const d120 = Math.PI * 120 / 180;
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
//#endregion
//#region src/process/quadToCubic.ts
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
//#endregion
//#region src/process/lineToCubic.ts
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
//#endregion
//#region src/process/segmentToCubic.ts
/**
* Converts any segment to C (cubic-bezier).
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
//#endregion
//#region src/process/normalizeSegment.ts
/**
* Normalizes a single segment of a `pathArray` object.
*
* @param segment the segment object
* @param params the normalization parameters
* @returns the normalized segment
*/
const normalizeSegment = (segment, params) => {
	const [pathCommand] = segment;
	const absCommand = pathCommand.toUpperCase();
	const isRelative = pathCommand !== absCommand;
	const { x1: px1, y1: py1, x2: px2, y2: py2, x, y } = params;
	const values = segment.slice(1);
	let absValues = values.map((n, j) => n + (isRelative ? j % 2 ? y : x : 0));
	if (!"TQ".includes(absCommand)) {
		params.qx = null;
		params.qy = null;
	}
	if (absCommand === "A") {
		absValues = values.slice(0, -2).concat(values[5] + (isRelative ? x : 0), values[6] + (isRelative ? y : 0));
		return ["A"].concat(absValues);
	} else if (absCommand === "H") return [
		"L",
		segment[1] + (isRelative ? x : 0),
		py1
	];
	else if (absCommand === "V") return [
		"L",
		px1,
		segment[1] + (isRelative ? y : 0)
	];
	else if (absCommand === "L") return [
		"L",
		segment[1] + (isRelative ? x : 0),
		segment[2] + (isRelative ? y : 0)
	];
	else if (absCommand === "M") return [
		"M",
		segment[1] + (isRelative ? x : 0),
		segment[2] + (isRelative ? y : 0)
	];
	else if (absCommand === "C") return ["C"].concat(absValues);
	else if (absCommand === "S") {
		const x1 = px1 * 2 - px2;
		const y1 = py1 * 2 - py2;
		params.x1 = x1;
		params.y1 = y1;
		return [
			"C",
			x1,
			y1
		].concat(absValues);
	} else if (absCommand === "T") {
		const qx = px1 * 2 - (params.qx ? params.qx : 0);
		const qy = py1 * 2 - (params.qy ? params.qy : 0);
		params.qx = qx;
		params.qy = qy;
		return [
			"Q",
			qx,
			qy
		].concat(absValues);
	} else if (absCommand === "Q") {
		const [nqx, nqy] = absValues;
		params.qx = nqx;
		params.qy = nqy;
		return ["Q"].concat(absValues);
	} else if (absCommand === "Z") return ["Z"];
	return segment;
};
//#endregion
//#region src/parser/paramsParser.ts
/**
* Default parser parameters object used to track position state
* while iterating through path segments.
*/
const paramsParser = {
	mx: 0,
	my: 0,
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0,
	x: 0,
	y: 0,
	qx: null,
	qy: null
};
//#endregion
//#region src/convert/pathToCurve.ts
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
* // => [['M', 10, 50], ['C', 25, 25, 40, 50, 40, 50]]
* ```
*/
const pathToCurve = (pathInput) => {
	const params = { ...paramsParser };
	const path = parsePathString(pathInput);
	return iterate(path, (seg, index, lastX, lastY) => {
		params.x = lastX;
		params.y = lastY;
		const normalSegment = normalizeSegment(seg, params);
		if (normalSegment[0] === "M") {
			params.mx = normalSegment[1];
			params.my = normalSegment[2];
		}
		let result = segmentToCubic(normalSegment, params);
		if (result[0] === "C" && result.length > 7) {
			path.splice(index + 1, 0, ["C"].concat(result.slice(7)));
			result = result.slice(0, 7);
		}
		const seglen = result.length;
		params.x1 = +result[seglen - 2];
		params.y1 = +result[seglen - 1];
		params.x2 = +result[seglen - 4] || params.x1;
		params.y2 = +result[seglen - 3] || params.y1;
		return result;
	});
};
//#endregion
//#region src/convert/pathToString.ts
/**
* Returns a valid `d` attribute string value created
* by rounding values and concatenating the PathArray segments.
*
* @param path - The PathArray object
* @param roundOption - Amount of decimals to round values to, or "off"
* @returns The concatenated path string
*
* @example
* ```ts
* pathToString([['M', 10, 10], ['L', 90, 90]], 2)
* // => 'M10 10L90 90'
* ```
*/
const pathToString = (path, roundOption) => {
	const pathLen = path.length;
	let { round } = defaultOptions;
	let segment = path[0];
	let result = "";
	round = roundOption === "off" ? roundOption : typeof roundOption === "number" && roundOption >= 0 ? roundOption : typeof round === "number" && round >= 0 ? round : "off";
	for (let i = 0; i < pathLen; i += 1) {
		segment = path[i];
		const [pathCommand] = segment;
		const values = segment.slice(1);
		result += pathCommand;
		if (round === "off") result += values.join(" ");
		else {
			let j = 0;
			const valLen = values.length;
			while (j < valLen) {
				result += roundTo(values[j], round);
				if (j !== valLen - 1) result += " ";
				j += 1;
			}
		}
	}
	return result;
};
//#endregion
//#region src/util/getPathBBox.ts
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
	if (!pathInput) return {
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
	const path = parsePathString(pathInput);
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
	let paramQX = 0;
	let paramQY = 0;
	iterate(path, (seg, index, lastX, lastY) => {
		[pathCommand] = seg;
		const absCommand = pathCommand.toUpperCase();
		const absoluteSegment = absCommand !== pathCommand ? absolutizeSegment(seg, index, lastX, lastY) : seg.slice(0);
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
		if (!"TQ".includes(absCommand)) {
			paramQX = 0;
			paramQY = 0;
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
			paramQX = paramX1 * 2 - paramQX;
			paramQY = paramY1 * 2 - paramQY;
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
		[paramX1, paramY1] = pathCommand === "Z" ? [mx, my] : normalSegment.slice(-2);
		[paramX2, paramY2] = pathCommand === "C" ? [normalSegment[3], normalSegment[4]] : pathCommand === "S" ? [normalSegment[1], normalSegment[2]] : [paramX1, paramY1];
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
//#endregion
//#region src/util/getTotalLength.ts
/**
* Returns the total length of a path, equivalent to `shape.getTotalLength()`.
*
* @param pathInput - The target path string or PathArray
* @returns The total length of the path
*
* @example
* ```ts
* getTotalLength('M0 0L100 0L100 100L0 100Z')
* // => 300
* ```
*/
const getTotalLength = (pathInput) => {
	const path = parsePathString(pathInput);
	let paramX1 = 0;
	let paramY1 = 0;
	let paramX2 = 0;
	let paramY2 = 0;
	let paramQX = 0;
	let paramQY = 0;
	let pathCommand = "M";
	let mx = 0;
	let my = 0;
	let totalLength = 0;
	iterate(path, (seg, index, lastX, lastY) => {
		[pathCommand] = seg;
		const absCommand = pathCommand.toUpperCase();
		const absoluteSegment = absCommand !== pathCommand ? absolutizeSegment(seg, index, lastX, lastY) : seg.slice(0);
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
		if (!"TQ".includes(absCommand)) {
			paramQX = 0;
			paramQY = 0;
		}
		if (pathCommand === "M") [, mx, my] = normalSegment;
		else if (pathCommand === "L") totalLength += getLineLength(lastX, lastY, normalSegment[1], normalSegment[2]);
		else if (pathCommand === "A") totalLength += getArcLength(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4], normalSegment[5], normalSegment[6], normalSegment[7]);
		else if (pathCommand === "S") {
			const cp1x = paramX1 * 2 - paramX2;
			const cp1y = paramY1 * 2 - paramY2;
			totalLength += getCubicLength(lastX, lastY, cp1x, cp1y, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4]);
		} else if (pathCommand === "C") totalLength += getCubicLength(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4], normalSegment[5], normalSegment[6]);
		else if (pathCommand === "T") {
			paramQX = paramX1 * 2 - paramQX;
			paramQY = paramY1 * 2 - paramQY;
			totalLength += getQuadLength(lastX, lastY, paramQX, paramQY, normalSegment[1], normalSegment[2]);
		} else if (pathCommand === "Q") {
			paramQX = normalSegment[1];
			paramQY = normalSegment[2];
			totalLength += getQuadLength(lastX, lastY, normalSegment[1], normalSegment[2], normalSegment[3], normalSegment[4]);
		} else if (pathCommand === "Z") totalLength += getLineLength(lastX, lastY, mx, my);
		[paramX1, paramY1] = pathCommand === "Z" ? [mx, my] : normalSegment.slice(-2);
		[paramX2, paramY2] = pathCommand === "C" ? [normalSegment[3], normalSegment[4]] : pathCommand === "S" ? [normalSegment[1], normalSegment[2]] : [paramX1, paramY1];
	});
	return totalLength;
};
//#endregion
//#region src/util/distanceEpsilon.ts
/** Small threshold value used for floating-point distance comparisons in path calculations. */
const DISTANCE_EPSILON = 1e-5;
//#endregion
//#region src/process/normalizePath.ts
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
* // => [['M', 10, 90], ['C', 30, 90, 25, 10, 50, 10], ['C', 75, 10, 70, 90, 90, 90]]
* ```
*/
const normalizePath = (pathInput) => {
	const path = parsePathString(pathInput);
	const params = { ...paramsParser };
	return iterate(path, (seg, _, lastX, lastY) => {
		params.x = lastX;
		params.y = lastY;
		const result = normalizeSegment(seg, params);
		const seglen = result.length;
		params.x1 = +result[seglen - 2];
		params.y1 = +result[seglen - 1];
		params.x2 = +result[seglen - 4] || params.x1;
		params.y2 = +result[seglen - 3] || params.y1;
		return result;
	});
};
//#endregion
//#region src/util/getPointAtLength.ts
/**
* Returns [x,y] coordinates of a point at a given length along a path.
*
* @param pathInput - The PathArray or path string to look into
* @param distance - The distance along the path
* @returns The requested {x, y} point coordinates
*
* @example
* ```ts
* getPointAtLength('M0 0L100 0L100 100Z', 50)
* // => { x: 50, y: 0 }
* ```
*/
const getPointAtLength = (pathInput, distance) => {
	const path = normalizePath(pathInput);
	let isM = false;
	let data = [];
	let x = 0;
	let y = 0;
	let [mx, my] = path[0].slice(1);
	const distanceIsNumber = typeof distance === "number";
	let point = {
		x: mx,
		y: my
	};
	let length = 0;
	let POINT = point;
	let totalLength = 0;
	if (!distanceIsNumber || distance < 1e-5) return point;
	iterate(path, (seg, _, lastX, lastY) => {
		const pathCommand = seg[0];
		isM = pathCommand === "M";
		data = !isM ? [lastX, lastY].concat(seg.slice(1)) : data;
		if (isM) {
			[, mx, my] = seg;
			point = {
				x: mx,
				y: my
			};
			length = 0;
		} else if (pathCommand === "L") {
			point = getPointAtLineLength(data[0], data[1], data[2], data[3], distance - totalLength);
			length = getLineLength(data[0], data[1], data[2], data[3]);
		} else if (pathCommand === "A") {
			point = getPointAtArcLength(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], distance - totalLength);
			length = getArcLength(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
		} else if (pathCommand === "C") {
			point = getPointAtCubicLength(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], distance - totalLength);
			length = getCubicLength(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
		} else if (pathCommand === "Q") {
			point = getPointAtQuadLength(data[0], data[1], data[2], data[3], data[4], data[5], distance - totalLength);
			length = getQuadLength(data[0], data[1], data[2], data[3], data[4], data[5]);
		} else if (pathCommand === "Z") {
			data = [
				lastX,
				lastY,
				mx,
				my
			];
			point = {
				x: mx,
				y: my
			};
			length = getLineLength(data[0], data[1], data[2], data[3]);
		}
		[x, y] = data.slice(-2);
		if (totalLength < distance) POINT = point;
		else return false;
		totalLength += length;
	});
	if (distance > totalLength - 1e-5) return {
		x,
		y
	};
	return POINT;
};
//#endregion
//#region src/util/getPropertiesAtLength.ts
/**
* Returns the segment, its index and length as well as
* the length to that segment at a given length in a path.
*
* @param pathInput target `pathArray`
* @param distance the given length
* @returns the requested properties
*/
const getPropertiesAtLength = (pathInput, distance) => {
	const pathArray = parsePathString(pathInput);
	let pathTemp = pathArray.slice(0);
	let pathLength = getTotalLength(pathTemp);
	let index = pathTemp.length - 1;
	let lengthAtSegment = 0;
	let length = 0;
	let segment = pathArray[0];
	if (index <= 0 || !distance || !Number.isFinite(distance)) return {
		segment,
		index: 0,
		length,
		lengthAtSegment
	};
	if (distance >= pathLength) {
		pathTemp = pathArray.slice(0, -1);
		lengthAtSegment = getTotalLength(pathTemp);
		length = pathLength - lengthAtSegment;
		segment = pathArray[index];
		return {
			segment,
			index,
			length,
			lengthAtSegment
		};
	}
	const segments = [];
	while (index > 0) {
		segment = pathTemp[index];
		pathTemp = pathTemp.slice(0, -1);
		lengthAtSegment = getTotalLength(pathTemp);
		length = pathLength - lengthAtSegment;
		pathLength = lengthAtSegment;
		segments.push({
			segment,
			index,
			length,
			lengthAtSegment
		});
		index -= 1;
	}
	return segments.find(({ lengthAtSegment: l }) => l <= distance);
};
//#endregion
//#region src/util/getPropertiesAtPoint.ts
/**
* Returns the point and segment in path closest to a given point as well as
* the distance to the path stroke.
*
* @see https://bl.ocks.org/mbostock/8027637
*
* @param pathInput target `pathArray`
* @param point the given point
* @returns the requested properties
*/
const getPropertiesAtPoint = (pathInput, point) => {
	const path = parsePathString(pathInput);
	const normalPath = normalizePath(path);
	const pathLength = getTotalLength(normalPath);
	const distanceTo = (p) => {
		const dx = p.x - point.x;
		const dy = p.y - point.y;
		return dx * dx + dy * dy;
	};
	let precision = 8;
	let scan;
	let closest = {
		x: 0,
		y: 0
	};
	let scanDistance = 0;
	let bestLength = 0;
	let bestDistance = Infinity;
	for (let scanLength = 0; scanLength <= pathLength; scanLength += precision) {
		scan = getPointAtLength(normalPath, scanLength);
		scanDistance = distanceTo(scan);
		if (scanDistance < bestDistance) {
			closest = scan;
			bestLength = scanLength;
			bestDistance = scanDistance;
		}
	}
	precision /= 2;
	let before;
	let after;
	let beforeLength = 0;
	let afterLength = 0;
	let beforeDistance = 0;
	let afterDistance = 0;
	while (precision > 1e-6) {
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
		} else precision /= 2;
		if (precision < 1e-5) break;
	}
	const segment = getPropertiesAtLength(path, bestLength);
	return {
		closest,
		distance: Math.sqrt(bestDistance),
		segment
	};
};
//#endregion
//#region src/util/getClosestPoint.ts
/**
* Returns the point in path closest to a given point.
*
* @param pathInput target `pathArray`
* @param point the given point
* @returns the best match
*/
const getClosestPoint = (pathInput, point) => {
	return getPropertiesAtPoint(pathInput, point).closest;
};
//#endregion
//#region src/util/getPathArea.ts
/**
* Returns the area of a single cubic-bezier segment.
*
* http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
*
* @param x1 the starting point X
* @param y1 the starting point Y
* @param c1x the first control point X
* @param c1y the first control point Y
* @param c2x the second control point X
* @param c2y the second control point Y
* @param x2 the ending point X
* @param y2 the ending point Y
* @returns the area of the cubic-bezier segment
*/
const getCubicSegArea = (x1, y1, c1x, c1y, c2x, c2y, x2, y2) => {
	return 3 * ((y2 - y1) * (c1x + c2x) - (x2 - x1) * (c1y + c2y) + c1y * (x1 - c2x) - c1x * (y1 - c2y) + y2 * (c2x + x1 / 3) - x2 * (c2y + y1 / 3)) / 20;
};
/**
* Returns the signed area of a shape.
*
* @author Jürg Lehni & Jonathan Puckey
*
* @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
*
* @param path - The shape PathArray
* @returns The signed area of the shape (positive for clockwise, negative for counter-clockwise)
*
* @example
* ```ts
* getPathArea([['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['Z']])
* // => -10000 (counter-clockwise square)
* ```
*/
const getPathArea = (path) => {
	let x = 0;
	let y = 0;
	let len = 0;
	return pathToCurve(path).map((seg) => {
		switch (seg[0]) {
			case "M":
				[, x, y] = seg;
				return 0;
			default:
				len = getCubicSegArea(x, y, seg[1], seg[2], seg[3], seg[4], seg[5], seg[6]);
				[x, y] = seg.slice(-2);
				return len;
		}
	}).reduce((a, b) => a + b, 0);
};
//#endregion
//#region src/util/getDrawDirection.ts
/**
* Check if a path is drawn clockwise and returns true if so,
* false otherwise.
*
* @param path the path string or `pathArray`
* @returns true when clockwise or false if not
*/
const getDrawDirection = (path) => {
	return getPathArea(pathToCurve(path)) >= 0;
};
//#endregion
//#region src/util/getSegmentAtLength.ts
/**
* Returns the segment at a given length.
*
* @param pathInput the target `pathArray`
* @param distance the distance in path to look at
* @returns the requested segment
*/
const getSegmentAtLength = (pathInput, distance) => {
	return getPropertiesAtLength(pathInput, distance).segment;
};
//#endregion
//#region src/util/getSegmentOfPoint.ts
/**
* Returns the path segment which contains a given point.
*
* @param path the `pathArray` to look into
* @param point the point of the shape to look for
* @returns the requested segment
*/
const getSegmentOfPoint = (path, point) => {
	return getPropertiesAtPoint(path, point).segment;
};
//#endregion
//#region src/util/isPathArray.ts
/**
* Iterates an array to check if it's an actual `pathArray`.
*
* @param path the `pathArray` to be checked
* @returns iteration result
*/
const isPathArray = (path) => {
	return Array.isArray(path) && path.every((seg) => {
		const lk = seg[0].toLowerCase();
		return paramsCounts[lk] === seg.length - 1 && "achlmqstvz".includes(lk) && seg.slice(1).every(Number.isFinite);
	}) && path.length > 0;
};
//#endregion
//#region src/util/isAbsoluteArray.ts
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
//#endregion
//#region src/util/isNormalizedArray.ts
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
//#endregion
//#region src/util/isPolygonArray.ts
/**
* Checks if a path is a polygon (only M, L, H, V, Z commands).
* @param pathArray PathArray (pre-normalize if needed)
* @returns boolean
*/
const isPolygonArray = (path) => {
	return isNormalizedArray(path) && path.every(([pc]) => "MLVHZ".includes(pc));
};
//#endregion
//#region src/util/isCurveArray.ts
/**
* Iterates an array to check if it's a `pathArray`
* with all C (cubic bezier) segments.
*
* @param path the `Array` to be checked
* @returns iteration result
*/
const isCurveArray = (path) => {
	return isNormalizedArray(path) && path.every(([pc]) => "MC".includes(pc));
};
//#endregion
//#region src/util/isPointInStroke.ts
/**
* Checks if a given point is in the stroke of a path.
*
* @param pathInput target path
* @param point the given `{x,y}` point
* @returns the query result
*/
const isPointInStroke = (pathInput, point) => {
	const { distance } = getPropertiesAtPoint(pathInput, point);
	return Math.abs(distance) < DISTANCE_EPSILON;
};
//#endregion
//#region src/util/isRelativeArray.ts
/**
* Iterates an array to check if it's a `pathArray`
* with relative values.
*
* @param path the `pathArray` to be checked
* @returns iteration result
*/
const isRelativeArray = (path) => {
	return isPathArray(path) && path.slice(1).every(([pc]) => pc === pc.toLowerCase());
};
//#endregion
//#region src/util/isValidPath.ts
/**
* Parses a path string value to determine its validity
* then returns true if it's valid or false otherwise.
*
* @param pathString the path string to be parsed
* @returns the path string validity
*/
const isValidPath = (pathString) => {
	if (typeof pathString !== "string" || !pathString.length) return false;
	const path = new PathParser(pathString);
	skipSpaces(path);
	while (path.index < path.max && !path.err.length) scanSegment(path);
	return !path.err.length && "mM".includes(path.segments[0][0]);
};
//#endregion
//#region src/morph/samplePolygon.ts
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
		else if (cmd === "A") points.push([seg[6], seg[7]]);
		else if (cmd === "Z") points.push([mx, my]);
		else throw new TypeError(`${error}: path command "${cmd}" is not supported`);
	});
	return points;
}
//#endregion
//#region src/util/shapeParams.ts
/**
* Supported shapes and their specific parameters.
*/
const shapeParams = {
	line: [
		"x1",
		"y1",
		"x2",
		"y2"
	],
	circle: [
		"cx",
		"cy",
		"r"
	],
	ellipse: [
		"cx",
		"cy",
		"rx",
		"ry"
	],
	rect: [
		"width",
		"height",
		"x",
		"y",
		"rx",
		"ry"
	],
	polygon: ["points"],
	polyline: ["points"],
	glyph: ["d"]
};
//#endregion
//#region src/util/isElement.ts
/**
* Checks if a value is a DOM Element.
*
* @param node - The value to check
* @returns True if the value is a DOM Element (nodeType === 1)
*/
const isElement = (node) => node !== void 0 && node !== null && typeof node === "object" && node.nodeType === 1;
//#endregion
//#region src/util/shapeToPathArray.ts
/**
* Returns a new PathArray from line attributes.
*
* @param attr - Shape configuration with x1, y1, x2, y2
* @returns A new line PathArray
*
* @example
* ```ts
* getLinePath({ x1: 0, y1: 0, x2: 100, y2: 100 })
* // => [['M', 0, 0], ['L', 100, 100]]
* ```
*/
const getLinePath = (attr) => {
	let { x1, y1, x2, y2 } = attr;
	[x1, y1, x2, y2] = [
		x1,
		y1,
		x2,
		y2
	].map((a) => +a);
	return [[
		"M",
		x1,
		y1
	], [
		"L",
		x2,
		y2
	]];
};
/**
* Returns a new PathArray from polyline/polygon attributes.
*
* @param attr - Shape configuration with points string
* @returns A new polygon/polyline PathArray
*
* @example
* ```ts
* getPolyPath({ type: 'polygon', points: '0,0 100,0 100,100 0,100' })
* // => [['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['z']]
* ```
*/
const getPolyPath = (attr) => {
	const pathArray = [];
	const points = (attr.points || "").trim().split(/[\s|,]/).map((a) => +a);
	let index = 0;
	while (index < points.length) {
		pathArray.push([
			index ? "L" : "M",
			points[index],
			points[index + 1]
		]);
		index += 2;
	}
	return attr.type === "polygon" ? [...pathArray, ["z"]] : pathArray;
};
/**
* Returns a new PathArray from circle attributes.
*
* @param attr - Shape configuration with cx, cy, r
* @returns A circle PathArray
*
* @example
* ```ts
* getCirclePath({ cx: 50, cy: 50, r: 25 })
* // => [['M', 25, 50], ['a', 25, 25, 0, 1, 0, 50, 0], ['a', 25, 25, 0, 1, 0, -50, 0]]
* ```
*/
const getCirclePath = (attr) => {
	let { cx, cy, r } = attr;
	[cx, cy, r] = [
		cx,
		cy,
		r
	].map((a) => +a);
	return [
		[
			"M",
			cx - r,
			cy
		],
		[
			"a",
			r,
			r,
			0,
			1,
			0,
			2 * r,
			0
		],
		[
			"a",
			r,
			r,
			0,
			1,
			0,
			-2 * r,
			0
		]
	];
};
/**
* Returns a new PathArray from ellipse attributes.
*
* @param attr - Shape configuration with cx, cy, rx, ry
* @returns An ellipse PathArray
*
* @example
* ```ts
* getEllipsePath({ cx: 50, cy: 50, rx: 30, ry: 20 })
* // => [['M', 20, 50], ['a', 30, 20, 0, 1, 0, 60, 0], ['a', 30, 20, 0, 1, 0, -60, 0]]
* ```
*/
const getEllipsePath = (attr) => {
	let { cx, cy } = attr;
	let rx = attr.rx || 0;
	let ry = attr.ry || rx;
	[cx, cy, rx, ry] = [
		cx,
		cy,
		rx,
		ry
	].map((a) => +a);
	return [
		[
			"M",
			cx - rx,
			cy
		],
		[
			"a",
			rx,
			ry,
			0,
			1,
			0,
			2 * rx,
			0
		],
		[
			"a",
			rx,
			ry,
			0,
			1,
			0,
			-2 * rx,
			0
		]
	];
};
/**
* Returns a new PathArray from rect attributes.
*
* @param attr - Object with x, y, width, height, and optional rx/ry
* @returns A new PathArray from `<rect>` attributes
*
* @example
* ```ts
* getRectanglePath({ x: 0, y: 0, width: 100, height: 50, ry: 10 })
* // => [['M', 10, 0], ['h', 80], ['a', 10, 10, 0, 0, 1, 10, 10], ...]
* ```
*/
const getRectanglePath = (attr) => {
	const x = +attr.x || 0;
	const y = +attr.y || 0;
	const w = +attr.width;
	const h = +attr.height;
	let rx = +(attr.rx || 0);
	let ry = +(attr.ry || rx);
	if (rx || ry) {
		if (rx * 2 > w) rx -= (rx * 2 - w) / 2;
		if (ry * 2 > h) ry -= (ry * 2 - h) / 2;
		return [
			[
				"M",
				x + rx,
				y
			],
			["h", w - rx * 2],
			[
				"s",
				rx,
				0,
				rx,
				ry
			],
			["v", h - ry * 2],
			[
				"s",
				0,
				ry,
				-rx,
				ry
			],
			["h", -w + rx * 2],
			[
				"s",
				-rx,
				0,
				-rx,
				-ry
			],
			["v", -h + ry * 2],
			[
				"s",
				0,
				-ry,
				rx,
				-ry
			]
		];
	}
	return [
		[
			"M",
			x,
			y
		],
		["h", w],
		["v", h],
		["H", x],
		["Z"]
	];
};
/**
* Returns a new `pathArray` created from attributes of a `<line>`, `<polyline>`,
* `<polygon>`, `<rect>`, `<ellipse>`, `<circle>`, <path> or `<glyph>`.
*
* It can also work with an options object, see the type below
* @see ShapeOps
*
* @param element target shape
* @returns the newly created `<path>` element
*/
const shapeToPathArray = (element) => {
	const supportedShapes = Object.keys(shapeParams);
	const targetIsElement = isElement(element);
	const tagName = targetIsElement ? element.tagName : null;
	if (tagName && [...supportedShapes, "path"].every((s) => tagName !== s)) throw TypeError(`${error}: "${tagName}" is not SVGElement`);
	const type = targetIsElement ? tagName : element.type;
	const shapeAttrs = shapeParams[type];
	const config = { type };
	if (targetIsElement) shapeAttrs.forEach((p) => {
		config[p] = element.getAttribute(p);
	});
	else Object.assign(config, element);
	let pathArray = [];
	if (type === "circle") pathArray = getCirclePath(config);
	else if (type === "ellipse") pathArray = getEllipsePath(config);
	else if (["polyline", "polygon"].includes(type)) pathArray = getPolyPath(config);
	else if (type === "rect") pathArray = getRectanglePath(config);
	else if (type === "line") pathArray = getLinePath(config);
	else if (["glyph", "path"].includes(type)) pathArray = parsePathString(targetIsElement ? element.getAttribute("d") || "" : element.d || "");
	if (isPathArray(pathArray) && pathArray.length) return pathArray;
	return false;
};
//#endregion
//#region src/util/shapeToPath.ts
/**
* Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
* `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
* is `true`, it will replace the target. The default `ownerDocument` is your current
* `document` browser page, if you want to use in server-side using `jsdom`, you can
* pass the `jsdom` `document` to `ownDocument`.
*
* It can also work with an options object, see the type below
* @see ShapeOps
*
* The newly created `<path>` element keeps all non-specific
* attributes like `class`, `fill`, etc.
*
* @param element - Target shape element or shape options object
* @param replace - Option to replace target element
* @param ownerDocument - Document for creating the element
* @returns The newly created `<path>` element, or false if the path is invalid
*
* @example
* ```ts
* const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
* circle.setAttribute('cx', '50')
* circle.setAttribute('cy', '50')
* circle.setAttribute('r', '25')
* const path = shapeToPath(circle)
* path.getAttribute('d')
* // => 'M50 25A25 25 0 1 1 50 75A25 25 0 1 1 50 25Z'
* ```
*/
const shapeToPath = (element, replace, ownerDocument) => {
	const doc = ownerDocument || document;
	const supportedShapes = Object.keys(shapeParams);
	const targetIsElement = isElement(element);
	const tagName = targetIsElement ? element.tagName : null;
	if (tagName === "path") throw TypeError(`${error}: "${tagName}" is already SVGPathElement`);
	if (tagName && supportedShapes.every((s) => tagName !== s)) throw TypeError(`${error}: "${tagName}" is not SVGElement`);
	const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
	const type = targetIsElement ? tagName : element.type;
	const shapeAttrs = shapeParams[type];
	const config = { type };
	const round = defaultOptions.round;
	const pathArray = shapeToPathArray(element);
	const description = pathArray && pathArray.length ? pathToString(pathArray, round) : "";
	if (targetIsElement) {
		shapeAttrs.forEach((p) => {
			config[p] = element.getAttribute(p);
		});
		for (let i = 0; i < element.attributes.length; i++) {
			const attr = element.attributes[i];
			if (attr && !shapeAttrs.includes(attr.name)) path.setAttribute(attr.name, attr.value);
		}
	} else {
		Object.assign(config, element);
		Object.keys(config).forEach((k) => {
			if (!shapeAttrs.includes(k) && k !== "type") path.setAttribute(k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), config[k]);
		});
	}
	if (isValidPath(description)) {
		path.setAttribute("d", description);
		if (replace && targetIsElement) {
			element.before(path, element);
			element.remove();
		}
		return path;
	}
	return false;
};
//#endregion
//#region src/util/isMultiPath.ts
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
	if (isPathArray(path)) {
		let moveCount = 0;
		for (const segment of path) if (segment[0].toUpperCase() === "M") {
			moveCount++;
			if (moveCount > 1) return true;
		}
		return false;
	}
	throw new TypeError(error + ": expected string or PathArray");
};
//#endregion
//#region src/util/isPolylineArray.ts
/**
* Checks if a path is a polyline (only M, L, H, V commands).
* @param pathArray PathArray (pre-normalize if needed)
* @returns boolean
*/
function isPolylineArray(path) {
	return isNormalizedArray(path) && path.every(([pc]) => "MLVH".includes(pc));
}
//#endregion
//#region src/util/isClosedPath.ts
/**
* Check if a PathArray is closed, which means its last segment is a Z.
* @param path
* @returns true if the path is closed
*/
const isClosedPath = (path) => {
	return path[path.length - 1][0].toUpperCase() === "Z";
};
//#endregion
//#region src/process/shortenSegment.ts
/**
* Shorten a single segment of a `pathArray` object.
*
* @param segment the `absoluteSegment` object
* @param normalSegment the `normalSegment` object
* @param params the coordinates of the previous segment
* @param prevCommand the path command of the previous segment
* @returns the shortened segment
*/
const shortenSegment = (segment, normalSegment, params, prevCommand) => {
	const [pathCommand] = segment;
	const { round: defaultRound } = defaultOptions;
	const round = typeof defaultRound === "number" ? defaultRound : 4;
	const normalValues = normalSegment.slice(1);
	const { x1, y1, x2, y2, x, y } = params;
	const [nx, ny] = normalValues.slice(-2);
	const result = segment;
	if (!"TQ".includes(pathCommand)) {
		params.qx = null;
		params.qy = null;
	}
	if (pathCommand === "L") {
		if (roundTo(x, round) === roundTo(nx, round)) return ["V", ny];
		else if (roundTo(y, round) === roundTo(ny, round)) return ["H", nx];
	} else if (pathCommand === "C") {
		const [nx1, ny1] = normalValues;
		params.x1 = nx1;
		params.y1 = ny1;
		if ("CS".includes(prevCommand) && (roundTo(nx1, round) === roundTo(x1 * 2 - x2, round) && roundTo(ny1, round) === roundTo(y1 * 2 - y2, round) || roundTo(x1, round) === roundTo(x2 * 2 - x, round) && roundTo(y1, round) === roundTo(y2 * 2 - y, round))) return [
			"S",
			normalValues[2],
			normalValues[3],
			normalValues[4],
			normalValues[5]
		];
	} else if (pathCommand === "Q") {
		const [qx, qy] = normalValues;
		params.qx = qx;
		params.qy = qy;
		if ("QT".includes(prevCommand) && roundTo(qx, round) === roundTo(x1 * 2 - x2, round) && roundTo(qy, round) === roundTo(y1 * 2 - y2, round)) return [
			"T",
			normalValues[2],
			normalValues[3]
		];
	}
	return result;
};
//#endregion
//#region src/process/roundSegment.ts
/**
* Rounds the numeric values of a path segment to the specified precision.
*
* @param segment - The path segment to round
* @param roundOption - Number of decimal places
* @returns The rounded segment
*/
const roundSegment = (segment, roundOption) => {
	const values = segment.slice(1).map((n) => roundTo(n, roundOption));
	return [segment[0]].concat(values);
};
//#endregion
//#region src/process/optimizePath.ts
/**
* Optimizes a PathArray:
* * converts segments to shorthand if possible
* * selects shortest representation from absolute and relative forms
*
* @param pathInput - A path string or PathArray
* @param roundOption - Number of decimal places for rounding
* @returns The optimized PathArray
*
* @example
* ```ts
* optimizePath('M10 10L10 10L90 90', 2)
* // => [['M', 10, 10], ['l', 0, 0], ['l', 80, 80]]
* ```
*/
const optimizePath = (pathInput, roundOption) => {
	const path = pathToAbsolute(pathInput);
	const round = typeof roundOption === "number" && roundOption >= 0 ? roundOption : 2;
	const optimParams = { ...paramsParser };
	const allPathCommands = [];
	let pathCommand = "M";
	let prevCommand = "Z";
	return iterate(path, (seg, i, lastX, lastY) => {
		optimParams.x = lastX;
		optimParams.y = lastY;
		const normalizedSegment = normalizeSegment(seg, optimParams);
		let result = seg;
		pathCommand = seg[0];
		allPathCommands[i] = pathCommand;
		if (i) {
			prevCommand = allPathCommands[i - 1];
			const shortSegment = shortenSegment(seg, normalizedSegment, optimParams, prevCommand);
			const absSegment = roundSegment(shortSegment, round);
			const absString = absSegment.join("");
			const relSegment = roundSegment(relativizeSegment(shortSegment, i, lastX, lastY), round);
			const relString = relSegment.join("");
			result = absString.length < relString.length ? absSegment : relSegment;
		}
		const seglen = normalizedSegment.length;
		optimParams.x1 = +normalizedSegment[seglen - 2];
		optimParams.y1 = +normalizedSegment[seglen - 1];
		optimParams.x2 = +normalizedSegment[seglen - 4] || optimParams.x1;
		optimParams.y2 = +normalizedSegment[seglen - 3] || optimParams.y1;
		return result;
	});
};
//#endregion
//#region src/process/reversePath.ts
/**
* Reverses all segments of a PathArray and returns a new PathArray
* with absolute values.
*
* @param pathInput - The source PathArray
* @returns The reversed PathArray
*
* @example
* ```ts
* reversePath([['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['Z']])
* // => [['M', 0, 100], ['L', 0, 0], ['L', 100, 0], ['L', 100, 100], ['Z']]
* ```
*/
const reversePath = (pathInput) => {
	const absolutePath = pathToAbsolute(pathInput);
	const normalizedPath = normalizePath(absolutePath);
	const pLen = absolutePath.length;
	const isClosed = absolutePath[pLen - 1][0] === "Z";
	const reversedPath = iterate(absolutePath, (segment, i) => {
		const normalizedSegment = normalizedPath[i];
		const prevSeg = i && absolutePath[i - 1];
		const prevCommand = prevSeg && prevSeg[0];
		const nextSeg = absolutePath[i + 1];
		const nextCommand = nextSeg && nextSeg[0];
		const pathCommand = segment[0];
		const [x, y] = normalizedPath[i ? i - 1 : pLen - 1].slice(-2);
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
				if (prevCommand && "CS".includes(prevCommand) && (!nextSeg || nextCommand !== "S")) result = [
					"C",
					normalizedSegment[3],
					normalizedSegment[4],
					normalizedSegment[1],
					normalizedSegment[2],
					x,
					y
				];
				else result = [
					pathCommand,
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
			case "T":
				if (prevCommand && "QT".includes(prevCommand) && (!nextSeg || nextCommand !== "T")) result = [
					"Q",
					normalizedSegment[1],
					normalizedSegment[2],
					x,
					y
				];
				else result = [
					pathCommand,
					x,
					y
				];
				break;
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
//#endregion
//#region src/process/splitPath.ts
/**
* Split a path string or PathArray into an array of sub-paths.
*
* In the process, values are converted to absolute
* for visual consistency.
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
	const parsedPath = parsePathString(pathInput);
	let path = [];
	let pi = -1;
	let x = 0;
	let y = 0;
	let mx = 0;
	let my = 0;
	iterate(parsedPath, (seg, _, prevX, prevY) => {
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
			path = [isRelative ? [
				absCommand,
				mx,
				my
			] : seg];
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
			path.push(seg);
		}
		composite[pi] = path;
	});
	return composite;
};
//#endregion
//#region src/process/getSVGMatrix.ts
/**
* Returns a transformation matrix to apply to `<path>` elements.
*
* @see TransformObjectValues
*
* @param transform the `transformObject`
* @returns a new transformation matrix
*/
const getSVGMatrix = (transform) => {
	let matrix = new CSSMatrix();
	const { origin } = transform;
	const [originX, originY] = origin;
	const { translate } = transform;
	const { rotate } = transform;
	const { skew } = transform;
	const { scale } = transform;
	if (Array.isArray(translate) && translate.length >= 2 && translate.every((x) => !Number.isNaN(+x)) && translate.some((x) => x !== 0)) matrix = matrix.translate(...translate);
	else if (typeof translate === "number" && !Number.isNaN(translate)) matrix = matrix.translate(translate);
	if (rotate || skew || scale) {
		matrix = matrix.translate(originX, originY);
		if (Array.isArray(rotate) && rotate.length >= 2 && rotate.every((x) => !Number.isNaN(+x)) && rotate.some((x) => x !== 0)) matrix = matrix.rotate(...rotate);
		else if (typeof rotate === "number" && !Number.isNaN(rotate)) matrix = matrix.rotate(rotate);
		if (Array.isArray(skew) && skew.length === 2 && skew.every((x) => !Number.isNaN(+x)) && skew.some((x) => x !== 0)) {
			matrix = skew[0] ? matrix.skewX(skew[0]) : matrix;
			matrix = skew[1] ? matrix.skewY(skew[1]) : matrix;
		} else if (typeof skew === "number" && !Number.isNaN(skew)) matrix = matrix.skewX(skew);
		if (Array.isArray(scale) && scale.length >= 2 && scale.every((x) => !Number.isNaN(+x)) && scale.some((x) => x !== 1)) matrix = matrix.scale(...scale);
		else if (typeof scale === "number" && !Number.isNaN(scale)) matrix = matrix.scale(scale);
		matrix = matrix.translate(-originX, -originY);
	}
	return matrix;
};
//#endregion
//#region src/process/projection2d.ts
/**
* Transforms a specified point using a matrix, returning a new
* Tuple *Object* comprising of the transformed point.
* Neither the matrix nor the original point are altered.
*
* @copyright thednp © 2021
*
* @param cssm CSSMatrix instance
* @param v Tuple
* @returns the resulting Tuple
*/
const translatePoint = (cssm, v) => {
	let m = CSSMatrix.Translate(v[0], v[1], v[2]);
	[, , , m.m44] = v;
	m = cssm.multiply(m);
	return [
		m.m41,
		m.m42,
		m.m43,
		m.m44
	];
};
/**
* Returns the [x,y] projected coordinates for a given an [x,y] point
* and an [x,y,z] perspective origin point.
*
* Equation found here =>
* http://en.wikipedia.org/wiki/3D_projection#Diagram
* Details =>
* https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
*
* @param m the transformation matrix
* @param point2D the initial [x,y] coordinates
* @param origin the [x,y,z] transform origin
* @returns the projected [x,y] coordinates
*/
const projection2d = (m, point2D, origin) => {
	const [originX, originY, originZ] = origin;
	const [x, y, z] = translatePoint(m, [
		point2D[0],
		point2D[1],
		0,
		1
	]);
	const relativePositionX = x - originX;
	const relativePositionY = y - originY;
	const relativePositionZ = z - originZ;
	return [relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ) || 1) + originX, relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ) || 1) + originY];
};
//#endregion
//#region src/process/transformPath.ts
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
const transformPath = (pathInput, transform) => {
	let x = 0;
	let y = 0;
	let lx = 0;
	let ly = 0;
	let j = 0;
	let jj = 0;
	const path = parsePathString(pathInput);
	const transformProps = transform && Object.keys(transform);
	if (!transform || transformProps && !transformProps.length) return path.slice(0);
	if (!transform.origin) Object.assign(transform, { origin: defaultOptions.origin });
	const origin = transform.origin;
	const matrixInstance = getSVGMatrix(transform);
	if (matrixInstance.isIdentity) return path.slice(0);
	return iterate(path, (seg, index, lastX, lastY) => {
		let [pathCommand] = seg;
		const absCommand = pathCommand.toUpperCase();
		const absoluteSegment = absCommand !== pathCommand ? absolutizeSegment(seg, index, lastX, lastY) : seg.slice(0);
		let result = absCommand === "A" ? ["C"].concat(arcToCubic(lastX, lastY, absoluteSegment[1], absoluteSegment[2], absoluteSegment[3], absoluteSegment[4], absoluteSegment[5], absoluteSegment[6], absoluteSegment[7])) : absCommand === "V" ? [
			"L",
			lastX,
			absoluteSegment[1]
		] : absCommand === "H" ? [
			"L",
			absoluteSegment[1],
			lastY
		] : absoluteSegment;
		pathCommand = result[0];
		const isLongArc = pathCommand === "C" && result.length > 7;
		const tempSegment = isLongArc ? result.slice(0, 7) : result.slice(0);
		if (isLongArc) {
			path.splice(index + 1, 0, ["C"].concat(result.slice(7)));
			result = tempSegment;
		}
		if (pathCommand === "L") {
			[lx, ly] = projection2d(matrixInstance, [result[1], result[2]], origin);
			if (x !== lx && y !== ly) result = [
				"L",
				lx,
				ly
			];
			else if (y === ly) result = ["H", lx];
			else if (x === lx) result = ["V", ly];
		} else for (j = 1, jj = result.length; j < jj; j += 2) {
			[lx, ly] = projection2d(matrixInstance, [+result[j], +result[j + 1]], origin);
			result[j] = lx;
			result[j + 1] = ly;
		}
		x = lx;
		y = ly;
		return result;
	});
};
//#endregion
//#region src/process/reverseCurve.ts
/**
* Reverses all segments of a `pathArray`
* which consists of only C (cubic-bezier) path commands.
*
* @param path the source `pathArray`
* @returns the reversed `pathArray`
*/
const reverseCurve = (path) => {
	const rotatedCurve = path.slice(1).map((x, i, curveOnly) => !i ? path[0].slice(1).concat(x.slice(1)) : curveOnly[i - 1].slice(-2).concat(x.slice(1))).map((x) => x.map((_, i) => x[x.length - i - 2 * (1 - i % 2)])).reverse();
	return [["M"].concat(rotatedCurve[0].slice(0, 2))].concat(rotatedCurve.map((x) => ["C"].concat(x.slice(2))));
};
//#endregion
//#region src/process/roundPath.ts
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
	return iterate(path, (segment) => {
		return roundSegment(segment, round);
	});
};
//#endregion
//#region src/morph/fixPath.ts
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
//#endregion
//#region src/morph/splitCubicSegment.ts
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
//#endregion
//#region src/morph/pathToPolyline.ts
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
//#endregion
//#region src/morph/splitLineToCount.ts
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
	const dx = x2 - x1;
	const dy = y2 - y1;
	let currentX = x1;
	let currentY = y1;
	let i = 0;
	while (i < count) {
		const t = 1 / (count - i);
		const nextX = x1 + t * dx;
		const nextY = y1 + t * dy;
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
//#endregion
//#region src/morph/getPathSplits.ts
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
	if (target <= 1) throw new TypeError(`${error}: target must be >= 2`);
	const totalLength = getTotalLength(path);
	if (totalLength === 0) return Array(path.length).fill(1);
	const idealSegLen = totalLength / target;
	const isPoly = isPolylineArray(path);
	const splits = [1];
	const lengths = [0];
	iterate(path, (seg, i, prevX, prevY) => {
		if (i > 0) {
			const [endX, endY] = seg.slice(-2);
			const segLen = isPoly ? getLineLength(prevX, prevY, endX, endY) : getCubicLength(prevX, prevY, seg[1], seg[2], seg[3], seg[4], seg[5], seg[6]);
			lengths.push(segLen);
			splits.push(1);
		}
	});
	let totalAllocated = 1;
	for (let i = 1; i < lengths.length; i++) {
		const segLen = lengths[i];
		const desired = segLen > idealSegLen ? Math.round(segLen / idealSegLen) : 1;
		splits[i] = desired;
		totalAllocated += desired;
	}
	let diff = target - totalAllocated;
	if (diff !== 0) {
		const candidates = [];
		for (let i = 1; i < lengths.length; i++) if (lengths[i] > 0) candidates.push([i, lengths[i]]);
		const cLen = candidates.length;
		if (diff < 0) {
			candidates.sort((a, b) => a[1] - b[1]);
			for (let i = 0; i < cLen; i++) {
				const idx = candidates[i][0];
				if (splits[idx] > 1 && candidates[i][1] > 0) {
					splits[idx]--;
					diff++;
				}
				if (diff === 0) break;
				else if (i === cLen - 1) i = 0;
			}
		} else if (diff > 0) {
			candidates.sort((a, b) => b[1] - a[1]);
			for (let i = 0; i < cLen; i++) {
				const idx = candidates[i][0];
				if (candidates[i][1] > 0) {
					splits[idx]++;
					diff--;
				}
				if (diff === 0) break;
				else if (i === cLen - 1) i = 0;
			}
		}
	}
	return splits;
}
//#endregion
//#region src/morph/splitLinePathToCount.ts
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
//#endregion
//#region src/morph/splitCubicToCount.ts
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
//#endregion
//#region src/morph/splitCurvePathToCount.ts
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
//#endregion
//#region src/morph/getRotatedPath.ts
/**
* Returns all possible rotations of a path (line or curve) by shifting the start point.
* Each rotation is a new PathArray starting at a different original segment.
*
* @param path PathArray (M + L/C + optional Z) — must be single subpath, normalized
* @returns PathArray[] — array of all possible rotations
*/
function getRotations(a) {
	const pathLen = a.length;
	const pointCount = pathLen - 1;
	let path;
	const result = [];
	for (let idx = 0; idx < pathLen; idx++) {
		path = [];
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
		result.push(path);
	}
	return result;
}
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
	const rotations = computedRotations || getRotations(pathA);
	if (pathA.length !== pathB.length) throw new TypeError(error + ": paths must have the same number of segments after equalization");
	let bestIndex = 0;
	let minDistanceSq = Infinity;
	for (let ri = 0; ri < rotations.length; ri++) {
		const rotation = rotations[ri];
		const rLen = rotation.length;
		let sumDistSq = 0;
		for (let i = 0; i < rLen; i++) {
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
	return rotations[bestIndex];
}
//#endregion
//#region src/morph/equalizeSegments.ts
const equalizeSegmentsDefaults = {
	mode: "auto",
	sampleSize: 10,
	roundValues: 4,
	reverse: true,
	close: false,
	target: void 0
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
	const { close, mode, reverse, roundValues, target: initialTarget } = Object.assign(equalizeSegmentsDefaults, initialCfg);
	let p1 = normalizePath(path1);
	let p2 = normalizePath(path2);
	fixPath(p1);
	fixPath(p2);
	let bothPoly = (isPolygonArray(p1) || isPolylineArray(p1)) && (isPolygonArray(p2) || isPolylineArray(p2));
	if (bothPoly && mode === "auto") {
		p1 = pathToPolyline(p1);
		p2 = pathToPolyline(p2);
	} else {
		bothPoly = false;
		p1 = pathToCurve(p1);
		p2 = pathToCurve(p2);
	}
	const area1 = polygonArea(samplePolygon(p1));
	const area2 = polygonArea(samplePolygon(p2));
	if (reverse !== false && Math.sign(area1) !== Math.sign(area2)) p2 = reversePath(p2);
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
	if (bothPoly) {
		equalP1 = splitLinePathToCount(p1, target);
		equalP2 = splitLinePathToCount(p2, target);
	} else {
		equalP1 = splitCurvePathToCount(p1, target);
		equalP2 = splitCurvePathToCount(p2, target);
	}
	equalP2 = getRotatedPath(equalP2, equalP1);
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
//#endregion
//#region src/util/pathIntersection.ts
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
			if (t1 >= 0 && t1 <= maxLimit && t2 >= 0 && t2 <= maxLimit) if (justCount) res++;
			else res.push({
				x: is.x,
				y: is.y,
				t1: Math.min(t1, 1),
				t2: Math.min(t2, 1)
			});
		}
	}
	return res;
};
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
* // => [{ x: 50, y: 25, t1: 0.5, t2: 0.5 }]
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
//#endregion
//#region src/morph/createPlaceholder.ts
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
//#endregion
//#region src/morph/matchPaths.ts
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
	fromPaths.sort((a, b) => b.size - a.size);
	toPaths.sort((a, b) => b.size - a.size);
	while (fromPaths.length > 0) {
		const from = fromPaths.shift();
		const bestTo = getBestMatch(from, toPaths);
		if (bestTo) pairs.push([from.path, bestTo.path]);
		else {
			const fromCentroid = [from.bbox.cx, from.bbox.cy];
			pairs.push([from.path, createPlaceholder(fromCentroid)]);
		}
	}
	while (toPaths.length > 0) {
		const to = toPaths.shift();
		const toCentroid = [to.bbox.cx, to.bbox.cy];
		pairs.push([createPlaceholder(toCentroid), to.path]);
	}
	return pairs;
}
//#endregion
//#region src/morph/classifyPaths.ts
/**
* Classifies paths into outer (containing) and inner (hole) paths.
*
* @param paths - Array of normalized path arrays to classify
* @returns Object with `outers` (containing shapes) and `inners` (holes)
*/
const classifyPaths = (paths) => {
	const outers = [];
	const inners = [];
	for (const path of paths) {
		const signedArea = polygonArea(samplePolygon(path));
		const bbox = getPathBBox(path);
		const feature = {
			isPoly: isPolygonArray(path) || isPolylineArray(path),
			size: bbox.width * bbox.height,
			path,
			signedArea,
			area: Math.abs(signedArea),
			bbox
		};
		if (signedArea > 0) outers.push(feature);
		else inners.push(feature);
	}
	return {
		outers,
		inners
	};
};
//#endregion
//#region src/morph/equalizePaths.ts
const equalizePathsDefaults = {
	mode: "auto",
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
	const cfg = Object.assign(equalizePathsDefaults, initialCfg);
	const p1 = normalizePath(pathInput1);
	const p2 = normalizePath(pathInput2);
	const multi1 = isMultiPath(p1);
	const multi2 = isMultiPath(p2);
	if (!multi1 && !multi2) return equalizeSegments(p1, p2, cfg);
	const globalArea1 = polygonArea(samplePolygon(p1));
	const globalArea2 = polygonArea(samplePolygon(p2));
	let path1 = p1;
	let path2 = p2;
	if (Math.sign(globalArea1) < 0) path1 = reversePath(path1);
	if (Math.sign(globalArea2) < 0) path2 = reversePath(path2);
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
			reverse: false
		});
		equalizedPairs.push([eqFrom, eqTo]);
	}
	return [equalizedPairs.map((p) => p[0]).flat(), equalizedPairs.map((p) => p[1]).flat()];
};
//#endregion
//#region src/main.ts
/**
* Creates a new SVGPathCommander instance with the following properties:
* * segments: `pathArray`
* * round: number
* * origin: [number, number, number?]
*
* @class
* @author thednp <https://github.com/thednp/svg-path-commander>
* @returns a new SVGPathCommander instance
*/
var SVGPathCommander = class {
	/**
	* @constructor
	* @param pathValue the path string
	* @param config instance options
	*/
	constructor(pathValue, config) {
		const instanceOptions = config || {};
		const undefPath = typeof pathValue === "undefined";
		if (undefPath || !pathValue.length) throw TypeError(`${error}: "pathValue" is ${undefPath ? "undefined" : "empty"}`);
		this.segments = parsePathString(pathValue);
		const { round: roundOption, origin: originOption } = instanceOptions;
		let round;
		if (Number.isInteger(roundOption) || roundOption === "off") round = roundOption;
		else round = defaultOptions.round;
		let origin = defaultOptions.origin;
		if (Array.isArray(originOption) && originOption.length >= 2) {
			const [originX, originY, originZ] = originOption.map(Number);
			origin = [
				!Number.isNaN(originX) ? originX : 0,
				!Number.isNaN(originY) ? originY : 0,
				!Number.isNaN(originZ) ? originZ : 0
			];
		}
		this.round = round;
		this.origin = origin;
		return this;
	}
	get bbox() {
		return getPathBBox(this.segments);
	}
	get length() {
		return getTotalLength(this.segments);
	}
	/**
	* Returns the path bounding box, equivalent to native `path.getBBox()`.
	*
	* @public
	* @returns the pathBBox
	*/
	getBBox() {
		return this.bbox;
	}
	/**
	* Returns the total path length, equivalent to native `path.getTotalLength()`.
	*
	* @public
	* @returns the path total length
	*/
	getTotalLength() {
		return this.length;
	}
	/**
	* Returns an `{x,y}` point in the path stroke at a given length,
	* equivalent to the native `path.getPointAtLength()`.
	*
	* @public
	* @param length the length
	* @returns the requested point
	*/
	getPointAtLength(length) {
		return getPointAtLength(this.segments, length);
	}
	/**
	* Convert path to absolute values.
	*
	* @example
	* ```ts
	* new SVGPathCommander('M10 10l80 80').toAbsolute().toString()
	* // => 'M10 10L90 90'
	* ```
	*
	* @returns this for chaining
	* @public
	*/
	toAbsolute() {
		const { segments } = this;
		this.segments = pathToAbsolute(segments);
		return this;
	}
	/**
	* Convert path to relative values.
	*
	* @example
	* ```ts
	* new SVGPathCommander('M10 10L90 90').toRelative().toString()
	* // => 'M10 10l80 80'
	* ```
	*
	* @returns this for chaining
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
	* @example
	* ```ts
	* new SVGPathCommander('M10 50q15 -25 30 0').toCurve().toString()
	* // => 'M10 50C25 25 40 50 40 50'
	* ```
	*
	* @returns this for chaining
	* @public
	*/
	toCurve() {
		const { segments } = this;
		this.segments = pathToCurve(segments);
		return this;
	}
	/**
	* Reverse the order of the segments and their values.
	*
	* @example
	* ```ts
	* new SVGPathCommander('M0 0L100 0L100 100L0 100Z').reverse().toString()
	* // => 'M0 100L0 0L100 0L100 100Z'
	* ```
	*
	* @param onlySubpath - option to reverse all sub-paths except first
	* @returns this for chaining
	* @public
	*/
	reverse(onlySubpath) {
		const { segments } = this;
		const split = splitPath(segments);
		const subPath = split.length > 1 ? split : false;
		const absoluteMultiPath = subPath ? subPath.map((x, i) => {
			if (onlySubpath) return i ? reversePath(x) : x.slice(0);
			return reversePath(x);
		}) : segments.slice(0);
		let path = [];
		if (subPath) path = absoluteMultiPath.flat(1);
		else path = onlySubpath ? segments : reversePath(segments);
		this.segments = path.slice(0);
		return this;
	}
	/**
	* Normalize path in 2 steps:
	* * convert `pathArray`(s) to absolute values
	* * convert shorthand notation to standard notation
	*
	* @example
	* ```ts
	* new SVGPathCommander('M10 90s20 -80 40 -80s20 80 40 80').normalize().toString()
	* // => 'M10 90C30 90 25 10 50 10C75 10 70 90 90 90'
	* ```
	*
	* @returns this for chaining
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
	*
	* @example
	* ```ts
	* new SVGPathCommander('M10 10L10 10L90 90').optimize().toString()
	* // => 'M10 10l0 0 80 80'
	* ```
	*
	* @returns this for chaining
	* @public
	*/
	optimize() {
		const { segments } = this;
		this.segments = optimizePath(segments, this.round === "off" ? 2 : this.round);
		return this;
	}
	/**
	* Transform path using values from an `Object` defined as `transformObject`.
	*
	* @see TransformObject for a quick reference
	*
	* @param source a `transformObject` as described above
	* @returns this for chaining
	* @public
	*/
	transform(source) {
		if (!source || typeof source !== "object" || typeof source === "object" && ![
			"translate",
			"rotate",
			"skew",
			"scale"
		].some((x) => x in source)) return this;
		const { segments, origin: [cx, cy, cz] } = this;
		const transform = {};
		for (const [k, v] of Object.entries(source)) if (k === "skew" && Array.isArray(v)) transform[k] = v.map(Number);
		else if ((k === "rotate" || k === "translate" || k === "origin" || k === "scale") && Array.isArray(v)) transform[k] = v.map(Number);
		else if (k !== "origin" && typeof Number(v) === "number") transform[k] = Number(v);
		const { origin } = transform;
		if (Array.isArray(origin) && origin.length >= 2) {
			const [originX, originY, originZ] = origin.map(Number);
			transform.origin = [
				!Number.isNaN(originX) ? originX : cx,
				!Number.isNaN(originY) ? originY : cy,
				originZ || cz
			];
		} else transform.origin = [
			cx,
			cy,
			cz
		];
		this.segments = transformPath(segments, transform);
		return this;
	}
	/**
	* Rotate path 180deg vertically.
	*
	* @example
	* ```ts
	* const path = new SVGPathCommander('M0 0L100 0L100 100L0 100Z')
	* path.flipX().toString()
	* ```
	*
	* @returns this for chaining
	* @public
	*/
	flipX() {
		const { cx, cy } = this.bbox;
		this.transform({
			rotate: [
				0,
				180,
				0
			],
			origin: [
				cx,
				cy,
				0
			]
		});
		return this;
	}
	/**
	* Rotate path 180deg horizontally.
	*
	* @example
	* ```ts
	* const path = new SVGPathCommander('M0 0L100 0L100 100L0 100Z')
	* path.flipY().toString()
	* ```
	*
	* @returns this for chaining
	* @public
	*/
	flipY() {
		const { cx, cy } = this.bbox;
		this.transform({
			rotate: [
				180,
				0,
				0
			],
			origin: [
				cx,
				cy,
				0
			]
		});
		return this;
	}
	/**
	* Export the current path to be used
	* for the `d` (description) attribute.
	*
	* @public
	* @returns the path string
	*/
	toString() {
		return pathToString(this.segments, this.round);
	}
	/**
	* Remove the instance.
	*
	* @public
	* @returns void
	*/
	dispose() {
		Object.keys(this).forEach((key) => delete this[key]);
	}
	static options = defaultOptions;
	static CSSMatrix = CSSMatrix;
	static arcTools = arcTools;
	static bezierTools = bezierTools;
	static cubicTools = cubicTools;
	static lineTools = lineTools;
	static polygonTools = polygonTools;
	static quadTools = quadTools;
	static pathToAbsolute = pathToAbsolute;
	static pathToRelative = pathToRelative;
	static pathToCurve = pathToCurve;
	static pathToString = pathToString;
	static distanceSquareRoot = distanceSquareRoot;
	static midPoint = midPoint;
	static rotateVector = rotateVector;
	static roundTo = roundTo;
	static parsePathString = parsePathString;
	static finalizeSegment = finalizeSegment;
	static invalidPathValue = invalidPathValue;
	static isArcCommand = isArcCommand;
	static isDigit = isDigit;
	static isDigitStart = isDigitStart;
	static isMoveCommand = isMoveCommand;
	static isPathCommand = isPathCommand;
	static isSpace = isSpace;
	static paramsCount = paramsCounts;
	static paramsParser = paramsParser;
	static PathParser = PathParser;
	static scanFlag = scanFlag;
	static scanParam = scanParam;
	static scanSegment = scanSegment;
	static skipSpaces = skipSpaces;
	static distanceEpsilon = DISTANCE_EPSILON;
	static fixPath = fixPath;
	static getClosestPoint = getClosestPoint;
	static getDrawDirection = getDrawDirection;
	static getPathArea = getPathArea;
	static getPathBBox = getPathBBox;
	static getPointAtLength = getPointAtLength;
	static getPropertiesAtLength = getPropertiesAtLength;
	static getPropertiesAtPoint = getPropertiesAtPoint;
	static getSegmentAtLength = getSegmentAtLength;
	static getSegmentOfPoint = getSegmentOfPoint;
	static getTotalLength = getTotalLength;
	static isAbsoluteArray = isAbsoluteArray;
	static isCurveArray = isCurveArray;
	static isPolygonArray = isPolygonArray;
	static isNormalizedArray = isNormalizedArray;
	static isPathArray = isPathArray;
	static isPointInStroke = isPointInStroke;
	static isRelativeArray = isRelativeArray;
	static isValidPath = isValidPath;
	static samplePolygon = samplePolygon;
	static shapeParams = shapeParams;
	static shapeToPath = shapeToPath;
	static shapeToPathArray = shapeToPathArray;
	static absolutizeSegment = absolutizeSegment;
	static arcToCubic = arcToCubic;
	static getSVGMatrix = getSVGMatrix;
	static iterate = iterate;
	static lineToCubic = lineToCubic;
	static normalizePath = normalizePath;
	static normalizeSegment = normalizeSegment;
	static optimizePath = optimizePath;
	static projection2d = projection2d;
	static quadToCubic = quadToCubic;
	static relativizeSegment = relativizeSegment;
	static reverseCurve = reverseCurve;
	static reversePath = reversePath;
	static roundPath = roundPath;
	static roundSegment = roundSegment;
	static segmentToCubic = segmentToCubic;
	static shortenSegment = shortenSegment;
	static splitPath = splitPath;
	static equalizePaths = equalizePaths;
	static equalizeSegments = equalizeSegments;
	static splitCubicSegment = splitCubicSegment;
	static transformPath = transformPath;
	static isPointInsideBBox = isPointInsideBBox;
	static pathsIntersection = pathsIntersection;
	static boundingBoxIntersect = boundingBoxIntersect;
	static isMultiPath = isMultiPath;
	static isClosedPath = isClosedPath;
	static isPolylineArray = isPolylineArray;
	static version = version;
};
//#endregion
//#region src/index.ts
var src_default = SVGPathCommander;
//#endregion
export { src_default as default };

//# sourceMappingURL=index.js.map