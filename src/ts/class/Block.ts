import { game, rs } from "../main.js";
import { Vector } from "./Vector.js";

export class Block {
    pos: Vector;
    width: number;
    height: number;

    health: number;

    collisionSides;

    constructor(o: BlockOptions) {
        if (!o.sizeScale) o.sizeScale = 1;
        this.pos = new Vector({ x: o.x, y: o.y });
        this.width = 30 * o.sizeScale;
        this.height = 30 * o.sizeScale;

        this.health = o.health || 1;

        this.collisionSides = {
            left: true,
            top: true,
            right: true,
            bottom: true
        }
    }

    get left() {
        return this.pos.x;
    }
    get right() {
        return this.pos.x + this.width;
    }
    get top() {
        return this.pos.y;
    }
    get bottom() {
        return this.pos.y + this.height;
    }

    collides(b: Block) {
        if (b == this) return;

        // Disable collision if this block forms a wall with other blocks
        if (this.left == b.right && this.top == b.top) this.collisionSides.right = false;
        if (this.top == b.bottom && this.left == b.left) this.collisionSides.bottom = false;
        if (this.right == b.left && this.top == b.top) this.collisionSides.left = false;
        if (this.bottom == b.top && this.left == b.left) this.collisionSides.top = false;
    }

    update() {
        // Update active collision sides
        this.collisionSides = {
            left: true,
            top: true,
            right: true,
            bottom: true
        }

        for (let b of game.blocks) {
            this.collides(b)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 1;
        ctx.strokeRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));

        ctx.fillStyle = '#696969';

        ctx.textAlign = 'center';
        ctx.font = `${rs(16)}px Arial`;

        let txSize = ctx.measureText(this.health.toString());
        ctx.fillText(this.health.toString(), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height / 2) + txSize.actualBoundingBoxAscent / 2);
    }
}

interface BlockOptions {
    x: number,
    y: number,
    sizeScale?: number,
    health: number
}