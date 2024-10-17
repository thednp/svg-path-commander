const roundTo = (n: number, round: number) => {
  const pow = round >= 1 ? 10 ** round : 1;

  return round > 0 ? Math.round(n * pow) / pow : Math.round(n);
};

export default roundTo;
