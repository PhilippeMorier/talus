import { Coord } from '../math';
import { InternalNode2 } from './internal-node';
import { LeafNode } from './leaf-node';
import { RootNode } from './root-node';

describe('RootNode', () => {
  it('should set given value and activate it', () => {
    const root = new RootNode(-1);

    root.setValueOn({ x: 0, y: 0, z: 0 }, 24);
    root.setValueOn({ x: 102, y: 15, z: 127 }, 42);

    expect(root.getValue({ x: 0, y: 0, z: 0 })).toEqual(24);
    expect(root.getValue({ x: 102, y: 15, z: 127 })).toEqual(42);

    expect(root.isValueOn({ x: 0, y: 0, z: 0 })).toEqual(true);
    expect(root.isValueOn({ x: 102, y: 15, z: 127 })).toEqual(true);

    expect(root.getValue({ x: 1, y: 1, z: 1 })).toEqual(-1);
  });

  it('should return background', () => {
    const root = new RootNode(-1);

    expect(root.getValue({ x: 111, y: 222, z: 333 })).toEqual(-1);
  });

  it('should set value when given float coordinates', () => {
    const root = new RootNode(-1);

    root.setValueOn({ x: 0, y: 0, z: 0.1 }, 1);
    root.setValueOn({ x: 0, y: 1.5, z: 0 }, 5);
    root.setValueOn({ x: 2.9, y: 0, z: 0 }, 9);

    expect(root.getValue({ x: 0, y: 0, z: 0 })).toEqual(1);
    expect(root.getValue({ x: 0, y: 0, z: 1 })).toEqual(-1);
    expect(root.getValue({ x: 0, y: 1, z: 0 })).toEqual(5);
    expect(root.getValue({ x: 0, y: 2, z: 0 })).toEqual(-1);
    expect(root.getValue({ x: 2, y: 0, z: 0 })).toEqual(9);
    expect(root.getValue({ x: 3, y: 0, z: 0 })).toEqual(-1);

    root.setValueOn({ x: 0, y: 0, z: -1.2 }, -2);
    root.setValueOn({ x: 0, y: -2.5, z: 0 }, -5);
    root.setValueOn({ x: -3.9, y: 0, z: 0 }, -9);

    expect(root.getValue({ x: 0, y: 0, z: -1 })).toEqual(-2);
    expect(root.getValue({ x: 0, y: -2, z: 0 })).toEqual(-5);
    expect(root.getValue({ x: -3, y: 0, z: 0 })).toEqual(-9);
  });

  it('should count all activated voxels', () => {
    const root = new RootNode(-1);

    root.setValueOn({ x: 0, y: 0, z: 0 }, 24);
    root.setValueOn({ x: 102, y: 15, z: 127 }, 42);

    expect(root.onVoxelCount()).toEqual(2);
  });

  it('should create new entries when inserting values', () => {
    const root = new RootNode(-1);

    root.setValueOn({ x: 0, y: 0, z: 0 }, 24);
    root.setValueOn({ x: 0, y: 0, z: 1 }, 24);
    root.setValueOn({ x: 102, y: 15, z: 127 }, 42);
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

    root.setValueOn({ x: 0, y: 0, z: 0 }, expectedValues[0]);
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

    root.setValueOn({ x: 0, y: 0, z: 0 }, 42);
    root.setValueOn(new Coord(0, 0, LeafNode.DIM), 42);

    expect(root.numBackgroundTiles()).toEqual(0);
  });

  it('should convert Coord to key and back', () => {
    const coord: Coord = new Coord(InternalNode2.DIM, InternalNode2.DIM - 1, InternalNode2.DIM);
    const key = RootNode.coordToKey(coord);

    expect(key).toEqual(`256,0,256`);
    expect(RootNode.keyToCoord(key)).toEqual({ x: 256, y: 0, z: 256 });
  });
});
