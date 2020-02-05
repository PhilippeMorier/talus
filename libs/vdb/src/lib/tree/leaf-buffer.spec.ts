import { LeafBuffer } from './leaf-buffer';

describe('LeafBuffer', () => {
  it('should fill with 0', () => {
    const size = 24;
    const buffer = new LeafBuffer(size, 0);

    for (let i = 0; i < size; i++) {
      expect(buffer.getValue(i)).toEqual(0);
    }
  });
});
