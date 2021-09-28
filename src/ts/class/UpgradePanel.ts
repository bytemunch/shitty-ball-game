import { game, nc, nc2, rs, rs2 } from "../main.js";
import { Vector } from "./Vector.js";

export abstract class UpgradePanel {
    pos: Vector;
    width: number;
    height: number;
    cost: bigint;

    constructor(o: UpgradePanelOptions) {
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
        // TODO add click and hold timer to confirm choice
        if (game.cashBank.use(this.cost)) {
            this.doUpgrade();
            this.cost = this.cost / 2n + this.cost * 2n;
        }
    }

    doUpgrade() {
        console.log('Upgrade not implemented!')
    }

    get enabled() {
        return (this.cost <= game.cashBank.count)
    }

    get currentLevel():number|bigint {
        console.log('level retrieve not implemented!')
        return 0;
    }

    get name() {
        console.log('upgrade name not implemented!')
        return "Upgrade!";
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.cost < game.cashBank.count ? '#242424' : '#ff2424';
        ctx.strokeStyle = '#696969';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText(nc(this.currentLevel), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.25))

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText(this.name, rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height / 2))

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(10)}px Arial`;
        ctx.fillText('$'+nc2(this.cost), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.75))
    }
}

interface UpgradePanelOptions {
    x: number
}