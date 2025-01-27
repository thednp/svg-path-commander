const isElement = (node?: unknown): node is Element =>
  node !== undefined && node !== null &&
  typeof node === "object" &&
  (node as Node).nodeType === 1; // ELEMENT_NODE

export default isElement;
