function cov_badon7ief() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getTotalLength.js";
  var hash = "aaf7330ae7d86fe8fdca33d9d3c6a94b46e0e56c";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getTotalLength.js",
    statementMap: {
      "0": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 14,
          column: 38
        }
      }
    },
    fnMap: {
      "0": {
        name: "getTotalLength",
        decl: {
          start: {
            line: 12,
            column: 24
          },
          end: {
            line: 12,
            column: 38
          }
        },
        loc: {
          start: {
            line: 12,
            column: 50
          },
          end: {
            line: 15,
            column: 1
          }
        },
        line: 12
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
    hash: "aaf7330ae7d86fe8fdca33d9d3c6a94b46e0e56c"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_badon7ief = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_badon7ief();
import pathLengthFactory from './pathLengthFactory';
/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * The `normalizePath` version is lighter, faster, more efficient and more accurate
 * with paths that are not `curveArray`.
 *
 * @param {string | SVGPath.pathArray} pathInput the target `pathArray`
 * @returns {number} the shape total length
 */

export default function getTotalLength(pathInput) {
  cov_badon7ief().f[0]++;
  cov_badon7ief().s[0]++;
  // @ts-ignore - it's fine
  return pathLengthFactory(pathInput);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFRvdGFsTGVuZ3RoLmpzIl0sIm5hbWVzIjpbInBhdGhMZW5ndGhGYWN0b3J5IiwiZ2V0VG90YWxMZW5ndGgiLCJwYXRoSW5wdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsaUJBQVAsTUFBOEIscUJBQTlCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsY0FBVCxDQUF3QkMsU0FBeEIsRUFBbUM7QUFBQTtBQUFBO0FBQ2hEO0FBQ0EsU0FBT0YsaUJBQWlCLENBQUNFLFNBQUQsQ0FBeEI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoTGVuZ3RoRmFjdG9yeSBmcm9tICcuL3BhdGhMZW5ndGhGYWN0b3J5JztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzaGFwZSB0b3RhbCBsZW5ndGgsIG9yIHRoZSBlcXVpdmFsZW50IHRvIGBzaGFwZS5nZXRUb3RhbExlbmd0aCgpYC5cbiAqXG4gKiBUaGUgYG5vcm1hbGl6ZVBhdGhgIHZlcnNpb24gaXMgbGlnaHRlciwgZmFzdGVyLCBtb3JlIGVmZmljaWVudCBhbmQgbW9yZSBhY2N1cmF0ZVxuICogd2l0aCBwYXRocyB0aGF0IGFyZSBub3QgYGN1cnZlQXJyYXlgLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgU1ZHUGF0aC5wYXRoQXJyYXl9IHBhdGhJbnB1dCB0aGUgdGFyZ2V0IGBwYXRoQXJyYXlgXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgc2hhcGUgdG90YWwgbGVuZ3RoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFRvdGFsTGVuZ3RoKHBhdGhJbnB1dCkge1xuICAvLyBAdHMtaWdub3JlIC0gaXQncyBmaW5lXG4gIHJldHVybiBwYXRoTGVuZ3RoRmFjdG9yeShwYXRoSW5wdXQpO1xufVxuIl19