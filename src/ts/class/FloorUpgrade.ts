import { game } from "../main.js";
import { UpgradePanel } from "./UpgradePanel.js";

export class FloorUpgrade extends UpgradePanel {
    constructor(o: FloorOptions) {
        super(o);
    }

    get name() {
        return 'Floor';
    }

    get currentLevel() {
        return game.upgrades.floorHealth;
    }
    
    doUpgrade() {
        game.upgrades.floorHealth*=2n;
    }
}

interface FloorOptions {
    x: number
}