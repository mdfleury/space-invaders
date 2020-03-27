import { Util } from "./util";
import { Player } from "./player";
import { Invader } from "./invader";
import { KEYS } from "./keys";
import { Size, Body } from "./global";

export class Game {
  public gameSize: Size;
  protected canvas: HTMLCanvasElement;
  protected bodies: Body[];
  protected screen: CanvasRenderingContext2D;

  constructor(domId: string) {
    this.canvas = <HTMLCanvasElement>document.getElementById(domId);
    this.canvas.onclick = this.reset.bind(this);
    this.gameSize = { x: this.canvas.width, y: this.canvas.height };
    this.screen = this.canvas.getContext("2d");
    window.addEventListener("keyup", event => {
      if (event.keyCode === KEYS.R) {
        this.reset();
      }
    });
  }

  public addBody(body: Body) {
    this.bodies.push(body);
  }

  public tick() {
    if (!this.hasPlayer()) {
      this.loseGame();
      return;
    }
    if (!this.hasInvaders()) {
      this.winGame();
      return;
    }
    this.update();
    this.draw();

    requestAnimationFrame(this.tick.bind(this));
  }

  public invadersBelow(invader: Invader) {
    return this.bodies.filter((body: Body) => {
      return (
        body instanceof Invader &&
        body.center.y > invader.center.y &&
        body.center.x - invader.center.x < invader.size.x
      );
    });
  }

  public start() {
    this.reset();
  }

  protected reset() {
    this.bodies = Util.produceInvaders(this);
    this.bodies.push(new Player(this));
    this.tick();
  }

  protected draw() {
    this.screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);
    for (let i = 0; i < this.bodies.length; i++) {
      Util.drawRect(this.screen, this.bodies[i]);
    }
  }

  protected update() {
    let bodies = this.bodies;
    const notCollidingWithAnything = (b1: Body) => {
      return (
        bodies.filter((b2: Body) => {
          return Util.colliding(b1, b2);
        }).length === 0
      );
    };

    this.bodies = this.bodies.filter(notCollidingWithAnything);
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].update();
    }
  }

  protected hasPlayer() {
    return (
      this.bodies.filter((body: Body) => {
        return body instanceof Player;
      }).length === 1
    );
  }

  protected hasInvaders() {
    return (
      this.bodies.filter((body: Body) => {
        return body instanceof Invader;
      }).length > 0
    );
  }

  protected loseGame() {
    this.displayMessage("Game Over");
  }

  protected winGame() {
    this.displayMessage("You win!");
  }

  protected displayMessage(text: string) {
    this.screen.font = "48px serif";
    this.screen.textAlign = "center";
    this.screen.fillText(text, this.gameSize.x / 2, this.gameSize.y / 2);
  }
}
