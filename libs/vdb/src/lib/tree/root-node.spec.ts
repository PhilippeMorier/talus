import { Coord } from '../math';
import { InternalNode2 } from './internal-node';
import { LeafNode } from './leaf-node';
import { RootNode } from './root-node';

describe('RootNode', () => {
  it('should set given value and activate it', () => {
    const root = new RootNode(-1);

    root.setValueOn(new Coord(0, 0, 0), 24);
    root.setValueOn(new Coord(102, 15, 127), 42);

    expect(root.getValue(new Coord(0, 0, 0))).toEqual(24);
    expect(root.getValue(new Coord(102, 15, 127))).toEqual(42);

    expect(root.isValueOn(new Coord(0, 0, 0))).toEqual(true);
    expect(root.isValueOn(new Coord(102, 15, 127))).toEqual(true);

    expect(root.getValue(new Coord(1, 1, 1))).toEqual(-1);
  });

  it('should return background', () => {
    const root = new RootNode(-1);

    expect(root.getValue(new Coord(111, 222, 333))).toEqual(-1);
  });

  it('should set value when given float coordinates', () => {
    const root = new RootNode(-1);

    root.setValueOn(new Coord(0, 0, 0.1), 1);
    root.setValueOn(new Coord(0, 1.5, 0), 5);
    root.setValueOn(new Coord(2.9, 0, 0), 9);

    expect(root.getValue(new Coord(0, 0, 0))).toEqual(1);
    expect(root.getValue(new Coord(0, 0, 1))).toEqual(-1);
    expect(root.getValue(new Coord(0, 1, 0))).toEqual(5);
    expect(root.getValue(new Coord(0, 2, 0))).toEqual(-1);
    expect(root.getValue(new Coord(2, 0, 0))).toEqual(9);
    expect(root.getValue(new Coord(3, 0, 0))).toEqual(-1);

    root.setValueOn(new Coord(0, 0, -1.2), -2);
    root.setValueOn(new Coord(0, -2.5, 0), -5);
    root.setValueOn(new Coord(-3.9, 0, 0), -9);

    expect(root.getValue(new Coord(0, 0, -1))).toEqual(-2);
    expect(root.getValue(new Coord(0, -2, 0))).toEqual(-5);
    expect(root.getValue(new Coord(-3, 0, 0))).toEqual(-9);
  });

  it('should count all activated voxels', () => {
    const root = new RootNode(-1);

    root.setValueOn(new Coord(0, 0, 0), 24);
    root.setValueOn(new Coord(102, 15, 127), 42);

    expect(root.onVoxelCount()).toEqual(2);
  });

  it('should create new entries when inserting values', () => {
    const root = new RootNode(-1);

    root.setValueOn(new Coord(0, 0, 0), 24);
    root.setValueOn(new Coord(0, 0, 1), 24);
    root.setValueOn(new Coord(102, 15, 127), 42);
    expect(root.getTableSize()).toEqual(1);

    root.setValueOn(new Coord(0, 0, InternalNode2.DIM), 42);
    root.setValueOn(new Coord(0, 1, InternalNode2.DIM), 42);
    root.setValueOn(new Coord(1, 0, InternalNode2.DIM), 42);
    expect(root.getTableSize()).toEqual(2);

    root.setValueOn(new Coord(InternalNode2.DIM, 0, 0), 42);
    root.setValueOn(new Coord(InternalNode2.DIM, 0, 1), 42);
    root.setValueOn(new Coord(InternalNode2.DIM, 1, 0), 42);
    expect(root.getTableSize()).toEqual(3);
  });

  it('should iterate over all activated voxels', () => {
    const root = new RootNode(-1);
    const expectedValues = [0, 1, 2, 3];

    root.setValueOn(new Coord(0, 0, 0), expectedValues[0]);
    root.setValueOn(new Coord(0, 0, InternalNode2.DIM), expectedValues[1]);
    root.setValueOn(new Coord(0, InternalNode2.DIM, 0), expectedValues[2]);
    root.setValueOn(new Coord(InternalNode2.DIM, 0, 0), expectedValues[3]);

    let counter = 0;
    for (const voxel of root.beginVoxelOn()) {
      expect(voxel.value).toEqual(expectedValues[counter]);
      counter++;
    }

    expect(counter).toEqual(expectedValues.length);
  });

  it('should have no background tiles', () => {
    const root = new RootNode(-1);

    root.setValueOn(new Coord(0, 0, 0), 42);
    root.setValueOn(new Coord(0, 0, LeafNode.DIM), 42);

    expect(root.numBackgroundTiles()).toEqual(0);
  });

  it('should convert Coord to key and back', () => {
    const coord: Coord = new Coord(InternalNode2.DIM, InternalNode2.DIM - 1, InternalNode2.DIM);
    const key = RootNode.coordToKey(coord);

    expect(key).toEqual(`256,0,256`);
    expect(RootNode.keyToCoord(key)).toEqual(new Coord(256, 0, 256));
  });
});
