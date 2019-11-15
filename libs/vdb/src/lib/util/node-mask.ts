import { BitSet } from 'mnemonist';
import { Index } from '../tree/leaf-node';

export class NodeMask {
  private mask: BitSet;

  constructor(bitSetLength: number, on?: boolean) {
    this.mask = new BitSet(bitSetLength);

    if (on) {
      this.mask.forEach(index => this.mask.set(index, on));
    }
  }

  setOn(n: Index): void {
    this.mask.set(n, true);
  }

  isOn(n: Index): boolean {
    return this.mask.test(n);
  }

  setOff(n: Index): void {
    this.mask.set(n, false);
  }

  isOff(i: Index): boolean {
    return this.mask.test(i) === false;
  }
}
