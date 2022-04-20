function cov_2b0vhuytuf() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isNormalizedArray.js";
  var hash = "a435d86ea70100b121c8835dc5a5864617baa4bc";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isNormalizedArray.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 13,
          column: 81
        }
      },
      "1": {
        start: {
          line: 13,
          column: 54
        },
        end: {
          line: 13,
          column: 79
        }
      }
    },
    fnMap: {
      "0": {
        name: "isNormalizedArray",
        decl: {
          start: {
            line: 11,
            column: 24
          },
          end: {
            line: 11,
            column: 41
          }
        },
        loc: {
          start: {
            line: 11,
            column: 48
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 11
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 13,
            column: 45
          },
          end: {
            line: 13,
            column: 46
          }
        },
        loc: {
          start: {
            line: 13,
            column: 54
          },
          end: {
            line: 13,
            column: 79
          }
        },
        line: 13
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 13,
            column: 9
          },
          end: {
            line: 13,
            column: 80
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 13,
            column: 9
          },
          end: {
            line: 13,
            column: 30
          }
        }, {
          start: {
            line: 13,
            column: 34
          },
          end: {
            line: 13,
            column: 80
          }
        }],
        line: 13
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
    hash: "a435d86ea70100b121c8835dc5a5864617baa4bc"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2b0vhuytuf = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2b0vhuytuf();
import isAbsoluteArray from './isAbsoluteArray';
/**
 * Iterates an array to check if it's a `pathArray`
 * with all segments are in non-shorthand notation
 * with absolute values.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */

export default function isNormalizedArray(path) {
  cov_2b0vhuytuf().f[0]++;
  cov_2b0vhuytuf().s[0]++;
  // @ts-ignore -- `isAbsoluteArray` also checks if it's `Array`
  return (cov_2b0vhuytuf().b[0][0]++, isAbsoluteArray(path)) && (cov_2b0vhuytuf().b[0][1]++, path.every(seg => {
    cov_2b0vhuytuf().f[1]++;
    cov_2b0vhuytuf().s[1]++;
    return 'ACLMQZ'.includes(seg[0]);
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzTm9ybWFsaXplZEFycmF5LmpzIl0sIm5hbWVzIjpbImlzQWJzb2x1dGVBcnJheSIsImlzTm9ybWFsaXplZEFycmF5IiwicGF0aCIsImV2ZXJ5Iiwic2VnIiwiaW5jbHVkZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsZUFBUCxNQUE0QixtQkFBNUI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsaUJBQVQsQ0FBMkJDLElBQTNCLEVBQWlDO0FBQUE7QUFBQTtBQUM5QztBQUNBLFNBQU8sNkJBQUFGLGVBQWUsQ0FBQ0UsSUFBRCxDQUFmLGtDQUF5QkEsSUFBSSxDQUFDQyxLQUFMLENBQVlDLEdBQUQsSUFBUztBQUFBO0FBQUE7QUFBQSxvQkFBU0MsUUFBVCxDQUFrQkQsR0FBRyxDQUFDLENBQUQsQ0FBckI7QUFBeUIsR0FBN0MsQ0FBekIsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlzQWJzb2x1dGVBcnJheSBmcm9tICcuL2lzQWJzb2x1dGVBcnJheSc7XG5cbi8qKlxuICogSXRlcmF0ZXMgYW4gYXJyYXkgdG8gY2hlY2sgaWYgaXQncyBhIGBwYXRoQXJyYXlgXG4gKiB3aXRoIGFsbCBzZWdtZW50cyBhcmUgaW4gbm9uLXNob3J0aGFuZCBub3RhdGlvblxuICogd2l0aCBhYnNvbHV0ZSB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBTVkdQYXRoLnBhdGhBcnJheX0gcGF0aCB0aGUgYHBhdGhBcnJheWAgdG8gYmUgY2hlY2tlZFxuICogQHJldHVybnMge2Jvb2xlYW59IGl0ZXJhdGlvbiByZXN1bHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNOb3JtYWxpemVkQXJyYXkocGF0aCkge1xuICAvLyBAdHMtaWdub3JlIC0tIGBpc0Fic29sdXRlQXJyYXlgIGFsc28gY2hlY2tzIGlmIGl0J3MgYEFycmF5YFxuICByZXR1cm4gaXNBYnNvbHV0ZUFycmF5KHBhdGgpICYmIHBhdGguZXZlcnkoKHNlZykgPT4gJ0FDTE1RWicuaW5jbHVkZXMoc2VnWzBdKSk7XG59XG4iXX0=