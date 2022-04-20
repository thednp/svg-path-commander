function cov_c3601o41h() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\clonePath.js";
  var hash = "1d1ed684fa77e60b6ca23f6969fd6c0a60c66fa4";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\clonePath.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 2
        },
        end: {
          line: 8,
          column: 58
        }
      },
      "1": {
        start: {
          line: 8,
          column: 26
        },
        end: {
          line: 8,
          column: 55
        }
      }
    },
    fnMap: {
      "0": {
        name: "clonePath",
        decl: {
          start: {
            line: 7,
            column: 24
          },
          end: {
            line: 7,
            column: 33
          }
        },
        loc: {
          start: {
            line: 7,
            column: 40
          },
          end: {
            line: 9,
            column: 1
          }
        },
        line: 7
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 8,
            column: 18
          },
          end: {
            line: 8,
            column: 19
          }
        },
        loc: {
          start: {
            line: 8,
            column: 26
          },
          end: {
            line: 8,
            column: 55
          }
        },
        line: 8
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 8,
            column: 26
          },
          end: {
            line: 8,
            column: 55
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 8,
            column: 45
          },
          end: {
            line: 8,
            column: 51
          }
        }, {
          start: {
            line: 8,
            column: 54
          },
          end: {
            line: 8,
            column: 55
          }
        }],
        line: 8
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
    hash: "1d1ed684fa77e60b6ca23f6969fd6c0a60c66fa4"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_c3601o41h = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_c3601o41h();

/**
 * Returns a clone of an existing `pathArray`.
 *
 * @param {SVGPath.pathArray | SVGPath.pathSegment} path the source `pathArray`
 * @returns {any} the cloned `pathArray`
 */
export default function clonePath(path) {
  cov_c3601o41h().f[0]++;
  cov_c3601o41h().s[0]++;
  return path.map(x => {
    cov_c3601o41h().f[1]++;
    cov_c3601o41h().s[1]++;
    return Array.isArray(x) ? (cov_c3601o41h().b[0][0]++, [...x]) : (cov_c3601o41h().b[0][1]++, x);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsb25lUGF0aC5qcyJdLCJuYW1lcyI6WyJjbG9uZVBhdGgiLCJwYXRoIiwibWFwIiwieCIsIkFycmF5IiwiaXNBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7O0FBZlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTQSxTQUFULENBQW1CQyxJQUFuQixFQUF5QjtBQUFBO0FBQUE7QUFDdEMsU0FBT0EsSUFBSSxDQUFDQyxHQUFMLENBQVVDLENBQUQsSUFBUTtBQUFBO0FBQUE7QUFBQSxXQUFBQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsQ0FBZCxnQ0FBbUIsQ0FBQyxHQUFHQSxDQUFKLENBQW5CLGdDQUE0QkEsQ0FBNUI7QUFBNkIsR0FBOUMsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXR1cm5zIGEgY2xvbmUgb2YgYW4gZXhpc3RpbmcgYHBhdGhBcnJheWAuXG4gKlxuICogQHBhcmFtIHtTVkdQYXRoLnBhdGhBcnJheSB8IFNWR1BhdGgucGF0aFNlZ21lbnR9IHBhdGggdGhlIHNvdXJjZSBgcGF0aEFycmF5YFxuICogQHJldHVybnMge2FueX0gdGhlIGNsb25lZCBgcGF0aEFycmF5YFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbG9uZVBhdGgocGF0aCkge1xuICByZXR1cm4gcGF0aC5tYXAoKHgpID0+IChBcnJheS5pc0FycmF5KHgpID8gWy4uLnhdIDogeCkpO1xufVxuIl19