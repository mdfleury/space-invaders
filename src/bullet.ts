import { Body, Size, Center } from "./body"

declare class Velocity {
    x: number
    y: number
}

export class Bullet implements Body{
    velocity: Velocity
    size: Size = {x: 3, y: 3}
    center: Center

    constructor(center: Center, velocity: Velocity) {
        this.center = center
        this.velocity = velocity
    }
    public update() {
        this.center.x += this.velocity.x
        this.center.y += this.velocity.y
    }
}
