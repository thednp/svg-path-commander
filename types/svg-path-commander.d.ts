export default SVGPathCommander;
declare class SVGPathCommander {
    constructor(pathValue: string, config: SVGPathCommander.options);
    round: any;
    segments: SVGPathCommander.pathArray;
    pathValue: string;
    public toAbsolute(): SVGPathCommander;
    public toRelative(): SVGPathCommander;
    public reverse(onlySubpath: boolean | number): SVGPathCommander;
    public normalize(): SVGPathCommander;
    public optimize(): SVGPathCommander;
    public transform(source: {
        [x: string]: (number | number[]);
    }): SVGPathCommander;
    public flipX(): SVGPathCommander;
    public flipY(): SVGPathCommander;
    public toString(): string;
}
