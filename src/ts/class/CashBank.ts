import { game, nc, rs, rs2 } from "../main.js";
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
        this.count = 100n;
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

    }

    use(amt: number) {
        this.count = this.count - BigInt(amt);

        if (this.count <= 0) {
            this.count = 0n;
            return false;
        }
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
        ctx.fillText('$' + nc(this.count), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height / 2));
    }
}

interface CashBankOptions {
    x: number
}