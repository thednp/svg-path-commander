export default function fixArc(p, pc1, i, count) {
  if (p[i].length > 7) {
    p[i].shift();
    let pi = p[i];
    while (pi.length) {
      pc1[i] = "A"; // if created multiple C:s, their original seg is saved
      p.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
    }
    p.splice(i, 1);
    count = p.length;
  }
}