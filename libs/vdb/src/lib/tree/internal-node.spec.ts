import { Coord } from '../math';
import { InternalNode1, InternalNode2 } from './internal-node';
import { LeafNode } from './leaf-node';

describe('InternalNode', () => {
  describe('InternalNode1', () => {
    describe('static config values', () => {
      expect(InternalNode1.LOG2DIM).toEqual(3);
      expect(InternalNode1.TOTAL).toEqual(3 + 3);
      expect(InternalNode1.DIM).toEqual(64);
      expect(InternalNode1.NUM_VALUES).toEqual(512);
      expect(InternalNode1.LEVEL).toEqual(1);
      expect(InternalNode1.NUM_VOXELS).toEqual(262_144);
    });

    describe('setValueOn()', () => {
      it.each([
        [new Coord(0, 0, 0), true],
        [new Coord(0, 0, 0), false],
        [new Coord(0, 0, 1), true],
        [new Coord(0, 0, 1), false],
        [new Coord(0, 1, 0), true],
        [new Coord(0, 1, 0), false],
        [new Coord(1, 0, 0), true],
        [new Coord(1, 0, 0), false],
        [new Coord(0, 0, InternalNode1.DIM - 1), true],
        [new Coord(0, 0, InternalNode1.DIM - 1), false],
        [new Coord(0, InternalNode1.DIM - 1, 0), true],
        [new Coord(0, InternalNode1.DIM - 1, 0), false],
        [new Coord(InternalNode1.DIM - 1, 0, 0), true],
        [new Coord(InternalNode1.DIM - 1, 0, 0), false],
      ])(
        '%#. should set and activate at the given index %j the value (%j)',
        (xyz: Coord, value: boolean) => {
          const child = new InternalNode1<boolean>(new Coord(0, 0, 0));

          child.setValueOn(xyz, value);

          expect(child.getValue(xyz)).toEqual(value);
        },
      );

      it('should get `undefined` on an unset index', () => {
        const child = new InternalNode1<boolean>(new Coord(0, 0, 0));

        expect(child.getValue(new Coord(0, 0, 0))).toBeUndefined();
      });
    });

    describe('coordToOffset()', () => {
      it.each([
        [new Coord(0, 0, LeafNode.DIM), 1],
        [new Coord(0, LeafNode.DIM, LeafNode.DIM), 8 + 1],
        [new Coord(LeafNode.DIM, LeafNode.DIM, LeafNode.DIM), 64 + 8 + 1],

        [new Coord(0, 0, LeafNode.DIM * 0), 0],
        [new Coord(0, 0, LeafNode.DIM * 1), 1],
        [new Coord(0, 0, LeafNode.DIM * 2), 2],
        [new Coord(0, 0, LeafNode.DIM * 3), 3],

        [new Coord(0, LeafNode.DIM * 0, 0), 0 * 8],
        [new Coord(0, LeafNode.DIM * 1, 0), 1 * 8],
        [new Coord(0, LeafNode.DIM * 2, 0), 2 * 8],
        [new Coord(0, LeafNode.DIM * 3, 0), 3 * 8],

        [new Coord(LeafNode.DIM * 0, 0, 0), 0 * 64],
        [new Coord(LeafNode.DIM * 1, 0, 0), 1 * 64],
        [new Coord(LeafNode.DIM * 2, 0, 0), 2 * 64],
        [new Coord(LeafNode.DIM * 3, 0, 0), 3 * 64],

        // 24 / 8 = 3 -> 3 x 64 = 192  ╮
        // 9  / 8 = 1 -> 1 x 8  = 8    ├─> 192 + 8 + 2 = 202
        // 17 / 8 = 2 -> 2 x 1  = 2    ╯
        [new Coord(24, 9, 17), 202],
      ])('should return for coordinate %j the offset (%j)', (xyz: Coord, offset: number) => {
        const child = new InternalNode1<number>(new Coord(0, 0, 0));

        expect(child.coordToOffset(xyz)).toEqual(offset);
      });
    });

    describe('isValueOn()', () => {
      it('should set each voxel', () => {
        const node1 = new InternalNode1<number>(new Coord(0, 0, 0));
        const maxDim = InternalNode1.DIM / 4; // Shorten test running time

        let onCounter = 0;
        for (let x = 0; x < maxDim; x++) {
          for (let y = 0; y < maxDim; y++) {
            for (let z = 0; z < maxDim; z++) {
              node1.setValueOn(new Coord(x, y, z), onCounter);

              expect(node1.getValue(new Coord(x, y, z))).toEqual(onCounter);
              onCounter++;
            }
          }
        }

        expect(onCounter).toEqual(Math.pow(maxDim, 3));
      });
    });

    describe('onVoxelCount()', () => {
      it('should count all activated voxels', () => {
        const node1 = new InternalNode1<number>(new Coord(0, 0, 0));
        const maxDim = InternalNode1.DIM / 4; // Shorten test running time

        let onCounter = 0;
        for (let x = 0; x < maxDim; x++) {
          for (let y = 0; y < maxDim; y++) {
            for (let z = 0; z < maxDim; z++) {
              node1.setValueOn(new Coord(x, y, z), 42);
              onCounter++;

              expect(node1.onVoxelCount()).toEqual(onCounter);
            }
          }
        }

        expect(onCounter).toEqual(Math.pow(maxDim, 3));
      });
    });

    describe('beginVoxelOn()', () => {
      it('should iterate over all activated voxels', () => {
        const node1 = new InternalNode1<number>(new Coord(0, 0, 0));
        const expectedValues = [0, 1, 2, 3];

        node1.setValueOn(new Coord(0, 0, 0), expectedValues[0]);
        node1.setValueOn(new Coord(0, 0, 11), expectedValues[1]);
        node1.setValueOn(new Coord(0, 22, 0), expectedValues[2]);
        node1.setValueOn(new Coord(31, 0, 0), expectedValues[3]);

        let counter = 0;
        for (const voxel of node1.beginVoxelOn()) {
          expect(voxel.value).toEqual(expectedValues[counter]);
          counter++;
        }

        expect(counter).toEqual(expectedValues.length);
      });
    });
  });

  describe('InternalNode2', () => {
    describe('static config values', () => {
      expect(InternalNode2.LOG2DIM).toEqual(2);
      expect(InternalNode2.TOTAL).toEqual(2 + 3 + 3);
      expect(InternalNode2.DIM).toEqual(256);
      expect(InternalNode2.NUM_VALUES).toEqual(64);
      expect(InternalNode2.LEVEL).toEqual(2);
      expect(InternalNode2.NUM_VOXELS).toEqual(16_777_216);
    });

    describe('setValueOn()', () => {
      const generateRandomInRange = (min: number, max: number): number =>
        Math.floor(Math.random() * (max - min + 1) + min);
      const generateRandomCoord = (min: number, max: number): Coord =>
        new Coord(
          generateRandomInRange(min, max),
          generateRandomInRange(min, max),
          generateRandomInRange(min, max),
        );
      const generateRandomCoords = (length: number, min: number, max: number): Coord[][] => {
        return Array.from({ length }, () => [generateRandomCoord(min, max)]);
      };

      it.each(generateRandomCoords(100, 0, InternalNode2.DIM - 1))(
        'should set/get random value at %j ',
        (xyz: Coord) => {
          const node2 = new InternalNode2<boolean>(new Coord(0, 0, 0));

          node2.setValueOn(xyz, true);

          expect(node2.isValueOn(xyz)).toBeTruthy();
        },
      );
    });

    describe('coordToOffset()', () => {
      it.each([
        [new Coord(0, 0, 0), 0],
        [new Coord(0, 0, 256), 0],
        [new Coord(0, 0, 64), 1],
        [new Coord(0, 0, 128), 2],
        [new Coord(0, 0, 192), 3],

        [new Coord(0, 0, 64), 1],
        [new Coord(0, 64, 0), 4],
        [new Coord(64, 0, 0), 16],
      ])('should return for coordinate %j the offset (%j)', (xyz: Coord, offset: number) => {
        const child = new InternalNode2<number>(new Coord(0, 0, 0));

        expect(child.coordToOffset(xyz)).toEqual(offset);
      });
    });

    describe('onVoxelCount()', () => {
      it('should count all activated voxels', () => {
        const node2 = new InternalNode2<number>(new Coord(0, 0, 0));
        const maxDim = InternalNode2.DIM / 4; // Shorten test running time

        let onCounter = 0;
        for (let x = 0; x < maxDim; x++) {
          for (let y = 0; y < maxDim; y++) {
            for (let z = 0; z < maxDim; z++) {
              node2.setValueOn(new Coord(x, y, z), 42);
              onCounter++;
            }
          }
        }

        expect(onCounter).toEqual(Math.pow(maxDim, 3));
      });
    });

    describe('beginVoxelOn()', () => {
      it('should iterate over all activated voxels', () => {
        const node2 = new InternalNode2<number>(new Coord(0, 0, 0));
        const expectedValues = [0, 1, 2, 3];

        node2.setValueOn(new Coord(0, 0, 0), expectedValues[0]);
        node2.setValueOn(new Coord(0, 0, 50), expectedValues[1]);
        node2.setValueOn(new Coord(0, 75, 0), expectedValues[2]);
        node2.setValueOn(new Coord(InternalNode2.DIM - 1, 0, 0), expectedValues[3]);

        let counter = 0;
        for (const voxel of node2.beginVoxelOn()) {
          expect(voxel.value).toEqual(expectedValues[counter]);
          counter++;
        }

        expect(counter).toEqual(expectedValues.length);
      });
    });
  });
});
