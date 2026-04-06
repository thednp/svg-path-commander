const intersectionFixtures = {
  intersecting: [
    {
      path1: 'M0 50C0 0,100 0,100 50',
      path2: 'M50 0C100 0,100 100,50 100',
      expectedCount: 1,
    },
    {
      path1: 'M0 0C50 50,50 100,100 100',
      path2: 'M100 0C50 50,50 100,0 100',
      expectedCount: 1,
    },
    {
      path1: 'M0 0C30 0,30 50,0 50C-30 50,-30 0,0 0Z',
      path2: 'M20 25C50 25,50 75,20 75C-10 75,-10 25,20 25Z',
      expectedCount: 2,
    },
  ],
  nonIntersecting: [
    {
      path1: 'M0 0C10 0,10 10,0 10C-10 10,-10 0,0 0Z',
      path2: 'M50 50C60 50,60 60,50 60C40 60,40 50,50 50Z',
      expectedCount: 0,
    },
    {
      path1: 'M0 0C10 0,10 10,0 10',
      path2: 'M0 20C10 20,10 30,0 30',
      expectedCount: 0,
    },
  ],
};

const equalizeFixtures = {
  simple: {
    triangle: 'M0 0L100 0L50 100Z',
    square: 'M0 0L100 0L100 100L0 100Z',
  },
  curves: {
    circle: 'M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z',
    ellipse: 'M60 0A60 30 0 1 1 60 60A60 30 0 1 1 60 0Z',
  },
  complex: {
    star: 'M50 0L61 35L98 35L68 57L79 91L50 70L21 91L32 57L2 35L39 35Z',
    heart: 'M50 30C50 30,100 0,100 40C100 70,50 100,50 100C50 100,0 70,0 40C0 0,50 30,50 30Z',
  },
  multiSubpath: {
    twoRects1: 'M0 0L20 0L20 20L0 20ZM30 30L50 30L50 50L30 50Z',
    twoRects2: 'M5 5L25 5L25 25L5 25ZM35 35L55 35L55 55L35 55Z',
  },
};

export { intersectionFixtures, equalizeFixtures };
export default { intersectionFixtures, equalizeFixtures };
