function cov_um7aih5ri() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\projection2d.js";
  var hash = "a92a7cdd845e613e9dc0f17d387c4c862fd9e819";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\projection2d.js",
    statementMap: {
      "0": {
        start: {
          line: 16,
          column: 19
        },
        end: {
          line: 16,
          column: 26
        }
      },
      "1": {
        start: {
          line: 17,
          column: 38
        },
        end: {
          line: 17,
          column: 44
        }
      },
      "2": {
        start: {
          line: 18,
          column: 18
        },
        end: {
          line: 20,
          column: 4
        }
      },
      "3": {
        start: {
          line: 22,
          column: 28
        },
        end: {
          line: 22,
          column: 47
        }
      },
      "4": {
        start: {
          line: 23,
          column: 28
        },
        end: {
          line: 23,
          column: 47
        }
      },
      "5": {
        start: {
          line: 24,
          column: 28
        },
        end: {
          line: 24,
          column: 47
        }
      },
      "6": {
        start: {
          line: 26,
          column: 2
        },
        end: {
          line: 29,
          column: 4
        }
      }
    },
    fnMap: {
      "0": {
        name: "projection2d",
        decl: {
          start: {
            line: 15,
            column: 24
          },
          end: {
            line: 15,
            column: 36
          }
        },
        loc: {
          start: {
            line: 15,
            column: 57
          },
          end: {
            line: 30,
            column: 1
          }
        },
        line: 15
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "a92a7cdd845e613e9dc0f17d387c4c862fd9e819"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_um7aih5ri = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_um7aih5ri();

/**
 * Returns the [x,y] projected coordinates for a given an [x,y] point
 * and an [x,y,z] perspective origin point.
 *
 * Equation found here =>
 * http://en.wikipedia.org/wiki/3D_projection#Diagram
 * Details =>
 * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
 *
 * @param {SVGPath.CSSMatrix} m the transformation matrix
 * @param {[number, number]} point2D the initial [x,y] coordinates
 * @param {number[]} origin the [x,y,z] transform origin
 * @returns {[number, number]} the projected [x,y] coordinates
 */
export default function projection2d(m, point2D, origin) {
  cov_um7aih5ri().f[0]++;
  const [px, py] = (cov_um7aih5ri().s[0]++, point2D);
  const [originX, originY, originZ] = (cov_um7aih5ri().s[1]++, origin);
  const point3D = (cov_um7aih5ri().s[2]++, m.transformPoint({
    x: px,
    y: py,
    z: 0,
    w: 1
  }));
  const relativePositionX = (cov_um7aih5ri().s[3]++, point3D.x - originX);
  const relativePositionY = (cov_um7aih5ri().s[4]++, point3D.y - originY);
  const relativePositionZ = (cov_um7aih5ri().s[5]++, point3D.z - originZ);
  cov_um7aih5ri().s[6]++;
  return [relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX, relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3Rpb24yZC5qcyJdLCJuYW1lcyI6WyJwcm9qZWN0aW9uMmQiLCJtIiwicG9pbnQyRCIsIm9yaWdpbiIsInB4IiwicHkiLCJvcmlnaW5YIiwib3JpZ2luWSIsIm9yaWdpbloiLCJwb2ludDNEIiwidHJhbnNmb3JtUG9pbnQiLCJ4IiwieSIsInoiLCJ3IiwicmVsYXRpdmVQb3NpdGlvblgiLCJyZWxhdGl2ZVBvc2l0aW9uWSIsInJlbGF0aXZlUG9zaXRpb25aIiwiTWF0aCIsImFicyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7O0FBZlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsWUFBVCxDQUFzQkMsQ0FBdEIsRUFBeUJDLE9BQXpCLEVBQWtDQyxNQUFsQyxFQUEwQztBQUFBO0FBQ3ZELFFBQU0sQ0FBQ0MsRUFBRCxFQUFLQyxFQUFMLDZCQUFXSCxPQUFYLENBQU47QUFDQSxRQUFNLENBQUNJLE9BQUQsRUFBVUMsT0FBVixFQUFtQkMsT0FBbkIsNkJBQThCTCxNQUE5QixDQUFOO0FBQ0EsUUFBTU0sT0FBTyw0QkFBR1IsQ0FBQyxDQUFDUyxjQUFGLENBQWlCO0FBQy9CQyxJQUFBQSxDQUFDLEVBQUVQLEVBRDRCO0FBQ3hCUSxJQUFBQSxDQUFDLEVBQUVQLEVBRHFCO0FBQ2pCUSxJQUFBQSxDQUFDLEVBQUUsQ0FEYztBQUNYQyxJQUFBQSxDQUFDLEVBQUU7QUFEUSxHQUFqQixDQUFILENBQWI7QUFJQSxRQUFNQyxpQkFBaUIsNEJBQUdOLE9BQU8sQ0FBQ0UsQ0FBUixHQUFZTCxPQUFmLENBQXZCO0FBQ0EsUUFBTVUsaUJBQWlCLDRCQUFHUCxPQUFPLENBQUNHLENBQVIsR0FBWUwsT0FBZixDQUF2QjtBQUNBLFFBQU1VLGlCQUFpQiw0QkFBR1IsT0FBTyxDQUFDSSxDQUFSLEdBQVlMLE9BQWYsQ0FBdkI7QUFUdUQ7QUFXdkQsU0FBTyxDQUNMTyxpQkFBaUIsSUFBSUcsSUFBSSxDQUFDQyxHQUFMLENBQVNYLE9BQVQsSUFBb0JVLElBQUksQ0FBQ0MsR0FBTCxDQUFTRixpQkFBVCxDQUF4QixDQUFqQixHQUF3RVgsT0FEbkUsRUFFTFUsaUJBQWlCLElBQUlFLElBQUksQ0FBQ0MsR0FBTCxDQUFTWCxPQUFULElBQW9CVSxJQUFJLENBQUNDLEdBQUwsQ0FBU0YsaUJBQVQsQ0FBeEIsQ0FBakIsR0FBd0VWLE9BRm5FLENBQVA7QUFJRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJucyB0aGUgW3gseV0gcHJvamVjdGVkIGNvb3JkaW5hdGVzIGZvciBhIGdpdmVuIGFuIFt4LHldIHBvaW50XG4gKiBhbmQgYW4gW3gseSx6XSBwZXJzcGVjdGl2ZSBvcmlnaW4gcG9pbnQuXG4gKlxuICogRXF1YXRpb24gZm91bmQgaGVyZSA9PlxuICogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS8zRF9wcm9qZWN0aW9uI0RpYWdyYW1cbiAqIERldGFpbHMgPT5cbiAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIzNzkyNTA1L3ByZWRpY3RlZC1yZW5kZXJpbmctb2YtY3NzLTNkLXRyYW5zZm9ybWVkLXBpeGVsXG4gKlxuICogQHBhcmFtIHtTVkdQYXRoLkNTU01hdHJpeH0gbSB0aGUgdHJhbnNmb3JtYXRpb24gbWF0cml4XG4gKiBAcGFyYW0ge1tudW1iZXIsIG51bWJlcl19IHBvaW50MkQgdGhlIGluaXRpYWwgW3gseV0gY29vcmRpbmF0ZXNcbiAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWdpbiB0aGUgW3gseSx6XSB0cmFuc2Zvcm0gb3JpZ2luXG4gKiBAcmV0dXJucyB7W251bWJlciwgbnVtYmVyXX0gdGhlIHByb2plY3RlZCBbeCx5XSBjb29yZGluYXRlc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9qZWN0aW9uMmQobSwgcG9pbnQyRCwgb3JpZ2luKSB7XG4gIGNvbnN0IFtweCwgcHldID0gcG9pbnQyRDtcbiAgY29uc3QgW29yaWdpblgsIG9yaWdpblksIG9yaWdpblpdID0gb3JpZ2luO1xuICBjb25zdCBwb2ludDNEID0gbS50cmFuc2Zvcm1Qb2ludCh7XG4gICAgeDogcHgsIHk6IHB5LCB6OiAwLCB3OiAxLFxuICB9KTtcblxuICBjb25zdCByZWxhdGl2ZVBvc2l0aW9uWCA9IHBvaW50M0QueCAtIG9yaWdpblg7XG4gIGNvbnN0IHJlbGF0aXZlUG9zaXRpb25ZID0gcG9pbnQzRC55IC0gb3JpZ2luWTtcbiAgY29uc3QgcmVsYXRpdmVQb3NpdGlvblogPSBwb2ludDNELnogLSBvcmlnaW5aO1xuXG4gIHJldHVybiBbXG4gICAgcmVsYXRpdmVQb3NpdGlvblggKiAoTWF0aC5hYnMob3JpZ2luWikgLyBNYXRoLmFicyhyZWxhdGl2ZVBvc2l0aW9uWikpICsgb3JpZ2luWCxcbiAgICByZWxhdGl2ZVBvc2l0aW9uWSAqIChNYXRoLmFicyhvcmlnaW5aKSAvIE1hdGguYWJzKHJlbGF0aXZlUG9zaXRpb25aKSkgKyBvcmlnaW5ZLFxuICBdO1xufVxuIl19