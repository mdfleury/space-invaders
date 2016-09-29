declare class Velocity {
    public x: number;
    public y: number;
}

declare class Size {
    public x: number;
    public y: number;
}

declare class Center {
    public x: number;
    public y: number;
}

declare abstract class Body {
    public center: Center;
    public size: Size;

    public abstract update(): void;
}
