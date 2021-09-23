import { game, nc, rs, rs2 } from "../main.js";
import { Vector } from "./Vector.js";

export class BounceUpgrade {
    pos: Vector;
    width: number;
    height: number;
    cost: bigint;

    constructor(o: BounceUpgradeOptions) {
        this.pos = new Vector({ x: o.x, y: game.naturalGameBB.interfaceTop + 6 });
        this.width = 48;
        this.height = 48;
        this.cost = 1000n;
    }

    update() {
        // nada to do here
    }

    pointCollides(x, y) {
        x = rs2(x);
        y = rs2(y);

        return (x > this.pos.x && x < this.pos.x + this.width &&
            y > this.pos.y && y < this.pos.y + this.height);
    }

    click() {
        // add event listener to cancel click
        let cancelled = false;
    }

    get enabled() {
        return (this.cost <= game.cashBank.count)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.cost < game.cashBank.count ? '#242424' : '#ff2424';
        ctx.strokeStyle = '#696969';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText(nc(game.upgrades.bounces-1), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.25))

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText('Bounces', rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height / 2))

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(10)}px Arial`;
        ctx.fillText('$'+nc(this.cost), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.75))
    }
}

interface BounceUpgradeOptions {
    x: number
}