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

export const waitFor = ms => {
    return new Promise(res => {
        setTimeout(() => { res(0) }, ms)
    })
}

// TODO export const and init in domready
export let game;

document.addEventListener('DOMContentLoaded', () => {
    console.log('bollocks');

    game = new BallGame;
    console.log(game);
});