export class Keyboarder {
  protected keyState: Boolean[] = [];

  constructor() {
    window.addEventListener("keydown", event => {
      this.keyState[event.keyCode] = true;
    });

    window.addEventListener("keyup", event => {
      this.keyState[event.keyCode] = false;
    });
  }

  public isDown(keyCode: number) {
    return this.keyState[keyCode] === true;
  }
}
