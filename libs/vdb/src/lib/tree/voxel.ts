import { Coord } from '../math/coord';
import { Index } from '../types';

export class Voxel<T> {
  static LOG2DIM: Index = 0;

  globalCoord: Coord;
  value: T;
}
