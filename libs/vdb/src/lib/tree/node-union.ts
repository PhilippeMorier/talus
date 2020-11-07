export class NodeUnion<ValueT, ChildT> {
  private child?: ChildT;
  private value?: ValueT;

  constructor(value?: ValueT) {
    if (value !== undefined) {
      this.setValue(value);
    }
  }

  getChild(): ChildT | undefined {
    return this.child;
  }

  setChild(c: ChildT): void {
    this.child = c;
  }

  getValue(): ValueT | undefined {
    return this.value;
  }

  setValue(v: ValueT): void {
    this.value = v;
  }
}
