import { Quaternion } from '@babylonjs/core/Maths/math.vector';
import { Turtle } from './turtle';

describe('Tree', () => {
  it('should construct new tree', () => {
    // const tree = Tree.construct(DEFAULT_TREE_PARAM, 'testSeed', false);
  });

  it('RotationQuaternionFromAxis', () => {
    const turtle = new Turtle();
    turtle.pitchDown(Math.PI / 2);
    console.log(turtle);

    const quaternion = Quaternion.RotationQuaternionFromAxis(
      turtle.right,
      turtle.dir,
      turtle.dir.cross(turtle.right),
    );

    console.log(quaternion);
  });
});
