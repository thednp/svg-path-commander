function cov_1u1xd60bk9() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isRelativeArray.js";
  var hash = "a845824d283543c90ca739005c18085a9f415ac9";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isRelativeArray.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 13,
          column: 69
        }
      },
      "1": {
        start: {
          line: 13,
          column: 36
        },
        end: {
          line: 13,
          column: 67
        }
      }
    },
    fnMap: {
      "0": {
        name: "isRelativeArray",
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
            column: 27
          },
          end: {
            line: 13,
            column: 28
          }
        },
        loc: {
          start: {
            line: 13,
            column: 36
          },
          end: {
            line: 13,
            column: 67
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
            column: 68
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
            column: 68
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
    hash: "a845824d283543c90ca739005c18085a9f415ac9"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1u1xd60bk9 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1u1xd60bk9();
import isPathArray from './isPathArray';
/**
 * Iterates an array to check if it's a `pathArray`
 * with relative values.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */

export default function isRelativeArray(path) {
  cov_1u1xd60bk9().f[0]++;
  cov_1u1xd60bk9().s[0]++;
  return (cov_1u1xd60bk9().b[0][0]++, isPathArray(path) // @ts-ignore -- `isPathArray` checks if it's `Array`
  ) && (cov_1u1xd60bk9().b[0][1]++, path.slice(1).every(seg => {
    cov_1u1xd60bk9().f[1]++;
    cov_1u1xd60bk9().s[1]++;
    return seg[0] === seg[0].toLowerCase();
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzUmVsYXRpdmVBcnJheS5qcyJdLCJuYW1lcyI6WyJpc1BhdGhBcnJheSIsImlzUmVsYXRpdmVBcnJheSIsInBhdGgiLCJzbGljZSIsImV2ZXJ5Iiwic2VnIiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsV0FBUCxNQUF3QixlQUF4QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsZUFBVCxDQUF5QkMsSUFBekIsRUFBK0I7QUFBQTtBQUFBO0FBQzVDLFNBQU8sNkJBQUFGLFdBQVcsQ0FBQ0UsSUFBRCxDQUFYLENBQ0w7QUFESyxvQ0FFRkEsSUFBSSxDQUFDQyxLQUFMLENBQVcsQ0FBWCxFQUFjQyxLQUFkLENBQXFCQyxHQUFELElBQVM7QUFBQTtBQUFBO0FBQUEsV0FBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxLQUFXQSxHQUFHLENBQUMsQ0FBRCxDQUFILENBQU9DLFdBQVAsRUFBWDtBQUErQixHQUE1RCxDQUZFLENBQVA7QUFHRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpc1BhdGhBcnJheSBmcm9tICcuL2lzUGF0aEFycmF5JztcblxuLyoqXG4gKiBJdGVyYXRlcyBhbiBhcnJheSB0byBjaGVjayBpZiBpdCdzIGEgYHBhdGhBcnJheWBcbiAqIHdpdGggcmVsYXRpdmUgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgU1ZHUGF0aC5wYXRoQXJyYXl9IHBhdGggdGhlIGBwYXRoQXJyYXlgIHRvIGJlIGNoZWNrZWRcbiAqIEByZXR1cm5zIHtib29sZWFufSBpdGVyYXRpb24gcmVzdWx0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzUmVsYXRpdmVBcnJheShwYXRoKSB7XG4gIHJldHVybiBpc1BhdGhBcnJheShwYXRoKVxuICAgIC8vIEB0cy1pZ25vcmUgLS0gYGlzUGF0aEFycmF5YCBjaGVja3MgaWYgaXQncyBgQXJyYXlgXG4gICAgJiYgcGF0aC5zbGljZSgxKS5ldmVyeSgoc2VnKSA9PiBzZWdbMF0gPT09IHNlZ1swXS50b0xvd2VyQ2FzZSgpKTtcbn1cbiJdfQ==