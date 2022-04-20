function cov_mu8b7ewoj() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\lineToCubic.js";
  var hash = "0fe018fd34bfc723f042ddb154853a09e796707f";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\lineToCubic.js",
    statementMap: {
      "0": {
        start: {
          line: 14,
          column: 12
        },
        end: {
          line: 14,
          column: 15
        }
      },
      "1": {
        start: {
          line: 16,
          column: 13
        },
        end: {
          line: 16,
          column: 21
        }
      },
      "2": {
        start: {
          line: 18,
          column: 13
        },
        end: {
          line: 18,
          column: 21
        }
      },
      "3": {
        start: {
          line: 19,
          column: 13
        },
        end: {
          line: 19,
          column: 32
        }
      },
      "4": {
        start: {
          line: 20,
          column: 13
        },
        end: {
          line: 20,
          column: 32
        }
      },
      "5": {
        start: {
          line: 21,
          column: 13
        },
        end: {
          line: 21,
          column: 32
        }
      },
      "6": {
        start: {
          line: 22,
          column: 13
        },
        end: {
          line: 22,
          column: 32
        }
      },
      "7": {
        start: {
          line: 23,
          column: 13
        },
        end: {
          line: 23,
          column: 32
        }
      },
      "8": {
        start: {
          line: 24,
          column: 15
        },
        end: {
          line: 24,
          column: 46
        }
      },
      "9": {
        start: {
          line: 26,
          column: 14
        },
        end: {
          line: 26,
          column: 41
        }
      },
      "10": {
        start: {
          line: 27,
          column: 15
        },
        end: {
          line: 27,
          column: 46
        }
      },
      "11": {
        start: {
          line: 29,
          column: 14
        },
        end: {
          line: 29,
          column: 41
        }
      },
      "12": {
        start: {
          line: 32,
          column: 2
        },
        end: {
          line: 32,
          column: 46
        }
      }
    },
    fnMap: {
      "0": {
        name: "lineToCubic",
        decl: {
          start: {
            line: 13,
            column: 24
          },
          end: {
            line: 13,
            column: 35
          }
        },
        loc: {
          start: {
            line: 13,
            column: 52
          },
          end: {
            line: 33,
            column: 1
          }
        },
        line: 13
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
      "11": 0,
      "12": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "0fe018fd34bfc723f042ddb154853a09e796707f"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_mu8b7ewoj = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_mu8b7ewoj();
import segmentLineFactory from '../util/segmentLineFactory';
import midPoint from '../math/midPoint';
/**
 * Converts an L (line-to) segment to C (cubic-bezier).
 *
 * @param {number} x1 line start x
 * @param {number} y1 line start y
 * @param {number} x2 line end x
 * @param {number} y2 line end y
 * @returns {number[]} the cubic-bezier segment
 */

export default function lineToCubic(x1, y1, x2, y2) {
  cov_mu8b7ewoj().f[0]++;
  const t = (cov_mu8b7ewoj().s[0]++, 0.5);
  /** @type {[number, number]} */

  const p0 = (cov_mu8b7ewoj().s[1]++, [x1, y1]);
  /** @type {[number, number]} */

  const p1 = (cov_mu8b7ewoj().s[2]++, [x2, y2]);
  const p2 = (cov_mu8b7ewoj().s[3]++, midPoint(p0, p1, t));
  const p3 = (cov_mu8b7ewoj().s[4]++, midPoint(p1, p2, t));
  const p4 = (cov_mu8b7ewoj().s[5]++, midPoint(p2, p3, t));
  const p5 = (cov_mu8b7ewoj().s[6]++, midPoint(p3, p4, t));
  const p6 = (cov_mu8b7ewoj().s[7]++, midPoint(p4, p5, t));
  const seg1 = (cov_mu8b7ewoj().s[8]++, [...p0, ...p2, ...p4, ...p6, t]); // @ts-ignore

  const cp1 = (cov_mu8b7ewoj().s[9]++, segmentLineFactory(...seg1));
  const seg2 = (cov_mu8b7ewoj().s[10]++, [...p6, ...p5, ...p3, ...p1, 0]); // @ts-ignore

  const cp2 = (cov_mu8b7ewoj().s[11]++, segmentLineFactory(...seg2)); // @ts-ignore

  cov_mu8b7ewoj().s[12]++;
  return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbmVUb0N1YmljLmpzIl0sIm5hbWVzIjpbInNlZ21lbnRMaW5lRmFjdG9yeSIsIm1pZFBvaW50IiwibGluZVRvQ3ViaWMiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInQiLCJwMCIsInAxIiwicDIiLCJwMyIsInA0IiwicDUiLCJwNiIsInNlZzEiLCJjcDEiLCJzZWcyIiwiY3AyIiwieCIsInkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0Esa0JBQVAsTUFBK0IsNEJBQS9CO0FBQ0EsT0FBT0MsUUFBUCxNQUFxQixrQkFBckI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUF5QkMsRUFBekIsRUFBNkJDLEVBQTdCLEVBQWlDQyxFQUFqQyxFQUFxQztBQUFBO0FBQ2xELFFBQU1DLENBQUMsNEJBQUcsR0FBSCxDQUFQO0FBQ0E7O0FBQ0EsUUFBTUMsRUFBRSw0QkFBRyxDQUFDTCxFQUFELEVBQUtDLEVBQUwsQ0FBSCxDQUFSO0FBQ0E7O0FBQ0EsUUFBTUssRUFBRSw0QkFBRyxDQUFDSixFQUFELEVBQUtDLEVBQUwsQ0FBSCxDQUFSO0FBQ0EsUUFBTUksRUFBRSw0QkFBR1QsUUFBUSxDQUFDTyxFQUFELEVBQUtDLEVBQUwsRUFBU0YsQ0FBVCxDQUFYLENBQVI7QUFDQSxRQUFNSSxFQUFFLDRCQUFHVixRQUFRLENBQUNRLEVBQUQsRUFBS0MsRUFBTCxFQUFTSCxDQUFULENBQVgsQ0FBUjtBQUNBLFFBQU1LLEVBQUUsNEJBQUdYLFFBQVEsQ0FBQ1MsRUFBRCxFQUFLQyxFQUFMLEVBQVNKLENBQVQsQ0FBWCxDQUFSO0FBQ0EsUUFBTU0sRUFBRSw0QkFBR1osUUFBUSxDQUFDVSxFQUFELEVBQUtDLEVBQUwsRUFBU0wsQ0FBVCxDQUFYLENBQVI7QUFDQSxRQUFNTyxFQUFFLDRCQUFHYixRQUFRLENBQUNXLEVBQUQsRUFBS0MsRUFBTCxFQUFTTixDQUFULENBQVgsQ0FBUjtBQUNBLFFBQU1RLElBQUksNEJBQUcsQ0FBQyxHQUFHUCxFQUFKLEVBQVEsR0FBR0UsRUFBWCxFQUFlLEdBQUdFLEVBQWxCLEVBQXNCLEdBQUdFLEVBQXpCLEVBQTZCUCxDQUE3QixDQUFILENBQVYsQ0FYa0QsQ0FZbEQ7O0FBQ0EsUUFBTVMsR0FBRyw0QkFBR2hCLGtCQUFrQixDQUFDLEdBQUdlLElBQUosQ0FBckIsQ0FBVDtBQUNBLFFBQU1FLElBQUksNkJBQUcsQ0FBQyxHQUFHSCxFQUFKLEVBQVEsR0FBR0QsRUFBWCxFQUFlLEdBQUdGLEVBQWxCLEVBQXNCLEdBQUdGLEVBQXpCLEVBQTZCLENBQTdCLENBQUgsQ0FBVixDQWRrRCxDQWVsRDs7QUFDQSxRQUFNUyxHQUFHLDZCQUFHbEIsa0JBQWtCLENBQUMsR0FBR2lCLElBQUosQ0FBckIsQ0FBVCxDQWhCa0QsQ0FrQmxEOztBQWxCa0Q7QUFtQmxELFNBQU8sQ0FBQ0QsR0FBRyxDQUFDRyxDQUFMLEVBQVFILEdBQUcsQ0FBQ0ksQ0FBWixFQUFlRixHQUFHLENBQUNDLENBQW5CLEVBQXNCRCxHQUFHLENBQUNFLENBQTFCLEVBQTZCZixFQUE3QixFQUFpQ0MsRUFBakMsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlZ21lbnRMaW5lRmFjdG9yeSBmcm9tICcuLi91dGlsL3NlZ21lbnRMaW5lRmFjdG9yeSc7XG5pbXBvcnQgbWlkUG9pbnQgZnJvbSAnLi4vbWF0aC9taWRQb2ludCc7XG5cbi8qKlxuICogQ29udmVydHMgYW4gTCAobGluZS10bykgc2VnbWVudCB0byBDIChjdWJpYy1iZXppZXIpLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSBsaW5lIHN0YXJ0IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSBsaW5lIHN0YXJ0IHlcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiBsaW5lIGVuZCB4XG4gKiBAcGFyYW0ge251bWJlcn0geTIgbGluZSBlbmQgeVxuICogQHJldHVybnMge251bWJlcltdfSB0aGUgY3ViaWMtYmV6aWVyIHNlZ21lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGluZVRvQ3ViaWMoeDEsIHkxLCB4MiwgeTIpIHtcbiAgY29uc3QgdCA9IDAuNTtcbiAgLyoqIEB0eXBlIHtbbnVtYmVyLCBudW1iZXJdfSAqL1xuICBjb25zdCBwMCA9IFt4MSwgeTFdO1xuICAvKiogQHR5cGUge1tudW1iZXIsIG51bWJlcl19ICovXG4gIGNvbnN0IHAxID0gW3gyLCB5Ml07XG4gIGNvbnN0IHAyID0gbWlkUG9pbnQocDAsIHAxLCB0KTtcbiAgY29uc3QgcDMgPSBtaWRQb2ludChwMSwgcDIsIHQpO1xuICBjb25zdCBwNCA9IG1pZFBvaW50KHAyLCBwMywgdCk7XG4gIGNvbnN0IHA1ID0gbWlkUG9pbnQocDMsIHA0LCB0KTtcbiAgY29uc3QgcDYgPSBtaWRQb2ludChwNCwgcDUsIHQpO1xuICBjb25zdCBzZWcxID0gWy4uLnAwLCAuLi5wMiwgLi4ucDQsIC4uLnA2LCB0XTtcbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBjcDEgPSBzZWdtZW50TGluZUZhY3RvcnkoLi4uc2VnMSk7XG4gIGNvbnN0IHNlZzIgPSBbLi4ucDYsIC4uLnA1LCAuLi5wMywgLi4ucDEsIDBdO1xuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IGNwMiA9IHNlZ21lbnRMaW5lRmFjdG9yeSguLi5zZWcyKTtcblxuICAvLyBAdHMtaWdub3JlXG4gIHJldHVybiBbY3AxLngsIGNwMS55LCBjcDIueCwgY3AyLnksIHgyLCB5Ml07XG59XG4iXX0=