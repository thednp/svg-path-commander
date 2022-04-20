function cov_1ekoakbacs() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\createPath.js";
  var hash = "5f5c1c6052159b422d83ef7b116f0a70699928dc";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\createPath.js",
    statementMap: {
      "0": {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 16,
          column: 38
        }
      }
    },
    fnMap: {
      "0": {
        name: "createPath",
        decl: {
          start: {
            line: 15,
            column: 24
          },
          end: {
            line: 15,
            column: 34
          }
        },
        loc: {
          start: {
            line: 15,
            column: 46
          },
          end: {
            line: 17,
            column: 1
          }
        },
        line: 15
      }
    },
    branchMap: {},
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "5f5c1c6052159b422d83ef7b116f0a70699928dc"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1ekoakbacs = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1ekoakbacs();
import shapeToPath from './shapeToPath';
/**
 * Returns a new `<path>` from a `<glyph>` element, only using its `d` attribute,
 * all other attributes are ignored.
 *
 * If `pathInput` is a valid path string, will create a `<path>` and return it.
 *
 * @deprecated
 * @see shapeToPath a new and more flexible utility
 *
 * @param {SVGPathCommander.shapeTypes} pathInput a `<glyph>` element or path string
 * @returns {SVGPathElement | boolean} a new `<path>` element
 */

export default function createPath(pathInput) {
  cov_1ekoakbacs().f[0]++;
  cov_1ekoakbacs().s[0]++;
  return shapeToPath(pathInput, true);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZVBhdGguanMiXSwibmFtZXMiOlsic2hhcGVUb1BhdGgiLCJjcmVhdGVQYXRoIiwicGF0aElucHV0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFdBQVAsTUFBd0IsZUFBeEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxVQUFULENBQW9CQyxTQUFwQixFQUErQjtBQUFBO0FBQUE7QUFDNUMsU0FBT0YsV0FBVyxDQUFDRSxTQUFELEVBQVksSUFBWixDQUFsQjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNoYXBlVG9QYXRoIGZyb20gJy4vc2hhcGVUb1BhdGgnO1xuXG4vKipcbiAqIFJldHVybnMgYSBuZXcgYDxwYXRoPmAgZnJvbSBhIGA8Z2x5cGg+YCBlbGVtZW50LCBvbmx5IHVzaW5nIGl0cyBgZGAgYXR0cmlidXRlLFxuICogYWxsIG90aGVyIGF0dHJpYnV0ZXMgYXJlIGlnbm9yZWQuXG4gKlxuICogSWYgYHBhdGhJbnB1dGAgaXMgYSB2YWxpZCBwYXRoIHN0cmluZywgd2lsbCBjcmVhdGUgYSBgPHBhdGg+YCBhbmQgcmV0dXJuIGl0LlxuICpcbiAqIEBkZXByZWNhdGVkXG4gKiBAc2VlIHNoYXBlVG9QYXRoIGEgbmV3IGFuZCBtb3JlIGZsZXhpYmxlIHV0aWxpdHlcbiAqXG4gKiBAcGFyYW0ge1NWR1BhdGhDb21tYW5kZXIuc2hhcGVUeXBlc30gcGF0aElucHV0IGEgYDxnbHlwaD5gIGVsZW1lbnQgb3IgcGF0aCBzdHJpbmdcbiAqIEByZXR1cm5zIHtTVkdQYXRoRWxlbWVudCB8IGJvb2xlYW59IGEgbmV3IGA8cGF0aD5gIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlUGF0aChwYXRoSW5wdXQpIHtcbiAgcmV0dXJuIHNoYXBlVG9QYXRoKHBhdGhJbnB1dCwgdHJ1ZSk7XG59XG4iXX0=