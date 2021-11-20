/**
 * Creates a new SVGPathCommander instance.
 * @class
 */
export default class SVGPathCommander {
    /**
     * @constructor
     * @param {String} pathValue the path string
     * @param {Object} config instance options
     */
    constructor(pathValue: string, config: Object);
    /**
     * @type {Boolean | Number}
     */
    round: boolean | number;
    /**
     * @type {Object | null}
     */
    origin: Object | null;
    /**
     * @type {Object}
     */
    segments: Object;
    /**
     * @type {String}
     */
    pathValue: string;
    /**
     * Convert path to absolute values
     * @public
     */
    public toAbsolute(): SVGPathCommander;
    /**
     * Convert path to relative values
     * @public
     */
    public toRelative(): SVGPathCommander;
    /**
     * Reverse path
     * @param {Boolean | Number} onlySubpath option to reverse all pathArray(s) except first
     * @public
     */
    public reverse(onlySubpath: boolean | number): SVGPathCommander;
    /**
     * Normalize path in 2 steps:
     * * convert pathArray(s) to absolute values
     * * convert shorthand notation to standard notation
     * @public
     */
    public normalize(): SVGPathCommander;
    /**
     * Optimize pathArray values:
     * * convert segments to absolute and/or relative values
     * * select segments with shortest resulted string
     * * round values to the specified `decimals` option value
     * @public
     */
    public optimize(): SVGPathCommander;
    /**
     * Transform path using values from an `Object`
     * with the following structure:
     *
     * {
     *   origin:    {x, y, z},
     *   translate: {x, y, z},
     *   rotate:    {x, y, z},
     *   skew:      {x, y, z},
     *   scale:     {x, y, z}
     * }
     * @param {Object} source a transform `Object`as described above
     * @public
     */
    public transform(source: Object): SVGPathCommander;
    /**
     * Rotate path 180deg horizontally
     * @public
     */
    public flipX(): SVGPathCommander;
    /**
     * Rotate path 180deg vertically
     * @public
     */
    public flipY(): SVGPathCommander;
    /**
     * Export the current path to be used
     * for the `d` (description) attribute.
     * @public
     * @return {String} the path string
     */
    public toString(): string;
}
