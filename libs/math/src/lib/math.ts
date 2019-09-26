export function isPowerOfTwo(check: number): boolean {
  // 8 = 1000, 7 = 0111

  // tslint:disable-next-line:no-bitwise
  return (check & (check - 1)) === 0;
}
