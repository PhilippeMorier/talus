import { Index } from '@talus/vdb';
import { BitSet } from 'mnemonist';

export class NodeMask {
  private mask = new BitSet(64);

  constructor(on?: boolean) {
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
