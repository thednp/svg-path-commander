function cov_8bhvxx3w4() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\polygonLength.js";
  var hash = "0f50579b94d520f27693717df105889094f0454b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\polygonLength.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 18,
          column: 8
        }
      },
      "1": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 16,
          column: 5
        }
      },
      "2": {
        start: {
          line: 15,
          column: 6
        },
        end: {
          line: 15,
          column: 64
        }
      },
      "3": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 13
        }
      }
    },
    fnMap: {
      "0": {
        name: "polygonLength",
        decl: {
          start: {
            line: 12,
            column: 24
          },
          end: {
            line: 12,
            column: 37
          }
        },
        loc: {
          start: {
            line: 12,
            column: 47
          },
          end: {
            line: 19,
            column: 1
          }
        },
        line: 12
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 13,
            column: 24
          },
          end: {
            line: 13,
            column: 25
          }
        },
        loc: {
          start: {
            line: 13,
            column: 46
          },
          end: {
            line: 18,
            column: 3
          }
        },
        line: 13
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        }, {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        }],
        line: 14
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "0f50579b94d520f27693717df105889094f0454b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_8bhvxx3w4 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_8bhvxx3w4();
import distanceSquareRoot from './distanceSquareRoot';
/**
 * d3-polygon-length
 * https://github.com/d3/d3-polygon
 *
 * Returns the perimeter of a polygon.
 *
 * @param {[number,number][]} polygon an array of coordinates
 * @returns {number} the polygon length
 */

export default function polygonLength(polygon) {
  cov_8bhvxx3w4().f[0]++;
  cov_8bhvxx3w4().s[0]++;
  return polygon.reduce((length, point, i) => {
    cov_8bhvxx3w4().f[1]++;
    cov_8bhvxx3w4().s[1]++;

    if (i) {
      cov_8bhvxx3w4().b[0][0]++;
      cov_8bhvxx3w4().s[2]++;
      return length + distanceSquareRoot(polygon[i - 1], point);
    } else {
      cov_8bhvxx3w4().b[0][1]++;
    }

    cov_8bhvxx3w4().s[3]++;
    return 0;
  }, 0);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvbHlnb25MZW5ndGguanMiXSwibmFtZXMiOlsiZGlzdGFuY2VTcXVhcmVSb290IiwicG9seWdvbkxlbmd0aCIsInBvbHlnb24iLCJyZWR1Y2UiLCJsZW5ndGgiLCJwb2ludCIsImkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLGtCQUFQLE1BQStCLHNCQUEvQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFlLFNBQVNDLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQWdDO0FBQUE7QUFBQTtBQUM3QyxTQUFPQSxPQUFPLENBQUNDLE1BQVIsQ0FBZSxDQUFDQyxNQUFELEVBQVNDLEtBQVQsRUFBZ0JDLENBQWhCLEtBQXNCO0FBQUE7QUFBQTs7QUFDMUMsUUFBSUEsQ0FBSixFQUFPO0FBQUE7QUFBQTtBQUNMLGFBQU9GLE1BQU0sR0FBR0osa0JBQWtCLENBQUNFLE9BQU8sQ0FBQ0ksQ0FBQyxHQUFHLENBQUwsQ0FBUixFQUFpQkQsS0FBakIsQ0FBbEM7QUFDRCxLQUZEO0FBQUE7QUFBQTs7QUFEMEM7QUFJMUMsV0FBTyxDQUFQO0FBQ0QsR0FMTSxFQUtKLENBTEksQ0FBUDtBQU1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRpc3RhbmNlU3F1YXJlUm9vdCBmcm9tICcuL2Rpc3RhbmNlU3F1YXJlUm9vdCc7XG5cbi8qKlxuICogZDMtcG9seWdvbi1sZW5ndGhcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kMy9kMy1wb2x5Z29uXG4gKlxuICogUmV0dXJucyB0aGUgcGVyaW1ldGVyIG9mIGEgcG9seWdvbi5cbiAqXG4gKiBAcGFyYW0ge1tudW1iZXIsbnVtYmVyXVtdfSBwb2x5Z29uIGFuIGFycmF5IG9mIGNvb3JkaW5hdGVzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgcG9seWdvbiBsZW5ndGhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcG9seWdvbkxlbmd0aChwb2x5Z29uKSB7XG4gIHJldHVybiBwb2x5Z29uLnJlZHVjZSgobGVuZ3RoLCBwb2ludCwgaSkgPT4ge1xuICAgIGlmIChpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoICsgZGlzdGFuY2VTcXVhcmVSb290KHBvbHlnb25baSAtIDFdLCBwb2ludCk7XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9LCAwKTtcbn1cbiJdfQ==