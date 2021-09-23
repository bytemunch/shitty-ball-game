import { game, rs } from "../main.js";
import { timestep } from "./BallGame.js";
import { Block } from "./Block.js";
import { Vector } from "./Vector.js";
import { Wall } from "./Wall.js";

export class Ball {
    pos: Vector;
    vel: Vector;

    size: number;

    health: number;

    constructor(o: BallOptions) {
        this.pos = new Vector({ x: o.x, y: o.y });
        this.vel = new Vector({ a: o.a, m: 5 });
        this.size = 5;

        this.health = game.upgrades.bounces;
    }

    update() {
        this.pos.addV(this.vel.iMult(timestep));

        for (let o of game.gameObjects) {
            if (this.collide(o)) {
                // this.update();
                // break;
            };
        }
    }

    get left() {
        return this.pos.x - this.size;
    }
    get right() {
        return this.pos.x + this.size;
    }
    get top() {
        return this.pos.y - this.size;
    }
    get bottom() {
        return this.pos.y + this.size;
    }

    collide(o: Wall | Block | Ball) {
        if (o == this) return;

        if (o.constructor.name == 'Ball') return;
        // TODO ball/ball collision
        if (this.left < o.right &&
            this.right > o.left &&
            this.top < o.bottom &&
            this.bottom > o.top) {
            const prevPosition = {
                left: this.pos.x - this.vel.x * timestep - this.size,
                right: this.pos.x - this.vel.x * timestep + this.size,
                top: this.pos.y - this.vel.y * timestep - this.size,
                bottom: this.pos.y - this.vel.y * timestep + this.size,
            }

            const rightCollide = prevPosition.right < o.left && this.right >= o.left;

            const leftCollide = prevPosition.left >= o.right && this.left < o.right;

            const bottomCollide = prevPosition.bottom < o.top && this.bottom >= o.top;

            const topCollide = prevPosition.top >= o.bottom && this.top < o.bottom;

            // TODO prioritize which bounce to use based on velocity angle compared to collision side
            // OR figure if the block is colliding with the other block we collided with and decide w that
            if (o.constructor.name == 'Block') {
                let b = o as Block;
                const negateHealth = () => {
                    b.health -= game.upgrades.ballDamage;
                    this.health--;
                }
                if (leftCollide && b.collisionSides.left) {
                    this.vel.x *= -1;
                    negateHealth();
                }

                if (topCollide && b.collisionSides.top) {
                    this.vel.y *= -1;
                    negateHealth();
                }

                if (rightCollide && b.collisionSides.right) {
                    this.vel.x *= -1;
                    negateHealth();
                }

                if (bottomCollide && b.collisionSides.bottom) {
                    this.vel.y *= -1;
                    negateHealth();
                }

            } else {
                if (leftCollide || rightCollide) this.vel.x *= -1;
                if (topCollide || bottomCollide) this.vel.y *= -1;
            }

            // this.health--;



            return true;

            // console.log(`collision! R:${rightCollide} L:${leftCollide} T:${topCollide} B:${bottomCollide}`);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(rs(this.pos.x), rs(this.pos.y), rs(this.size), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

interface BallOptions {
    x: number,
    y: number,
    a: number
}