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

  setOn(i: Index): void {
    this.mask.set(i, true);
  }

  isOn(i: Index): boolean {
    return this.mask.test(i);
  }

  countOn(): number {
    return this.mask.size;
  }

  *beginOn(): IterableIterator<number> {
    const iterator = this.mask.entries();
    let result = iterator.next();

    while (!result.done) {
      const isBitOn = result.value[1] === 1;
      if (isBitOn) {
        yield result.value[0];
      }

      result = iterator.next();
    }
  }

  setOff(i: Index): void {
    this.mask.set(i, false);
  }

  isOff(i: Index): boolean {
    return this.mask.test(i) === false;
  }

  set(i: Index, on: boolean): void {
    on ? this.setOn(i) : this.setOff(i);
  }
}
