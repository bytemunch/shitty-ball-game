import { game } from "../main.js";
import { UpgradePanel } from "./UpgradePanel.js";

export class DamageUpgrade extends UpgradePanel {
    constructor(o: DamageUpgradeOptions) {
        super(o);
    }

    get name() {
        return 'Damage';
    }

    get currentLevel() {
        return game.upgrades.ballDamage;
    }
    
    doUpgrade() {
        game.upgrades.ballDamage++;
    }
}

interface DamageUpgradeOptions {
    x: number
}