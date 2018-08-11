import { PerspectiveCamera } from 'three';

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

  constructor(private readonly camera: PerspectiveCamera) {
    this.addListeners();
  }

  update(deltaInSeconds: number): void {
    const movementSpeed = deltaInSeconds * this.movementSpeed;

    this.pressedKeyboardKeys.forEach(key => {
      switch (key) {
        case 'left':
          this.camera.translateX(-movementSpeed);
          break;
        case 'right':
          this.camera.translateX(movementSpeed);
          break;
        case 'forward':
          this.camera.translateZ(-movementSpeed);
          break;
        case 'backward':
          this.camera.translateZ(movementSpeed);
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
  }

  private removeListeners(): void {
    window.removeEventListener('keydown', this.onKeyDown, false);
    window.removeEventListener('keyup', this.onKeyUp, false);
    window.removeEventListener('mousedown', this.onMouseDown, false);
  }

  private onKeyDown = ({ key }: KeyboardEvent) => {
    const moveKey = this.moveKeysConfig[key];
    if (moveKey) {
      this.pressedKeyboardKeys.add(moveKey);
    }
  };

  private onKeyUp = ({ key }: KeyboardEvent) => {
    this.pressedKeyboardKeys.delete(this.moveKeysConfig[key]);
  };

  private onMouseDown(): void {

  }
}
