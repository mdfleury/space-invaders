
export class Keyboarder {
  protected keyState: {[key: string]: Boolean } = {};

  constructor() {
    window.addEventListener("keydown", event => {
      this.keyState[event.key] = true;
    });

    window.addEventListener("keyup", event => {
      this.keyState[event.key] = false;
    });
  }

  public isDown(keyCode: string) {
    return this.keyState[keyCode] === true;
  }
}
