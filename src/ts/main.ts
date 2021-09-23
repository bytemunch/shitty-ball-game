import { BallGame } from './class/BallGame.js';
import { ResizeHandler } from './class/ResizeHandler.js';

// Resizing functions
// NOTE only resize objects on DRAW not on creation
//  to keep the physics the same across screen sizes
export let rh = new ResizeHandler;
export const rs = n => n * rh.sizeRatio;
export const rs2 = n => n / rh.sizeRatio;

// block grid maths-y bit
export const bg = n => n * 30 + 10;

// number display function
export const nc = (n:bigint|number) => {
    if (typeof n == "number") n = BigInt(n);
    if (n < 1000n) {
        return `${n}`;
    }
    if (n < 1000000n) {
        return `${(n/1000n)}k`;
    }
    if (n < 1000000000n) {
        return `${(n/1000000n)}m`;
    }
    if (n < 1000000000000n) {
        return `${(n/1000000000n)}b`;
    }
    if (n < 1000000000000000n) {
        return `${(n/1000000000000n)}t`;
    }
    if (n < 1000000000000000000n) {
        return `${(n/1000000000000000n)}q`;
    }
    if (n < 1000000000000000000000n) {
        return `${(n/1000000000000000000n)}x`;
    }
}

// TODO export const and init in domready
export let game:BallGame;

document.addEventListener('DOMContentLoaded', () => {
    console.log('bollocks');

    game = new BallGame;
    game.postInit();
    console.log(game);
});