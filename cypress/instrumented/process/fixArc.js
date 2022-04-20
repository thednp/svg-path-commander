function cov_27gkvqvheq() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\fixArc.js";
  var hash = "6f356ebcc15e4669af1cd3d450e02c84fb658499";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\fixArc.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 21,
          column: 3
        }
      },
      "1": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 20
        }
      },
      "2": {
        start: {
          line: 12,
          column: 20
        },
        end: {
          line: 12,
          column: 27
        }
      },
      "3": {
        start: {
          line: 13,
          column: 13
        },
        end: {
          line: 13,
          column: 14
        }
      },
      "4": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 19,
          column: 5
        }
      },
      "5": {
        start: {
          line: 16,
          column: 6
        },
        end: {
          line: 16,
          column: 31
        }
      },
      "6": {
        start: {
          line: 18,
          column: 6
        },
        end: {
          line: 18,
          column: 62
        }
      },
      "7": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 22
        }
      }
    },
    fnMap: {
      "0": {
        name: "fixArc",
        decl: {
          start: {
            line: 9,
            column: 24
          },
          end: {
            line: 9,
            column: 30
          }
        },
        loc: {
          start: {
            line: 9,
            column: 57
          },
          end: {
            line: 22,
            column: 1
          }
        },
        line: 9
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 21,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 21,
            column: 3
          }
        }, {
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 21,
            column: 3
          }
        }],
        line: 10
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
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "6f356ebcc15e4669af1cd3d450e02c84fb658499"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_27gkvqvheq = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_27gkvqvheq();

/**
 * Splits an extended A (arc-to) segment into two cubic-bezier segments.
 *
 * @param {SVGPath.pathArray} path the `pathArray` this segment belongs to
 * @param {string[]} allPathCommands all previous path commands
 * @param {number} i the segment index
 */
export default function fixArc(path, allPathCommands, i) {
  cov_27gkvqvheq().f[0]++;
  cov_27gkvqvheq().s[0]++;

  if (path[i].length > 7) {
    cov_27gkvqvheq().b[0][0]++;
    cov_27gkvqvheq().s[1]++;
    path[i].shift();
    const segment = (cov_27gkvqvheq().s[2]++, path[i]);
    let ni = (cov_27gkvqvheq().s[3]++, i); // ESLint

    cov_27gkvqvheq().s[4]++;

    while (segment.length) {
      cov_27gkvqvheq().s[5]++;
      // if created multiple C:s, their original seg is saved
      allPathCommands[i] = 'A'; // @ts-ignore

      cov_27gkvqvheq().s[6]++;
      path.splice(ni += 1, 0, ['C', ...segment.splice(0, 6)]);
    }

    cov_27gkvqvheq().s[7]++;
    path.splice(i, 1);
  } else {
    cov_27gkvqvheq().b[0][1]++;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpeEFyYy5qcyJdLCJuYW1lcyI6WyJmaXhBcmMiLCJwYXRoIiwiYWxsUGF0aENvbW1hbmRzIiwiaSIsImxlbmd0aCIsInNoaWZ0Iiwic2VnbWVudCIsIm5pIiwic3BsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7OztBQWZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsZUFBZSxTQUFTQSxNQUFULENBQWdCQyxJQUFoQixFQUFzQkMsZUFBdEIsRUFBdUNDLENBQXZDLEVBQTBDO0FBQUE7QUFBQTs7QUFDdkQsTUFBSUYsSUFBSSxDQUFDRSxDQUFELENBQUosQ0FBUUMsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUFBO0FBQUE7QUFDdEJILElBQUFBLElBQUksQ0FBQ0UsQ0FBRCxDQUFKLENBQVFFLEtBQVI7QUFDQSxVQUFNQyxPQUFPLDZCQUFHTCxJQUFJLENBQUNFLENBQUQsQ0FBUCxDQUFiO0FBQ0EsUUFBSUksRUFBRSw2QkFBR0osQ0FBSCxDQUFOLENBSHNCLENBR1Y7O0FBSFU7O0FBSXRCLFdBQU9HLE9BQU8sQ0FBQ0YsTUFBZixFQUF1QjtBQUFBO0FBQ3JCO0FBQ0FGLE1BQUFBLGVBQWUsQ0FBQ0MsQ0FBRCxDQUFmLEdBQXFCLEdBQXJCLENBRnFCLENBR3JCOztBQUhxQjtBQUlyQkYsTUFBQUEsSUFBSSxDQUFDTyxNQUFMLENBQVlELEVBQUUsSUFBSSxDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUFDLEdBQUQsRUFBTSxHQUFHRCxPQUFPLENBQUNFLE1BQVIsQ0FBZSxDQUFmLEVBQWtCLENBQWxCLENBQVQsQ0FBeEI7QUFDRDs7QUFUcUI7QUFVdEJQLElBQUFBLElBQUksQ0FBQ08sTUFBTCxDQUFZTCxDQUFaLEVBQWUsQ0FBZjtBQUNELEdBWEQ7QUFBQTtBQUFBO0FBWUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNwbGl0cyBhbiBleHRlbmRlZCBBIChhcmMtdG8pIHNlZ21lbnQgaW50byB0d28gY3ViaWMtYmV6aWVyIHNlZ21lbnRzLlxuICpcbiAqIEBwYXJhbSB7U1ZHUGF0aC5wYXRoQXJyYXl9IHBhdGggdGhlIGBwYXRoQXJyYXlgIHRoaXMgc2VnbWVudCBiZWxvbmdzIHRvXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhbGxQYXRoQ29tbWFuZHMgYWxsIHByZXZpb3VzIHBhdGggY29tbWFuZHNcbiAqIEBwYXJhbSB7bnVtYmVyfSBpIHRoZSBzZWdtZW50IGluZGV4XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZml4QXJjKHBhdGgsIGFsbFBhdGhDb21tYW5kcywgaSkge1xuICBpZiAocGF0aFtpXS5sZW5ndGggPiA3KSB7XG4gICAgcGF0aFtpXS5zaGlmdCgpO1xuICAgIGNvbnN0IHNlZ21lbnQgPSBwYXRoW2ldO1xuICAgIGxldCBuaSA9IGk7IC8vIEVTTGludFxuICAgIHdoaWxlIChzZWdtZW50Lmxlbmd0aCkge1xuICAgICAgLy8gaWYgY3JlYXRlZCBtdWx0aXBsZSBDOnMsIHRoZWlyIG9yaWdpbmFsIHNlZyBpcyBzYXZlZFxuICAgICAgYWxsUGF0aENvbW1hbmRzW2ldID0gJ0EnO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcGF0aC5zcGxpY2UobmkgKz0gMSwgMCwgWydDJywgLi4uc2VnbWVudC5zcGxpY2UoMCwgNildKTtcbiAgICB9XG4gICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gIH1cbn1cbiJdfQ==