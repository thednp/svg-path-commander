export default function(path1, path2, a1, a2, i, count) {
  if (path1 && path2 && path1[i][0] === "M" && path2[i][0] !== "M") {
    path2.splice(i, 0, ["M", a2.x, a2.y]);
    a1.bx = 0;
    a1.by = 0;
    a1.x = path1[i][1];
    a1.y = path1[i][2];
    count = Math.max(p.length, p2 && p2.length || 0);
  }
}