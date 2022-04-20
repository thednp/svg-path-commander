function cov_1rtbrvvcfj() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\distanceSquareRoot.js";
  var hash = "dbd0f000e37112f5cb05a348bf9f3fe3ef8608bc";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\distanceSquareRoot.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 13,
          column: 4
        }
      }
    },
    fnMap: {
      "0": {
        name: "distanceSquareRoot",
        decl: {
          start: {
            line: 9,
            column: 24
          },
          end: {
            line: 9,
            column: 42
          }
        },
        loc: {
          start: {
            line: 9,
            column: 49
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 9
      }
    },
    branchMap: {},
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "dbd0f000e37112f5cb05a348bf9f3fe3ef8608bc"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1rtbrvvcfj = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1rtbrvvcfj();

/**
 * Returns the square root of the distance
 * between two given points.
 *
 * @param {[number, number]} a the first point coordinates
 * @param {[number, number]} b the second point coordinates
 * @returns {number} the distance value
 */
export default function distanceSquareRoot(a, b) {
  cov_1rtbrvvcfj().f[0]++;
  cov_1rtbrvvcfj().s[0]++;
  return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3RhbmNlU3F1YXJlUm9vdC5qcyJdLCJuYW1lcyI6WyJkaXN0YW5jZVNxdWFyZVJvb3QiLCJhIiwiYiIsIk1hdGgiLCJzcXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7Ozs7QUFmWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTQSxrQkFBVCxDQUE0QkMsQ0FBNUIsRUFBK0JDLENBQS9CLEVBQWtDO0FBQUE7QUFBQTtBQUMvQyxTQUFPQyxJQUFJLENBQUNDLElBQUwsQ0FDTCxDQUFDSCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9DLENBQUMsQ0FBQyxDQUFELENBQVQsS0FBaUJELENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT0MsQ0FBQyxDQUFDLENBQUQsQ0FBekIsSUFDRSxDQUFDRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9DLENBQUMsQ0FBQyxDQUFELENBQVQsS0FBaUJELENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT0MsQ0FBQyxDQUFDLENBQUQsQ0FBekIsQ0FGRyxDQUFQO0FBSUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJldHVybnMgdGhlIHNxdWFyZSByb290IG9mIHRoZSBkaXN0YW5jZVxuICogYmV0d2VlbiB0d28gZ2l2ZW4gcG9pbnRzLlxuICpcbiAqIEBwYXJhbSB7W251bWJlciwgbnVtYmVyXX0gYSB0aGUgZmlyc3QgcG9pbnQgY29vcmRpbmF0ZXNcbiAqIEBwYXJhbSB7W251bWJlciwgbnVtYmVyXX0gYiB0aGUgc2Vjb25kIHBvaW50IGNvb3JkaW5hdGVzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZGlzdGFuY2UgdmFsdWVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlzdGFuY2VTcXVhcmVSb290KGEsIGIpIHtcbiAgcmV0dXJuIE1hdGguc3FydChcbiAgICAoYVswXSAtIGJbMF0pICogKGFbMF0gLSBiWzBdKVxuICAgICsgKGFbMV0gLSBiWzFdKSAqIChhWzFdIC0gYlsxXSksXG4gICk7XG59XG4iXX0=