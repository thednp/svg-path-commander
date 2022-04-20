function cov_1z7i4mqgyh() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\shorthandToCubic.js";
  var hash = "eb8f5145e7bf23fa907e64f4ffb84ef4746678d0";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\shorthandToCubic.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 15,
          column: 17
        }
      }
    },
    fnMap: {
      "0": {
        name: "shorthandToCubic",
        decl: {
          start: {
            line: 12,
            column: 24
          },
          end: {
            line: 12,
            column: 40
          }
        },
        loc: {
          start: {
            line: 12,
            column: 70
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
            column: 16
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
            column: 16
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
    hash: "eb8f5145e7bf23fa907e64f4ffb84ef4746678d0"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1z7i4mqgyh = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1z7i4mqgyh();

/**
 * Returns the missing control point from an
 * S (shorthand cubic bezier) segment.
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} x2 curve end x
 * @param {number} y2 curve end y
 * @param {string} prevCommand the previous path command
 * @returns {{x1: number, y1: number}}} the missing control point
 */
export default function shorthandToCubic(x1, y1, x2, y2, prevCommand) {
  cov_1z7i4mqgyh().f[0]++;
  cov_1z7i4mqgyh().s[0]++;
  return 'CS'.includes(prevCommand) ? (cov_1z7i4mqgyh().b[0][0]++, {
    x1: x1 * 2 - x2,
    y1: y1 * 2 - y2
  }) : (cov_1z7i4mqgyh().b[0][1]++, {
    x1,
    y1
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3J0aGFuZFRvQ3ViaWMuanMiXSwibmFtZXMiOlsic2hvcnRoYW5kVG9DdWJpYyIsIngxIiwieTEiLCJ4MiIsInkyIiwicHJldkNvbW1hbmQiLCJpbmNsdWRlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7O0FBZlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsZ0JBQVQsQ0FBMEJDLEVBQTFCLEVBQThCQyxFQUE5QixFQUFrQ0MsRUFBbEMsRUFBc0NDLEVBQXRDLEVBQTBDQyxXQUExQyxFQUF1RDtBQUFBO0FBQUE7QUFDcEUsU0FBTyxLQUFLQyxRQUFMLENBQWNELFdBQWQsaUNBQ0g7QUFBRUosSUFBQUEsRUFBRSxFQUFFQSxFQUFFLEdBQUcsQ0FBTCxHQUFTRSxFQUFmO0FBQW1CRCxJQUFBQSxFQUFFLEVBQUVBLEVBQUUsR0FBRyxDQUFMLEdBQVNFO0FBQWhDLEdBREcsaUNBRUg7QUFBRUgsSUFBQUEsRUFBRjtBQUFNQyxJQUFBQTtBQUFOLEdBRkcsQ0FBUDtBQUdEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXR1cm5zIHRoZSBtaXNzaW5nIGNvbnRyb2wgcG9pbnQgZnJvbSBhblxuICogUyAoc2hvcnRoYW5kIGN1YmljIGJlemllcikgc2VnbWVudC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0geDEgY3VydmUgc3RhcnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IHkxIGN1cnZlIHN0YXJ0IHlcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiBjdXJ2ZSBlbmQgeFxuICogQHBhcmFtIHtudW1iZXJ9IHkyIGN1cnZlIGVuZCB5XG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldkNvbW1hbmQgdGhlIHByZXZpb3VzIHBhdGggY29tbWFuZFxuICogQHJldHVybnMge3t4MTogbnVtYmVyLCB5MTogbnVtYmVyfX19IHRoZSBtaXNzaW5nIGNvbnRyb2wgcG9pbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hvcnRoYW5kVG9DdWJpYyh4MSwgeTEsIHgyLCB5MiwgcHJldkNvbW1hbmQpIHtcbiAgcmV0dXJuICdDUycuaW5jbHVkZXMocHJldkNvbW1hbmQpXG4gICAgPyB7IHgxOiB4MSAqIDIgLSB4MiwgeTE6IHkxICogMiAtIHkyIH1cbiAgICA6IHsgeDEsIHkxIH07XG59XG4iXX0=