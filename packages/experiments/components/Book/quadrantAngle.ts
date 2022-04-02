// keep the rotation beween 0 and 90 deg

export function quadrantAngle(angle: number) {
  const quadrant = Math.ceil(angle / 90);
  const isQuadrantEven = quadrant % 2 == 0;
  const quadrantMaxAngle = 90 * quadrant;
  const quadrantAngle = quadrantMaxAngle - angle;
  return isQuadrantEven ? quadrantAngle : 90 - quadrantAngle;
}
