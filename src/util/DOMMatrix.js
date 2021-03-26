import CSSMatrix from 'dommatrix/src/index.js';

const CSS3Matrix = typeof DOMMatrix !== 'undefined' ? DOMMatrix : CSSMatrix;

export default CSS3Matrix;
