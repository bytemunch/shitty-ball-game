import { rs } from "../main.js";
import { prevFrameTime, timestep } from "./BallGame.js";
import { Vector } from "./Vector.js";

export class Particle {
    pos: Vector;
    vel: Vector;
    size: number;

    age: number;
    lifespan: number;
    birth: number;
    dead: boolean;

    constructor(o: ParticleOptions) {
        this.lifespan = 300;
        this.birth = prevFrameTime;
        this.dead = false;

        this.pos = new Vector({ x: o.x, y: o.y });
        this.vel = new Vector({ a: Math.random() * Math.PI * 2, m: 3 });
        this.size = 1;
    }

    die() {
        this.dead = true;
    }

    update() {
        this.age = prevFrameTime - this.birth;
        this.pos.addV(this.vel.iMult(timestep));

        if (this.age >= this.lifespan) this.die();
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255,255,255,${1-this.age/this.lifespan})`;
        ctx.beginPath();
        ctx.arc(rs(this.pos.x), rs(this.pos.y), rs(this.size), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

interface ParticleOptions {
    x: number,
    y: number,
    size?: number,
    color?: string,
}