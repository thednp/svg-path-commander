function cov_24gwxx9jxp() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\splitCubic.js";
  var hash = "29f72dfd6d122c98733993792f7da87d70e306fa";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\splitCubic.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 27
        },
        end: {
          line: 10,
          column: 30
        }
      },
      "1": {
        start: {
          line: 11,
          column: 13
        },
        end: {
          line: 11,
          column: 28
        }
      },
      "2": {
        start: {
          line: 12,
          column: 13
        },
        end: {
          line: 12,
          column: 28
        }
      },
      "3": {
        start: {
          line: 13,
          column: 13
        },
        end: {
          line: 13,
          column: 28
        }
      },
      "4": {
        start: {
          line: 14,
          column: 13
        },
        end: {
          line: 14,
          column: 28
        }
      },
      "5": {
        start: {
          line: 16,
          column: 13
        },
        end: {
          line: 16,
          column: 32
        }
      },
      "6": {
        start: {
          line: 18,
          column: 13
        },
        end: {
          line: 18,
          column: 32
        }
      },
      "7": {
        start: {
          line: 20,
          column: 13
        },
        end: {
          line: 20,
          column: 32
        }
      },
      "8": {
        start: {
          line: 21,
          column: 13
        },
        end: {
          line: 21,
          column: 32
        }
      },
      "9": {
        start: {
          line: 22,
          column: 13
        },
        end: {
          line: 22,
          column: 32
        }
      },
      "10": {
        start: {
          line: 23,
          column: 13
        },
        end: {
          line: 23,
          column: 32
        }
      },
      "11": {
        start: {
          line: 25,
          column: 2
        },
        end: {
          line: 29,
          column: 4
        }
      }
    },
    fnMap: {
      "0": {
        name: "splitCubic",
        decl: {
          start: {
            line: 9,
            column: 24
          },
          end: {
            line: 9,
            column: 34
          }
        },
        loc: {
          start: {
            line: 9,
            column: 53
          },
          end: {
            line: 30,
            column: 1
          }
        },
        line: 9
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "29f72dfd6d122c98733993792f7da87d70e306fa"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_24gwxx9jxp = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_24gwxx9jxp();
import midPoint from '../math/midPoint';
/**
 * Split a cubic-bezier segment into two.
 *
 * @param {number[]} pts the cubic-bezier parameters
 * @return {SVGPath.cubicSegment[]} two new cubic-bezier segments
 */

export default function splitCubic(pts
/* , ratio */
) {
  cov_24gwxx9jxp().f[0]++;
  const t = (
  /* ratio || */
  cov_24gwxx9jxp().s[0]++, 0.5);
  const p0 = (cov_24gwxx9jxp().s[1]++, pts.slice(0, 2));
  const p1 = (cov_24gwxx9jxp().s[2]++, pts.slice(2, 4));
  const p2 = (cov_24gwxx9jxp().s[3]++, pts.slice(4, 6));
  const p3 = (cov_24gwxx9jxp().s[4]++, pts.slice(6, 8)); // @ts-ignore

  const p4 = (cov_24gwxx9jxp().s[5]++, midPoint(p0, p1, t)); // @ts-ignore

  const p5 = (cov_24gwxx9jxp().s[6]++, midPoint(p1, p2, t)); // @ts-ignore

  const p6 = (cov_24gwxx9jxp().s[7]++, midPoint(p2, p3, t));
  const p7 = (cov_24gwxx9jxp().s[8]++, midPoint(p4, p5, t));
  const p8 = (cov_24gwxx9jxp().s[9]++, midPoint(p5, p6, t));
  const p9 = (cov_24gwxx9jxp().s[10]++, midPoint(p7, p8, t));
  cov_24gwxx9jxp().s[11]++;
  return [['C', ...p4, ...p7, ...p9], // @ts-ignore
  ['C', ...p8, ...p6, ...p3]];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwbGl0Q3ViaWMuanMiXSwibmFtZXMiOlsibWlkUG9pbnQiLCJzcGxpdEN1YmljIiwicHRzIiwidCIsInAwIiwic2xpY2UiLCJwMSIsInAyIiwicDMiLCJwNCIsInA1IiwicDYiLCJwNyIsInA4IiwicDkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFFBQVAsTUFBcUIsa0JBQXJCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsVUFBVCxDQUFvQkM7QUFBRztBQUF2QixFQUFzQztBQUFBO0FBQ25ELFFBQU1DLENBQUM7QUFBRztBQUFILDJCQUFrQixHQUFsQixDQUFQO0FBQ0EsUUFBTUMsRUFBRSw2QkFBR0YsR0FBRyxDQUFDRyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQWIsQ0FBSCxDQUFSO0FBQ0EsUUFBTUMsRUFBRSw2QkFBR0osR0FBRyxDQUFDRyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQWIsQ0FBSCxDQUFSO0FBQ0EsUUFBTUUsRUFBRSw2QkFBR0wsR0FBRyxDQUFDRyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQWIsQ0FBSCxDQUFSO0FBQ0EsUUFBTUcsRUFBRSw2QkFBR04sR0FBRyxDQUFDRyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQWIsQ0FBSCxDQUFSLENBTG1ELENBTW5EOztBQUNBLFFBQU1JLEVBQUUsNkJBQUdULFFBQVEsQ0FBQ0ksRUFBRCxFQUFLRSxFQUFMLEVBQVNILENBQVQsQ0FBWCxDQUFSLENBUG1ELENBUW5EOztBQUNBLFFBQU1PLEVBQUUsNkJBQUdWLFFBQVEsQ0FBQ00sRUFBRCxFQUFLQyxFQUFMLEVBQVNKLENBQVQsQ0FBWCxDQUFSLENBVG1ELENBVW5EOztBQUNBLFFBQU1RLEVBQUUsNkJBQUdYLFFBQVEsQ0FBQ08sRUFBRCxFQUFLQyxFQUFMLEVBQVNMLENBQVQsQ0FBWCxDQUFSO0FBQ0EsUUFBTVMsRUFBRSw2QkFBR1osUUFBUSxDQUFDUyxFQUFELEVBQUtDLEVBQUwsRUFBU1AsQ0FBVCxDQUFYLENBQVI7QUFDQSxRQUFNVSxFQUFFLDZCQUFHYixRQUFRLENBQUNVLEVBQUQsRUFBS0MsRUFBTCxFQUFTUixDQUFULENBQVgsQ0FBUjtBQUNBLFFBQU1XLEVBQUUsOEJBQUdkLFFBQVEsQ0FBQ1ksRUFBRCxFQUFLQyxFQUFMLEVBQVNWLENBQVQsQ0FBWCxDQUFSO0FBZG1EO0FBZ0JuRCxTQUFPLENBQ0wsQ0FBQyxHQUFELEVBQU0sR0FBR00sRUFBVCxFQUFhLEdBQUdHLEVBQWhCLEVBQW9CLEdBQUdFLEVBQXZCLENBREssRUFFTDtBQUNBLEdBQUMsR0FBRCxFQUFNLEdBQUdELEVBQVQsRUFBYSxHQUFHRixFQUFoQixFQUFvQixHQUFHSCxFQUF2QixDQUhLLENBQVA7QUFLRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtaWRQb2ludCBmcm9tICcuLi9tYXRoL21pZFBvaW50JztcblxuLyoqXG4gKiBTcGxpdCBhIGN1YmljLWJlemllciBzZWdtZW50IGludG8gdHdvLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IHB0cyB0aGUgY3ViaWMtYmV6aWVyIHBhcmFtZXRlcnNcbiAqIEByZXR1cm4ge1NWR1BhdGguY3ViaWNTZWdtZW50W119IHR3byBuZXcgY3ViaWMtYmV6aWVyIHNlZ21lbnRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNwbGl0Q3ViaWMocHRzLyogLCByYXRpbyAqLykge1xuICBjb25zdCB0ID0gLyogcmF0aW8gfHwgKi8gMC41O1xuICBjb25zdCBwMCA9IHB0cy5zbGljZSgwLCAyKTtcbiAgY29uc3QgcDEgPSBwdHMuc2xpY2UoMiwgNCk7XG4gIGNvbnN0IHAyID0gcHRzLnNsaWNlKDQsIDYpO1xuICBjb25zdCBwMyA9IHB0cy5zbGljZSg2LCA4KTtcbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBwNCA9IG1pZFBvaW50KHAwLCBwMSwgdCk7XG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgcDUgPSBtaWRQb2ludChwMSwgcDIsIHQpO1xuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IHA2ID0gbWlkUG9pbnQocDIsIHAzLCB0KTtcbiAgY29uc3QgcDcgPSBtaWRQb2ludChwNCwgcDUsIHQpO1xuICBjb25zdCBwOCA9IG1pZFBvaW50KHA1LCBwNiwgdCk7XG4gIGNvbnN0IHA5ID0gbWlkUG9pbnQocDcsIHA4LCB0KTtcblxuICByZXR1cm4gW1xuICAgIFsnQycsIC4uLnA0LCAuLi5wNywgLi4ucDldLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBbJ0MnLCAuLi5wOCwgLi4ucDYsIC4uLnAzXSxcbiAgXTtcbn1cbiJdfQ==