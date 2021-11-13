declare module "options/options" {
    export default SVGPCO;
    namespace SVGPCO {
        const origin: null;
        const decimals: number;
        const round: number;
    }
}
declare module "util/DOMMatrix" {
    export default CSS3Matrix;
    const CSS3Matrix: any;
}
declare module "process/clonePath" {
    export default function clonePath(pathArray: any): any;
}
declare module "process/roundPath" {
    export default function roundPath(pathArray: any, round: any): any;
}
declare module "util/fixArc" {
    export default function fixArc(pathArray: any, allPathCommands: any, i: any): void;
}
declare module "util/paramsCount" {
    namespace _default {
        const a: number;
        const c: number;
        const h: number;
        const l: number;
        const m: number;
        const r: number;
        const q: number;
        const s: number;
        const t: number;
        const v: number;
        const z: number;
    }
    export default _default;
}
declare module "util/isPathArray" {
    export default function isPathArray(pathArray: any): boolean;
}
declare module "util/isCurveArray" {
    export default function isCurveArray(pathArray: any): any;
}
declare module "process/finalizeSegment" {
    export default function finalizeSegment(state: any): void;
}
declare module "util/invalidPathValue" {
    var _default: "Invalid path value";
    export default _default;
}
declare module "process/scanFlag" {
    export default function scanFlag(state: any): void;
}
declare module "util/isDigit" {
    export default function isDigit(code: any): boolean;
}
declare module "process/scanParam" {
    export default function scanParam(state: any): void;
}
declare module "util/isSpace" {
    export default function isSpace(ch: any): boolean;
}
declare module "process/skipSpaces" {
    export default function skipSpaces(state: any): void;
}
declare module "util/isPathCommand" {
    export default function isPathCommand(code: any): boolean;
}
declare module "util/isDigitStart" {
    export default function isDigitStart(code: any): boolean;
}
declare module "util/isArcCommand" {
    export default function isArcCommand(code: any): boolean;
}
declare module "process/scanSegment" {
    export default function scanSegment(state: any): void;
}
declare module "util/svgPathArray" {
    export default function SVGPathArray(pathString: any): void;
    export default class SVGPathArray {
        constructor(pathString: any);
        segments: any[];
        pathValue: any;
        max: any;
        index: number;
        param: number;
        segmentStart: number;
        data: any[];
        err: string;
    }
}
declare module "process/parsePathString" {
    export default function parsePathString(pathString: any, round: any): any;
}
declare module "util/isAbsoluteArray" {
    export default function isAbsoluteArray(pathInput: any): any;
}
declare module "convert/pathToAbsolute" {
    export default function pathToAbsolute(pathInput: any, round: any): any;
}
declare module "process/shorthandToQuad" {
    export default function shorthandToQuad(x1: any, y1: any, qx: any, qy: any, prevCommand: any): {
        qx: any;
        qy: any;
    };
}
declare module "process/shorthandToCubic" {
    export default function shorthandToCubic(x1: any, y1: any, x2: any, y2: any, prevCommand: any): {
        x1: any;
        y1: any;
    };
}
declare module "process/normalizeSegment" {
    export default function normalizeSegment(segment: any, params: any, prevCommand: any): any;
}
declare module "util/isNormalizedArray" {
    export default function isNormalizedArray(pathArray: any): boolean;
}
declare module "process/normalizePath" {
    export default function normalizePath(pathInput: any, round: any): any;
}
declare module "util/rotateVector" {
    export default function rotateVector(x: any, y: any, rad: any): {
        x: number;
        y: number;
    };
}
declare module "process/arcToCubic" {
    export default function arcToCubic(x1: any, y1: any, rx: any, ry: any, angle: any, LAF: any, SF: any, x2: any, y2: any, recursive: any): any;
}
declare module "process/quadToCubic" {
    export default function quadToCubic(x1: any, y1: any, qx: any, qy: any, x2: any, y2: any): any[];
}
declare module "util/getPointAtSegLength" {
    export default function getPointAtSegLength(p1x: any, p1y: any, c1x: any, c1y: any, c2x: any, c2y: any, p2x: any, p2y: any, t: any): {
        x: number;
        y: number;
    };
}
declare module "math/midPoint" {
    export default function midPoint(a: any, b: any, t: any): any[];
}
declare module "process/lineToCubic" {
    export default function lineToCubic(x1: any, y1: any, x2: any, y2: any): any[];
}
declare module "process/segmentToCubic" {
    export default function segmentToCubic(segment: any, params: any): any;
}
declare module "convert/pathToCurve" {
    export default function pathToCurve(pathInput: any, round: any): any;
}
declare module "util/getPathArea" {
    export default function getPathArea(pathArray: any, round: any): any;
}
declare module "util/getSegCubicLength" {
    export default function getSegCubicLength(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any, x4: any, y4: any, z: any): number;
}
declare module "util/getPathLength" {
    export default function getPathLength(pathArray: any, round: any): number;
}
declare module "util/getDrawDirection" {
    export default function getDrawDirection(pathArray: any, round: any): boolean;
}
declare module "util/getPointAtLength" {
    export default function getPointAtLength(pathArray: any, length: any): any;
}
declare module "util/getCubicSize" {
    export default function getCubicSize(p1x: any, p1y: any, c1x: any, c1y: any, c2x: any, c2y: any, p2x: any, p2y: any): {
        min: {
            x: number;
            y: number;
        };
        max: {
            x: number;
            y: number;
        };
    };
}
declare module "util/getPathBBox" {
    export default function getPathBBox(pathArray: any, round: any): {
        x: number;
        y: number;
        width: number;
        height: number;
        x2: number;
        y2: number;
        cx?: undefined;
        cy?: undefined;
    } | {
        x: number;
        y: number;
        x2: number;
        y2: number;
        width: number;
        height: number;
        cx: number;
        cy: number;
    };
}
declare module "util/isRelativeArray" {
    export default function isRelativeArray(pathInput: any): any;
}
declare module "convert/pathToString" {
    export default function pathToString(pathArray: any): any;
}
declare module "process/splitPath" {
    export default function splitPath(pathInput: any): any;
}
declare module "convert/pathToRelative" {
    export default function pathToRelative(pathInput: any, round: any): any;
}
declare module "process/optimizePath" {
    export default function optimizePath(pathArray: any, round: any): any;
}
declare module "process/reverseCurve" {
    export default function reverseCurve(pathArray: any): string[][];
}
declare module "process/reversePath" {
    export default function reversePath(pathString: any, round: any): any;
}
declare module "math/epsilon" {
    var _default: 1e-9;
    export default _default;
}
declare module "util/getSVGMatrix" {
    export default function getSVGMatrix(transformObject: any): any;
}
declare module "util/transformEllipse" {
    export default function transformEllipse(m: any, rx: any, ry: any, ax: any): {
        rx: number;
        ry: number;
        ax: number;
    };
}
declare module "util/projection2d" {
    export default function projection2d(m: any, point2D: any, origin: any): any[];
}
declare module "process/transformPath" {
    export default function transformPath(pathArray: any, transformObject: any, round: any): any;
}
declare module "util/util" {
    namespace _default {
        export { CSS3Matrix as CSSMatrix };
        export { parsePathString };
        export { isPathArray };
        export { isCurveArray };
        export { isAbsoluteArray };
        export { isRelativeArray };
        export { isNormalizedArray };
        export { pathToAbsolute };
        export { pathToRelative };
        export { pathToCurve };
        export { pathToString };
        export { getDrawDirection };
        export { getPathArea };
        export { getPathBBox };
        export { getPathLength };
        export { getPointAtLength };
        export { clonePath };
        export { splitPath };
        export { roundPath };
        export { optimizePath };
        export { reverseCurve };
        export { reversePath };
        export { normalizePath };
        export { transformPath };
        export { getSVGMatrix };
        export { SVGPCO as options };
    }
    export default _default;
    import CSS3Matrix from "util/DOMMatrix";
    import parsePathString from "process/parsePathString";
    import isPathArray from "util/isPathArray";
    import isCurveArray from "util/isCurveArray";
    import isAbsoluteArray from "util/isAbsoluteArray";
    import isRelativeArray from "util/isRelativeArray";
    import isNormalizedArray from "util/isNormalizedArray";
    import pathToAbsolute from "convert/pathToAbsolute";
    import pathToRelative from "convert/pathToRelative";
    import pathToCurve from "convert/pathToCurve";
    import pathToString from "convert/pathToString";
    import getDrawDirection from "util/getDrawDirection";
    import getPathArea from "util/getPathArea";
    import getPathBBox from "util/getPathBBox";
    import getPathLength from "util/getPathLength";
    import getPointAtLength from "util/getPointAtLength";
    import clonePath from "process/clonePath";
    import splitPath from "process/splitPath";
    import roundPath from "process/roundPath";
    import optimizePath from "process/optimizePath";
    import reverseCurve from "process/reverseCurve";
    import reversePath from "process/reversePath";
    import normalizePath from "process/normalizePath";
    import transformPath from "process/transformPath";
    import getSVGMatrix from "util/getSVGMatrix";
    import SVGPCO from "options/options";
}
declare module "class/SVGPathCommander" {
    export default class SVGPathCommander {
        constructor(pathValue: any, ops: any);
        round: any;
        origin: any;
        segments: any;
        pathValue: any;
    }
}
declare module "index" {
    export default SVGPathCommander;
    import SVGPathCommander from "class/SVGPathCommander";
}
