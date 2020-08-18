import pathToAbsolute from './pathToAbsolute.js'
import processSegment from '../process/processSegment.js'
import fixM from '../util/fixM.js'
import fixArc from '../util/fixArc.js'
import roundPath from '../util/roundPath.js'

export default function(path, path2) {
  let p = pathToAbsolute(path), // holder for previous path command of original path
      p2 = path2 && pathToAbsolute(path2),
      attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null};

  // path commands of original path p
  // path commands of original path p2
  // temporary holder for original path command
  let pcoms1 = [], pcoms2 = [], 
      pathCommand = "", pcom = "", 
      ii = Math.max(p.length, p2 && p2.length || 0);

  for (let i = 0; i < (ii = Math.max(p.length, p2 && p2.length || 0)); i++) {
    p[i] && (pathCommand = p[i][0]); // save current path command

    if (pathCommand !== "C") { // C is not saved yet, because it may be result of conversion
      pcoms1[i] = pathCommand; // Save current path command
      i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
    }
    p[i] = processSegment(p[i], attrs, pcom); // Previous path command is inputted to processSegment

    // A is the only command
    // which may produce multiple C:s
    // so we have to make sure that C is also C in original path
    if (pcoms1[i] !== "A" && pathCommand === "C") pcoms1[i] = "C"; 

    fixArc(p,p2,pcoms1,pcoms2,i,ii); // fixArc adds also the right amount of A:s to pcoms1

    if (p2) { // the same procedures is done to p2
      p2[i] && (pathCommand = p2[i][0]);
      if (pathCommand !== "C") {
        pcoms2[i] = pathCommand;
        i && (pcom = pcoms2[i - 1]);
      }
      p2[i] = processSegment(p2[i], attrs2, pcom);

      if (pcoms2[i] !== "A" && pathCommand === "C") {
        pcoms2[i] = "C";
      }
      fixArc(p2,p,pcoms2,pcoms1,i,ii);
    }
    fixM(p, p2, attrs, attrs2, i, ii);
    fixM(p2, p, attrs2, attrs, i, ii);

    let seg = p[i],
        seg2 = p2 && p2[i],
        seglen = seg.length,
        seg2len = p2 && seg2.length;
    attrs.x = +seg[seglen - 2];
    attrs.y = +seg[seglen - 1];
    attrs.bx = +(seg[seglen - 4]) || attrs.x;
    attrs.by = +(seg[seglen - 3]) || attrs.y;
    attrs2.bx = p2 && (+(seg2[seg2len - 4]) || attrs2.x);
    attrs2.by = p2 && (+(seg2[seg2len - 3]) || attrs2.y);
    attrs2.x = p2 && seg2[seg2len - 2];
    attrs2.y = p2 && seg2[seg2len - 1];
  }
  return p2 ? [roundPath(p), roundPath(p2)] : roundPath(p)
}