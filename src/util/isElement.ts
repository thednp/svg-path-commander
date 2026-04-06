/**
 * Checks if a value is a DOM Element.
 *
 * @param node - The value to check
 * @returns True if the value is a DOM Element (nodeType === 1)
 */
export const isElement = (node?: unknown): node is Element =>
  node !== undefined && node !== null &&
  typeof node === "object" &&
  (node as Node).nodeType === 1; // ELEMENT_NODE
