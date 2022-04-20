function cov_2qaldbuvoj() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isPathArray.js";
  var hash = "28324e2912b1de6e05fe55581975fdaa5db798ed";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isPathArray.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 13,
          column: 5
        }
      },
      "1": {
        start: {
          line: 11,
          column: 15
        },
        end: {
          line: 11,
          column: 35
        }
      },
      "2": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 12,
          column: 75
        }
      }
    },
    fnMap: {
      "0": {
        name: "isPathArray",
        decl: {
          start: {
            line: 9,
            column: 24
          },
          end: {
            line: 9,
            column: 35
          }
        },
        loc: {
          start: {
            line: 9,
            column: 42
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 9
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 10,
            column: 43
          },
          end: {
            line: 10,
            column: 44
          }
        },
        loc: {
          start: {
            line: 10,
            column: 52
          },
          end: {
            line: 13,
            column: 3
          }
        },
        line: 10
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 10,
            column: 9
          },
          end: {
            line: 13,
            column: 4
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 10,
            column: 9
          },
          end: {
            line: 10,
            column: 28
          }
        }, {
          start: {
            line: 10,
            column: 32
          },
          end: {
            line: 13,
            column: 4
          }
        }],
        line: 10
      },
      "1": {
        loc: {
          start: {
            line: 12,
            column: 11
          },
          end: {
            line: 12,
            column: 74
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 12,
            column: 11
          },
          end: {
            line: 12,
            column: 45
          }
        }, {
          start: {
            line: 12,
            column: 49
          },
          end: {
            line: 12,
            column: 74
          }
        }],
        line: 12
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "28324e2912b1de6e05fe55581975fdaa5db798ed"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2qaldbuvoj = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2qaldbuvoj();
import paramsCount from '../parser/paramsCount';
/**
 * Iterates an array to check if it's an actual `pathArray`.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */

export default function isPathArray(path) {
  cov_2qaldbuvoj().f[0]++;
  cov_2qaldbuvoj().s[0]++;
  return (cov_2qaldbuvoj().b[0][0]++, Array.isArray(path)) && (cov_2qaldbuvoj().b[0][1]++, path.every(seg => {
    cov_2qaldbuvoj().f[1]++;
    const lk = (cov_2qaldbuvoj().s[1]++, seg[0].toLowerCase());
    cov_2qaldbuvoj().s[2]++;
    return (cov_2qaldbuvoj().b[1][0]++, paramsCount[lk] === seg.length - 1) && (cov_2qaldbuvoj().b[1][1]++, 'achlmqstvz'.includes(lk));
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzUGF0aEFycmF5LmpzIl0sIm5hbWVzIjpbInBhcmFtc0NvdW50IiwiaXNQYXRoQXJyYXkiLCJwYXRoIiwiQXJyYXkiLCJpc0FycmF5IiwiZXZlcnkiLCJzZWciLCJsayIsInRvTG93ZXJDYXNlIiwibGVuZ3RoIiwiaW5jbHVkZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsV0FBUCxNQUF3Qix1QkFBeEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxXQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUFBO0FBQUE7QUFDeEMsU0FBTyw2QkFBQUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLElBQWQsbUNBQXVCQSxJQUFJLENBQUNHLEtBQUwsQ0FBWUMsR0FBRCxJQUFTO0FBQUE7QUFDaEQsVUFBTUMsRUFBRSw2QkFBR0QsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPRSxXQUFQLEVBQUgsQ0FBUjtBQURnRDtBQUVoRCxXQUFPLDZCQUFBUixXQUFXLENBQUNPLEVBQUQsQ0FBWCxLQUFvQkQsR0FBRyxDQUFDRyxNQUFKLEdBQWEsQ0FBakMsa0NBQXNDLGFBQWFDLFFBQWIsQ0FBc0JILEVBQXRCLENBQXRDLENBQVA7QUFDRCxHQUg2QixDQUF2QixDQUFQO0FBSUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGFyYW1zQ291bnQgZnJvbSAnLi4vcGFyc2VyL3BhcmFtc0NvdW50JztcblxuLyoqXG4gKiBJdGVyYXRlcyBhbiBhcnJheSB0byBjaGVjayBpZiBpdCdzIGFuIGFjdHVhbCBgcGF0aEFycmF5YC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IFNWR1BhdGgucGF0aEFycmF5fSBwYXRoIHRoZSBgcGF0aEFycmF5YCB0byBiZSBjaGVja2VkXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gaXRlcmF0aW9uIHJlc3VsdFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1BhdGhBcnJheShwYXRoKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHBhdGgpICYmIHBhdGguZXZlcnkoKHNlZykgPT4ge1xuICAgIGNvbnN0IGxrID0gc2VnWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIHBhcmFtc0NvdW50W2xrXSA9PT0gc2VnLmxlbmd0aCAtIDEgJiYgJ2FjaGxtcXN0dnonLmluY2x1ZGVzKGxrKTtcbiAgfSk7XG59XG4iXX0=