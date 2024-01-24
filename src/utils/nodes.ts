export function isAncestor(ancestorId: string, nodeId: string) {
  const ancestorParts = ancestorId.split("/");
  const nodeParts = nodeId.split("/");

  if (ancestorParts.length > nodeParts.length) {
    return false;
  }

  for (let i = 0; i < ancestorParts.length; i++) {
    if (ancestorParts[i] !== nodeParts[i]) {
      return false;
    }
  }

  return true;
}
