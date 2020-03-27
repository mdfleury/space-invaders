import { Bullet } from "./bullet";
import { Game } from "./game";
import { Body, Size, Center } from "./global";

export class Invader extends Body {
  public size: Size = { x: 15, y: 15 };
  protected game: Game;
  protected patrolX: number;
  protected speedX: number;
  protected bulletChance: number = 0.99;

  constructor(game: Game, center: Center) {
    super();
    this.game = game;
    this.center = center;
    this.patrolX = 0;
    this.speedX = 0.3;
  }

  public update() {
    if (this.patrolX < 0 || this.patrolX > 40) {
      this.speedX = -this.speedX;
    }
    this.center.x += this.speedX;
    this.patrolX += this.speedX;

    if (
      Math.random() > this.bulletChance &&
      !this.game.invadersBelow(this).length
    ) {
      let bullet = new Bullet(
        { x: this.center.x, y: this.center.y + this.size.x / 2 },
        { x: Math.random() - 0.5, y: 2 }
      );
      this.game.addBody(bullet);
    }
  }
}
