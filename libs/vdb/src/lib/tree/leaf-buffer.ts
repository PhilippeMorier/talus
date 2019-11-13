import { Index, LeafNode, ValueType } from './leaf-node';

export class LeafBuffer<T extends ValueType> {
  private size: Index = LeafNode.LOG2DIM;
  // Creating a dense/packed array, so it has no holes and avoiding it to be sparse.
  // Dense: [undefined, 1, 2], sparse: [,,2] -> Chrome displays it as [empty × 2, 2]
  private data: T[] = Array.apply(null, Array(this.size));

  /**
   * Construct a buffer populated with the specified value.
   */
  constructor(value?: T) {
    if (value) {
      this.fill(value);
    }
  }

  setValue(i: Index, value: T): void {
    this.data[i] = value;
  }

  getValue(i: Index): T {
    return this.data[i];
  }

  private fill(value: T): void {
    this.data.fill(value);
  }
}
