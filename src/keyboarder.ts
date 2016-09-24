export const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
}

export class Keyboarder {
    keyState: any = {}

    constructor() {
        window.onkeydown = (event) => {
            this.keyState[event.keyCode] = true;
        };

        window.onkeyup = (event) => {
            this.keyState[event.keyCode] = false;
        };
    }

    public isDown(keyCode: number) {
        return this.keyState[keyCode] === true;
    }
}
