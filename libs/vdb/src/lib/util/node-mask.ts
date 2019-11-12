import { BitSet } from 'mnemonist';

export class NodeMask {
  private mask = new BitSet(64);

  /**
   * Set the <i>n</i>th  bit on
   */
  setOn(n: number): void {
    this.mask.set(n, true);
  }
}
