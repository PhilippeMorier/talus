import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { applyTropism, Turtle } from './turtle';

describe('Turtle', () => {
  it('should clone turtle', () => {
    const turtle = new Turtle();
    turtle.turnRight(Math.PI / 2);

    const cloneTurtle = new Turtle(turtle);

    expect(cloneTurtle.dir).toEqual(turtle.dir);
    expect(cloneTurtle.pos).toEqual(turtle.pos);
    expect(cloneTurtle.right).toEqual(turtle.right);
    expect(cloneTurtle.width).toEqual(turtle.width);
  });

  /**                                             / (z)
   *                                             /
   *  dir (y)                                   0----- dir (x)
   *       |                                    |
   *       |  /(z)            turn 90° right    |
   *       | /                                  |
   *       0----- right (x)                   right (-y)
   */
  it('should turn 90° right', () => {
    const turtle = new Turtle();

    turtle.turnRight(Math.PI / 2);

    expect(turtle.dir.x).toBeCloseTo(1, 5);
    expect(turtle.dir.y).toBeCloseTo(0, 5);
    expect(turtle.dir.z).toBeCloseTo(0, 5);

    expect(turtle.right.x).toBeCloseTo(0, 5);
    expect(turtle.right.y).toBeCloseTo(-1, 5);
    expect(turtle.right.z).toBeCloseTo(0, 5);
  });

  it('should turn 90° left', () => {
    const turtle = new Turtle();

    turtle.turnLeft(Math.PI / 2);

    expect(turtle.dir.x).toBeCloseTo(-1, 5);
    expect(turtle.dir.y).toBeCloseTo(0, 5);
    expect(turtle.dir.z).toBeCloseTo(0, 5);

    expect(turtle.right.x).toBeCloseTo(0, 5);
    expect(turtle.right.y).toBeCloseTo(1, 5);
    expect(turtle.right.z).toBeCloseTo(0, 5);
  });

  it('should pitch 90° up', () => {
    const turtle = new Turtle();

    turtle.pitchUp(Math.PI / 2);

    expect(turtle.dir.x).toBeCloseTo(0, 5);
    expect(turtle.dir.y).toBeCloseTo(0, 5);
    expect(turtle.dir.z).toBeCloseTo(-1, 5);

    expect(turtle.right.x).toBeCloseTo(1, 5);
    expect(turtle.right.y).toBeCloseTo(0, 5);
    expect(turtle.right.z).toBeCloseTo(0, 5);
  });

  it('should pitch 90° down', () => {
    const turtle = new Turtle();

    turtle.pitchDown(Math.PI / 2);

    expect(turtle.dir.x).toBeCloseTo(0, 5);
    expect(turtle.dir.y).toBeCloseTo(0, 5);
    expect(turtle.dir.z).toBeCloseTo(1, 5);

    expect(turtle.right.x).toBeCloseTo(1, 5);
    expect(turtle.right.y).toBeCloseTo(0, 5);
    expect(turtle.right.z).toBeCloseTo(0, 5);
  });

  it('should roll 90° right', () => {
    const turtle = new Turtle();

    turtle.rollRight(Math.PI / 2);

    expect(turtle.dir.x).toBeCloseTo(0, 5);
    expect(turtle.dir.y).toBeCloseTo(1, 5);
    expect(turtle.dir.z).toBeCloseTo(0, 5);

    expect(turtle.right.x).toBeCloseTo(0, 5);
    expect(turtle.right.y).toBeCloseTo(0, 5);
    expect(turtle.right.z).toBeCloseTo(1, 5);
  });

  it('should roll 90° left', () => {
    const turtle = new Turtle();

    turtle.rollLeft(Math.PI / 2);

    expect(turtle.dir.x).toBeCloseTo(0, 5);
    expect(turtle.dir.y).toBeCloseTo(1, 5);
    expect(turtle.dir.z).toBeCloseTo(0, 5);

    expect(turtle.right.x).toBeCloseTo(0, 5);
    expect(turtle.right.y).toBeCloseTo(0, 5);
    expect(turtle.right.z).toBeCloseTo(-1, 5);
  });

  it('should move along direction by given distance', () => {
    const turtle = new Turtle();

    turtle.move(10);

    expect(turtle.pos.x).toEqual(0);
    expect(turtle.pos.y).toEqual(10);
    expect(turtle.pos.z).toEqual(0);
  });

  it.each([
    // Values received from running the python function `apply_tropism` manually
    [new Vector3(0, 0.5, 0.5), new Vector3(0, 0.996, 0.087), new Vector3(1, 0, 0)],
    [
      new Vector3(0.5, 0.5, 0.5),
      new Vector3(0.087, 0.992, 0.087),
      new Vector3(0.996, -0.087, -0.0038),
    ],
    [
      new Vector3(-1, 1.5, 0.5),
      new Vector3(-0.173, 0.981, 0.0867),
      new Vector3(0.9848, 0.173, 0.0075),
    ],
  ])(
    'should apply tropism vector %j to turtle',
    (tropism: Vector3, expectedDir: Vector3, expectedRight: Vector3) => {
      const turtle = new Turtle();

      applyTropism(turtle, tropism);

      expect(turtle.dir.x).toBeCloseTo(expectedDir.x, 3);
      expect(turtle.dir.y).toBeCloseTo(expectedDir.y, 3);
      expect(turtle.dir.z).toBeCloseTo(expectedDir.z, 3);

      expect(turtle.right.x).toBeCloseTo(expectedRight.x, 3);
      expect(turtle.right.y).toBeCloseTo(expectedRight.y, 3);
      expect(turtle.right.z).toBeCloseTo(expectedRight.z, 3);
    },
  );
});
