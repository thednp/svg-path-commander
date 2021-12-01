export function getLinePath(attr: SVGPathCommander.lineAttr): import("../../types").pathArray;
export function getPolyPath(attr: SVGPathCommander.polyAttr): import("../../types").pathArray;
export function getCirclePath(attr: SVGPathCommander.circleAttr): import("../../types").pathArray;
export function getEllipsePath(attr: SVGPathCommander.ellipseAttr): import("../../types").pathArray;
export function getRectanglePath(attr: SVGPathCommander.rectAttr): import("../../types").pathArray;
export default function shapeToPath(element: SVGPathCommander.shapeTypes | SVGPathCommander.shapeOps, replace: boolean): SVGPathElement | boolean;
