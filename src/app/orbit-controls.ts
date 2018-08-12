import { PerspectiveCamera, Raycaster, Scene, Vector2, Vector3 } from 'three';

type KeyboardKey =
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

type MoveKey = 'left' | 'right' | 'forward' | 'backward';

export class OrbitControls {
  private center = new Vector3();
  private dragStart: Vector2 | undefined;
  private raycaster = new Raycaster();

  private movementSpeed = 5.0;
  private pressedKeyboardKeys = new Set<MoveKey>();
  private moveKeysConfig: Partial<Record<KeyboardKey, MoveKey>> = {
    ArrowLeft: 'left',
    a: 'left',
    ArrowRight: 'right',
    d: 'right',
    ArrowUp: 'forward',
    w: 'forward',
    ArrowDown: 'backward',
    s: 'backward',
  };

  constructor(private readonly camera: PerspectiveCamera, private readonly scene: Scene) {
    this.addListeners();
  }

  update(deltaInSeconds: number): void {
    const distance = deltaInSeconds * this.movementSpeed;

    this.pressedKeyboardKeys.forEach(key => {
      switch (key) {
        case 'left':
          this.camera.translateX(-distance);
          break;
        case 'right':
          this.camera.translateX(distance);
          break;
        case 'forward':
          this.camera.translateZ(-distance);
          break;
        case 'backward':
          this.camera.translateZ(distance);
          break;
      }
    });
  }

  dispose(): void {
    this.removeListeners();
  }

  private addListeners(): void {
    window.addEventListener('keydown', this.onKeyDown, false);
    window.addEventListener('keyup', this.onKeyUp, false);

    window.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);
  }

  private removeListeners(): void {
    window.removeEventListener('keydown', this.onKeyDown, false);
    window.removeEventListener('keyup', this.onKeyUp, false);

    window.removeEventListener('mousedown', this.onMouseDown, false);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('mouseup', this.onMouseUp, false);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    const moveKey = this.moveKeysConfig[event.key];
    if (moveKey) {
      this.pressedKeyboardKeys.add(moveKey);
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();

    this.pressedKeyboardKeys.delete(this.moveKeysConfig[event.key]);
  };

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault();

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const normalizedDeviceMouseCoordinates = new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );

    this.dragStart = new Vector2(event.clientX, event.clientY);

    this.raycaster.setFromCamera(normalizedDeviceMouseCoordinates, this.camera);
    const intersections = this.raycaster.intersectObjects(this.scene.children);
    if (intersections.length > 0) {
      console.log('Intersection!');
      this.center = intersections[0].point;
    }
  };

  private onMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    if (!this.dragStart) {
      return;
    }

    this.dragStart.setX(event.clientX - this.dragStart.x);
    this.dragStart.setY(event.clientY - this.dragStart.y);
    this.drag(this.dragStart.x, this.dragStart.y);

    this.dragStart.set(event.clientX, event.clientY);
  };

  private onMouseUp = (event: MouseEvent) => {
    event.preventDefault();

    this.dragStart = undefined;
  };

  // https://andreasrohner.at/posts/Web%20Development/JavaScript/Simple-orbital-camera-controls-for-THREE-js/
  private drag(deltaX: number, deltaY: number): void {
    const radPerPixel = Math.PI / 450;
    const deltaPhi = radPerPixel * deltaX;
    const deltaTheta = radPerPixel * deltaY;
    const pos = this.camera.position.sub(this.center);
    const radius = pos.length();
    let theta = Math.acos(pos.z / radius);
    let phi = Math.atan2(pos.y, pos.x);

    // Subtract deltaTheta and deltaPhi
    theta = Math.min(Math.max(theta - deltaTheta, 0), Math.PI);
    phi -= deltaPhi;

    // Turn back into Cartesian coordinates
    pos.x = radius * Math.sin(theta) * Math.cos(phi);
    pos.y = radius * Math.sin(theta) * Math.sin(phi);
    pos.z = radius * Math.cos(theta);

    this.camera.position.add(this.center);
    this.camera.lookAt(this.center);
  }
}
