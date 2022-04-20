function cov_y9gr3lstt() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\segmentLineFactory.js";
  var hash = "1f7789a6cabc2bcf00c44d636ccd775ddb569605";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\segmentLineFactory.js",
    statementMap: {
      "0": {
        start: {
          line: 16,
          column: 17
        },
        end: {
          line: 16,
          column: 55
        }
      },
      "1": {
        start: {
          line: 17,
          column: 17
        },
        end: {
          line: 17,
          column: 22
        }
      },
      "2": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 28,
          column: 3
        }
      },
      "3": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 22,
          column: 5
        }
      },
      "4": {
        start: {
          line: 21,
          column: 6
        },
        end: {
          line: 21,
          column: 30
        }
      },
      "5": {
        start: {
          line: 23,
          column: 4
        },
        end: {
          line: 25,
          column: 5
        }
      },
      "6": {
        start: {
          line: 24,
          column: 6
        },
        end: {
          line: 24,
          column: 30
        }
      },
      "7": {
        start: {
          line: 26,
          column: 19
        },
        end: {
          line: 26,
          column: 66
        }
      },
      "8": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 20
        }
      },
      "9": {
        start: {
          line: 29,
          column: 2
        },
        end: {
          line: 29,
          column: 16
        }
      }
    },
    fnMap: {
      "0": {
        name: "segmentLineFactory",
        decl: {
          start: {
            line: 15,
            column: 24
          },
          end: {
            line: 15,
            column: 42
          }
        },
        loc: {
          start: {
            line: 15,
            column: 69
          },
          end: {
            line: 30,
            column: 1
          }
        },
        line: 15
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 28,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 28,
            column: 3
          }
        }, {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 28,
            column: 3
          }
        }],
        line: 19
      },
      "1": {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        }],
        line: 20
      },
      "2": {
        loc: {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 25,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 25,
            column: 5
          }
        }, {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 25,
            column: 5
          }
        }],
        line: 23
      }
    },
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
      "9": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "1f7789a6cabc2bcf00c44d636ccd775ddb569605"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_y9gr3lstt = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_y9gr3lstt();
import midPoint from '../math/midPoint';
import distanceSquareRoot from '../math/distanceSquareRoot';
/**
 * Returns the length of a line (L,V,H,Z) segment
 * or a point at a given length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the distance to point
 * @returns {{x: number, y: number} | number} the segment length or point
 */

export default function segmentLineFactory(x1, y1, x2, y2, distance) {
  cov_y9gr3lstt().f[0]++;
  const length = (cov_y9gr3lstt().s[0]++, distanceSquareRoot([x1, y1], [x2, y2]));
  const margin = (cov_y9gr3lstt().s[1]++, 0.001);
  cov_y9gr3lstt().s[2]++;

  if (typeof distance === 'number') {
    cov_y9gr3lstt().b[0][0]++;
    cov_y9gr3lstt().s[3]++;

    if (distance < margin) {
      cov_y9gr3lstt().b[1][0]++;
      cov_y9gr3lstt().s[4]++;
      return {
        x: x1,
        y: y1
      };
    } else {
      cov_y9gr3lstt().b[1][1]++;
    }

    cov_y9gr3lstt().s[5]++;

    if (distance > length) {
      cov_y9gr3lstt().b[2][0]++;
      cov_y9gr3lstt().s[6]++;
      return {
        x: x2,
        y: y2
      };
    } else {
      cov_y9gr3lstt().b[2][1]++;
    }

    const [x, y] = (cov_y9gr3lstt().s[7]++, midPoint([x1, y1], [x2, y2], distance / length));
    cov_y9gr3lstt().s[8]++;
    return {
      x,
      y
    };
  } else {
    cov_y9gr3lstt().b[0][1]++;
  }

  cov_y9gr3lstt().s[9]++;
  return length;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlZ21lbnRMaW5lRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJtaWRQb2ludCIsImRpc3RhbmNlU3F1YXJlUm9vdCIsInNlZ21lbnRMaW5lRmFjdG9yeSIsIngxIiwieTEiLCJ4MiIsInkyIiwiZGlzdGFuY2UiLCJsZW5ndGgiLCJtYXJnaW4iLCJ4IiwieSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFFBQVAsTUFBcUIsa0JBQXJCO0FBQ0EsT0FBT0Msa0JBQVAsTUFBK0IsNEJBQS9CO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFlLFNBQVNDLGtCQUFULENBQTRCQyxFQUE1QixFQUFnQ0MsRUFBaEMsRUFBb0NDLEVBQXBDLEVBQXdDQyxFQUF4QyxFQUE0Q0MsUUFBNUMsRUFBc0Q7QUFBQTtBQUNuRSxRQUFNQyxNQUFNLDRCQUFHUCxrQkFBa0IsQ0FBQyxDQUFDRSxFQUFELEVBQUtDLEVBQUwsQ0FBRCxFQUFXLENBQUNDLEVBQUQsRUFBS0MsRUFBTCxDQUFYLENBQXJCLENBQVo7QUFDQSxRQUFNRyxNQUFNLDRCQUFHLEtBQUgsQ0FBWjtBQUZtRTs7QUFJbkUsTUFBSSxPQUFPRixRQUFQLEtBQW9CLFFBQXhCLEVBQWtDO0FBQUE7QUFBQTs7QUFDaEMsUUFBSUEsUUFBUSxHQUFHRSxNQUFmLEVBQXVCO0FBQUE7QUFBQTtBQUNyQixhQUFPO0FBQUVDLFFBQUFBLENBQUMsRUFBRVAsRUFBTDtBQUFTUSxRQUFBQSxDQUFDLEVBQUVQO0FBQVosT0FBUDtBQUNELEtBRkQ7QUFBQTtBQUFBOztBQURnQzs7QUFJaEMsUUFBSUcsUUFBUSxHQUFHQyxNQUFmLEVBQXVCO0FBQUE7QUFBQTtBQUNyQixhQUFPO0FBQUVFLFFBQUFBLENBQUMsRUFBRUwsRUFBTDtBQUFTTSxRQUFBQSxDQUFDLEVBQUVMO0FBQVosT0FBUDtBQUNELEtBRkQ7QUFBQTtBQUFBOztBQUdBLFVBQU0sQ0FBQ0ksQ0FBRCxFQUFJQyxDQUFKLDZCQUFTWCxRQUFRLENBQUMsQ0FBQ0csRUFBRCxFQUFLQyxFQUFMLENBQUQsRUFBVyxDQUFDQyxFQUFELEVBQUtDLEVBQUwsQ0FBWCxFQUFxQkMsUUFBUSxHQUFHQyxNQUFoQyxDQUFqQixDQUFOO0FBUGdDO0FBUWhDLFdBQU87QUFBRUUsTUFBQUEsQ0FBRjtBQUFLQyxNQUFBQTtBQUFMLEtBQVA7QUFDRCxHQVREO0FBQUE7QUFBQTs7QUFKbUU7QUFjbkUsU0FBT0gsTUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1pZFBvaW50IGZyb20gJy4uL21hdGgvbWlkUG9pbnQnO1xuaW1wb3J0IGRpc3RhbmNlU3F1YXJlUm9vdCBmcm9tICcuLi9tYXRoL2Rpc3RhbmNlU3F1YXJlUm9vdCc7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIGEgbGluZSAoTCxWLEgsWikgc2VnbWVudFxuICogb3IgYSBwb2ludCBhdCBhIGdpdmVuIGxlbmd0aC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0geDEgdGhlIHN0YXJ0aW5nIHBvaW50IFhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSB0aGUgc3RhcnRpbmcgcG9pbnQgWVxuICogQHBhcmFtIHtudW1iZXJ9IHgyIHRoZSBlbmRpbmcgcG9pbnQgWFxuICogQHBhcmFtIHtudW1iZXJ9IHkyIHRoZSBlbmRpbmcgcG9pbnQgWVxuICogQHBhcmFtIHtudW1iZXI9fSBkaXN0YW5jZSB0aGUgZGlzdGFuY2UgdG8gcG9pbnRcbiAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVtYmVyfSB0aGUgc2VnbWVudCBsZW5ndGggb3IgcG9pbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2VnbWVudExpbmVGYWN0b3J5KHgxLCB5MSwgeDIsIHkyLCBkaXN0YW5jZSkge1xuICBjb25zdCBsZW5ndGggPSBkaXN0YW5jZVNxdWFyZVJvb3QoW3gxLCB5MV0sIFt4MiwgeTJdKTtcbiAgY29uc3QgbWFyZ2luID0gMC4wMDE7XG5cbiAgaWYgKHR5cGVvZiBkaXN0YW5jZSA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAoZGlzdGFuY2UgPCBtYXJnaW4pIHtcbiAgICAgIHJldHVybiB7IHg6IHgxLCB5OiB5MSB9O1xuICAgIH1cbiAgICBpZiAoZGlzdGFuY2UgPiBsZW5ndGgpIHtcbiAgICAgIHJldHVybiB7IHg6IHgyLCB5OiB5MiB9O1xuICAgIH1cbiAgICBjb25zdCBbeCwgeV0gPSBtaWRQb2ludChbeDEsIHkxXSwgW3gyLCB5Ml0sIGRpc3RhbmNlIC8gbGVuZ3RoKTtcbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cbiAgcmV0dXJuIGxlbmd0aDtcbn1cbiJdfQ==