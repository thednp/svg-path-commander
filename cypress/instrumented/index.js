function cov_25vdewq4ng() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\index.js";
  var hash = "ecaead31df4354e08ecf0c629f006281e5c1b04f";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\index.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 0
        },
        end: {
          line: 6,
          column: 51
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0
    },
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "ecaead31df4354e08ecf0c629f006281e5c1b04f"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_25vdewq4ng = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_25vdewq4ng();
import SVGPathCommander from './svg-path-commander';
import Util from './util/util';
import Version from './version'; // Export to global

cov_25vdewq4ng().s[0]++;
Object.assign(SVGPathCommander, Util, {
  Version
});
export default SVGPathCommander;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIlNWR1BhdGhDb21tYW5kZXIiLCJVdGlsIiwiVmVyc2lvbiIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPQSxnQkFBUCxNQUE2QixzQkFBN0I7QUFDQSxPQUFPQyxJQUFQLE1BQWlCLGFBQWpCO0FBQ0EsT0FBT0MsT0FBUCxNQUFvQixXQUFwQixDLENBRUE7OztBQUNBQyxNQUFNLENBQUNDLE1BQVAsQ0FBY0osZ0JBQWQsRUFBZ0NDLElBQWhDLEVBQXNDO0FBQUVDLEVBQUFBO0FBQUYsQ0FBdEM7QUFFQSxlQUFlRixnQkFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTVkdQYXRoQ29tbWFuZGVyIGZyb20gJy4vc3ZnLXBhdGgtY29tbWFuZGVyJztcbmltcG9ydCBVdGlsIGZyb20gJy4vdXRpbC91dGlsJztcbmltcG9ydCBWZXJzaW9uIGZyb20gJy4vdmVyc2lvbic7XG5cbi8vIEV4cG9ydCB0byBnbG9iYWxcbk9iamVjdC5hc3NpZ24oU1ZHUGF0aENvbW1hbmRlciwgVXRpbCwgeyBWZXJzaW9uIH0pO1xuXG5leHBvcnQgZGVmYXVsdCBTVkdQYXRoQ29tbWFuZGVyO1xuIl19