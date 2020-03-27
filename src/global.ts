export class Velocity {
  public x: number;
  public y: number;
}

export class Size {
  public x: number;
  public y: number;
}

export class Center {
  public x: number;
  public y: number;
}

export abstract class Body {
  public center: Center;
  public size: Size;

  public abstract update(): void;
}
