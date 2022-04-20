function cov_2q5dbtcal() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPathArea.js";
  var hash = "66de2d103724bdf0721d95977971b852f77ea07b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPathArea.js",
    statementMap: {
      "0": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 21,
          column: 66
        }
      },
      "1": {
        start: {
          line: 34,
          column: 10
        },
        end: {
          line: 34,
          column: 11
        }
      },
      "2": {
        start: {
          line: 34,
          column: 21
        },
        end: {
          line: 34,
          column: 22
        }
      },
      "3": {
        start: {
          line: 34,
          column: 34
        },
        end: {
          line: 34,
          column: 35
        }
      },
      "4": {
        start: {
          line: 36,
          column: 2
        },
        end: {
          line: 48,
          column: 32
        }
      },
      "5": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 47,
          column: 5
        }
      },
      "6": {
        start: {
          line: 39,
          column: 8
        },
        end: {
          line: 39,
          column: 23
        }
      },
      "7": {
        start: {
          line: 40,
          column: 8
        },
        end: {
          line: 40,
          column: 17
        }
      },
      "8": {
        start: {
          line: 43,
          column: 8
        },
        end: {
          line: 43,
          column: 53
        }
      },
      "9": {
        start: {
          line: 45,
          column: 8
        },
        end: {
          line: 45,
          column: 31
        }
      },
      "10": {
        start: {
          line: 46,
          column: 8
        },
        end: {
          line: 46,
          column: 19
        }
      },
      "11": {
        start: {
          line: 48,
          column: 22
        },
        end: {
          line: 48,
          column: 27
        }
      }
    },
    fnMap: {
      "0": {
        name: "getCubicSegArea",
        decl: {
          start: {
            line: 18,
            column: 9
          },
          end: {
            line: 18,
            column: 24
          }
        },
        loc: {
          start: {
            line: 18,
            column: 61
          },
          end: {
            line: 22,
            column: 1
          }
        },
        line: 18
      },
      "1": {
        name: "getPathArea",
        decl: {
          start: {
            line: 33,
            column: 24
          },
          end: {
            line: 33,
            column: 35
          }
        },
        loc: {
          start: {
            line: 33,
            column: 42
          },
          end: {
            line: 49,
            column: 1
          }
        },
        line: 33
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 36,
            column: 31
          },
          end: {
            line: 36,
            column: 32
          }
        },
        loc: {
          start: {
            line: 36,
            column: 40
          },
          end: {
            line: 48,
            column: 3
          }
        },
        line: 36
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 48,
            column: 12
          },
          end: {
            line: 48,
            column: 13
          }
        },
        loc: {
          start: {
            line: 48,
            column: 22
          },
          end: {
            line: 48,
            column: 27
          }
        },
        line: 48
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 47,
            column: 5
          }
        },
        type: "switch",
        locations: [{
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 40,
            column: 17
          }
        }, {
          start: {
            line: 41,
            column: 6
          },
          end: {
            line: 46,
            column: 19
          }
        }],
        line: 37
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
      "9": 0,
      "10": 0,
      "11": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "66de2d103724bdf0721d95977971b852f77ea07b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2q5dbtcal = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2q5dbtcal();
import pathToCurve from '../convert/pathToCurve';
/**
 * Returns the area of a single cubic-bezier segment.
 *
 * http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @returns {number} the area of the cubic-bezier segment
 */

function getCubicSegArea(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
  cov_2q5dbtcal().f[0]++;
  cov_2q5dbtcal().s[0]++;
  return 3 * ((y2 - y1) * (c1x + c2x) - (x2 - x1) * (c1y + c2y) + c1y * (x1 - c2x) - c1x * (y1 - c2y) + y2 * (c2x + x1 / 3) - x2 * (c2y + y1 / 3)) / 20;
}
/**
 * Returns the area of a shape.
 * @author Jürg Lehni & Jonathan Puckey
 *
 * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
 *
 * @param {SVGPath.pathArray} path the shape `pathArray`
 * @returns {number} the length of the cubic-bezier segment
 */


export default function getPathArea(path) {
  cov_2q5dbtcal().f[1]++;
  let x = (cov_2q5dbtcal().s[1]++, 0);
  let y = (cov_2q5dbtcal().s[2]++, 0);
  let len = (cov_2q5dbtcal().s[3]++, 0);
  cov_2q5dbtcal().s[4]++;
  return pathToCurve(path).map(seg => {
    cov_2q5dbtcal().f[2]++;
    cov_2q5dbtcal().s[5]++;

    switch (seg[0]) {
      case 'M':
        cov_2q5dbtcal().b[0][0]++;
        cov_2q5dbtcal().s[6]++;
        [, x, y] = seg;
        cov_2q5dbtcal().s[7]++;
        return 0;

      default:
        cov_2q5dbtcal().b[0][1]++;
        cov_2q5dbtcal().s[8]++;
        // @ts-ignore -- the utility will have proper amount of params
        len = getCubicSegArea(x, y, ...seg.slice(1)); // @ts-ignore -- the segment always has numbers

        cov_2q5dbtcal().s[9]++;
        [x, y] = seg.slice(-2);
        cov_2q5dbtcal().s[10]++;
        return len;
    }
  }).reduce((a, b) => {
    cov_2q5dbtcal().f[3]++;
    cov_2q5dbtcal().s[11]++;
    return a + b;
  }, 0);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFBhdGhBcmVhLmpzIl0sIm5hbWVzIjpbInBhdGhUb0N1cnZlIiwiZ2V0Q3ViaWNTZWdBcmVhIiwieDEiLCJ5MSIsImMxeCIsImMxeSIsImMyeCIsImMyeSIsIngyIiwieTIiLCJnZXRQYXRoQXJlYSIsInBhdGgiLCJ4IiwieSIsImxlbiIsIm1hcCIsInNlZyIsInNsaWNlIiwicmVkdWNlIiwiYSIsImIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFdBQVAsTUFBd0Isd0JBQXhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVNDLGVBQVQsQ0FBeUJDLEVBQXpCLEVBQTZCQyxFQUE3QixFQUFpQ0MsR0FBakMsRUFBc0NDLEdBQXRDLEVBQTJDQyxHQUEzQyxFQUFnREMsR0FBaEQsRUFBcURDLEVBQXJELEVBQXlEQyxFQUF6RCxFQUE2RDtBQUFBO0FBQUE7QUFDM0QsU0FBUSxLQUFLLENBQUNBLEVBQUUsR0FBR04sRUFBTixLQUFhQyxHQUFHLEdBQUdFLEdBQW5CLElBQTBCLENBQUNFLEVBQUUsR0FBR04sRUFBTixLQUFhRyxHQUFHLEdBQUdFLEdBQW5CLENBQTFCLEdBQ0RGLEdBQUcsSUFBSUgsRUFBRSxHQUFHSSxHQUFULENBREYsR0FDb0JGLEdBQUcsSUFBSUQsRUFBRSxHQUFHSSxHQUFULENBRHZCLEdBRURFLEVBQUUsSUFBSUgsR0FBRyxHQUFHSixFQUFFLEdBQUcsQ0FBZixDQUZELEdBRXVCTSxFQUFFLElBQUlELEdBQUcsR0FBR0osRUFBRSxHQUFHLENBQWYsQ0FGOUIsQ0FBRCxHQUVzRCxFQUY3RDtBQUdEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxlQUFlLFNBQVNPLFdBQVQsQ0FBcUJDLElBQXJCLEVBQTJCO0FBQUE7QUFDeEMsTUFBSUMsQ0FBQyw0QkFBRyxDQUFILENBQUw7QUFBVyxNQUFJQyxDQUFDLDRCQUFHLENBQUgsQ0FBTDtBQUFXLE1BQUlDLEdBQUcsNEJBQUcsQ0FBSCxDQUFQO0FBRGtCO0FBR3hDLFNBQU9kLFdBQVcsQ0FBQ1csSUFBRCxDQUFYLENBQWtCSSxHQUFsQixDQUF1QkMsR0FBRCxJQUFTO0FBQUE7QUFBQTs7QUFDcEMsWUFBUUEsR0FBRyxDQUFDLENBQUQsQ0FBWDtBQUNFLFdBQUssR0FBTDtBQUFBO0FBQUE7QUFDRSxXQUFHSixDQUFILEVBQU1DLENBQU4sSUFBV0csR0FBWDtBQURGO0FBRUUsZUFBTyxDQUFQOztBQUNGO0FBQUE7QUFBQTtBQUNFO0FBQ0FGLFFBQUFBLEdBQUcsR0FBR2IsZUFBZSxDQUFDVyxDQUFELEVBQUlDLENBQUosRUFBTyxHQUFHRyxHQUFHLENBQUNDLEtBQUosQ0FBVSxDQUFWLENBQVYsQ0FBckIsQ0FGRixDQUdFOztBQUhGO0FBSUUsU0FBQ0wsQ0FBRCxFQUFJQyxDQUFKLElBQVNHLEdBQUcsQ0FBQ0MsS0FBSixDQUFVLENBQUMsQ0FBWCxDQUFUO0FBSkY7QUFLRSxlQUFPSCxHQUFQO0FBVEo7QUFXRCxHQVpNLEVBWUpJLE1BWkksQ0FZRyxDQUFDQyxDQUFELEVBQUlDLENBQUosS0FBVTtBQUFBO0FBQUE7QUFBQSxXQUFBRCxDQUFDLEdBQUdDLENBQUo7QUFBSyxHQVpsQixFQVlvQixDQVpwQixDQUFQO0FBYUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aFRvQ3VydmUgZnJvbSAnLi4vY29udmVydC9wYXRoVG9DdXJ2ZSc7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYXJlYSBvZiBhIHNpbmdsZSBjdWJpYy1iZXppZXIgc2VnbWVudC5cbiAqXG4gKiBodHRwOi8vb2JqZWN0bWl4LmNvbS9ncmFwaGljcy8xMzM1NTMtYXJlYS1jbG9zZWQtYmV6aWVyLWN1cnZlLmh0bWxcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0geDEgdGhlIHN0YXJ0aW5nIHBvaW50IFhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSB0aGUgc3RhcnRpbmcgcG9pbnQgWVxuICogQHBhcmFtIHtudW1iZXJ9IGMxeCB0aGUgZmlyc3QgY29udHJvbCBwb2ludCBYXG4gKiBAcGFyYW0ge251bWJlcn0gYzF5IHRoZSBmaXJzdCBjb250cm9sIHBvaW50IFlcbiAqIEBwYXJhbSB7bnVtYmVyfSBjMnggdGhlIHNlY29uZCBjb250cm9sIHBvaW50IFhcbiAqIEBwYXJhbSB7bnVtYmVyfSBjMnkgdGhlIHNlY29uZCBjb250cm9sIHBvaW50IFlcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiB0aGUgZW5kaW5nIHBvaW50IFhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MiB0aGUgZW5kaW5nIHBvaW50IFlcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBhcmVhIG9mIHRoZSBjdWJpYy1iZXppZXIgc2VnbWVudFxuICovXG5mdW5jdGlvbiBnZXRDdWJpY1NlZ0FyZWEoeDEsIHkxLCBjMXgsIGMxeSwgYzJ4LCBjMnksIHgyLCB5Mikge1xuICByZXR1cm4gKDMgKiAoKHkyIC0geTEpICogKGMxeCArIGMyeCkgLSAoeDIgLSB4MSkgKiAoYzF5ICsgYzJ5KVxuICAgICAgICAgICArIChjMXkgKiAoeDEgLSBjMngpKSAtIChjMXggKiAoeTEgLSBjMnkpKVxuICAgICAgICAgICArICh5MiAqIChjMnggKyB4MSAvIDMpKSAtICh4MiAqIChjMnkgKyB5MSAvIDMpKSkpIC8gMjA7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYXJlYSBvZiBhIHNoYXBlLlxuICogQGF1dGhvciBKw7xyZyBMZWhuaSAmIEpvbmF0aGFuIFB1Y2tleVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3BhcGVyanMvcGFwZXIuanMvYmxvYi9kZXZlbG9wL3NyYy9wYXRoL1BhdGguanNcbiAqXG4gKiBAcGFyYW0ge1NWR1BhdGgucGF0aEFycmF5fSBwYXRoIHRoZSBzaGFwZSBgcGF0aEFycmF5YFxuICogQHJldHVybnMge251bWJlcn0gdGhlIGxlbmd0aCBvZiB0aGUgY3ViaWMtYmV6aWVyIHNlZ21lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UGF0aEFyZWEocGF0aCkge1xuICBsZXQgeCA9IDA7IGxldCB5ID0gMDsgbGV0IGxlbiA9IDA7XG5cbiAgcmV0dXJuIHBhdGhUb0N1cnZlKHBhdGgpLm1hcCgoc2VnKSA9PiB7XG4gICAgc3dpdGNoIChzZWdbMF0pIHtcbiAgICAgIGNhc2UgJ00nOlxuICAgICAgICBbLCB4LCB5XSA9IHNlZztcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBAdHMtaWdub3JlIC0tIHRoZSB1dGlsaXR5IHdpbGwgaGF2ZSBwcm9wZXIgYW1vdW50IG9mIHBhcmFtc1xuICAgICAgICBsZW4gPSBnZXRDdWJpY1NlZ0FyZWEoeCwgeSwgLi4uc2VnLnNsaWNlKDEpKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAtLSB0aGUgc2VnbWVudCBhbHdheXMgaGFzIG51bWJlcnNcbiAgICAgICAgW3gsIHldID0gc2VnLnNsaWNlKC0yKTtcbiAgICAgICAgcmV0dXJuIGxlbjtcbiAgICB9XG4gIH0pLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xufVxuIl19