function cov_vomo3j5qc() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPointAtPathLength.js";
  var hash = "80a44e9f89bdc96b6fa01bb7472cecd13f85b52c";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPointAtPathLength.js",
    statementMap: {
      "0": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 14,
          column: 47
        }
      }
    },
    fnMap: {
      "0": {
        name: "getPointAtPathLength",
        decl: {
          start: {
            line: 13,
            column: 24
          },
          end: {
            line: 13,
            column: 44
          }
        },
        loc: {
          start: {
            line: 13,
            column: 66
          },
          end: {
            line: 15,
            column: 1
          }
        },
        line: 13
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
    hash: "80a44e9f89bdc96b6fa01bb7472cecd13f85b52c"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_vomo3j5qc = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_vomo3j5qc();
import getPointAtLength from './getPointAtLength';
/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 * `pathToCurve` version.
 *
 * @deprecated
 *
 * @param {string | SVGPath.pathArray} pathInput the `pathArray` to look into
 * @param {number} distance the length of the shape to look at
 * @returns {{x: number, y: number}} the requested {x, y} point coordinates
 */

export default function getPointAtPathLength(pathInput, distance) {
  cov_vomo3j5qc().f[0]++;
  cov_vomo3j5qc().s[0]++;
  return getPointAtLength(pathInput, distance);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFBvaW50QXRQYXRoTGVuZ3RoLmpzIl0sIm5hbWVzIjpbImdldFBvaW50QXRMZW5ndGgiLCJnZXRQb2ludEF0UGF0aExlbmd0aCIsInBhdGhJbnB1dCIsImRpc3RhbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLGdCQUFQLE1BQTZCLG9CQUE3QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0Msb0JBQVQsQ0FBOEJDLFNBQTlCLEVBQXlDQyxRQUF6QyxFQUFtRDtBQUFBO0FBQUE7QUFDaEUsU0FBT0gsZ0JBQWdCLENBQUNFLFNBQUQsRUFBWUMsUUFBWixDQUF2QjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdldFBvaW50QXRMZW5ndGggZnJvbSAnLi9nZXRQb2ludEF0TGVuZ3RoJztcblxuLyoqXG4gKiBSZXR1cm5zIFt4LHldIGNvb3JkaW5hdGVzIG9mIGEgcG9pbnQgYXQgYSBnaXZlbiBsZW5ndGggb2YgYSBzaGFwZS5cbiAqIGBwYXRoVG9DdXJ2ZWAgdmVyc2lvbi5cbiAqXG4gKiBAZGVwcmVjYXRlZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgU1ZHUGF0aC5wYXRoQXJyYXl9IHBhdGhJbnB1dCB0aGUgYHBhdGhBcnJheWAgdG8gbG9vayBpbnRvXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgdGhlIGxlbmd0aCBvZiB0aGUgc2hhcGUgdG8gbG9vayBhdFxuICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHRoZSByZXF1ZXN0ZWQge3gsIHl9IHBvaW50IGNvb3JkaW5hdGVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFBvaW50QXRQYXRoTGVuZ3RoKHBhdGhJbnB1dCwgZGlzdGFuY2UpIHtcbiAgcmV0dXJuIGdldFBvaW50QXRMZW5ndGgocGF0aElucHV0LCBkaXN0YW5jZSk7XG59XG4iXX0=