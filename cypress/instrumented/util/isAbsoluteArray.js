function cov_imvuebc2w() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isAbsoluteArray.js";
  var hash = "b741a2a3545d34fbd116405b61dc1e2e4314cb96";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isAbsoluteArray.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 13,
          column: 54
        }
      },
      "1": {
        start: {
          line: 13,
          column: 25
        },
        end: {
          line: 13,
          column: 52
        }
      }
    },
    fnMap: {
      "0": {
        name: "isAbsoluteArray",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 39
          }
        },
        loc: {
          start: {
            line: 10,
            column: 46
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 10
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 13,
            column: 18
          },
          end: {
            line: 13,
            column: 19
          }
        },
        loc: {
          start: {
            line: 13,
            column: 25
          },
          end: {
            line: 13,
            column: 52
          }
        },
        line: 13
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 11,
            column: 9
          },
          end: {
            line: 13,
            column: 53
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 11,
            column: 9
          },
          end: {
            line: 11,
            column: 26
          }
        }, {
          start: {
            line: 13,
            column: 7
          },
          end: {
            line: 13,
            column: 53
          }
        }],
        line: 11
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
    hash: "b741a2a3545d34fbd116405b61dc1e2e4314cb96"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_imvuebc2w = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_imvuebc2w();
import isPathArray from './isPathArray';
/**
 * Iterates an array to check if it's a `pathArray`
 * with all absolute values.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */

export default function isAbsoluteArray(path) {
  cov_imvuebc2w().f[0]++;
  cov_imvuebc2w().s[0]++;
  return (cov_imvuebc2w().b[0][0]++, isPathArray(path) // @ts-ignore -- `isPathArray` also checks if it's `Array`
  ) && (cov_imvuebc2w().b[0][1]++, path.every(x => {
    cov_imvuebc2w().f[1]++;
    cov_imvuebc2w().s[1]++;
    return x[0] === x[0].toUpperCase();
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzQWJzb2x1dGVBcnJheS5qcyJdLCJuYW1lcyI6WyJpc1BhdGhBcnJheSIsImlzQWJzb2x1dGVBcnJheSIsInBhdGgiLCJldmVyeSIsIngiLCJ0b1VwcGVyQ2FzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPQSxXQUFQLE1BQXdCLGVBQXhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxlQUFULENBQXlCQyxJQUF6QixFQUErQjtBQUFBO0FBQUE7QUFDNUMsU0FBTyw0QkFBQUYsV0FBVyxDQUFDRSxJQUFELENBQVgsQ0FDTDtBQURLLG1DQUVGQSxJQUFJLENBQUNDLEtBQUwsQ0FBWUMsQ0FBRCxJQUFPO0FBQUE7QUFBQTtBQUFBLFdBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsS0FBU0EsQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLQyxXQUFMLEVBQVQ7QUFBMkIsR0FBN0MsQ0FGRSxDQUFQO0FBR0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNQYXRoQXJyYXkgZnJvbSAnLi9pc1BhdGhBcnJheSc7XG5cbi8qKlxuICogSXRlcmF0ZXMgYW4gYXJyYXkgdG8gY2hlY2sgaWYgaXQncyBhIGBwYXRoQXJyYXlgXG4gKiB3aXRoIGFsbCBhYnNvbHV0ZSB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBTVkdQYXRoLnBhdGhBcnJheX0gcGF0aCB0aGUgYHBhdGhBcnJheWAgdG8gYmUgY2hlY2tlZFxuICogQHJldHVybnMge2Jvb2xlYW59IGl0ZXJhdGlvbiByZXN1bHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNBYnNvbHV0ZUFycmF5KHBhdGgpIHtcbiAgcmV0dXJuIGlzUGF0aEFycmF5KHBhdGgpXG4gICAgLy8gQHRzLWlnbm9yZSAtLSBgaXNQYXRoQXJyYXlgIGFsc28gY2hlY2tzIGlmIGl0J3MgYEFycmF5YFxuICAgICYmIHBhdGguZXZlcnkoKHgpID0+IHhbMF0gPT09IHhbMF0udG9VcHBlckNhc2UoKSk7XG59XG4iXX0=