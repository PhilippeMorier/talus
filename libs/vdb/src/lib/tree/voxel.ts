import { Coord } from '../math/coord';

export class Voxel<T> {
  globalCoord: Coord;
  value: T;
}
