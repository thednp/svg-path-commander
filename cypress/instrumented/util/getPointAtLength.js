function cov_7evn2wxzn() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPointAtLength.js";
  var hash = "f1cb936176db74a4f574bd9b04ef86ecec69f4d9";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPointAtLength.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 48
        }
      }
    },
    fnMap: {
      "0": {
        name: "getPointAtLength",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 40
          }
        },
        loc: {
          start: {
            line: 10,
            column: 62
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 10
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
    hash: "f1cb936176db74a4f574bd9b04ef86ecec69f4d9"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_7evn2wxzn = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_7evn2wxzn();
import pathLengthFactory from './pathLengthFactory';
/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param {string | SVGPath.pathArray} pathInput the `pathArray` to look into
 * @param {number} distance the length of the shape to look at
 * @returns {{x: number, y: number}} the requested {x, y} point coordinates
 */

export default function getPointAtLength(pathInput, distance) {
  cov_7evn2wxzn().f[0]++;
  cov_7evn2wxzn().s[0]++;
  // @ts-ignore
  return pathLengthFactory(pathInput, distance);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFBvaW50QXRMZW5ndGguanMiXSwibmFtZXMiOlsicGF0aExlbmd0aEZhY3RvcnkiLCJnZXRQb2ludEF0TGVuZ3RoIiwicGF0aElucHV0IiwiZGlzdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsaUJBQVAsTUFBOEIscUJBQTlCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxnQkFBVCxDQUEwQkMsU0FBMUIsRUFBcUNDLFFBQXJDLEVBQStDO0FBQUE7QUFBQTtBQUM1RDtBQUNBLFNBQU9ILGlCQUFpQixDQUFDRSxTQUFELEVBQVlDLFFBQVosQ0FBeEI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoTGVuZ3RoRmFjdG9yeSBmcm9tICcuL3BhdGhMZW5ndGhGYWN0b3J5JztcblxuLyoqXG4gKiBSZXR1cm5zIFt4LHldIGNvb3JkaW5hdGVzIG9mIGEgcG9pbnQgYXQgYSBnaXZlbiBsZW5ndGggb2YgYSBzaGFwZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IFNWR1BhdGgucGF0aEFycmF5fSBwYXRoSW5wdXQgdGhlIGBwYXRoQXJyYXlgIHRvIGxvb2sgaW50b1xuICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIHRoZSBsZW5ndGggb2YgdGhlIHNoYXBlIHRvIGxvb2sgYXRcbiAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSB0aGUgcmVxdWVzdGVkIHt4LCB5fSBwb2ludCBjb29yZGluYXRlc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRQb2ludEF0TGVuZ3RoKHBhdGhJbnB1dCwgZGlzdGFuY2UpIHtcbiAgLy8gQHRzLWlnbm9yZVxuICByZXR1cm4gcGF0aExlbmd0aEZhY3RvcnkocGF0aElucHV0LCBkaXN0YW5jZSk7XG59XG4iXX0=