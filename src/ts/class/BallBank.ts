import { game, nc, rs, rs2 } from "../main.js";
import { Vector } from "./Vector.js";

export class BallBank {
    pos: Vector;
    width: number;
    height: number;
    magSize: number;
    count: bigint;

    constructor(o: BallBankOptions) {
        this.pos = new Vector({ x: o.x, y: game.naturalGameBB.interfaceTop + 6 });
        this.width = 48;
        this.height = 48;
        this.magSize = 100;
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
        switch (this.magSize) {
            case 1:
                this.magSize = 10;
                break;
            case 10:
                this.magSize = 25;
                break;
            case 25:
                this.magSize = 50;
                break;
            case 50:
                this.magSize = 100;
                break;
            case 100:
                this.magSize = 1;
                break;
        }
        if (this.count < this.magSize) this.magSize = 1;
    }

    setMaxMagSize() {
        if (this.count > 100) {
            this.magSize = 100;
            return;
        }

        if (this.count > 50) {
            this.magSize = 50;
            return;
        }

        if (this.count > 25) {
            this.magSize = 25;
            return;
        }

        if (this.count > 10) {
            this.magSize = 10;
            return;
        }
    }

    use(amt: number) {
        this.count = this.count - BigInt(amt);
        this.setMaxMagSize();

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
        ctx.fillText('x' + nc(this.magSize), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height / 2))

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(10)}px Arial`;
        ctx.fillText(nc(this.count), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.75))
    }
}

interface BallBankOptions {
    x: number
}