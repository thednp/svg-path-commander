function cov_1dahj9u9ah() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getDrawDirection.js";
  var hash = "2f13f37f18126ab43ffdcc064b6d07f5f75ef1ba";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getDrawDirection.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 45
        }
      }
    },
    fnMap: {
      "0": {
        name: "getDrawDirection",
        decl: {
          start: {
            line: 11,
            column: 24
          },
          end: {
            line: 11,
            column: 40
          }
        },
        loc: {
          start: {
            line: 11,
            column: 47
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 11
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
    hash: "2f13f37f18126ab43ffdcc064b6d07f5f75ef1ba"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1dahj9u9ah = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1dahj9u9ah();
import getPathArea from './getPathArea';
import pathToCurve from '../convert/pathToCurve';
/**
 * Check if a path is drawn clockwise and returns true if so,
 * false otherwise.
 *
 * @param {SVGPath.pathArray} path the path string or `pathArray`
 * @returns {boolean} true when clockwise or false if not
 */

export default function getDrawDirection(path) {
  cov_1dahj9u9ah().f[0]++;
  cov_1dahj9u9ah().s[0]++;
  return getPathArea(pathToCurve(path)) >= 0;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldERyYXdEaXJlY3Rpb24uanMiXSwibmFtZXMiOlsiZ2V0UGF0aEFyZWEiLCJwYXRoVG9DdXJ2ZSIsImdldERyYXdEaXJlY3Rpb24iLCJwYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFdBQVAsTUFBd0IsZUFBeEI7QUFDQSxPQUFPQyxXQUFQLE1BQXdCLHdCQUF4QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsZ0JBQVQsQ0FBMEJDLElBQTFCLEVBQWdDO0FBQUE7QUFBQTtBQUM3QyxTQUFPSCxXQUFXLENBQUNDLFdBQVcsQ0FBQ0UsSUFBRCxDQUFaLENBQVgsSUFBa0MsQ0FBekM7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRQYXRoQXJlYSBmcm9tICcuL2dldFBhdGhBcmVhJztcbmltcG9ydCBwYXRoVG9DdXJ2ZSBmcm9tICcuLi9jb252ZXJ0L3BhdGhUb0N1cnZlJztcblxuLyoqXG4gKiBDaGVjayBpZiBhIHBhdGggaXMgZHJhd24gY2xvY2t3aXNlIGFuZCByZXR1cm5zIHRydWUgaWYgc28sXG4gKiBmYWxzZSBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTVkdQYXRoLnBhdGhBcnJheX0gcGF0aCB0aGUgcGF0aCBzdHJpbmcgb3IgYHBhdGhBcnJheWBcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIHdoZW4gY2xvY2t3aXNlIG9yIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREcmF3RGlyZWN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIGdldFBhdGhBcmVhKHBhdGhUb0N1cnZlKHBhdGgpKSA+PSAwO1xufVxuIl19