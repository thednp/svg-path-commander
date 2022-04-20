function cov_29n5pehdl5() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\shorthandToQuad.js";
  var hash = "daf2406af4313a63e95da1b9811416ad473d195b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\shorthandToQuad.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 15,
          column: 25
        }
      }
    },
    fnMap: {
      "0": {
        name: "shorthandToQuad",
        decl: {
          start: {
            line: 12,
            column: 24
          },
          end: {
            line: 12,
            column: 39
          }
        },
        loc: {
          start: {
            line: 12,
            column: 69
          },
          end: {
            line: 16,
            column: 1
          }
        },
        line: 12
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
            line: 15,
            column: 24
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 14,
            column: 6
          },
          end: {
            line: 14,
            column: 42
          }
        }, {
          start: {
            line: 15,
            column: 6
          },
          end: {
            line: 15,
            column: 24
          }
        }],
        line: 13
      }
    },
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "daf2406af4313a63e95da1b9811416ad473d195b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_29n5pehdl5 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_29n5pehdl5();

/**
 * Returns the missing control point from an
 * T (shorthand quadratic bezier) segment.
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} qx control point x
 * @param {number} qy control point y
 * @param {string} prevCommand the previous path command
 * @returns {{qx: number, qy: number}}} the missing control point
 */
export default function shorthandToQuad(x1, y1, qx, qy, prevCommand) {
  cov_29n5pehdl5().f[0]++;
  cov_29n5pehdl5().s[0]++;
  return 'QT'.includes(prevCommand) ? (cov_29n5pehdl5().b[0][0]++, {
    qx: x1 * 2 - qx,
    qy: y1 * 2 - qy
  }) : (cov_29n5pehdl5().b[0][1]++, {
    qx: x1,
    qy: y1
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3J0aGFuZFRvUXVhZC5qcyJdLCJuYW1lcyI6WyJzaG9ydGhhbmRUb1F1YWQiLCJ4MSIsInkxIiwicXgiLCJxeSIsInByZXZDb21tYW5kIiwiaW5jbHVkZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7OztBQWZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVNBLGVBQVQsQ0FBeUJDLEVBQXpCLEVBQTZCQyxFQUE3QixFQUFpQ0MsRUFBakMsRUFBcUNDLEVBQXJDLEVBQXlDQyxXQUF6QyxFQUFzRDtBQUFBO0FBQUE7QUFDbkUsU0FBTyxLQUFLQyxRQUFMLENBQWNELFdBQWQsaUNBQ0g7QUFBRUYsSUFBQUEsRUFBRSxFQUFFRixFQUFFLEdBQUcsQ0FBTCxHQUFTRSxFQUFmO0FBQW1CQyxJQUFBQSxFQUFFLEVBQUVGLEVBQUUsR0FBRyxDQUFMLEdBQVNFO0FBQWhDLEdBREcsaUNBRUg7QUFBRUQsSUFBQUEsRUFBRSxFQUFFRixFQUFOO0FBQVVHLElBQUFBLEVBQUUsRUFBRUY7QUFBZCxHQUZHLENBQVA7QUFHRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJucyB0aGUgbWlzc2luZyBjb250cm9sIHBvaW50IGZyb20gYW5cbiAqIFQgKHNob3J0aGFuZCBxdWFkcmF0aWMgYmV6aWVyKSBzZWdtZW50LlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSBjdXJ2ZSBzdGFydCB4XG4gKiBAcGFyYW0ge251bWJlcn0geTEgY3VydmUgc3RhcnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IHF4IGNvbnRyb2wgcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IHF5IGNvbnRyb2wgcG9pbnQgeVxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZDb21tYW5kIHRoZSBwcmV2aW91cyBwYXRoIGNvbW1hbmRcbiAqIEByZXR1cm5zIHt7cXg6IG51bWJlciwgcXk6IG51bWJlcn19fSB0aGUgbWlzc2luZyBjb250cm9sIHBvaW50XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNob3J0aGFuZFRvUXVhZCh4MSwgeTEsIHF4LCBxeSwgcHJldkNvbW1hbmQpIHtcbiAgcmV0dXJuICdRVCcuaW5jbHVkZXMocHJldkNvbW1hbmQpXG4gICAgPyB7IHF4OiB4MSAqIDIgLSBxeCwgcXk6IHkxICogMiAtIHF5IH1cbiAgICA6IHsgcXg6IHgxLCBxeTogeTEgfTtcbn1cbiJdfQ==