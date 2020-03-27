import { Bullet } from "./bullet";
import { Keyboarder } from "./keyboarder";
import { KEYS } from "./keys";
import { Game } from "./game";
import { Body, Size } from "./global";

export class Player extends Body {
  public size: Size = { x: 15, y: 15 };
  protected keyboarder: Keyboarder;
  protected game: Game;
  protected lastShot: number = 0;
  protected shotLag: number = 100;

  constructor(game: Game) {
    super();
    this.game = game;
    this.keyboarder = new Keyboarder();
    this.center = {
      x: this.game.gameSize.x / 2,
      y: this.game.gameSize.y - this.size.x
    };
  }

  public update() {
    if (
      this.keyboarder.isDown(KEYS.LEFT) &&
      this.center.x - this.size.x / 2 > 0
    ) {
      this.center.x -= 2;
    } else if (
      this.keyboarder.isDown(KEYS.RIGHT) &&
      this.center.x + this.size.x / 2 < this.game.gameSize.x
    ) {
      this.center.x += 2;
    }

    if (this.keyboarder.isDown(KEYS.SPACE)) {
      const now = new Date().getTime();
      if (now - this.lastShot < this.shotLag) return;
      this.lastShot = new Date().getTime();
      let bullet = new Bullet(
        { x: this.center.x, y: this.center.y - this.size.x / 2 },
        { x: 0, y: -6 }
      );
      this.game.addBody(bullet);
    }
  }
}
