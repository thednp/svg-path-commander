export default function(p, p2, pc1, pc2, i, count) {
  if (p[i].length > 7) {
    p[i].shift();
    let pi = p[i];
    while (pi.length) {
      pc1[i] = "A"; // if created multiple C:s, their original seg is saved
      p2 && (pc2[i] = "A"); // the same as above
      p.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
    }
    p.splice(i, 1);
    count = Math.max(p.length, p2 && p2.length || 0);
  }
}