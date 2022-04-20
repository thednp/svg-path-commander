function cov_7zjkpfdjo() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getClosestPoint.js";
  var hash = "969f3c704b31349db2a9cf641a14b019281f44c9";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getClosestPoint.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 11,
          column: 56
        }
      }
    },
    fnMap: {
      "0": {
        name: "getClosestPoint",
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
            line: 12,
            column: 1
          }
        },
        line: 10
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
    hash: "969f3c704b31349db2a9cf641a14b019281f44c9"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_7zjkpfdjo = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_7zjkpfdjo();
import getPropertiesAtPoint from './getPropertiesAtPoint';
/**
 * Returns the point in path closest to a given point.
 *
 * @param {string | SVGPath.pathArray} pathInput target `pathArray`
 * @param {{x: number, y: number}} point the given point
 * @returns {{x: number, y: number}} the best match
 */

export default function getClosestPoint(pathInput, point) {
  cov_7zjkpfdjo().f[0]++;
  cov_7zjkpfdjo().s[0]++;
  return getPropertiesAtPoint(pathInput, point).closest;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldENsb3Nlc3RQb2ludC5qcyJdLCJuYW1lcyI6WyJnZXRQcm9wZXJ0aWVzQXRQb2ludCIsImdldENsb3Nlc3RQb2ludCIsInBhdGhJbnB1dCIsInBvaW50IiwiY2xvc2VzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPQSxvQkFBUCxNQUFpQyx3QkFBakM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFlLFNBQVNDLGVBQVQsQ0FBeUJDLFNBQXpCLEVBQW9DQyxLQUFwQyxFQUEyQztBQUFBO0FBQUE7QUFDeEQsU0FBT0gsb0JBQW9CLENBQUNFLFNBQUQsRUFBWUMsS0FBWixDQUFwQixDQUF1Q0MsT0FBOUM7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRQcm9wZXJ0aWVzQXRQb2ludCBmcm9tICcuL2dldFByb3BlcnRpZXNBdFBvaW50JztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwb2ludCBpbiBwYXRoIGNsb3Nlc3QgdG8gYSBnaXZlbiBwb2ludC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IFNWR1BhdGgucGF0aEFycmF5fSBwYXRoSW5wdXQgdGFyZ2V0IGBwYXRoQXJyYXlgXG4gKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHBvaW50IHRoZSBnaXZlbiBwb2ludFxuICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHRoZSBiZXN0IG1hdGNoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENsb3Nlc3RQb2ludChwYXRoSW5wdXQsIHBvaW50KSB7XG4gIHJldHVybiBnZXRQcm9wZXJ0aWVzQXRQb2ludChwYXRoSW5wdXQsIHBvaW50KS5jbG9zZXN0O1xufVxuIl19