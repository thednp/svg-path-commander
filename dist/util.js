/*!
* SVGPathCommander UTIL v2.4.0 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
import CSSMatrix from "@thednp/dommatrix";
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
// src/math/distanceSquareRoot.ts
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
/** The tools for line segment computation. */
const lineTools = {
	getLineBBox,
	getLineLength,
	getPointAtLineLength
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
* Calculates the speed (derivative magnitude) of a Bezier curve at parameter `t`.
*
* @param derivativeFn the curve derivative function
* @param t the sampled point ratio in `[0-1]`
* @returns the curve speed at parameter `t`
*/
const calculateBezier = (derivativeFn, t) => {
	const d = derivativeFn(t);
	const l = d.x * d.x + d.y * d.y;
	return Math.sqrt(l);
};
/**
* Returns the total arc length of a Bezier segment.
*
* @param derivativeFn the curve derivative function
* @returns the total arc length
*/
const bezierLength = (derivativeFn) => {
	return bezierLengthAtT(derivativeFn, 1);
};
/**
* Returns the arc length of a Bezier segment from its start point
* up to a given `t` ratio, by integrating the curve speed `|B'(t)|`
* over the `[0, t]` interval with Gauss-Legendre quadrature.
*
* @param derivativeFn the curve derivative function
* @param t the sampled point ratio in `[0-1]`
* @returns the arc length up to parameter `t`
*/
const bezierLengthAtT = (derivativeFn, t) => {
	const z = t / 2;
	const len = Tvalues.length;
	let sum = 0;
	for (let i = 0, tMid; i < len; i++) {
		tMid = z * Tvalues[i] + z;
		sum += Cvalues[i] * calculateBezier(derivativeFn, tMid);
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
* Returns the arc length of a Bezier segment from its start point
* up to a given `t` ratio, for the segment given by its coordinates.
*
* @param curve cubic / quad bezier segment
* @param t the sampled point ratio in `[0-1]`
* @returns the arc length up to parameter `t`
*/
const getBezierLengthAtT = (curve, t) => {
	const dpoints = deriveBezier(getBezierPoints(curve));
	return bezierLengthAtT((ratio) => {
		return computeBezier(dpoints[0], ratio);
	}, t);
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
	const dpoints = deriveBezier(getBezierPoints(curve));
	const derivativeFn = (ratio) => {
		return computeBezier(dpoints[0], ratio);
	};
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 25; i += 1) {
		const mid = (lo + hi) / 2;
		if (bezierLengthAtT(derivativeFn, mid) < distance) lo = mid;
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
	return bezierLength((t) => {
		return computeBezier(dpoints[0], t);
	});
};
/** The precision threshold to consider a cubic polynomial as quadratic. */
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
/** The tools for Bezier curve computation. */
const bezierTools = {
	bezierLength,
	bezierLengthAtT,
	calculateBezier,
	CBEZIER_MINMAX_EPSILON,
	computeBezier,
	Cvalues,
	deriveBezier,
	getBezierLength,
	getBezierLengthAtT,
	getBezierPoints,
	getTAtBezierLength,
	minmaxC,
	minmaxQ,
	Tvalues
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
* Returns the Arc segment length.
* @param rx radius along X axis
* @param ry radius along Y axis
* @param theta the angle in radians
* @returns the arc length
*/
const arcLength = (rx, ry, theta) => {
	return Math.abs(arcLengthAtAngle(rx, ry, theta));
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
		const sweepAngle = endAngle - startAngle;
		const length = Math.abs(arcLengthBetween(rx, ry, startAngle, endAngle));
		if (rx === 0 || ry === 0) return getPointAtLineLength(x1, y1, x, y, distance);
		if (distance <= 0) point = {
			x: x1,
			y: y1
		};
		else if (distance >= length) point = {
			x,
			y
		};
		else {
			const { PI, cos, sin } = Math;
			const xRotRad = (angle % 360 + 360) % 360 * (PI / 180);
			let lo = 0;
			let hi = 1;
			for (let i = 0; i < 25; i += 1) {
				const mid = (lo + hi) / 2;
				if (Math.abs(arcLengthBetween(rx, ry, startAngle, startAngle + sweepAngle * mid)) < distance) lo = mid;
				else hi = mid;
			}
			const alpha = startAngle + sweepAngle * ((lo + hi) / 2);
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
	const { min, max, tan, atan2, cos, PI } = Math;
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
	const xArray = [x];
	const yArray = [y];
	let xMin = min(x1, x);
	let xMax = max(x1, x);
	let yMin = min(y1, y);
	let yMax = max(y1, y);
	const angleAfterStart = endAngle - deltaAngle * 1e-5;
	const pP2 = arcPoint(cx, cy, rx, ry, alpha, angleAfterStart);
	const angleBeforeEnd = endAngle - deltaAngle * .99999;
	const pP3 = arcPoint(cx, cy, rx, ry, alpha, angleBeforeEnd);
	/**
	* expected extremes
	* if leaving inner bounding box
	* (between segment start and end point)
	* otherwise exclude elliptic extreme points
	*/
	if (pP2[0] > xMax || pP3[0] > xMax) {
		const p1 = arcPoint(cx, cy, rx, ry, alpha, rightAngle);
		xArray.push(p1[0]);
		yArray.push(p1[1]);
	}
	if (pP2[0] < xMin || pP3[0] < xMin) {
		const p2 = arcPoint(cx, cy, rx, ry, alpha, leftAngle);
		xArray.push(p2[0]);
		yArray.push(p2[1]);
	}
	if (pP2[1] < yMin || pP3[1] < yMin) {
		const p4 = arcPoint(cx, cy, rx, ry, alpha, topAngle);
		xArray.push(p4[0]);
		yArray.push(p4[1]);
	}
	if (pP2[1] > yMax || pP3[1] > yMax) {
		const p3 = arcPoint(cx, cy, rx, ry, alpha, bottomAngle);
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
/** The tools for elliptical arc computation. */
const arcTools = {
	angleBetween,
	arcLength,
	arcLengthAtAngle,
	arcLengthBetween,
	arcPoint,
	getArcBBox,
	getArcLength,
	getArcProps,
	getPointAtArcLength
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
/** The tools for cubic Bezier computation. */
const cubicTools = {
	getCubicBBox,
	getCubicLength,
	getPointAtCubicLength,
	getPointAtCubicSegmentLength
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
		const coords = [
			x1,
			y1,
			cx,
			cy,
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
			point = getPointAtQuadSegmentLength(coords, t);
		}
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
/** The tools for quadratic Bezier computation. */
const quadTools = {
	getPointAtQuadLength,
	getPointAtQuadSegmentLength,
	getQuadBBox,
	getQuadLength
};
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
/** The tools for polygon computation. */
const polygonTools = {
	polygonArea,
	polygonLength,
	polygonCentroid
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
// src/parser/finalizeSegment.ts
/**
* Breaks the parsing of a pathString once a segment is finalized.
*
* @param path - The PathParser instance
*/
const finalizeSegment = (path) => {
	let pathCommand = path.pathValue[path.segmentStart];
	let relativeCommand = pathCommand.toLowerCase();
	const { data } = path;
	let index = 0;
	while (data.length - index >= paramsCounts[relativeCommand]) {
		if (relativeCommand === "m" && data.length - index > 2) {
			const segment = new Array(3);
			segment[0] = pathCommand;
			segment[1] = data[index];
			segment[2] = data[index + 1];
			path.segments.push(segment);
			index += 2;
			relativeCommand = "l";
			pathCommand = pathCommand === "m" ? "l" : "L";
		} else {
			const paramCount = paramsCounts[relativeCommand];
			const segment = new Array(paramCount + 1);
			segment[0] = pathCommand;
			for (let i = 0; i < paramCount; i += 1) segment[i + 1] = data[index + i];
			path.segments.push(segment);
			index += paramCount;
		}
		if (!paramsCounts[relativeCommand]) break;
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
		const [pathCommand] = segment;
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
// src/process/relativizeSegment.ts
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
// src/convert/pathToRelative.ts
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
	const path = parsePathString(pathInput);
	return iterate(path, relativizeSegment);
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
		y
	];
	else if (absCommand === "V") return [
		"L",
		x,
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
		const canReflect = prevCommand != null && "CS".includes(prevCommand);
		return [
			"C",
			canReflect && params.x2 != null ? x * 2 - params.x2 : x,
			canReflect && params.y2 != null ? y * 2 - params.y2 : y
		].concat(absValues);
	} else if (absCommand === "T") {
		const qx = params.qx != null ? x * 2 - params.qx : x;
		const qy = params.qy != null ? y * 2 - params.qy : y;
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
			path.splice(index + 1, 0, ["C"].concat(values.slice(7)));
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
// src/convert/pathToString.ts
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
	const pow = round === "off" ? 0 : 10 ** round;
	for (let i = 0; i < pathLen; i += 1) {
		segment = path[i];
		const pathCommand = segment[0];
		const segLen = segment.length;
		result += pathCommand;
		if (round === "off") for (let j = 1; j < segLen; j += 1) {
			result += segment[j];
			if (j !== segLen - 1) result += " ";
		}
		else for (let j = 1; j < segLen; j += 1) {
			result += Math.round(segment[j] * pow) / pow;
			if (j !== segLen - 1) result += " ";
		}
	}
	return result;
};
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
			paramQX = null;
			paramQY = null;
		}
		let length = 0;
		let geometry = normalSegment;
		if (pathCommand === "M") [, mx, my] = normalSegment;
		else if (pathCommand === "L") length = getLineLength(lastX, lastY, normalSegment[1], normalSegment[2]);
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
		const [endX, endY] = pathCommand === "Z" ? [mx, my] : geometry.slice(-2);
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
		[paramX1, paramY1] = pathCommand === "Z" ? [mx, my] : normalSegment.slice(-2);
		[paramX2, paramY2] = pathCommand === "C" ? [normalSegment[3], normalSegment[4]] : pathCommand === "S" ? [normalSegment[1], normalSegment[2]] : [paramX1, paramY1];
	});
	return measures;
};
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
// src/util/distanceEpsilon.ts
/** Small threshold value used for floating-point distance comparisons in path calculations. */
const DISTANCE_EPSILON = 1e-5;
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
	for (const segment of path) {
		const command = segment[0];
		const measure = {
			segment,
			startX: x,
			startY: y,
			endX: x,
			endY: y,
			length: 0,
			lengthAtSegment: totalLength
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
/**
* Returns the point of a measured path at a given distance.
*
* The segment is found with a binary search over the accumulated lengths:
* it is the last segment whose accumulated length is still below the
* distance, which is the same segment the linear walk over the path would
* have stopped at.
*
* @param table - the length table of the path
* @param distance - the distance along the path
* @returns the requested {x, y} point coordinates
*/
const getPointAtTable = (table, distance) => {
	const { measures, startX, startY } = table;
	if (!measures.length) return {
		x: 0,
		y: 0
	};
	if (typeof distance !== "number" || Number.isNaN(distance) || distance < 1e-5) return {
		x: startX,
		y: startY
	};
	let low = 0;
	let high = measures.length - 1;
	while (low < high) {
		const mid = low + high + 1 >> 1;
		if (measures[mid].lengthAtSegment < distance) low = mid;
		else high = mid - 1;
	}
	const measure = measures[low];
	const { segment, startX: x1, startY: y1, endX, endY } = measure;
	const command = segment[0];
	const offset = distance - measure.lengthAtSegment;
	if (command === "M") return {
		x: endX,
		y: endY
	};
	if (command === "L") return getPointAtLineLength(x1, y1, endX, endY, offset);
	if (command === "C") return getPointAtCubicLength(x1, y1, segment[1], segment[2], segment[3], segment[4], endX, endY, offset);
	if (command === "Q") return getPointAtQuadLength(x1, y1, segment[1], segment[2], endX, endY, offset);
	if (command === "A") return getPointAtArcLength(x1, y1, segment[1], segment[2], segment[3], segment[4], segment[5], endX, endY, offset);
	return getPointAtLineLength(x1, y1, endX, endY, offset);
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
// src/util/getPropertiesAtLength.ts
/**
* Returns the length of a measured segment.
*
* The length is taken from the accumulated lengths, the total up to the
* segment minus the total before it, and not from the length the segment
* was measured with: the two differ in the last bits, and this keeps the
* result identical to the one the previous implementation returned.
*
* @param measure - the measured segment
* @returns the length of the segment
*/
const segmentLength = (measure) => measure.lengthAtSegment + measure.length - measure.lengthAtSegment;
/**
* Returns the frame of a measured segment at a given distance.
*
* @param measure - the measured segment
* @param offset - the distance from the start of the segment
* @returns the frame of the segment
*/
const frameOf = (measure, offset = 0) => {
	if (!measure) return {
		point: {
			x: 0,
			y: 0
		},
		tangent: {
			x: 0,
			y: 0
		},
		normal: {
			x: 0,
			y: 0
		},
		angle: 0
	};
	return getSegmentFrame(measure.geometry, measure.startX, measure.startY, measure.endX, measure.endY, offset, measure.length);
};
/**
* Returns the segment, its index and length as well as
* the length to that segment at a given length in a path.
*
* The point at the given length is returned with the frame of the path at
* that point: the unit tangent vector, the unit normal vector and the angle
* of the tangent in degrees.
*
* @param pathInput target `pathArray`
* @param distance the given length
* @returns the requested properties
*/
const getPropertiesAtLength = (pathInput, distance) => {
	const measures = measureSegments(pathInput);
	const lastIndex = measures.length - 1;
	const segment = measures[0]?.segment ?? [
		"M",
		0,
		0
	];
	if (lastIndex <= 0 || !distance || distance < 0) return {
		segment,
		index: 0,
		length: 0,
		lengthAtSegment: 0,
		...frameOf(measures[0])
	};
	const last = measures[lastIndex];
	if (distance >= last.lengthAtSegment + last.length) return {
		segment: last.segment,
		index: last.index,
		length: segmentLength(last),
		lengthAtSegment: last.lengthAtSegment,
		...frameOf(last, distance - last.lengthAtSegment)
	};
	let index = 1;
	for (let i = lastIndex; i > 0; i--) if (measures[i].lengthAtSegment <= distance) {
		index = i;
		break;
	}
	const measure = measures[index];
	return {
		segment: measure.segment,
		index: measure.index,
		length: segmentLength(measure),
		lengthAtSegment: measure.lengthAtSegment,
		...frameOf(measure, distance - measure.lengthAtSegment)
	};
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
// src/util/getPropertiesAtPoint.ts
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
	if (!path.length) return {
		closest: {
			x: 0,
			y: 0
		},
		distance: Infinity
	};
	const normalPath = normalizePath(path);
	const table = buildPathLengthTable(normalPath);
	const pathLength = table.totalLength;
	const isLoop = table.isLoop;
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
		scan = getPointAtTable(table, scanLength);
		scanDistance = distanceTo(scan);
		if (scanDistance < bestDistance) {
			closest = scan;
			bestLength = scanLength;
			bestDistance = scanDistance;
		}
	}
	precision /= 2;
	let beforeLength = 0;
	let afterLength = 0;
	while (precision > 1e-6) {
		beforeLength = bestLength - precision;
		afterLength = bestLength + precision;
		if (beforeLength < 0) beforeLength = isLoop ? beforeLength + pathLength : -1;
		if (afterLength > pathLength) afterLength = isLoop ? afterLength - pathLength : pathLength + 1;
		const before = beforeLength >= 0 && beforeLength <= pathLength ? getPointAtTable(table, beforeLength) : null;
		const after = afterLength >= 0 && afterLength <= pathLength ? getPointAtTable(table, afterLength) : null;
		const beforeDistance = before ? distanceTo(before) : Infinity;
		const afterDistance = after ? distanceTo(after) : Infinity;
		if (before && beforeDistance < bestDistance) {
			closest = before;
			bestLength = beforeLength;
			bestDistance = beforeDistance;
		} else if (after && afterDistance < bestDistance) {
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
// src/util/getClosestPoint.ts
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
// src/util/getPathArea.ts
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
* // => 10000 (clockwise square)
* ```
*/
const getPathArea = (path) => getCurveArea(pathToCurve(path));
/**
* Returns the signed area of a path that is already made of cubic beziers.
*
* The conversion is the expensive part of the area calculation, so it is
* kept out of this function: a caller that already has a curve array does
* not have to convert it a second time.
*
* @param path - The curve PathArray
* @returns The signed area of the shape
*/
const getCurveArea = (path) => {
	let x = 0;
	let y = 0;
	let len = 0;
	return path.map((seg) => {
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
// src/util/getDrawDirection.ts
/**
* Check if a path is drawn clockwise and returns true if so,
* false otherwise.
*
* @param path the path string or `pathArray`
* @returns true when clockwise or false if not
*/
const getDrawDirection = (path) => {
	return getCurveArea(pathToCurve(path)) >= 0;
};
// src/util/getPointAtLength.ts
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
	return getPointAtNormalizedLength(normalizePath(pathInput), distance);
};
/**
* Returns [x,y] coordinates of a point at a given length along a path
* that is already normalized.
*
* The normalization is the expensive part of the lookup, so it is kept
* out of this function: a caller that already has a normalized path does
* not have to normalize it again for every point it looks up.
*
* @param path - The normalized PathArray to look into
* @param distance - The distance along the path
* @returns The requested {x, y} point coordinates
*/
const getPointAtNormalizedLength = (path, distance) => {
	return getPointAtTable(buildPathLengthTable(path), distance);
};
// src/util/getSegmentAtLength.ts
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
// src/util/getSegmentOfPoint.ts
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
// src/util/isCurveArray.ts
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
// src/util/isPointInStroke.ts
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
// src/process/flattenPath.ts
/**
* Returns the number of intervals a cubic segment is split into.
*
* The second differences of the control points bound the distance of the
* curve to its chord, and the distance of a piece of the curve to the chord
* of the piece falls with the square of the number of the pieces, so the
* number of the intervals is the square root of the ratio of the bound to
* the tolerance.
*
* @param coords - the coordinates of the cubic segment
* @param tolerance - the maximum distance between the curve and its chords
* @returns the number of intervals
*/
const getIntervalCount = (coords, tolerance) => {
	const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] = coords;
	const d1 = Math.hypot(x1 - 2 * c1x + c2x, y1 - 2 * c1y + c2y);
	const d2 = Math.hypot(c1x - 2 * c2x + x2, c1y - 2 * c2y + y2);
	const flatness = .75 * Math.max(d1, d2);
	if (flatness <= tolerance) return 1;
	return Math.ceil(Math.sqrt(flatness / tolerance));
};
/**
* Flattens a path into polygons, one for every sub-path.
*
* The curves of the path are split into chords that stay within the
* tolerance of the curve, and every sub-path is closed, the way a fill
* closes an open path.
*
* @param path - the curve path to flatten
* @param tolerance - the maximum distance between the curve and its chords
* @returns the polygons of the path
*/
const flattenPath = (path, tolerance) => {
	const polygons = [];
	let points = [];
	let current = {
		x: 0,
		y: 0
	};
	for (const segment of path) {
		if (segment[0] === "M") {
			if (points.length > 1) polygons.push(points);
			current = {
				x: segment[1],
				y: segment[2]
			};
			points = [current];
			continue;
		}
		const coords = [
			current.x,
			current.y,
			segment[1],
			segment[2],
			segment[3],
			segment[4],
			segment[5],
			segment[6]
		];
		const count = getIntervalCount(coords, tolerance);
		for (let i = 1; i <= count; i += 1) {
			const point = getPointAtCubicSegmentLength(coords, i / count);
			points.push(point);
		}
		current = {
			x: segment[5],
			y: segment[6]
		};
	}
	if (points.length > 1) polygons.push(points);
	return polygons;
};
// src/math/distanceToSegment.ts
/**
* Returns the distance from a point to a line segment.
*
* The distance is the one to the segment, not to the infinite line: a point
* beyond the end of the segment is at the distance to that end.
*
* @param point - the point to measure
* @param start - the start of the segment
* @param end - the end of the segment
* @returns the distance from the point to the segment
*/
const distanceToSegment = (point, start, end) => {
	const dx = end.x - start.x;
	const dy = end.y - start.y;
	const lengthSquared = dx * dx + dy * dy;
	if (lengthSquared === 0) {
		const px = point.x - start.x;
		const py = point.y - start.y;
		return Math.sqrt(px * px + py * py);
	}
	let ratio = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
	ratio = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
	const px = point.x - (start.x + dx * ratio);
	const py = point.y - (start.y + dy * ratio);
	return Math.sqrt(px * px + py * py);
};
// src/math/pointInPolygon.ts
/**
* Returns the number of times a ray from a point crosses a polygon.
*
* The ray goes to the right, so every edge of the polygon that crosses the
* height of the point after it is counted. The parity of the count is the
* answer of the `evenodd` fill rule.
*
* @param polygon - the polygon to test
* @param point - the point to test
* @returns the number of crossings
*/
const getPolygonCrossings = (polygon, point) => {
	const { x, y } = point;
	const count = polygon.length;
	let crossings = 0;
	for (let i = 0; i < count; i += 1) {
		const j = (i + 1) % count;
		const current = polygon[i];
		const next = polygon[j];
		if (current.y > y === next.y > y) continue;
		if (x < (next.x - current.x) * (y - current.y) / (next.y - current.y) + current.x) crossings += 1;
	}
	return crossings;
};
/**
* Returns the winding number of a polygon around a point.
*
* Every edge that crosses the height of the point counts, the direction of
* the crossing decides the sign of the count. The winding number is zero
* outside of the polygon and it is not zero inside of it, whatever the
* direction of the polygon is, so its sign is the direction of the shape.
*
* @param polygon - the polygon to test
* @param point - the point to test
* @returns the winding number
*/
const getPolygonWindingNumber = (polygon, point) => {
	const { x, y } = point;
	const count = polygon.length;
	let winding = 0;
	for (let i = 0; i < count; i += 1) {
		const j = (i + 1) % count;
		const current = polygon[i];
		const next = polygon[j];
		const side = (next.x - current.x) * (y - current.y) - (next.y - current.y) * (x - current.x);
		if (current.y <= y) {
			if (next.y > y && side > 0) winding += 1;
		} else if (next.y <= y && side < 0) winding -= 1;
	}
	return winding;
};
/**
* Checks if a point is on the boundary of a polygon.
*
* @param polygon - the polygon to test
* @param point - the point to test
* @param epsilon - the maximum distance to the boundary
* @returns whether the point is on the boundary
*/
const isPointOnPolygon = (polygon, point, epsilon) => {
	const count = polygon.length;
	for (let i = 0; i < count; i += 1) {
		const j = (i + 1) % count;
		if (distanceToSegment(point, polygon[i], polygon[j]) <= epsilon) return true;
	}
	return false;
};
// src/util/isPointInPath.ts
/**
* The distance a point can be from the boundary of a shape and still be on it.
*
* The tolerance of the flattening is the error of the approximation, not the
* width of the boundary, so the boundary is tested with a tight distance.
*/
const boundaryEpsilon = 1e-9;
/**
* Checks if a given point is inside a path.
*
* The path is flattened into polygons and the point is tested against them
* with the fill rule of the path: the `nonzero` rule counts the windings of
* the polygons around the point, the `evenodd` rule counts the crossings of
* the polygons with a ray from the point. A point on the boundary of the
* shape is inside of it, the way the browser answers it.
*
* The curves of the path are approximated with chords that stay within the
* tolerance of the curve, so the answer is exact except for the points that
* are within the tolerance of the boundary of a curve.
*
* @param pathInput target path
* @param point the given `{x,y}` point
* @param options the options of the test
* @returns the query result
*
* @example
* ```ts
* isPointInPath('M0 0L100 0L100 100L0 100Z', { x: 50, y: 50 });
* // => true
* ```
*/
const isPointInPath = (pathInput, point, options) => {
	const { fillRule = "nonzero", tolerance = .1 } = options ?? {};
	if (fillRule !== "nonzero" && fillRule !== "evenodd") throw TypeError(`${error}: fillRule must be "nonzero" or "evenodd"`);
	if (typeof tolerance !== "number" || !Number.isFinite(tolerance) || tolerance <= 0) throw TypeError(`${error}: tolerance must be a positive number`);
	const path = pathToCurve(pathInput);
	if (!path.length) return false;
	const polygons = flattenPath(path, tolerance);
	let crossings = 0;
	let winding = 0;
	for (const polygon of polygons) {
		if (isPointOnPolygon(polygon, point, boundaryEpsilon)) return true;
		crossings += getPolygonCrossings(polygon, point);
		winding += getPolygonWindingNumber(polygon, point);
	}
	return fillRule === "evenodd" ? crossings % 2 === 1 : winding !== 0;
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
// src/util/isRelativeArray.ts
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
// src/util/isValidPath.ts
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
	return !path.err.length && !!path.segments.length && "mM".includes(path.segments[0][0]);
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
// src/util/shapeParams.ts
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
// src/util/isElement.ts
/**
* Checks if a value is a DOM Element.
*
* @param node - The value to check
* @returns True if the value is a DOM Element (nodeType === 1)
*/
const isElement = (node) => node !== void 0 && node !== null && typeof node === "object" && node.nodeType === 1;
// src/util/shapeToPathArray.ts
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
	while (index + 1 < points.length) {
		const x = points[index];
		const y = points[index + 1];
		if (Number.isFinite(x) && Number.isFinite(y)) pathArray.push([
			pathArray.length ? "L" : "M",
			x,
			y
		]);
		index += 2;
	}
	return attr.type === "polygon" && pathArray.length ? [...pathArray, ["z"]] : pathArray;
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
// src/util/shapeToPath.ts
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
// src/process/offsetNodes.ts
/**
* Returns the sampled points of the drawable segments of a sub-path.
*
* A line gives its two end points, a curve gives `steps` samples spread
* evenly over its length. The tangent of every sample is the tangent of the
* path at that point, so the normal of the sample is the direction the path
* is offset to.
*
* The first point of a segment is a corner when the segment follows another
* one, and the closing segment of a closed sub-path ends with a corner that
* joins the last segment to the first one.
*
* @param measures - the measured segments of the sub-path
* @param steps - the number of the intervals a curve is sampled with
* @returns the sampled points of the sub-path
*/
const getOffsetNodes = (measures, steps) => {
	const nodes = [];
	for (const measure of measures) {
		const command = measure.geometry[0];
		if (command === "M") continue;
		if (measure.length <= 0) continue;
		const isFirst = nodes.length === 0;
		if (command === "L" || command === "Z") {
			const dx = measure.endX - measure.startX;
			const dy = measure.endY - measure.startY;
			const length = Math.sqrt(dx * dx + dy * dy);
			const tx = dx / length;
			const ty = dy / length;
			nodes.push({
				x: measure.startX,
				y: measure.startY,
				tx,
				ty,
				corner: !isFirst
			});
			nodes.push({
				x: measure.endX,
				y: measure.endY,
				tx,
				ty,
				corner: false
			});
			continue;
		}
		for (let i = 0; i <= steps; i += 1) {
			const frame = getSegmentFrame(measure.geometry, measure.startX, measure.startY, measure.endX, measure.endY, measure.length * i / steps, measure.length);
			nodes.push({
				x: frame.point.x,
				y: frame.point.y,
				tx: frame.tangent.x,
				ty: frame.tangent.y,
				corner: !isFirst && i === 0
			});
		}
	}
	const last = measures[measures.length - 1];
	if (nodes.length && last && last.geometry[0] === "Z") {
		const first = nodes[0];
		nodes.push({
			x: first.x,
			y: first.y,
			tx: first.tx,
			ty: first.ty,
			corner: true
		});
	}
	return nodes;
};
// src/process/offsetJoin.ts
/**
* The angle of an arc of a round join or a round cap, in radians.
*
* The arcs are emitted as straight lines, and the smaller the angle the
* closer the result is to the arc it stands for.
*/
const arcStep = Math.PI / 8;
/**
* Returns the signed angle between two directions, in radians.
*
* The angle is the turn of the path at a corner: it is positive when the
* path turns towards the positive angle direction, and it is in the `-PI` to
* `PI` range.
*
* @param from - the direction the path comes from
* @param to - the direction the path goes to
* @returns the signed angle between the two directions
*/
const signedTurn = (from, to) => {
	const dot = from.tx * to.tx + from.ty * to.ty;
	const cross = from.tx * to.ty - from.ty * to.tx;
	return Math.atan2(cross, dot);
};
/**
* Returns the intersection of two lines, if they have one.
*
* @param x1 - the X coordinate of the first point
* @param y1 - the Y coordinate of the first point
* @param dx1 - the X component of the direction of the first line
* @param dy1 - the Y component of the direction of the first line
* @param x2 - the X coordinate of the second point
* @param y2 - the Y coordinate of the second point
* @param dx2 - the X component of the direction of the second line
* @param dy2 - the Y component of the direction of the second line
* @returns the intersection of the two lines, or `null`
*/
const intersectLines = (x1, y1, dx1, dy1, x2, y2, dx2, dy2) => {
	const denominator = dx1 * dy2 - dy1 * dx2;
	if (Math.abs(denominator) < 1e-12) return null;
	const ratio = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / denominator;
	return [x1 + dx1 * ratio, y1 + dy1 * ratio];
};
/**
* Returns the points of a join between two offset lines.
*
* The join is placed on the outer side of a corner, where the two offset
* lines do not cross: the `miter` join is the intersection of the two
* lines, the `bevel` join is the straight line between the two offset
* points and the `round` join is an arc of the offset radius around the
* corner.
*
* @param cornerX - the X coordinate of the corner of the path
* @param cornerY - the Y coordinate of the corner of the path
* @param from - the end of the incoming offset line
* @param to - the start of the outgoing offset line
* @param distance - the offset distance
* @param join - the join type
* @param miterLimit - the ratio of the miter length to the offset distance
* @returns the points of the join
*/
const getJoinPoints = (cornerX, cornerY, from, to, distance, join, miterLimit) => {
	if (join === "round") {
		const turn = signedTurn(from, to);
		const startAngle = Math.atan2(from.y - cornerY, from.x - cornerX);
		const steps = Math.max(1, Math.ceil(Math.abs(turn) / arcStep));
		const points = [];
		for (let i = 1; i < steps; i += 1) {
			const angle = startAngle + turn * i / steps;
			points.push([cornerX + Math.cos(angle) * distance, cornerY + Math.sin(angle) * distance]);
		}
		return points;
	}
	if (join === "miter") {
		const miter = intersectLines(from.x, from.y, from.tx, from.ty, to.x, to.y, to.tx, to.ty);
		if (miter) {
			if (Math.hypot(miter[0] - cornerX, miter[1] - cornerY) <= miterLimit * distance) return [miter];
		}
	}
	return [];
};
/**
* Returns the points of a cap at the end of an open path.
*
* The `butt` cap is the straight line between the two offset points, the
* `square` cap extends the path by the offset distance and the `round` cap
* is a half circle of the offset radius around the end of the path.
*
* @param centerX - the X coordinate of the end of the path
* @param centerY - the Y coordinate of the end of the path
* @param from - the first offset point of the cap
* @param to - the last offset point of the cap
* @param distance - the offset distance
* @param cap - the cap type
* @param extensionX - the X component of the direction the cap extends to
* @param extensionY - the Y component of the direction the cap extends to
* @returns the points of the cap
*/
const getCapPoints = (centerX, centerY, from, to, distance, cap, extensionX, extensionY) => {
	if (cap === "butt") return [];
	if (cap === "square") return [[from[0] + extensionX * distance, from[1] + extensionY * distance], [to[0] + extensionX * distance, to[1] + extensionY * distance]];
	const startAngle = Math.atan2(from[1] - centerY, from[0] - centerX);
	const sweep = -Math.PI;
	const steps = Math.max(1, Math.ceil(Math.abs(sweep) / arcStep));
	const points = [];
	for (let i = 1; i < steps; i += 1) {
		const angle = startAngle + sweep * i / steps;
		points.push([centerX + Math.cos(angle) * distance, centerY + Math.sin(angle) * distance]);
	}
	return points;
};
// src/process/offsetPath.ts
/** The sides an offset can be created on. */
const sides = [
	"left",
	"right",
	"both"
];
/** The join types of an offset. */
const joins = [
	"round",
	"miter",
	"bevel"
];
/** The cap types of an offset. */
const caps = [
	"butt",
	"square",
	"round"
];
/**
* Returns the options of the path offsetting, with the defaults applied.
*
* @param options - the options of the offset
* @returns the resolved options
*/
const resolveOptions = (options) => {
	const { side = "left", join = "miter", miterLimit = 4, cap = "butt", steps = 16, precision = 4 } = options;
	if (!sides.includes(side)) throw TypeError(`${error}: side must be one of "left", "right" or "both"`);
	if (!joins.includes(join)) throw TypeError(`${error}: join must be one of "round", "miter" or "bevel"`);
	if (!caps.includes(cap)) throw TypeError(`${error}: cap must be one of "butt", "square" or "round"`);
	if (typeof miterLimit !== "number" || !Number.isFinite(miterLimit) || miterLimit <= 0) throw TypeError(`${error}: miterLimit must be a positive number`);
	if (!Number.isInteger(steps) || steps < 1) throw TypeError(`${error}: steps must be an integer greater than 0`);
	if (!Number.isInteger(precision) || precision < 0) throw TypeError(`${error}: precision must be an integer of 0 or more`);
	return {
		side,
		join,
		miterLimit,
		cap,
		steps,
		precision
	};
};
/**
* Groups the measured segments of a path into its sub-paths.
*
* @param measures - the measured segments of the path
* @returns the measured segments of every sub-path
*/
const groupSubPaths = (measures) => {
	const groups = [];
	let group = [];
	for (const measure of measures) {
		if (measure.geometry[0] === "M" && group.length) {
			groups.push(group);
			group = [];
		}
		group.push(measure);
	}
	if (group.length) groups.push(group);
	return groups;
};
/**
* Returns the offset polyline of one side of a sub-path.
*
* Every node is shifted along the normal of the path. At a corner the two
* offset lines meet: on the outer side of the turn the join is applied, and
* on the inner side of the turn the offset lines cross before the corner, so
* the curve is trimmed at their intersection.
*
* @param nodes - the sampled points of the sub-path
* @param side - `1` for the left side of the path, `-1` for the right side
* @param distance - the offset distance
* @param options - the resolved options of the offset
* @param closed - whether the sub-path is closed
* @returns the points of the offset polyline
*/
const buildSidePolyline = (nodes, side, distance, options, closed) => {
	const { join, miterLimit } = options;
	const offsets = nodes.map((node) => ({
		x: node.x - side * node.ty * distance,
		y: node.y + side * node.tx * distance,
		tx: node.tx,
		ty: node.ty
	}));
	const points = [[offsets[0].x, offsets[0].y]];
	for (let i = 1; i < offsets.length; i += 1) {
		const from = offsets[i - 1];
		const to = offsets[i];
		let trimmed = false;
		if (nodes[i].corner) {
			const turn = signedTurn(from, to);
			if (Math.abs(turn) > 1e-9) {
				if (side * turn < 0) points.push(...getJoinPoints(nodes[i].x, nodes[i].y, from, to, distance, join, miterLimit));
				else {
					const intersection = intersectLines(from.x, from.y, from.tx, from.ty, to.x, to.y, to.tx, to.ty);
					if (intersection) {
						points[points.length - 1] = intersection;
						if (closed && i === offsets.length - 1) points[0] = intersection;
						trimmed = true;
					}
				}
			}
		}
		if (!trimmed) {
			const point = [to.x, to.y];
			if (!samePoint(points[points.length - 1], point)) points.push(point);
		}
	}
	return points;
};
/**
* Returns whether two points are the same point.
*
* @param a - the first point
* @param b - the second point
* @returns whether the points are the same
*/
const samePoint = (a, b) => Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
/**
* Returns a coordinate of the result, rounded and without a negative zero.
*
* @param value - the coordinate
* @param precision - the number of the decimals of the result
* @returns the rounded coordinate
*/
const roundCoordinate = (value, precision) => cleanZero(roundTo(value, precision));
/**
* Returns the segments of an offset polyline.
*
* @param points - the points of the polyline
* @param closed - whether the polyline is closed
* @param precision - the number of the decimals of the result
* @returns the segments of the polyline
*/
const toSegments = (points, closed, precision) => {
	const last = points[points.length - 1];
	const list = closed && points.length > 1 && samePoint(points[0], last) ? points.slice(0, -1) : points;
	const segments = [];
	if (!list.length) return segments;
	segments.push([
		"M",
		roundCoordinate(list[0][0], precision),
		roundCoordinate(list[0][1], precision)
	]);
	for (let i = 1; i < list.length; i += 1) segments.push([
		"L",
		roundCoordinate(list[i][0], precision),
		roundCoordinate(list[i][1], precision)
	]);
	if (closed) segments.push(["Z"]);
	return segments;
};
/**
* Offsets a path along its normals.
*
* The path is sampled along its length, every sample is shifted along the
* normal of the path and the result is a path of straight lines. The
* corners of the path are joined with the `join` option, and the ends of an
* open path are capped with the `cap` option.
*
* The `side` option is literal: the left side is the left normal of the
* direction of travel, the same normal `getPropertiesAtLength()` returns.
* The `both` side is the outline of the stroke, the band between the two
* sides of the path.
*
* The offset is not cleaned up: an offset distance larger than the local
* radius of curvature of the path produces a self-crossing curve.
*
* @param pathInput - the path string or `PathArray`
* @param distance - the offset distance
* @param options - the options of the offset
* @returns the offset path
*
* @example
* ```ts
* offsetPath('M0 0L100 0', 10)
* // => [['M', 0, 10], ['L', 100, 10]]
* ```
*/
const offsetPath = (pathInput, distance, options) => {
	if (typeof distance !== "number" || !Number.isFinite(distance)) throw TypeError(`${error}: distance must be a number`);
	if (distance < 0) throw TypeError(`${error}: distance must be a positive number`);
	const resolved = resolveOptions(options ?? {});
	if (distance === 0) return parsePathString(pathInput);
	const measures = measureSegments(pathInput);
	const groups = groupSubPaths(measures);
	const result = [];
	for (const group of groups) {
		const nodes = getOffsetNodes(group, resolved.steps);
		const last = group[group.length - 1];
		const closed = Boolean(last && last.geometry[0] === "Z");
		if (!nodes.length) {
			const first = group[0];
			result.push([
				"M",
				first.endX,
				first.endY
			]);
			continue;
		}
		if (resolved.side === "both") {
			const left = buildSidePolyline(nodes, 1, distance, resolved, closed);
			const right = buildSidePolyline(nodes, -1, distance, resolved, closed);
			if (closed) {
				const leftArea = Math.abs(polygonArea(left));
				const rightArea = Math.abs(polygonArea(right));
				const outer = leftArea >= rightArea ? left : right;
				const inner = leftArea >= rightArea ? right : left;
				result.push(...toSegments(outer, true, resolved.precision));
				result.push(...toSegments([...inner].reverse(), true, resolved.precision));
				continue;
			}
			const start = nodes[0];
			const end = nodes[nodes.length - 1];
			const endCap = getCapPoints(end.x, end.y, left[left.length - 1], right[right.length - 1], distance, resolved.cap, end.tx, end.ty);
			const startCap = getCapPoints(start.x, start.y, right[0], left[0], distance, resolved.cap, -start.tx, -start.ty);
			const ring = [
				...left,
				...endCap,
				...[...right].reverse(),
				...startCap
			];
			result.push(...toSegments(ring, true, resolved.precision));
			continue;
		}
		const side = resolved.side === "left" ? 1 : -1;
		const polyline = buildSidePolyline(nodes, side, distance, resolved, closed);
		result.push(...toSegments(polyline, closed, resolved.precision));
	}
	return result;
};
// src/process/shortenSegment.ts
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
	const { x2, y2, x, y } = params;
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
		if ("CS".includes(prevCommand) && x2 != null && y2 != null && roundTo(nx1, round) === roundTo(x * 2 - x2, round) && roundTo(ny1, round) === roundTo(y * 2 - y2, round)) return [
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
		if ("QT".includes(prevCommand) && x2 != null && y2 != null && roundTo(qx, round) === roundTo(x * 2 - x2, round) && roundTo(qy, round) === roundTo(y * 2 - y2, round)) return [
			"T",
			normalValues[2],
			normalValues[3]
		];
	}
	return result;
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
	const values = segment.slice(1).map((n) => roundTo(n, roundOption));
	return [segment[0]].concat(values);
};
// src/process/optimizePath.ts
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
* // => [['M', 10, 10], ['v', 0], ['l', 80, 80]]
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
		let result = seg;
		pathCommand = seg[0];
		allPathCommands[i] = pathCommand;
		if (i) prevCommand = allPathCommands[i - 1];
		const normalizedSegment = normalizeSegment(seg, optimParams, i ? prevCommand : null);
		if (i) {
			const shortSegment = shortenSegment(seg, normalizedSegment, optimParams, prevCommand);
			const absSegment = roundSegment(shortSegment, round);
			const absString = absSegment.join("");
			const relativeSegment = relativizeSegment(shortSegment, i, lastX, lastY);
			const relSegment = roundSegment(relativeSegment, round);
			const relString = relSegment.join("");
			result = absString.length < relString.length ? absSegment : relSegment;
		}
		const seglen = normalizedSegment.length;
		optimParams.x1 = +normalizedSegment[seglen - 2];
		optimParams.y1 = +normalizedSegment[seglen - 1];
		if (normalizedSegment[0] === "C" || normalizedSegment[0] === "Q") {
			optimParams.x2 = +normalizedSegment[seglen - 4];
			optimParams.y2 = +normalizedSegment[seglen - 3];
		} else {
			optimParams.x2 = null;
			optimParams.y2 = null;
		}
		return result;
	});
};
// src/process/joinPath.ts
/**
* Joins two paths into a single path with two sub-paths.
*
* Both paths have to be valid paths, so they begin with a moveto command,
* and the result holds absolute values.
*
* @param pathA - the first path string or `PathArray`
* @param pathB - the second path string or `PathArray`
* @returns the joined path
*
* @example
* ```ts
* joinPath('M0 0L100 0', 'M0 100L100 100')
* // => [
* //   ['M', 0, 0], ['L', 100, 0],
* //   ['M', 0, 100], ['L', 100, 100]
* // ]
* ```
*/
const joinPath = (pathA, pathB) => {
	const first = pathToAbsolute(parsePathString(pathA));
	const second = pathToAbsolute(parsePathString(pathB));
	return [...first, ...second];
};
// src/process/reversePath.ts
/**
* Reverses the segments of a single sub-path and returns a new PathArray
* with absolute values.
*
* @param absolutePath - The absolute PathArray of a single sub-path
* @returns The reversed PathArray
*/
const reverseSubPath$1 = (absolutePath) => {
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
	const reversed = subPaths.map((path) => reverseSubPath$1(path));
	return reversed.length === 1 ? reversed[0] : reversed.flat();
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
// src/process/reverseSubPath.ts
/**
* Reverses the sub-path at a given index of a path.
*
* The other sub-paths are left untouched, and the result holds absolute
* values.
*
* @param pathInput - the path string or `PathArray`
* @param index - the zero-based index of the sub-path to reverse
* @returns the path with the sub-path reversed
*
* @example
* ```ts
* reverseSubPath('M0 0L100 0ZM0 100L100 100', 1)
* // => [
* //   ['M', 0, 0], ['L', 100, 0], ['Z'],
* //   ['M', 100, 100], ['L', 0, 100]
* // ]
* ```
*/
const reverseSubPath = (pathInput, index) => {
	const subPaths = splitPath(pathInput);
	if (!Number.isInteger(index) || index < 0 || index >= subPaths.length) throw TypeError(`${error}: index must be a number within the range of the sub-paths`);
	const reversed = reversePath(subPaths[index]);
	return [
		...subPaths.slice(0, index),
		reversed,
		...subPaths.slice(index + 1)
	].flat();
};
// src/process/getSVGMatrix.ts
/**
* Returns a transformation matrix to apply to `<path>` elements.
*
* @see TransformObject
*
* @param transform the `transformObject`
* @returns a new transformation matrix
*/
const getSVGMatrix = (transform) => {
	let matrix = new CSSMatrix();
	const [originX, originY] = transform.origin ?? defaultOptions.origin;
	const { translate, rotate, skew, scale } = transform;
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
// src/process/projection2d.ts
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
	if (cssm.is2D) return [
		cssm.a * v[0] + cssm.c * v[1] + cssm.e * v[3],
		cssm.b * v[0] + cssm.d * v[1] + cssm.f * v[3],
		0,
		1
	];
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
	const numerator = Math.abs(originZ);
	const denominator = Math.abs(relativePositionZ);
	const factor = numerator === 0 || denominator === 0 ? 1 : numerator / denominator;
	return [relativePositionX * factor + originX, relativePositionY * factor + originY];
};
// src/process/transformPath.ts
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
const transform2D = (path, a, b, c, d, e, f, originX, originY) => {
	const result = [];
	let x = 0;
	let y = 0;
	let lx = 0;
	let ly = 0;
	let ox = 0;
	let oy = 0;
	let omx = 0;
	let omy = 0;
	for (let i = 0, len = path.length; i < len; i += 1) {
		const seg = path[i];
		const pathCommand = seg[0];
		const commandCode = pathCommand.charCodeAt(0);
		const isRelative = commandCode >= 97;
		const absCommand = isRelative ? String.fromCharCode(commandCode - 32) : pathCommand;
		const outCommand = absCommand;
		if (absCommand === "Z") {
			result.push(["Z"]);
			ox = omx;
			oy = omy;
			continue;
		}
		if (absCommand === "V") {
			const absY = seg[1] + (isRelative ? oy : 0);
			lx = a * ox + c * absY + e - originX + originX;
			ly = b * ox + d * absY + f - originY + originY;
			if (x !== lx && y !== ly) result.push([
				"L",
				lx,
				ly
			]);
			else if (y === ly) result.push(["H", lx]);
			else if (x === lx) result.push(["V", ly]);
			else result.push([
				"L",
				ox,
				absY
			]);
			oy = absY;
			x = lx;
			y = ly;
			continue;
		}
		if (absCommand === "H") {
			const absX = seg[1] + (isRelative ? ox : 0);
			lx = a * absX + c * oy + e - originX + originX;
			ly = b * absX + d * oy + f - originY + originY;
			if (x !== lx && y !== ly) result.push([
				"L",
				lx,
				ly
			]);
			else if (y === ly) result.push(["H", lx]);
			else if (x === lx) result.push(["V", ly]);
			else result.push([
				"L",
				absX,
				oy
			]);
			ox = absX;
			x = lx;
			y = ly;
			continue;
		}
		if (absCommand === "A") {
			const absX = seg[6] + (isRelative ? ox : 0);
			const absY = seg[7] + (isRelative ? oy : 0);
			const cubics = arcToCubic(ox, oy, seg[1], seg[2], seg[3], seg[4], seg[5], absX, absY);
			const cubicsLen = cubics.length;
			let k = 0;
			if (cubicsLen > 0) do {
				const piece = ["C"];
				const end = k + 6;
				for (let j = k; j < end; j += 2) {
					lx = a * cubics[j] + c * cubics[j + 1] + e - originX + originX;
					ly = b * cubics[j] + d * cubics[j + 1] + f - originY + originY;
					piece.push(lx, ly);
				}
				result.push(piece);
				k = end;
			} while (k < cubicsLen);
			else result.push(["C"]);
			if (cubicsLen > 0) {
				ox = cubics[cubicsLen - 2];
				oy = cubics[cubicsLen - 1];
			} else {
				ox = absX;
				oy = absY;
			}
			x = lx;
			y = ly;
			continue;
		}
		if (absCommand === "L") {
			const absX = seg[1] + (isRelative ? ox : 0);
			const absY = seg[2] + (isRelative ? oy : 0);
			lx = a * absX + c * absY + e - originX + originX;
			ly = b * absX + d * absY + f - originY + originY;
			if (x !== lx && y !== ly) result.push([
				"L",
				lx,
				ly
			]);
			else if (y === ly) result.push(["H", lx]);
			else if (x === lx) result.push(["V", ly]);
			else result.push([
				"L",
				absX,
				absY
			]);
			ox = absX;
			oy = absY;
			x = lx;
			y = ly;
			continue;
		}
		{
			const piece = [outCommand];
			const segLen = seg.length;
			for (let j = 1; j < segLen; j += 2) {
				const absX = seg[j] + (isRelative ? ox : 0);
				const absY = seg[j + 1] + (isRelative ? oy : 0);
				lx = a * absX + c * absY + e - originX + originX;
				ly = b * absX + d * absY + f - originY + originY;
				piece.push(lx, ly);
			}
			result.push(piece);
			ox = seg[segLen - 2] + (isRelative ? ox : 0);
			oy = seg[segLen - 1] + (isRelative ? oy : 0);
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
* // => [['M', 10, 20], ['H', 210], ['V', 220], ['H', 10], ['Z']]
* ```
*/
const transformPath = (pathInput, transform) => {
	const path = parsePathString(pathInput);
	const transformProps = transform && Object.keys(transform);
	if (!transform || transformProps && !transformProps.length) return path.slice(0);
	const origin = (transform.origin ?? defaultOptions.origin).slice(0);
	const matrixInstance = getSVGMatrix({
		...transform,
		origin
	});
	if (matrixInstance.isIdentity) return path.slice(0);
	if (matrixInstance.is2D) return transform2D(path, matrixInstance.a, matrixInstance.b, matrixInstance.c, matrixInstance.d, matrixInstance.e, matrixInstance.f, origin[0], origin[1]);
	let x = 0;
	let y = 0;
	let lx = 0;
	let ly = 0;
	let j = 0;
	let jj = 0;
	return iterate(path, (seg, index, lastX, lastY) => {
		const [pathCommand] = seg;
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
		if (result[0] === "C" && result.length > 7) {
			const tempSegment = result.slice(0, 7);
			path.splice(index + 1, 0, ["C"].concat(result.slice(7)));
			result = tempSegment;
		}
		if (result[0] === "L") {
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
// src/process/reverseCurve.ts
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
// src/process/samplePath.ts
/**
* Returns the number of samples of a segment.
*
* The samples are spread over the parameter of the segment, so their number
* grows with the length of the segment: a straight segment needs none, a
* curve needs one every step.
*
* @param length - the length of the segment
* @param step - the maximum distance between two samples
* @returns the number of samples of the segment
*/
const sampleCount = (length, step) => Math.max(2, Math.ceil(length / step));
/**
* Returns the points of a normalized path, sampled along its segments.
*
* The samples are the points the simplification measures: they sit on the
* path itself, so the distance between the path and the result is measured
* against the path and not against an approximation of it.
*
* A straight segment needs no sample of its own, the chord of a straight
* segment is the segment: the same goes for the close segment, the
* deviation of a chord from a straight line is at its ends and the ends are
* the samples of the segments around it.
*
* @param path - the normalized path to sample
* @param step - the maximum distance between two samples
* @returns the samples of the path, in path order
*/
const samplePath = (path, step) => {
	const { measures } = buildPathLengthTable(path);
	const samples = [];
	for (const measure of measures) {
		const { segment, startX, startY, endX, endY, length } = measure;
		const command = segment[0];
		if (command === "Z") {
			samples.push({
				x: endX,
				y: endY
			});
			continue;
		}
		if (command === "M" || command === "L") samples.push({
			x: endX,
			y: endY
		});
		else if (command === "C") {
			const count = sampleCount(length, step);
			const coords = [
				startX,
				startY,
				segment[1],
				segment[2],
				segment[3],
				segment[4],
				endX,
				endY
			];
			for (let i = 1; i < count; i += 1) samples.push(getPointAtCubicSegmentLength(coords, i / count));
			samples.push({
				x: endX,
				y: endY
			});
		} else if (command === "Q") {
			const count = sampleCount(length, step);
			const coords = [
				startX,
				startY,
				segment[1],
				segment[2],
				endX,
				endY
			];
			for (let i = 1; i < count; i += 1) samples.push(getPointAtQuadSegmentLength(coords, i / count));
			samples.push({
				x: endX,
				y: endY
			});
		} else {
			const rx = segment[1];
			const ry = segment[2];
			const angle = segment[3];
			if (rx === 0 || ry === 0) {
				samples.push({
					x: endX,
					y: endY
				});
				continue;
			}
			const { center, rx: radiusX, ry: radiusY, startAngle, endAngle } = getArcProps(startX, startY, rx, ry, angle, segment[4], segment[5], endX, endY);
			const count = sampleCount(length, step);
			const alpha = (angle % 360 + 360) % 360 * (Math.PI / 180);
			const sweep = endAngle - startAngle;
			for (let i = 1; i < count; i += 1) {
				const [x, y] = arcPoint(center.x, center.y, radiusX, radiusY, alpha, startAngle + sweep * i / count);
				samples.push({
					x,
					y
				});
			}
			samples.push({
				x: endX,
				y: endY
			});
		}
	}
	return samples;
};
// src/process/douglasPeucker.ts
/**
* Returns the indexes of the points that have to be kept to approximate a
* polyline within a given tolerance, with the Douglas-Peucker algorithm.
*
* The first and the last point of the polyline are always kept, the points
* in between are kept when they are further from the chord between the two
* points around them than the tolerance.
*
* @see https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
*
* @param points - the points of the polyline
* @param tolerance - the maximum distance from the simplified polyline
* @returns the indexes of the points to keep, in order
*/
const douglasPeucker = (points, tolerance) => {
	if (points.length < 3) return points.map((_point, index) => index);
	const keep = points.map(() => false);
	keep[0] = true;
	keep[points.length - 1] = true;
	const stack = [0, points.length - 1];
	while (stack.length) {
		const last = stack.pop();
		const first = stack.pop();
		const start = points[first];
		const end = points[last];
		let maxDistance = 0;
		let index = -1;
		for (let i = first + 1; i < last; i += 1) {
			const distance = distanceToSegment(points[i], start, end);
			if (distance > maxDistance) {
				maxDistance = distance;
				index = i;
			}
		}
		if (index === -1 || maxDistance <= tolerance) continue;
		keep[index] = true;
		const span = last - first;
		const edge = span >> 3;
		if (span > 8 && (index - first < edge || last - index < edge)) {
			const middle = first + (span >> 1);
			keep[middle] = true;
			if (index < middle) stack.push(middle, last, index, middle, first, index);
			else stack.push(index, last, middle, index, first, middle);
		} else stack.push(index, last, first, index);
	}
	return points.map((_point, index) => index).filter((index) => keep[index]);
};
// src/process/simplifyPath.ts
/**
* The default tolerance of the simplification.
*/
const defaultTolerance = 1;
/**
* The maximum number of samples of a path.
*
* The samples are the measurements of the algorithm, so their number grows
* with the length of the path and shrinks with the tolerance: a very long
* path with a very small tolerance would need millions of samples, so the
* sampling is capped and the step grows to fit.
*/
const MAX_SAMPLES = 2e4;
/**
* The share of the tolerance the samples are spread with.
*
* The curve is sampled with a step of a sixteenth of the tolerance, so the
* deviation of the curve between two samples is a fraction of the tolerance
* itself: a range is only accepted when the curve stays within four fifths
* of the tolerance from the chord, so the result cannot exceed it.
*/
const SAMPLE_SHARE = 16;
/**
* The share of the tolerance a range of the path may use.
*
* The samples are a discretization of the path, so the deviation between two
* samples is not measured: the range is accepted at four fifths of the
* tolerance, so the result stays within the tolerance even when the curve
* bulges a little between two samples.
*/
const ACCEPTANCE = .8;
/**
* Splits a normalized path into its sub-paths.
*
* @param path - the normalized path to split
* @returns the sub-paths of the path
*/
const splitSubPaths = (path) => {
	const result = [];
	let current = [];
	for (const segment of path) if (segment[0] === "M") {
		if (current.length) result.push(current);
		current = [segment];
	} else current.push(segment);
	result.push(current);
	return result;
};
/**
* Simplifies a path, with the Douglas-Peucker algorithm.
*
* The path is sampled along its length and the points that are needed to
* keep its shape within the tolerance are kept: the result is a path of
* straight lines, one sub-path for every sub-path of the source.
*
* The tolerance is the maximum distance between the result and the source:
* every point of the source stays within the tolerance of the result. A
* smaller tolerance keeps more points, a bigger one removes more.
*
* @param pathInput - the target path string or PathArray
* @param options - the tolerance of the simplification, or the options
* @returns the simplified path
*
* @example
* ```ts
* simplifyPath("M0 0L10 0L20 0L30 0", 1)
* // => [['M', 0, 0], ['L', 30, 0]]
* ```
*/
const simplifyPath = (pathInput, options) => {
	const tolerance = typeof options === "number" ? options : options?.tolerance ?? defaultTolerance;
	if (!Number.isFinite(tolerance) || tolerance <= 0) throw new TypeError(`${error}: tolerance must be a positive number`);
	const normalized = normalizePath(pathInput);
	if (!normalized.length) return [];
	const result = [];
	for (const subPath of splitSubPaths(normalized)) {
		const { totalLength } = buildPathLengthTable(subPath);
		const step = Math.max(tolerance / SAMPLE_SHARE, totalLength / MAX_SAMPLES);
		const samples = samplePath(subPath, step);
		const kept = douglasPeucker(samples, tolerance * ACCEPTANCE);
		const start = samples[0];
		result.push([
			"M",
			start.x,
			start.y
		]);
		const closed = subPath[subPath.length - 1][0] === "Z";
		const end = closed ? kept.length - 1 : kept.length;
		for (let i = 1; i < end; i += 1) {
			const point = samples[kept[i]];
			result.push([
				"L",
				point.x,
				point.y
			]);
		}
		if (closed) result.push(["Z"]);
	}
	return result;
};
export { PathParser, absolutizeSegment, arcToCubic, arcTools, bezierTools, cubicTools, DISTANCE_EPSILON as distanceEpsilon, distanceSquareRoot, finalizeSegment, getClosestPoint, getDrawDirection, getPathArea, getPathBBox, getPointAtLength, getPropertiesAtLength, getPropertiesAtPoint, getSVGMatrix, getSegmentAtLength, getSegmentOfPoint, getTotalLength, invalidPathValue, isAbsoluteArray, isArcCommand, isClosedPath, isCurveArray, isDigit, isDigitStart, isMoveCommand, isMultiPath, isNormalizedArray, isPathArray, isPathCommand, isPointInPath, isPointInStroke, isPolygonArray, isPolylineArray, isRelativeArray, isSpace, isValidPath, iterate, joinPath, lineToCubic, lineTools, midPoint, normalizePath, normalizeSegment, offsetPath, optimizePath, paramsCounts, paramsParser, parsePathString, pathToAbsolute, pathToCurve, pathToRelative, pathToString, polygonTools, projection2d, quadToCubic, quadTools, relativizeSegment, reverseCurve, reversePath, reverseSubPath, rotateVector, roundPath, roundSegment, roundTo, scanFlag, scanParam, scanSegment, segmentToCubic, shapeParams, shapeToPath, shapeToPathArray, shortenSegment, simplifyPath, skipSpaces, splitPath, transformPath };

//# sourceMappingURL=util.js.map