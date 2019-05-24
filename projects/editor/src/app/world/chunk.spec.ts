import { Chunk } from './chunk';
import { Vector3, X, Y, Z } from './vector3';
import { Voxel } from './voxel';

describe('Chunk', () => {
  let chunk: Chunk;
  const size: Vector3 = [2, 2, 2];

  beforeEach(() => {
    chunk = new Chunk(size, [0, 0, 0]);
  });

  it('should initialize chunk', () => {
    const emptyVoxel = new Voxel(0, 0);
    for (let x = 0; x < chunk.size[X]; x++) {
      for (let y = 0; y < chunk.size[Y]; y++) {
        for (let z = 0; z < chunk.size[Z]; z++) {
          expect(chunk.getVoxel([x, y, z])).toEqual(emptyVoxel);
        }
      }
    }
  });

  it('should set and get the same voxel', () => {
    const voxel = new Voxel(1, 42);
    chunk.setVoxel([0, 0, 0], voxel);

    expect(chunk.getVoxel([0, 0, 0])).toEqual(voxel);
  });

  it('should have `undefined` for empty voxel', () => {
    const emptyVoxel = new Voxel(0, 0);
    expect(chunk.getVoxel([0, 0, 0])).toEqual(emptyVoxel);
    expect(chunk.getVoxel([1, 1, 1])).toEqual(emptyVoxel);
  });

  it('should set position correctly', () => {
    let testChunk = new Chunk([2, 2, 2], [0, 0, 0]);
    expect(testChunk.position).toEqual([0, 0, 0]);

    testChunk = new Chunk([2, 2, 2], [1, 1, 1]);
    expect(testChunk.position).toEqual([2, 2, 2]);

    testChunk = new Chunk([2, 2, 2], [0, 1, 2]);
    expect(testChunk.position).toEqual([0, 2, 4]);
  });

  it('should set get chunk id', () => {
    let testChunk = new Chunk([2, 2, 2], [0, 0, 0]);
    expect(testChunk.name).toEqual('chunk 0,0,0');

    testChunk = new Chunk([4, 4, 4], [1, 2, 3]);
    expect(testChunk.name).toEqual('chunk 1,2,3');
  });
});
