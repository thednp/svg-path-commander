/*!
* SVGPathCommander v0.0.6b (http://thednp.github.io/svg-path-commander)
* Copyright 2020 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVGPathCommander = factory());
}(this, (function () { 'use strict';

  var options = {
    decimals:3,
    round:1
  };

  function clonePath(pathArray){
    return pathArray.map(function (x) { return Array.isArray(x) ? clonePath(x) : !isNaN(+x) ? +x : x; } )
  }

  function roundPath(pathArray,round) {
    var decimalsOption = !isNaN(+round) ? +round : options.round && options.decimals;
    return decimalsOption ?
      pathArray.map( function (seg) { return seg.map(function (c,i) {
        var nr = +c, dc = Math.pow(10,decimalsOption);
        return i ? (nr % 1 === 0 ? nr : Math.round(nr*dc)/dc) : c
      }
    ); }) : clonePath(pathArray)
  }

  function SVGPathArray(pathString){
    this.segments = [];
    this.pathValue = pathString;
    this.max = pathString.length;
    this.index  = 0;
    this.param = 0.0;
    this.segmentStart = 0;
    this.data = [];
    this.err = '';
    return this
  }

  var paramsCount = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

  function finalizeSegment(state) {
    var cmd = state.pathValue[state.segmentStart], cmdLC = cmd.toLowerCase(), params = state.data;
    if (cmdLC === 'm' && params.length > 2) {
      state.segments.push([ cmd, params[0], params[1] ]);
      params = params.slice(2);
      cmdLC = 'l';
      cmd = (cmd === 'm') ? 'l' : 'L';
    }
    if (cmdLC === 'r') {
      state.segments.push([ cmd ].concat(params));
    } else {
      while (params.length >= paramsCount[cmdLC]) {
        state.segments.push([ cmd ].concat(params.splice(0, paramsCount[cmdLC])));
        if (!paramsCount[cmdLC]) {
          break;
        }
      }
    }
  }

  var invalidPathValue = 'Invalid path value';

  function scanFlag(state) {
    var ch = state.pathValue.charCodeAt(state.index);
    if (ch === 0x30) {
      state.param = 0;
      state.index++;
      return;
    }
    if (ch === 0x31) {
      state.param = 1;
      state.index++;
      return;
    }
    state.err = invalidPathValue;
  }

  function isDigit(code) {
    return (code >= 48 && code <= 57);
  }

  function scanParam(state) {
    var start = state.index,
        index = start,
        max = state.max,
        zeroFirst = false,
        hasCeiling = false,
        hasDecimal = false,
        hasDot = false,
        ch;
    if (index >= max) {
      state.err = invalidPathValue + ": missing param " + (state.pathValue[index]);
      return;
    }
    ch = state.pathValue.charCodeAt(index);
    if (ch === 0x2B || ch === 0x2D) {
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (!isDigit(ch) && ch !== 0x2E) {
      state.err = invalidPathValue + ": " + (state.pathValue[index]) + " not number";
      return;
    }
    if (ch !== 0x2E) {
      zeroFirst = (ch === 0x30);
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (zeroFirst && index < max) {
        if (ch && isDigit(ch)) {
          state.err = invalidPathValue + ": " + (state.pathValue[start]) + " illegal number";
          return;
        }
      }
      while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        index++;
        hasCeiling = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (ch === 0x2E) {
      hasDot = true;
      index++;
      while (isDigit(state.pathValue.charCodeAt(index))) {
        index++;
        hasDecimal = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (ch === 0x65 || ch === 0x45) {
      if (hasDot && !hasCeiling && !hasDecimal) {
        state.err = invalidPathValue + ": " + (state.pathValue[index]) + " invalid float exponent";
        return;
      }
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (ch === 0x2B || ch === 0x2D) {
        index++;
      }
      if (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
          index++;
        }
      } else {
        state.err = invalidPathValue + ": " + (state.pathValue[index]) + " invalid float exponent";
        return;
      }
    }
    state.index = index;
    state.param = +state.pathValue.slice(start, index);
  }

  function isPathCommand(code) {
    switch (code | 0x20) {
      case 0x6D:
      case 0x7A:
      case 0x6C:
      case 0x68:
      case 0x76:
      case 0x63:
      case 0x73:
      case 0x71:
      case 0x74:
      case 0x61:
      case 0x72:
        return true;
    }
    return false;
  }

  function isDigitStart(code) {
    return (code >= 48 && code <= 57) ||
            code === 0x2B ||
            code === 0x2D ||
            code === 0x2E;
  }

  function isArcCommand(code) {
    return (code | 0x20) === 0x61;
  }

  function isSpace(ch) {
    var specialSpaces = [
      0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
      0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF ];
    return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) ||
      (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
      (ch >= 0x1680 && specialSpaces.indexOf(ch) >= 0);
  }

  function skipSpaces(state) {
    while (state.index < state.max && isSpace(state.pathValue.charCodeAt(state.index))) {
      state.index++;
    }
  }

  function scanSegment(state) {
    var max = state.max, cmdCode, comma_found, need_params, i;
    state.segmentStart = state.index;
    cmdCode = state.pathValue.charCodeAt(state.index);
    if (!isPathCommand(cmdCode)) {
      state.err = invalidPathValue + ": " + (state.pathValue[state.index]) + " not a path command";
      return;
    }
    need_params = paramsCount[state.pathValue[state.index].toLowerCase()];
    state.index++;
    skipSpaces(state);
    state.data = [];
    if (!need_params) {
      finalizeSegment(state);
      return;
    }
    comma_found = false;
    for (;;) {
      for (i = need_params; i > 0; i--) {
        if (isArcCommand(cmdCode) && (i === 3 || i === 4)) { scanFlag(state); }
        else { scanParam(state); }
        if (state.err.length) {
          return;
        }
        state.data.push(state.param);
        skipSpaces(state);
        comma_found = false;
        if (state.index < max && state.pathValue.charCodeAt(state.index) === 0x2C) {
          state.index++;
          skipSpaces(state);
          comma_found = true;
        }
      }
      if (comma_found) {
        continue;
      }
      if (state.index >= state.max) {
        break;
      }
      if (!isDigitStart(state.pathValue.charCodeAt(state.index))) {
        break;
      }
    }
    finalizeSegment(state);
  }

  function isPathArray(pathArray){
    return Array.isArray(pathArray) && pathArray.every(function (x){
      var pathCommand = x[0].toLowerCase();
      return paramsCount[pathCommand] === x.length - 1 && /[achlmrqstvz]/g.test(pathCommand)
    })
  }

  function parsePathString(pathString,round) {
    if ( isPathArray(pathString) ) {
      return clonePath(pathString)
    }
    var state = new SVGPathArray(pathString), max = state.max;
    skipSpaces(state);
    while (state.index < max && !state.err.length) {
      scanSegment(state);
    }
    if (state.err.length) {
      state.segments = [];
    } else if (state.segments.length) {
      if ('mM'.indexOf(state.segments[0][0]) < 0) {
        state.err = invalidPathValue + ": missing M/m";
        state.segments = [];
      } else {
        state.segments[0][0] = 'M';
      }
    }
    return roundPath(state.segments,round)
  }

  function isAbsoluteArray(pathInput){
    return isPathArray(pathInput) && pathInput.every(function (x){ return x[0] === x[0].toUpperCase(); })
  }

  function pathToAbsolute(pathArray,round) {
    if (isAbsoluteArray(pathArray)) {
      return clonePath(pathArray)
    }
    pathArray = parsePathString(pathArray);
    var resultArray = [],
        x = 0, y = 0, mx = 0, my = 0,
        start = 0, ii = pathArray.length,
        pathCommand = '', segment = [], segLength = 0,
        absoluteSegment = [];
    if (pathArray[0][0] === "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      resultArray[0] = ["M", x, y];
    }
    for (var i = start; i < ii; i++) {
      segment = pathArray[i];
      pathCommand = segment[0];
      resultArray.push(absoluteSegment = []);
      if (pathCommand !== pathCommand.toUpperCase()) {
        absoluteSegment[0] = pathCommand.toUpperCase();
        switch (absoluteSegment[0]) {
          case "A":
            segment.slice(1,-2)
                   .concat([+segment[6] + x, +segment[7] + y])
                   .map(function (s){ return absoluteSegment.push(s); });
            break;
          case "V":
            absoluteSegment[1] = +segment[1] + y;
            break;
          case "H":
            absoluteSegment[1] = +segment[1] + x;
            break;
          case "M":
            mx = +segment[1] + x;
            my = +segment[2] + y;
          default:
            segment.map(function (s,j){ return j && absoluteSegment.push(+s + ((j % 2) ? x : y)); });
        }
      } else {
        segment.map(function (k){ return absoluteSegment.push(k); });
      }
      segLength = absoluteSegment.length;
      switch (absoluteSegment[0]) {
        case "Z":
          x = mx;
          y = my;
          break;
        case "H":
          x = +absoluteSegment[1];
          break;
        case "V":
          y = +absoluteSegment[1];
          break;
        case "M":
          mx = +absoluteSegment[segLength - 2];
          my = +absoluteSegment[segLength - 1];
        default:
          x = +absoluteSegment[segLength - 2];
          y = +absoluteSegment[segLength - 1];
      }
    }
    return roundPath(resultArray,round)
  }

  function isRelativeArray(pathInput){
    return isPathArray(pathInput) && pathInput.slice(1).every(function (x){ return x[0] === x[0].toLowerCase(); })
  }

  function pathToRelative (pathArray,round) {
    if (isRelativeArray(pathArray)){
      return clonePath(pathArray)
    }
    pathArray = parsePathString(pathArray);
    var resultArray = [], segLength = 0,
        x = 0, y = 0, mx = 0, my = 0,
        segment = [], pathCommand = '', relativeSegment = [],
        start = 0, ii = pathArray.length;
    if (pathArray[0][0] === "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      resultArray.push(["M", x, y]);
    }
    var loop = function ( i ) {
      segment = pathArray[i];
      pathCommand = segment[0];
      resultArray.push(relativeSegment = []);
      if (pathCommand !== pathCommand.toLowerCase() ) {
        relativeSegment[0] = pathCommand.toLowerCase();
        switch (relativeSegment[0]) {
          case "a":
            segment.slice(1,-2)
                   .concat([+segment[6] - x, +segment[7] - y])
                   .map(function (s){ return relativeSegment.push(s); });
            break;
          case "v":
            relativeSegment[1] = +segment[1] - y;
            break;
          case "m":
            mx = +segment[1];
            my = +segment[2];
          default:
            segment.map(function (s,j){ return j && relativeSegment.push(+s - ((j % 2) ? x : y)); });
        }
      } else {
        relativeSegment = [];
        resultArray[i] = relativeSegment;
        if (pathCommand === "m") {
          mx = +segment[1] + x;
          my = +segment[2] + y;
        }
        segment.map(function (s){ return resultArray[i].push(s); });
      }
      segLength = resultArray[i].length;
      switch (resultArray[i][0]) {
        case "z":
          x = mx;
          y = my;
          break;
        case "h":
          x += resultArray[i][segLength - 1];
          break;
        case "v":
          y += resultArray[i][segLength - 1];
          break;
        default:
          x += resultArray[i][segLength - 2];
          y += resultArray[i][segLength - 1];
      }
    };
    for (var i = start; i < ii; i++) loop( i );
    return roundPath(resultArray,round)
  }

  function pathToString(pathArray) {
    return pathArray.map(function (x){ return x[0].concat(x.slice(1).join(' ')); }).join('')
  }

  function shorthandToQuadratic(x1,y1,qx,qy,prevCommand){
    return 'QT'.indexOf(prevCommand)>-1 ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy}
                                        : { qx: x1, qy: y1 }
  }

  function shorthandToCubic(x1,y1,x2,y2,prevCommand){
    return 'CS'.indexOf(prevCommand)>-1 ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2}
                                        : { x1: x1, y1: y1 }
  }

  function normalizeSegment(segment, params, prevCommand) {
    var nqxy, nxy;
    switch (segment[0]) {
      case "S":
        nxy = shorthandToCubic(params.x1,params.y1, params.x2,params.y2, prevCommand);
        params.x1 = nxy.x1;
        params.y1 = nxy.y1;
        segment = ["C", nxy.x1, nxy.y1].concat(segment.slice(1));
        break
      case "T":
        nqxy = shorthandToQuadratic(params.x1,params.y1, params.qx, params.qy, prevCommand);
        params.qx = nqxy.qx;
        params.qy = nqxy.qy;
        segment = ["Q", params.qx, params.qy].concat(segment.slice(1));
        break
      case "Q":
        params.qx = segment[1];
        params.qy = segment[2];
        break
      case "H":
        segment = ["L", segment[1], params.y1];
        break
      case "V":
        segment = ["L", params.x1, segment[1]];
        break
    }
    return segment
  }

  function normalizePath(pathArray,round) {
    pathArray = pathToAbsolute(pathArray);
    var params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
        allPathCommands = [], pathCommand = '', prevCommand = '', ii = pathArray.length,
        segment, seglen;
    for (var i = 0; i < ii; i++) {
      pathArray[i] && (pathCommand = pathArray[i][0]);
      allPathCommands[i] = pathCommand;
      i && ( prevCommand = allPathCommands[i - 1]);
      pathArray[i] = normalizeSegment(pathArray[i], params, prevCommand);
      segment = pathArray[i];
      seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray,round)
  }

  function reversePath(pathString,round){
    var absolutePath = pathToAbsolute(pathString,round),
        isClosed = absolutePath.slice(-1)[0][0] === 'Z',
        reversedPath = [], segLength = 0;
    reversedPath = normalizePath(absolutePath).map(function (segment,i){
      segLength = segment.length;
      return {
        c: absolutePath[i][0],
        x: segment[segLength - 2],
        y: segment[segLength - 1],
        seg: absolutePath[i],
        normSeg: segment
      }
    }).map(function (seg,i,pathArray){
      var segment = seg.seg,
          data = seg.normSeg,
          prevSeg = i && pathArray[i-1],
          nextSeg = pathArray[i+1] && pathArray[i+1],
          pathCommand = seg.c,
          pLen = pathArray.length,
          x = i ? pathArray[i-1].x : pathArray[pLen-1].x,
          y = i ? pathArray[i-1].y : pathArray[pLen-1].y,
          result = [];
      switch(pathCommand){
        case 'M':
          result = isClosed ? ['Z'] : [pathCommand, x,y];
          break
        case 'A':
          result = segment.slice(0,-3).concat([(segment[5] === 1 ? 0 : 1), x,y]);
          break
        case 'C':
          if (nextSeg && nextSeg.c === 'S') {
            result = ['S', segment[1],segment[2], x,y];
          } else {
            result = [pathCommand, segment[3],segment[4], segment[1],segment[2], x,y];
          }
          break
        case 'S':
          if ( prevSeg && 'CS'.indexOf(prevSeg.c)>-1 && (!nextSeg || nextSeg && nextSeg.c !== 'S')) {
            result = ['C', data[3],data[4], data[1],data[2], x,y];
          } else {
            result = [pathCommand, data[1],data[2], x,y];
          }
          break
        case 'Q':
          if (nextSeg && nextSeg.c === 'T') {
            result = ['T', x,y];
          } else {
            result = segment.slice(0,-2).concat([x,y]);
          }
          break
        case 'T':
          if (prevSeg && 'QT'.indexOf(prevSeg.c)>-1 && (!nextSeg || nextSeg && nextSeg.c !== 'T')) {
            result = ['Q', data[1],data[2], x,y];
          } else {
            result = [pathCommand, x,y];
          }
          break
        case 'Z':
          result = ['M',x,y];
          break
        case 'H':
          result = [pathCommand,x];
          break
        case 'V':
          result = [pathCommand,y];
          break
        default:
          result = segment.slice(0,-2).concat([x,y]);
      }
      return result
    });
    return isClosed ? reversedPath.reverse()
                    : [reversedPath[0]].concat(reversedPath.slice(1).reverse())
  }

  function splitPath(pathString) {
    return pathString
      .replace( /(m|M)/g, "|$1")
      .split('|')
      .map(function (s){ return s.trim(); })
      .filter(function (s){ return s; })
  }

  function optimizePath(pathArray,round){
    var absolutePath = pathToAbsolute(pathArray,round),
        relativePath = pathToRelative(pathArray,round);
    return absolutePath.map(function (x,i) { return i ? (x.join('').length < relativePath[i].join('').length ? x : relativePath[i]) : x; } )
  }

  var SVGPathCommander = function SVGPathCommander(pathValue,ops){
    this.round =ops && ops.round === 0 ? 0 :
                  ops && ops.decimals ? ops.decimals :
                  options.round && options.decimals ?
                  options.decimals : 0;
    var path = parsePathString(pathValue,this.round);
    this.segments = clonePath(path);
    this.pathValue = pathValue;
    return this
  };
  SVGPathCommander.prototype.toAbsolute = function toAbsolute (){
    var path = pathToAbsolute(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.toRelative = function toRelative (){
    var path = pathToRelative(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.reverse = function reverse (onlySubpath){
    this.toAbsolute();
    var subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString()),
        absoluteMultiPath = subPath && clonePath(subPath).map(function (x,i) {
          return onlySubpath ? (i ? reversePath(x) : parsePathString(x)) : reversePath(x)
        }),
        path =subPath ? [].concat.apply([], absoluteMultiPath)
              : onlySubpath ? this.segments : reversePath(this.segments);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.normalize = function normalize (){
    var path = normalizePath(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.optimize = function optimize (){
    var path = optimizePath(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.toString = function toString (){
    return pathToString(this.segments)
  };

  function getArea(v) {
    var x0 = v[0], y0 = v[1],
        x1 = v[2], y1 = v[3],
        x2 = v[4], y2 = v[5],
        x3 = v[6], y3 = v[7];
    return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
            + y1 * (x0 - x2) - x1 * (y0 - y2)
            + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
  }
  function getShapeArea(curveArray) {
    return curveArray.slice(1).map(function (seg,i,cv){
      var previous = cv[i === 0 ? cv.length-1 : i-1];
      return getArea(previous.slice(previous.length-2).concat(seg.slice(1)))
    }).reduce(function (a, b) { return a + b; }, 0)
  }

  function isCurveArray(pathArray){
    return isPathArray(pathArray) && pathArray.slice(1).every(function (x){ return x[0] === 'C'; })
  }

  function getDrawDirection(curveArray) {
    if (!isCurveArray(curveArray)) {
      throw("getDrawDirection expects a curveArray")
    }
    return getShapeArea(curveArray) >= 0
  }

  function reverseCurve(pathArray){
     var rotatedCurve = pathArray.slice(1)
                        .map(function (x,i,curveOnly) { return !i ? pathArray[0].slice(1).concat(x.slice(1)) : curveOnly[i-1].slice(-2).concat(x.slice(1)); })
                        .map(function (x) { return x.map(function (y,i) { return x[x.length - i - 2 * (1 - i % 2)]; } ); })
                        .reverse();
    return [ ['M'].concat( rotatedCurve[0].slice(0,2)) ]
            .concat(rotatedCurve.map(function (x){ return ['C'].concat(x.slice(2) ); } ))
  }

  function fixArc(pathArray, allPathCommands, i) {
    if (pathArray[i].length > 7) {
      pathArray[i].shift();
      var pi = pathArray[i];
      while (pi.length) {
        allPathCommands[i] = "A";
        pathArray.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
      }
      pathArray.splice(i, 1);
    }
  }

  function rotateVector(x, y, rad) {
    var X = x * Math.cos(rad) - y * Math.sin(rad),
        Y = x * Math.sin(rad) + y * Math.cos(rad);
    return {x: X, y: Y}
  }

  function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
    var _120 = Math.PI * 120 / 180,
        rad = Math.PI / 180 * (angle || 0),
        res = [], xy, f1, f2, cx, cy;
    if (!recursive) {
      xy = rotateVector(x1, y1, -rad);
      x1 = xy.x; y1 = xy.y;
      xy = rotateVector(x2, y2, -rad);
      x2 = xy.x; y2 = xy.y;
      var x = (x1 - x2) / 2,
          y = (y1 - y2) / 2,
          h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx = h * rx;
        ry = h * ry;
      }
      var rx2 = rx * rx,
          ry2 = ry * ry,
          k = (large_arc_flag == sweep_flag ? -1 : 1)
            * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
            / (rx2 * y * y + ry2 * x * x)));
      cx = k * rx * y / ry + (x1 + x2) / 2;
      cy = k * -ry * x / rx + (y1 + y2) / 2;
      f1 = Math.asin( ((y1 - cy) / ry).toFixed(9) );
      f2 = Math.asin( ((y2 - cy) / ry).toFixed(9) );
      f1 = x1 < cx ? Math.PI - f1 : f1;
      f2 = x2 < cx ? Math.PI - f2 : f2;
      f1 < 0 && (f1 = Math.PI * 2 + f1);
      f2 < 0 && (f2 = Math.PI * 2 + f2);
      if (sweep_flag && f1 > f2) {
        f1 = f1 - Math.PI * 2;
      }
      if (!sweep_flag && f2 > f1) {
        f2 = f2 - Math.PI * 2;
      }
    } else {
      f1 = recursive[0];
      f2 = recursive[1];
      cx = recursive[2];
      cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
      var f2old = f2, x2old = x2, y2old = y2;
      f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      return [m2, m3, m4].concat(res);
    } else {
      res = [m2, m3, m4].concat(res).join().split(",");
      return res.map(function (rz,i){ return i % 2 ? rotateVector(res[i - 1], rz, rad).y : rotateVector(rz, res[i + 1], rad).x; });
    }
  }

  function quadraticToCubicBezier (x1, y1, ax, ay, x2, y2) {
    var _13 = 1 / 3, _23 = 2 / 3;
    return [
            _13 * x1 + _23 * ax,
            _13 * y1 + _23 * ay,
            _13 * x2 + _23 * ax,
            _13 * y2 + _23 * ay,
            x2, y2 ]
  }

  function lineToCubicBezier(x1, y1, x2, y2) {
    return [x1, y1, x2, y2, x2, y2]
  }

  function segmentToCubicBezier(segment, params) {
    'TQ'.indexOf(segment[0])<0 && (params.qx = params.qy = null);
    switch (segment[0]) {
      case 'M':
        params.x = segment[1];
        params.y = segment[2];
        break
      case 'A':
        segment = ['C'].concat(a2c.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
        break
      case 'Q':
        params.qx = segment[1];
        params.qy = segment[2];
        segment = ['C'].concat(quadraticToCubicBezier.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
        break
      case 'L':
        segment = ['C'].concat(lineToCubicBezier(params.x1, params.y1, segment[1], segment[2]));
        break
      case 'Z':
        segment = ['C'].concat(lineToCubicBezier(params.x1, params.y1, params.x, params.y));
        break
    }
    return segment
  }

  function pathToCurve(pathArray,round) {
    if (isCurveArray(pathArray)){
      return clonePath(pathArray)
    }
    pathArray = normalizePath(pathArray);
    var params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
        allPathCommands = [], pathCommand = '', ii = pathArray.length,
        segment, seglen;
    for (var i = 0; i < ii; i++) {
      pathArray[i] && (pathCommand = pathArray[i][0]);
      if (pathCommand !== 'C') {
        allPathCommands[i] = pathCommand;
      }
      pathArray[i] = segmentToCubicBezier(pathArray[i], params);
      allPathCommands[i] !== 'A' && pathCommand === 'C' && ( allPathCommands[i] = 'C' );
      fixArc(pathArray,allPathCommands,i);
      ii = pathArray.length;
      segment = pathArray[i];
      seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray,round)
  }

  var util = {
    getShapeArea: getShapeArea,
    getDrawDirection: getDrawDirection,
    clonePath: clonePath,
    splitPath: splitPath,
    isPathArray: isPathArray,
    isCurveArray: isCurveArray,
    isAbsoluteArray: isAbsoluteArray,
    isRelativeArray: isRelativeArray,
    roundPath: roundPath,
    optimizePath: optimizePath,
    pathToAbsolute: pathToAbsolute,
    pathToRelative: pathToRelative,
    pathToCurve: pathToCurve,
    pathToString: pathToString,
    parsePathString: parsePathString,
    reverseCurve: reverseCurve,
    reversePath: reversePath,
    normalizePath: normalizePath,
    options: options
  };

  for (var x in util) { SVGPathCommander[x] = util[x]; }

  return SVGPathCommander;

})));
