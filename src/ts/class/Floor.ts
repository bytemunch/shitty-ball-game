import { game, nc, rs } from "../main.js";
import { Block } from "./Block.js";

export class Floor extends Block {
    constructor() {
        super({ x: 0, y: game.naturalGameBB.interfaceTop - 100, health: game.upgrades.floorHealth });
        this.width = 320;
        this.height = 16;

        this.collisionSides = {
            top: false,
            left: false,
            right: false,
            bottom: true
        }
    }

    update() {
    }

    die() {

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#FFFFFF88';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));
        ctx.strokeStyle = '#69696988';
        ctx.lineWidth = 1;
        ctx.strokeRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));

        ctx.fillStyle = '#696969';

        ctx.textAlign = 'center';
        ctx.font = `${rs(12)}px Arial`;

        let txSize = ctx.measureText(this.health.toString());
        ctx.fillText(nc(this.health), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height / 2) + txSize.actualBoundingBoxAscent / 2);
    }
}