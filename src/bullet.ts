import { Body, Size, Velocity, Center } from "./global";

export class Bullet extends Body {
  public size: Size = { x: 3, y: 3 };
  protected velocity: Velocity;

  constructor(center: Center, velocity: Velocity) {
    super();
    this.center = center;
    this.velocity = velocity;
  }

  public update() {
    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;
  }
}
