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
        [{ x: 0, y: 0, z: 0 }, true],
        [{ x: 0, y: 0, z: 0 }, false],
        [{ x: 0, y: 0, z: 1 }, true],
        [{ x: 0, y: 0, z: 1 }, false],
        [{ x: 0, y: 1, z: 0 }, true],
        [{ x: 0, y: 1, z: 0 }, false],
        [{ x: 1, y: 0, z: 0 }, true],
        [{ x: 1, y: 0, z: 0 }, false],
        [{ x: 0, y: 0, z: InternalNode1.DIM - 1 }, true],
        [{ x: 0, y: 0, z: InternalNode1.DIM - 1 }, false],
        [{ x: 0, y: InternalNode1.DIM - 1, z: 0 }, true],
        [{ x: 0, y: InternalNode1.DIM - 1, z: 0 }, false],
        [{ x: InternalNode1.DIM - 1, y: 0, z: 0 }, true],
        [{ x: InternalNode1.DIM - 1, y: 0, z: 0 }, false],
      ])(
        '%#. should set and activate at the given index %j the value (%j)',
        (xyz: Coord, value: boolean) => {
          const child = new InternalNode1<boolean>({ x: 0, y: 0, z: 0 });

          child.setValueOn(xyz, value);

          expect(child.getValue(xyz)).toEqual(value);
        },
      );

      it('should throw an error when accessing on empty index', () => {
        const child = new InternalNode1<boolean>({ x: 0, y: 0, z: 0 });

        expect(() => child.getValue({ x: 0, y: 0, z: 0 })).toThrow();
      });
    });

    describe('coordToOffset()', () => {
      it.each([
        [{ x: 0, y: 0, z: LeafNode.DIM }, 1],
        [{ x: 0, y: LeafNode.DIM, z: LeafNode.DIM }, 8 + 1],
        [{ x: LeafNode.DIM, y: LeafNode.DIM, z: LeafNode.DIM }, 64 + 8 + 1],

        [{ x: 0, y: 0, z: LeafNode.DIM * 0 }, 0],
        [{ x: 0, y: 0, z: LeafNode.DIM * 1 }, 1],
        [{ x: 0, y: 0, z: LeafNode.DIM * 2 }, 2],
        [{ x: 0, y: 0, z: LeafNode.DIM * 3 }, 3],

        [{ x: 0, y: LeafNode.DIM * 0, z: 0 }, 0 * 8],
        [{ x: 0, y: LeafNode.DIM * 1, z: 0 }, 1 * 8],
        [{ x: 0, y: LeafNode.DIM * 2, z: 0 }, 2 * 8],
        [{ x: 0, y: LeafNode.DIM * 3, z: 0 }, 3 * 8],

        [{ x: LeafNode.DIM * 0, y: 0, z: 0 }, 0 * 64],
        [{ x: LeafNode.DIM * 1, y: 0, z: 0 }, 1 * 64],
        [{ x: LeafNode.DIM * 2, y: 0, z: 0 }, 2 * 64],
        [{ x: LeafNode.DIM * 3, y: 0, z: 0 }, 3 * 64],

        // 24 / 8 = 3 -> 3 x 64 = 192  ╮
        // 9  / 8 = 1 -> 1 x 8  = 8    ├─> 192 + 8 + 2 = 202
        // 17 / 8 = 2 -> 2 x 1  = 2    ╯
        [{ x: 24, y: 9, z: 17 }, 202],
      ])('should return for coordinate %j the offset (%j)', (xyz: Coord, offset: number) => {
        const child = new InternalNode1<number>({ x: 0, y: 0, z: 0 });

        expect(child.coordToOffset(xyz)).toEqual(offset);
      });
    });

    describe('isValueOn()', () => {
      it('should set each voxel', () => {
        const node1 = new InternalNode1<number>({ x: 0, y: 0, z: 0 });
        const maxDim = InternalNode1.DIM / 4; // Shorten test running time

        let onCounter = 0;
        for (let x = 0; x < maxDim; x++) {
          for (let y = 0; y < maxDim; y++) {
            for (let z = 0; z < maxDim; z++) {
              node1.setValueOn({ x, y, z }, onCounter);

              expect(node1.getValue({ x, y, z })).toEqual(onCounter);
              onCounter++;
            }
          }
        }

        expect(onCounter).toEqual(Math.pow(maxDim, 3));
      });
    });

    describe('onVoxelCount()', () => {
      it('should count all activated voxels', () => {
        const node1 = new InternalNode1<number>({ x: 0, y: 0, z: 0 });
        const maxDim = InternalNode1.DIM / 4; // Shorten test running time

        let onCounter = 0;
        for (let x = 0; x < maxDim; x++) {
          for (let y = 0; y < maxDim; y++) {
            for (let z = 0; z < maxDim; z++) {
              node1.setValueOn({ x, y, z }, 42);
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
        const node1 = new InternalNode1<number>({ x: 0, y: 0, z: 0 });
        const expectedValues = [0, 1, 2, 3];

        node1.setValueOn({ x: 0, y: 0, z: 0 }, expectedValues[0]);
        node1.setValueOn({ x: 0, y: 0, z: 11 }, expectedValues[1]);
        node1.setValueOn({ x: 0, y: 22, z: 0 }, expectedValues[2]);
        node1.setValueOn({ x: 31, y: 0, z: 0 }, expectedValues[3]);

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
      const generateRandomCoord = (min: number, max: number): Coord => ({
        x: generateRandomInRange(min, max),
        y: generateRandomInRange(min, max),
        z: generateRandomInRange(min, max),
      });
      const generateRandomCoords = (length: number, min: number, max: number): Coord[][] => {
        return Array.from({ length }, () => [generateRandomCoord(min, max)]);
      };

      it.each(generateRandomCoords(100, 0, InternalNode2.DIM - 1))(
        'should set/get random value at %j ',
        (xyz: Coord) => {
          const node2 = new InternalNode2<boolean>({ x: 0, y: 0, z: 0 });

          node2.setValueOn(xyz, true);

          expect(node2.isValueOn(xyz)).toBeTruthy();
        },
      );
    });

    describe('coordToOffset()', () => {
      it.each([
        [{ x: 0, y: 0, z: 0 }, 0],
        [{ x: 0, y: 0, z: 256 }, 0],
        [{ x: 0, y: 0, z: 64 }, 1],
        [{ x: 0, y: 0, z: 128 }, 2],
        [{ x: 0, y: 0, z: 192 }, 3],

        [{ x: 0, y: 0, z: 64 }, 1],
        [{ x: 0, y: 64, z: 0 }, 4],
        [{ x: 64, y: 0, z: 0 }, 16],
      ])('should return for coordinate %j the offset (%j)', (xyz: Coord, offset: number) => {
        const child = new InternalNode2<number>({ x: 0, y: 0, z: 0 });

        expect(child.coordToOffset(xyz)).toEqual(offset);
      });
    });

    describe('onVoxelCount()', () => {
      it('should count all activated voxels', () => {
        const node2 = new InternalNode2<number>({ x: 0, y: 0, z: 0 });
        const maxDim = InternalNode2.DIM / 4; // Shorten test running time

        let onCounter = 0;
        for (let x = 0; x < maxDim; x++) {
          for (let y = 0; y < maxDim; y++) {
            for (let z = 0; z < maxDim; z++) {
              node2.setValueOn({ x, y, z }, 42);
              onCounter++;
            }
          }
        }

        expect(onCounter).toEqual(Math.pow(maxDim, 3));
      });
    });

    describe('beginVoxelOn()', () => {
      it('should iterate over all activated voxels', () => {
        const node2 = new InternalNode2<number>({ x: 0, y: 0, z: 0 });
        const expectedValues = [0, 1, 2, 3];

        node2.setValueOn({ x: 0, y: 0, z: 0 }, expectedValues[0]);
        node2.setValueOn({ x: 0, y: 0, z: 50 }, expectedValues[1]);
        node2.setValueOn({ x: 0, y: 75, z: 0 }, expectedValues[2]);
        node2.setValueOn({ x: InternalNode2.DIM - 1, y: 0, z: 0 }, expectedValues[3]);

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
