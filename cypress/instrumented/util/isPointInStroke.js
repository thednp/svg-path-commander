function cov_29frmd74ww() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isPointInStroke.js";
  var hash = "70048d063e8a90751a4db7fbb5e55ce0e77c9fee";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isPointInStroke.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 23
        },
        end: {
          line: 11,
          column: 61
        }
      },
      "1": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 35
        }
      }
    },
    fnMap: {
      "0": {
        name: "isPointInStroke",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 39
          }
        },
        loc: {
          start: {
            line: 10,
            column: 58
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 10
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "70048d063e8a90751a4db7fbb5e55ce0e77c9fee"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_29frmd74ww = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_29frmd74ww();
import getPropertiesAtPoint from './getPropertiesAtPoint';
/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param {string | SVGPath.pathArray} pathInput target path
 * @param {{x: number, y: number}} point the given `{x,y}` point
 * @returns {boolean} the query result
 */

export default function isPointInStroke(pathInput, point) {
  cov_29frmd74ww().f[0]++;
  const {
    distance
  } = (cov_29frmd74ww().s[0]++, getPropertiesAtPoint(pathInput, point));
  cov_29frmd74ww().s[1]++;
  return Math.abs(distance) < 0.01;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzUG9pbnRJblN0cm9rZS5qcyJdLCJuYW1lcyI6WyJnZXRQcm9wZXJ0aWVzQXRQb2ludCIsImlzUG9pbnRJblN0cm9rZSIsInBhdGhJbnB1dCIsInBvaW50IiwiZGlzdGFuY2UiLCJNYXRoIiwiYWJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0Esb0JBQVAsTUFBaUMsd0JBQWpDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxlQUFULENBQXlCQyxTQUF6QixFQUFvQ0MsS0FBcEMsRUFBMkM7QUFBQTtBQUN4RCxRQUFNO0FBQUVDLElBQUFBO0FBQUYsZ0NBQWVKLG9CQUFvQixDQUFDRSxTQUFELEVBQVlDLEtBQVosQ0FBbkMsQ0FBTjtBQUR3RDtBQUV4RCxTQUFPRSxJQUFJLENBQUNDLEdBQUwsQ0FBU0YsUUFBVCxJQUFxQixJQUE1QjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdldFByb3BlcnRpZXNBdFBvaW50IGZyb20gJy4vZ2V0UHJvcGVydGllc0F0UG9pbnQnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGdpdmVuIHBvaW50IGlzIGluIHRoZSBzdHJva2Ugb2YgYSBwYXRoLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgU1ZHUGF0aC5wYXRoQXJyYXl9IHBhdGhJbnB1dCB0YXJnZXQgcGF0aFxuICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSBwb2ludCB0aGUgZ2l2ZW4gYHt4LHl9YCBwb2ludFxuICogQHJldHVybnMge2Jvb2xlYW59IHRoZSBxdWVyeSByZXN1bHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNQb2ludEluU3Ryb2tlKHBhdGhJbnB1dCwgcG9pbnQpIHtcbiAgY29uc3QgeyBkaXN0YW5jZSB9ID0gZ2V0UHJvcGVydGllc0F0UG9pbnQocGF0aElucHV0LCBwb2ludCk7XG4gIHJldHVybiBNYXRoLmFicyhkaXN0YW5jZSkgPCAwLjAxO1xufVxuIl19