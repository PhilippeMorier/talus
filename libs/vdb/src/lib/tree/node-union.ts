export class NodeUnion<ValueT, ChildT> {
  private child?: ChildT;
  private value?: ValueT;

  constructor(value?: ValueT) {
    if (value !== undefined) {
      this.setValue(value);
    }
  }

  getChild(): ChildT {
    if (!this.child) {
      throw new Error('Child is not set.');
    }

    return this.child;
  }

  setChild(c: ChildT): void {
    this.child = c;
  }

  getValue(): ValueT {
    if (!this.value) {
      throw new Error('Value is not set.');
    }

    return this.value;
  }

  setValue(v: ValueT): void {
    this.value = v;
  }
}
