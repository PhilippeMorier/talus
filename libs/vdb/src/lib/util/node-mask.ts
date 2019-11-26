import { BitSet } from 'mnemonist';
import { Index } from '../tree/leaf-node';

export class NodeMask {
  private mask: BitSet;

  constructor(bitSetLength: number, on?: boolean) {
    this.mask = new BitSet(bitSetLength);

    if (on) {
      this.setAllOn();
    }
  }

  setAllOn(): void {
    for (let i = 0; i < this.mask.length; i++) {
      this.setOn(i);
    }
  }

  setOn(n: Index): void {
    this.mask.set(n, true);
  }

  isOn(n: Index): boolean {
    return this.mask.test(n);
  }

  countOn(): number {
    return this.mask.size;
  }

  *beginOn(): IterableIterator<[number, number]> {
    const iterator = this.mask.entries();
    let result = iterator.next();

    while (!result.done) {
      const isBitOn = result.value[1] === 1;
      if (isBitOn) {
        yield result.value;
      }

      result = iterator.next();
    }
  }

  setOff(n: Index): void {
    this.mask.set(n, false);
  }

  isOff(i: Index): boolean {
    return this.mask.test(i) === false;
  }
}
