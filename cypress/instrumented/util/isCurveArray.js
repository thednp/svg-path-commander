function cov_6cr6p37dr() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isCurveArray.js";
  var hash = "58da3186b43338034903ff5e9d79fd8abee183a1";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isCurveArray.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 73
        }
      },
      "1": {
        start: {
          line: 12,
          column: 50
        },
        end: {
          line: 12,
          column: 71
        }
      }
    },
    fnMap: {
      "0": {
        name: "isCurveArray",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 36
          }
        },
        loc: {
          start: {
            line: 10,
            column: 43
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 10
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 12,
            column: 41
          },
          end: {
            line: 12,
            column: 42
          }
        },
        loc: {
          start: {
            line: 12,
            column: 50
          },
          end: {
            line: 12,
            column: 71
          }
        },
        line: 12
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 12,
            column: 9
          },
          end: {
            line: 12,
            column: 72
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 12,
            column: 9
          },
          end: {
            line: 12,
            column: 26
          }
        }, {
          start: {
            line: 12,
            column: 30
          },
          end: {
            line: 12,
            column: 72
          }
        }],
        line: 12
      }
    },
    s: {
      "0": 0,
      "1": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "58da3186b43338034903ff5e9d79fd8abee183a1"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_6cr6p37dr = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_6cr6p37dr();
import isPathArray from './isPathArray';
/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param {string | SVGPath.pathArray} path the `Array` to be checked
 * @returns {boolean} iteration result
 */

export default function isCurveArray(path) {
  cov_6cr6p37dr().f[0]++;
  cov_6cr6p37dr().s[0]++;
  // @ts-ignore -- `isPathArray` also checks if it's `Array`
  return (cov_6cr6p37dr().b[0][0]++, isPathArray(path)) && (cov_6cr6p37dr().b[0][1]++, path.every(seg => {
    cov_6cr6p37dr().f[1]++;
    cov_6cr6p37dr().s[1]++;
    return 'MC'.includes(seg[0]);
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzQ3VydmVBcnJheS5qcyJdLCJuYW1lcyI6WyJpc1BhdGhBcnJheSIsImlzQ3VydmVBcnJheSIsInBhdGgiLCJldmVyeSIsInNlZyIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFdBQVAsTUFBd0IsZUFBeEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFlLFNBQVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO0FBQUE7QUFBQTtBQUN6QztBQUNBLFNBQU8sNEJBQUFGLFdBQVcsQ0FBQ0UsSUFBRCxDQUFYLGlDQUFxQkEsSUFBSSxDQUFDQyxLQUFMLENBQVlDLEdBQUQsSUFBUztBQUFBO0FBQUE7QUFBQSxnQkFBS0MsUUFBTCxDQUFjRCxHQUFHLENBQUMsQ0FBRCxDQUFqQjtBQUFxQixHQUF6QyxDQUFyQixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNQYXRoQXJyYXkgZnJvbSAnLi9pc1BhdGhBcnJheSc7XG5cbi8qKlxuICogSXRlcmF0ZXMgYW4gYXJyYXkgdG8gY2hlY2sgaWYgaXQncyBhIGBwYXRoQXJyYXlgXG4gKiB3aXRoIGFsbCBDIChjdWJpYyBiZXppZXIpIHNlZ21lbnRzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgU1ZHUGF0aC5wYXRoQXJyYXl9IHBhdGggdGhlIGBBcnJheWAgdG8gYmUgY2hlY2tlZFxuICogQHJldHVybnMge2Jvb2xlYW59IGl0ZXJhdGlvbiByZXN1bHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNDdXJ2ZUFycmF5KHBhdGgpIHtcbiAgLy8gQHRzLWlnbm9yZSAtLSBgaXNQYXRoQXJyYXlgIGFsc28gY2hlY2tzIGlmIGl0J3MgYEFycmF5YFxuICByZXR1cm4gaXNQYXRoQXJyYXkocGF0aCkgJiYgcGF0aC5ldmVyeSgoc2VnKSA9PiAnTUMnLmluY2x1ZGVzKHNlZ1swXSkpO1xufVxuIl19