import { Invader } from "./invader";

export class Util {
    public static produceInvaders(game: any) {
        let invaders: Invader[] = [];

        for (let i = 0; i < 24; i++) {
            let x = 30 + (i % 8) * 30;
            let y = 30 + (i % 3) * 30;
            invaders.push(new Invader(game, {x: x, y: y}));
        }

        return invaders;
    }

    public static colliding(b1: Body, b2: Body) {
        return !(
            b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x + b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y + b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
        );
    }

    public static drawRect(screen: CanvasRenderingContext2D, body: Body) {
        screen.fillRect(
            body.center.x - body.size.x / 2,
            body.center.y - body.size.y / 2,
            body.size.x,
            body.size.y
        );
    }
}
