function cov_yzt11ybr6() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getSegmentOfPoint.js";
  var hash = "7e2de3c4ccfc597ac12454944450c9b0925be06b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getSegmentOfPoint.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 16
        },
        end: {
          line: 11,
          column: 49
        }
      },
      "1": {
        start: {
          line: 12,
          column: 22
        },
        end: {
          line: 12,
          column: 27
        }
      },
      "2": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 13,
          column: 65
        }
      }
    },
    fnMap: {
      "0": {
        name: "getSegmentOfPoint",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 41
          }
        },
        loc: {
          start: {
            line: 10,
            column: 55
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 10
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
            line: 13,
            column: 64
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 13,
            column: 42
          },
          end: {
            line: 13,
            column: 57
          }
        }, {
          start: {
            line: 13,
            column: 60
          },
          end: {
            line: 13,
            column: 64
          }
        }],
        line: 13
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
    hash: "7e2de3c4ccfc597ac12454944450c9b0925be06b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_yzt11ybr6 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_yzt11ybr6();
import getPropertiesAtPoint from './getPropertiesAtPoint';
/**
 * Returns the path segment which contains a given point.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to look into
 * @param {{x: number, y: number}} point the point of the shape to look for
 * @returns {SVGPath.pathSegment?} the requested segment
 */

export default function getSegmentOfPoint(path, point) {
  cov_yzt11ybr6().f[0]++;
  const props = (cov_yzt11ybr6().s[0]++, getPropertiesAtPoint(path, point));
  const {
    segment
  } = (cov_yzt11ybr6().s[1]++, props);
  cov_yzt11ybr6().s[2]++;
  return typeof segment !== 'undefined' ? (cov_yzt11ybr6().b[0][0]++, segment.segment) : (cov_yzt11ybr6().b[0][1]++, null);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFNlZ21lbnRPZlBvaW50LmpzIl0sIm5hbWVzIjpbImdldFByb3BlcnRpZXNBdFBvaW50IiwiZ2V0U2VnbWVudE9mUG9pbnQiLCJwYXRoIiwicG9pbnQiLCJwcm9wcyIsInNlZ21lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLG9CQUFQLE1BQWlDLHdCQUFqQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsaUJBQVQsQ0FBMkJDLElBQTNCLEVBQWlDQyxLQUFqQyxFQUF3QztBQUFBO0FBQ3JELFFBQU1DLEtBQUssNEJBQUdKLG9CQUFvQixDQUFDRSxJQUFELEVBQU9DLEtBQVAsQ0FBdkIsQ0FBWDtBQUNBLFFBQU07QUFBRUUsSUFBQUE7QUFBRiwrQkFBY0QsS0FBZCxDQUFOO0FBRnFEO0FBR3JELFNBQU8sT0FBT0MsT0FBUCxLQUFtQixXQUFuQiwrQkFBaUNBLE9BQU8sQ0FBQ0EsT0FBekMsZ0NBQW1ELElBQW5ELENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRQcm9wZXJ0aWVzQXRQb2ludCBmcm9tICcuL2dldFByb3BlcnRpZXNBdFBvaW50JztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwYXRoIHNlZ21lbnQgd2hpY2ggY29udGFpbnMgYSBnaXZlbiBwb2ludC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IFNWR1BhdGgucGF0aEFycmF5fSBwYXRoIHRoZSBgcGF0aEFycmF5YCB0byBsb29rIGludG9cbiAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gcG9pbnQgdGhlIHBvaW50IG9mIHRoZSBzaGFwZSB0byBsb29rIGZvclxuICogQHJldHVybnMge1NWR1BhdGgucGF0aFNlZ21lbnQ/fSB0aGUgcmVxdWVzdGVkIHNlZ21lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0U2VnbWVudE9mUG9pbnQocGF0aCwgcG9pbnQpIHtcbiAgY29uc3QgcHJvcHMgPSBnZXRQcm9wZXJ0aWVzQXRQb2ludChwYXRoLCBwb2ludCk7XG4gIGNvbnN0IHsgc2VnbWVudCB9ID0gcHJvcHM7XG4gIHJldHVybiB0eXBlb2Ygc2VnbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBzZWdtZW50LnNlZ21lbnQgOiBudWxsO1xufVxuIl19