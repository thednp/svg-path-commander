const shapeObjects = [
  { type: 'line', id:'line', x1: 0, y1: 0, x2: 182, y2: 72, stroke: 'turquoise', strokeWidth: 2 },
  { type: 'ellipse', id: 'ellipse', cx: '68.3', cy:'37', rx: '15.1', ry: '23.4', fill: 'darkorange' },
  { type: 'circle', id:'circle', cx:27.5, cy:36.9, r:23.5, fill: 'orangered' },
  { type: 'polygon', id:'polygon', points: '107.4,13 113.7,28.8 127.9,31.3 117.6,43.5 120.1,60.8 107.4,52.6 94.6,60.8 97.1,43.5 86.8,31.3 101,28.8', fill:'yellow' },
  { type: 'polyline', id:'polyline', points: '107.39,17.78 112.43,30.42 123.79,32.42 115.55,42.18 117.55,56.02 107.39,49.46 97.15,56.02 99.15,42.18 90.91,32.42 102.27,30.42', fill:'black' },
  { type: 'rect', id: 'rect', x: '131', y: '13.2', width: '47.5', height: '47.6', ry: '25', fill: 'yellowgreen' },
  { type: 'glyph', id: 'glyph', d: 'M143.5 22.72H166s3 0 3 3v22.56s0 3 -3 3h-22.5s-3 0 -3 -3V25.72s0 -3 3 -3', fill: 'rgba(255,255,255,0.3)' },
];

export default shapeObjects;
