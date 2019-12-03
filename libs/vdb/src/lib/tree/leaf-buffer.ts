import { createDenseArray } from '../util/array';
import { Index } from './leaf-node';

export class LeafBuffer<T> {
  private data: T[] = createDenseArray(this.size);

  /**
   * Construct a buffer populated with the specified value.
   */
  constructor(private size: Index, value?: T) {
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
