import CSSMatrix from 'dommatrix/src/index.js'

let CSS3Matrix = typeof DOMMatrix !== 'undefined' ? DOMMatrix : CSSMatrix

export default CSS3Matrix