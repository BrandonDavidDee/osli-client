export function getAspectRatio(width: number, height: number) {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const commonDivisor = gcd(width, height);
  const reducedWidth = width / commonDivisor;
  const reducedHeight = height / commonDivisor;
  return {
    width: reducedWidth,
    height: reducedHeight,
  };
}
