export class NodeUnion<ValueT, ChildT> {
  private child: ChildT;
  private value: ValueT;

  getChild(): ChildT {
    return this.child;
  }

  setChild(c: ChildT): void {
    this.child = c;
  }

  getValue(): ValueT {
    return this.value;
  }

  setValue(v: ValueT): void {
    this.value = v;
  }
}
