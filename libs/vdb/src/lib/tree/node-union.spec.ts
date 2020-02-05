import { NodeUnion } from './node-union';

describe('NodeUnion', () => {
  it('should initialize with 0', () => {
    const union = new NodeUnion<number, string>(0);

    expect(union.getValue()).toEqual(0);
  });
});
