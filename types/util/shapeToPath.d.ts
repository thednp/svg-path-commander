export function getLinePath(attr: svgpcNS.lineAttr): import("../../types").pathArray;
export function getPolyPath(attr: svgpcNS.polyAttr): import("../../types").pathArray;
export function getCirclePath(attr: svgpcNS.circleAttr): import("../../types").pathArray;
export function getEllipsePath(attr: svgpcNS.ellipseAttr): import("../../types").pathArray;
export function getRectanglePath(attr: svgpcNS.rectAttr): import("../../types").pathArray;
export default function shapeToPath(element: svgpcNS.shapeTypes, replace: boolean): SVGPathElement | null;
