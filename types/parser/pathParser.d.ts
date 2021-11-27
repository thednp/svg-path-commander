export default function PathParser(pathString: string): void;
export default class PathParser {
    constructor(pathString: string);
    segments: import("../../types").pathArray;
    pathValue: string;
    max: number;
    index: number;
    param: number;
    segmentStart: number;
    data: any;
    err: string;
}
