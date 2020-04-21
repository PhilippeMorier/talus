import { Turtle } from './turtle';

describe('Turtle', () => {
  /**     dir (y)                               0-----> dir (x)
   *       |                                    |
   *       |                  turn 90° right    |
   *       |                                    |
   *       0-----> right (x)                    v
   *                                          right (-y)
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
});
