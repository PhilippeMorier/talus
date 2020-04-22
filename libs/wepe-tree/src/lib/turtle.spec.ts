import { Turtle } from './turtle';

describe('Turtle', () => {
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
});
