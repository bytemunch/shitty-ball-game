import { game, nc, nc2, rs, rs2 } from "../main.js";
import { Vector } from "./Vector.js";

export class CashBank {
    pos: Vector;
    width: number;
    height: number;
    count: bigint;

    constructor(o: CashBankOptions) {
        this.pos = new Vector({ x: o.x, y: game.naturalGameBB.interfaceTop + 6 });
        this.width = 48;
        this.height = 48;
        this.count = 1000000000000n;
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
        game.pause();
    }

    use(amt: number | bigint) {
        if (typeof amt == 'number') amt = BigInt(Math.floor(amt));

        if (this.count - amt < 0) return false;

        this.count = this.count - amt;

        return true;
    }

    add(amt: number | bigint) {
        if (typeof amt == 'number') amt = BigInt(Math.floor(amt));
        this.count += amt;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.count > 0 ? '#242424' : '#ff2424';
        ctx.strokeStyle = '#696969';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText('$' + nc2(this.count), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.4));

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText('Pause', rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.7));
    }
}

interface CashBankOptions {
    x: number
}