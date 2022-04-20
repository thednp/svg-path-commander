function cov_jnx22gtfd() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getSegmentAtLength.js";
  var hash = "47ff77712c1798fb70d70f1efa7dbb7c6aa4880a";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getSegmentAtLength.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 16
        },
        end: {
          line: 10,
          column: 58
        }
      },
      "1": {
        start: {
          line: 11,
          column: 22
        },
        end: {
          line: 11,
          column: 78
        }
      },
      "2": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 17
        }
      }
    },
    fnMap: {
      "0": {
        name: "getSegmentAtLength",
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
            column: 64
          },
          end: {
            line: 13,
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
            line: 11,
            column: 22
          },
          end: {
            line: 11,
            column: 78
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 11,
            column: 53
          },
          end: {
            line: 11,
            column: 58
          }
        }, {
          start: {
            line: 11,
            column: 61
          },
          end: {
            line: 11,
            column: 78
          }
        }],
        line: 11
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "47ff77712c1798fb70d70f1efa7dbb7c6aa4880a"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_jnx22gtfd = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_jnx22gtfd();
import getPropertiesAtLength from './getPropertiesAtLength';
/**
 * Returns the segment at a given length.
 * @param {string | SVGPath.pathArray} pathInput the target `pathArray`
 * @param {number} distance the distance in path to look at
 * @returns {SVGPath.pathSegment?} the requested segment
 */

export default function getSegmentAtLength(pathInput, distance) {
  cov_jnx22gtfd().f[0]++;
  const props = (cov_jnx22gtfd().s[0]++, getPropertiesAtLength(pathInput, distance));
  const {
    segment
  } = (cov_jnx22gtfd().s[1]++, typeof props !== 'undefined' ? (cov_jnx22gtfd().b[0][0]++, props) : (cov_jnx22gtfd().b[0][1]++, {
    segment: null
  }));
  cov_jnx22gtfd().s[2]++;
  return segment;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFNlZ21lbnRBdExlbmd0aC5qcyJdLCJuYW1lcyI6WyJnZXRQcm9wZXJ0aWVzQXRMZW5ndGgiLCJnZXRTZWdtZW50QXRMZW5ndGgiLCJwYXRoSW5wdXQiLCJkaXN0YW5jZSIsInByb3BzIiwic2VnbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EscUJBQVAsTUFBa0MseUJBQWxDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0Msa0JBQVQsQ0FBNEJDLFNBQTVCLEVBQXVDQyxRQUF2QyxFQUFpRDtBQUFBO0FBQzlELFFBQU1DLEtBQUssNEJBQUdKLHFCQUFxQixDQUFDRSxTQUFELEVBQVlDLFFBQVosQ0FBeEIsQ0FBWDtBQUNBLFFBQU07QUFBRUUsSUFBQUE7QUFBRiwrQkFBYyxPQUFPRCxLQUFQLEtBQWlCLFdBQWpCLCtCQUErQkEsS0FBL0IsZ0NBQXVDO0FBQUVDLElBQUFBLE9BQU8sRUFBRTtBQUFYLEdBQXZDLENBQWQsQ0FBTjtBQUY4RDtBQUc5RCxTQUFPQSxPQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2V0UHJvcGVydGllc0F0TGVuZ3RoIGZyb20gJy4vZ2V0UHJvcGVydGllc0F0TGVuZ3RoJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzZWdtZW50IGF0IGEgZ2l2ZW4gbGVuZ3RoLlxuICogQHBhcmFtIHtzdHJpbmcgfCBTVkdQYXRoLnBhdGhBcnJheX0gcGF0aElucHV0IHRoZSB0YXJnZXQgYHBhdGhBcnJheWBcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSB0aGUgZGlzdGFuY2UgaW4gcGF0aCB0byBsb29rIGF0XG4gKiBAcmV0dXJucyB7U1ZHUGF0aC5wYXRoU2VnbWVudD99IHRoZSByZXF1ZXN0ZWQgc2VnbWVudFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRTZWdtZW50QXRMZW5ndGgocGF0aElucHV0LCBkaXN0YW5jZSkge1xuICBjb25zdCBwcm9wcyA9IGdldFByb3BlcnRpZXNBdExlbmd0aChwYXRoSW5wdXQsIGRpc3RhbmNlKTtcbiAgY29uc3QgeyBzZWdtZW50IH0gPSB0eXBlb2YgcHJvcHMgIT09ICd1bmRlZmluZWQnID8gcHJvcHMgOiB7IHNlZ21lbnQ6IG51bGwgfTtcbiAgcmV0dXJuIHNlZ21lbnQ7XG59XG4iXX0=