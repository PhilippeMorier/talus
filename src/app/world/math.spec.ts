import { isPowerOfTwo } from './math';

describe('Math', () => {
  it('should determine if number is power of two', () => {
    expect(isPowerOfTwo(1)).toBeTruthy();
    expect(isPowerOfTwo(2)).toBeTruthy();
    expect(isPowerOfTwo(4)).toBeTruthy();
    expect(isPowerOfTwo(8)).toBeTruthy();
    expect(isPowerOfTwo(16)).toBeTruthy();
  });

  it('should determine if number is NOT power of two', () => {
    expect(isPowerOfTwo(3)).toBeFalsy();
    expect(isPowerOfTwo(5)).toBeFalsy();
    expect(isPowerOfTwo(7)).toBeFalsy();
    expect(isPowerOfTwo(-8)).toBeFalsy();
  });
});
