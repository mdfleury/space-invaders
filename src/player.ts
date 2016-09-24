import { Body, Size, Center } from "./body";
import { Bullet } from "./bullet";
import { KEYS, Keyboarder } from "./keyboarder";
import { Game } from "./game"

export class Player implements Body {
    keyboarder: Keyboarder
    game: Game
    center: Center
    size: Size

    constructor(game: Game) {
        this.size = {x: 15, y: 15}
        this.game = game
        this.keyboarder = new Keyboarder()
        this.center = {x: this.game.gameSize.x / 2, y: this.game.gameSize.y - this.size.x};
    }

    update() {
        if (this.keyboarder.isDown(KEYS.LEFT)) {
            this.center.x -= 2;
        }
        else if (this.keyboarder.isDown(KEYS.RIGHT)) {
            this.center.x += 2;
        }
        else if (this.keyboarder.isDown(KEYS.SPACE)) {
            let bullet = new Bullet(
                { x: this.center.x, y: this.center.y - this.size.x / 2 },
                { x: 0, y: -6 }
            );
            this.game.addBody(bullet);
        }
    }
}
