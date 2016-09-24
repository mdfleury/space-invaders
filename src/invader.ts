import { Body, Size, Center } from "./body";
import { Bullet } from "./bullet";
import { Game } from "./game";

export class Invader implements Body {
    game: any
    size: Size = {x: 15, y: 15}
    center: Center

    patrolX: number
    speedX: number

    constructor(game: Game, center: Center) {
        this.game = game;
        this.center = center;
        this.patrolX = 0;
        this.speedX = 0.3;
    }

    public update () {
        if (this.patrolX < 0 || this.patrolX > 40) {
            this.speedX = -this.speedX;
        }
        this.center.x += this.speedX;
        this.patrolX += this.speedX;

        if (Math.random() > 0.99 && !this.game.invadersBelow(this).length) {
            let bullet = new Bullet(
                { x: this.center.x, y: this.center.y + this.size.x / 2 },
                { x: Math.random() - 0.5, y: 2 }
            );
            this.game.addBody(bullet);
        }
    }
}
