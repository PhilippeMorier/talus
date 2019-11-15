import { createDenseArray } from './array';

describe('Array', () => {
  describe('createDenseArray()', () => {
    it('should create array with given length', () => {
      const array = createDenseArray<boolean>(10);

      expect(array.length).toEqual(10);
    });

    it('should create array with undefined initial values', () => {
      const array = createDenseArray<boolean>(10);

      array.every(value => expect(value).toBeUndefined());
    });

    it('should create array with different objects as initial values', () => {
      const array = createDenseArray(3, () => ({ property: 0 }));
      array[0].property = 42;
      array[2].property = 43;

      expect(array[0].property).toEqual(42);
      expect(array[1].property).toEqual(0);
      expect(array[2].property).toEqual(43);
    });
  });
});
