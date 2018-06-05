import { Camera, Math as MathThree, Vector3 } from 'three';

export class FirstPersonControls {
  private target: Vector3 = new Vector3(0, 0, 0);
  private enabled = true;

  public movementSpeed = 1.0;
  public lookSpeed = 0.005;

  public lookVertical = true;
  private autoForward = false;

  private activeLook = true;

  private heightSpeed = false;
  private heightCoef = 1.0;
  private heightMin = 0.0;
  private heightMax = 1.0;

  public constrainVertical = false;
  public verticalMin = 0;
  public verticalMax = Math.PI;

  private autoSpeedFactor = 0.0;

  private mouseX = 0;
  private mouseY = 0;

  public lat = 0;
  public lon = 0;
  private phi = 0;
  private theta = 0;

  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private moveUp = false;
  private moveDown = false;

  private mouseDragOn = false;

  private viewHalfX = 0;
  private viewHalfY = 0;

  constructor(private object: Camera, private domElement?: HTMLCanvasElement) {
    this.domElement.setAttribute('tabindex', '-1');

    this.handleResize();

    this.domElement.addEventListener('contextmenu', e => this.contextmenu(e), false);
    // this.domElement.addEventListener('mousemove', e => this.onMouseMove(e), false);
    // this.domElement.addEventListener('mousedown', e => this.onMouseDown(e), false);
    // this.domElement.addEventListener('mouseup', e => this.onMouseUp(e), false);
    this.domElement.addEventListener('keydown', e => this.onKeyDown(e), false);
    this.domElement.addEventListener('keyup', e => this.onKeyUp(e), false);
  }

  public update(delta: number): void {
    if (this.enabled === false) {
      return;
    }

    if (this.heightSpeed) {
      const y = MathThree.clamp(this.object.position.y, this.heightMin, this.heightMax);
      const heightDelta = y - this.heightMin;

      this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
    } else {
      this.autoSpeedFactor = 0.0;
    }

    const actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward || (this.autoForward && !this.moveBackward)) {
      this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
    }
    if (this.moveBackward) {
      this.object.translateZ(actualMoveSpeed);
    }

    if (this.moveLeft) {
      this.object.translateX(-actualMoveSpeed);
    }
    if (this.moveRight) {
      this.object.translateX(actualMoveSpeed);
    }

    if (this.moveUp) {
      this.object.translateY(actualMoveSpeed);
    }
    if (this.moveDown) {
      this.object.translateY(-actualMoveSpeed);
    }

    let actualLookSpeed = delta * this.lookSpeed;

    if (!this.activeLook) {
      actualLookSpeed = 0;
    }

    let verticalLookRatio = 1;

    if (this.constrainVertical) {
      verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
    }

    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) {
      this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
    }

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = MathThree.degToRad(90 - this.lat);

    this.theta = MathThree.degToRad(this.lon);

    if (this.constrainVertical) {
      this.phi = MathThree.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
    }

    const targetPosition = this.target;
    const position = this.object.position;

    targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    targetPosition.y = position.y + 100 * Math.cos(this.phi);
    targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

    this.object.lookAt(targetPosition);
  }

  public dispose(): void {
    this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
    this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
    this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
    this.domElement.removeEventListener('mouseup', this.onMouseUp, false);

    window.removeEventListener('keydown', this.onKeyDown, false);
    window.removeEventListener('keyup', this.onKeyUp, false);
  }

  private handleResize() {
    this.viewHalfX = this.domElement.offsetWidth / 2;
    this.viewHalfY = this.domElement.offsetHeight / 2;
  }

  private onMouseDown(event: MouseEvent) {
    this.domElement.focus();

    event.preventDefault();
    event.stopPropagation();

    if (this.activeLook) {
      switch (event.button) {
        case 0:
          this.moveForward = true;
          break;
        case 2:
          this.moveBackward = true;
          break;
      }
    }

    this.mouseDragOn = true;
  }

  private onMouseUp(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.activeLook) {
      switch (event.button) {
        case 0:
          this.moveForward = false;
          break;
        case 2:
          this.moveBackward = false;
          break;
      }
    }

    this.mouseDragOn = false;
  }

  private onMouseMove(event: MouseEvent) {
    this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
    this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
  }

  private onKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ this.moveForward = true;
        break;

      case 37: /*left*/
      case 65:
        /*A*/ this.moveLeft = true;
        break;

      case 40: /*down*/
      case 83:
        /*S*/ this.moveBackward = true;
        break;

      case 39: /*right*/
      case 68:
        /*D*/ this.moveRight = true;
        break;

      case 82:
        /*R*/ this.moveUp = true;
        break;
      case 70:
        /*F*/ this.moveDown = true;
        break;
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ this.moveForward = false;
        break;

      case 37: /*left*/
      case 65:
        /*A*/ this.moveLeft = false;
        break;

      case 40: /*down*/
      case 83:
        /*S*/ this.moveBackward = false;
        break;

      case 39: /*right*/
      case 68:
        /*D*/ this.moveRight = false;
        break;

      case 82:
        /*R*/ this.moveUp = false;
        break;
      case 70:
        /*F*/ this.moveDown = false;
        break;
    }
  }

  private contextmenu(event: MouseEvent) {
    event.preventDefault();
  }
}
