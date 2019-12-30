import { areEqual, clone, Coord } from '../math';
import { ValueAccessor3 } from './value-accessor';

export class ValueAccessorPath {
  readonly leafNodeOrigins: Coord[] = [];
  readonly internalNode1Origins: Coord[] = [];
  readonly internalNode2Origins: Coord[] = [];

  constructor(leafNodeOrigin?: Coord, internalNode1Origin?: Coord, internalNode2Origin?: Coord) {
    if (leafNodeOrigin) {
      this.leafNodeOrigins.push(clone(leafNodeOrigin));
    }
    if (internalNode1Origin) {
      this.internalNode1Origins.push(clone(internalNode1Origin));
    }
    if (internalNode2Origin) {
      this.internalNode2Origins.push(clone(internalNode2Origin));
    }
  }

  add(path: ValueAccessorPath): void {
    path.leafNodeOrigins.forEach(toAddOrigin => {
      if (!this.leafNodeOrigins.some(origin => areEqual(origin, toAddOrigin))) {
        this.leafNodeOrigins.push(toAddOrigin);
      }
    });

    path.internalNode1Origins.forEach(toAddOrigin => {
      if (!this.internalNode1Origins.some(origin => areEqual(origin, toAddOrigin))) {
        this.internalNode1Origins.push(toAddOrigin);
      }
    });

    path.internalNode2Origins.forEach(toAddOrigin => {
      if (!this.internalNode2Origins.some(origin => areEqual(origin, toAddOrigin))) {
        this.internalNode2Origins.push(toAddOrigin);
      }
    });
  }
}

export function getPathFromValueAccessor<T>(accessor: ValueAccessor3<T>): ValueAccessorPath {
  return new ValueAccessorPath(accessor.leafKey, accessor.internalKey1, accessor.internalKey2);
}
