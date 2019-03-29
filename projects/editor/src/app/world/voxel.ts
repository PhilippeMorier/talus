export class Voxel {
  constructor(public objectId: number, public type: number) {}
}

// max objectId: 2^15 - 1
// max type: 2^16 - 1
export function toVoxelValue({ objectId, type }: Voxel): number {
  // tslint:disable-next-line:no-bitwise
  return (objectId << 16) | (type & 65535);
}

export function toVoxel(value: number): Voxel {
  // tslint:disable-next-line:no-bitwise
  return new Voxel(value >> 16, value & 65535);
}
