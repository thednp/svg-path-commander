export default function getPathBBox(pathArray: any): {
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
