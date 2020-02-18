export function createDenseArray<T>(length: number, initialValueFactory?: () => T): T[] {
  // Creating a dense/packed array, so it has no holes and avoiding it to be sparse.
  // Dense: [undefined, 1, 2], sparse: [,,2] -> Chrome displays it as [empty × 2, 2]

  // eslint-disable-next-line prefer-spread
  const array: T[] = Array.apply(null, Array(length));

  if (initialValueFactory) {
    array.forEach((_, i) => (array[i] = initialValueFactory()));
  }

  return array;
}
