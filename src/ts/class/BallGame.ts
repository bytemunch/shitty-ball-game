import { bg, rh, rs, rs2 } from "../main.js";
import { Ball } from "./Ball.js";
import { Block } from "./Block.js";
import { Wall } from "./Wall.js";
import { BallGun } from "./BallGun.js";
import { BallBank } from "./BallBank.js";
import { CashBank } from "./CashBank.js";
import { BounceUpgrade } from "./BounceUpgrade.js";
import { DamageUpgrade } from "./DamageUpgrade.js";
import { Particle } from "./Particle.js";

export const lowerGameBound = 500;

let deltaTime = 0;
export let prevFrameTime = 0;
export let timestep = 0;

export let frameCount = 0;

export class BallGame {
    walls: Wall[];
    balls: Ball[];
    blocks: Block[];
    interfaces: any[];
    particles: Particle[];

    level: number;

    actionQueue: any[];

    upgrades: any;

    // Main canvas
    cnv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // Interface Canvas
    iCnv: HTMLCanvasElement;
    iCtx: CanvasRenderingContext2D;

    // DOM stuff
    targetDiv: HTMLDivElement;
    targetBB: DOMRect;

    naturalGameBB: { x: number, y: number, width: number, height: number, interfaceTop: number };

    score: bigint;
    ballBank: BallBank;
    cashBank: CashBank;

    ballGun: BallGun;

    loopHandle;
    bounceUpgrade: BounceUpgrade;
    damageUpgrade: DamageUpgrade;
    timeFactor: number;

    constructor() {
        this.timeFactor = 1;

        this.level = 0;
        // Setup natural sizes
        // 64px for interface, less margins makes 48px touch targets
        this.naturalGameBB = {
            x: 0,
            y: 0,
            width: 320,
            height: 568,
            interfaceTop: 504
        }

        // setup upgrades
        this.upgrades = {
            cashDropped: 1,
            ballDamage: 1n,
            bounces: 2
        }

        // Grab targetdiv
        this.targetDiv = document.querySelector('#ball-game');

        // Create canvases
        this.cnv = document.createElement('canvas');
        this.cnv.id = 'game-canvas';

        this.ctx = this.cnv.getContext('2d');

        this.iCnv = document.createElement('canvas');
        this.iCnv.id = 'interface-canvas';

        this.iCtx = this.iCnv.getContext('2d');

        // setup initial canvas sizes
        this.onResize();

        // Append canvases to document in #ball-game
        this.targetDiv.appendChild(this.cnv);
        this.targetDiv.appendChild(this.iCnv);

        // resize canvas on window resize
        window.addEventListener('resize', e => {
            this.onResize();
        })

        // Setup initial variables
        this.score = 0n;
        this.balls = [];
        this.walls = [];
        this.blocks = [];
        this.particles = [];
        this.interfaces = [];
        this.actionQueue = [];

        // Setup initial objects
        this.ballGun = new BallGun;

        // Walls & ceiling
        const wallWidth = 10;

        this.walls = [
            new Wall({
                x: 0,
                y: 0,
                width: wallWidth,
                height: lowerGameBound
            }),
            new Wall({
                x: this.naturalGameBB.width - wallWidth,
                y: 0,
                width: wallWidth,
                height: lowerGameBound
            }),
            new Wall({
                x: 0,
                y: 0,
                width: this.naturalGameBB.width,
                height: wallWidth
            }),
        ]

        // add interaction handlers
        this.targetDiv.addEventListener('touchstart', e => {
            e.preventDefault();
            const x = e.touches[0].clientX - this.targetBB.x;
            const y = e.touches[0].clientY - this.targetBB.y;

            if (rs2(y) < this.naturalGameBB.interfaceTop) {
                // ingame touch
                const moveFn = e => {
                    e.preventDefault();

                    this.ballGun.setTarget(e.touches[0].clientX - this.targetBB.x, e.touches[0].clientY - this.targetBB.y);
                }

                moveFn(e);

                this.targetDiv.addEventListener('touchmove', moveFn);

                const upFn = e => {
                    e.preventDefault();

                    this.targetDiv.removeEventListener('touchmove', moveFn);
                    this.targetDiv.removeEventListener('touchend', upFn);

                    this.ballGun.fire(this.balls, this.ballBank.magSize);
                }

                this.targetDiv.addEventListener('touchend', upFn);
            } else {
                // interfaces
                for (let i of this.interfaceObjects) {
                    if (i.pointCollides && i.pointCollides(x, y)) i.click();
                }
            }
        })

        this.targetDiv.addEventListener('mousedown', e => {
            e.preventDefault();
            if (e.offsetX < this.naturalGameBB.interfaceTop) {
                // ingame click
                const moveFn = e => {
                    e.preventDefault();

                    this.ballGun.setTarget(e.offsetX, e.offsetY);
                }

                moveFn(e);

                this.targetDiv.addEventListener('mousemove', moveFn);

                const upFn = e => {
                    e.preventDefault();

                    this.targetDiv.removeEventListener('mousemove', moveFn);
                    this.targetDiv.removeEventListener('mouseup', upFn);

                    this.ballGun.fire(this.balls, this.ballBank.magSize);
                }

                this.targetDiv.addEventListener('mouseup', upFn);
            } else {
                // interfaces
            }
        })

        // TEST
        // this.testDraw();

    }

    async loadLevel() {
        // add balls in play back to bank
        this.ballBank.add(this.balls.length);

        this.balls.forEach(b => b.health = 0);

        this.ballGun.forceStop = true;

        let levelsPerDifficulty = {
            easy: 2,
            medium: 2,
            hard: 1,
            bonus: 1
        }

        let difficulty = 'bonus';

        let lvl = Math.floor(1 + Math.random() * levelsPerDifficulty[difficulty]);
        let scaling = Math.ceil(this.level / 5) || 1;

        let levelLoaded = new Promise(res => {
            // pull test level from image
            let ocnv = document.createElement('canvas');
            let octx = ocnv.getContext('2d');

            let oimg = new Image();

            oimg.onload = () => {
                octx.drawImage(oimg, 0, 0);
                let imgData = octx.getImageData(0, 0, 10, 10);

                console.log(imgData);
                // Loading from image
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        console.log(imgData.data[10 * i + j]);

                        let channelMix = imgData.data[(10 * j * 4 + i * 4)] + imgData.data[(10 * j * 4 + i * 4) + 1] + imgData.data[(10 * j * 4 + i * 4) + 2];

                        let bh = BigInt(Math.ceil(scaling * 100 * (channelMix / (255 * 3))));
                        this.blocks.push(new Block({ x: bg(i), y: bg(j), health: bh }));
                    }
                }

                res(0);
            }

            oimg.src = `./levels/${difficulty}/${lvl}.png`;
        })


        return levelLoaded;
    }

    onResize() {
        this.targetBB = this.targetDiv.getBoundingClientRect();

        this.iCnv.width = this.targetBB.width;
        this.iCnv.height = this.targetBB.height;

        this.cnv.width = this.targetBB.width;
        this.cnv.height = this.targetBB.height;

        // Get ratio to resize objects by
        rh.ratio = this.targetBB.width / this.naturalGameBB.width;

        // this.testDraw();
    }

    postInit() {
        // add interfaces
        this.ballBank = new BallBank({ x: 256 });
        this.cashBank = new CashBank({ x: 16 });
        this.bounceUpgrade = new BounceUpgrade({ x: 70 })
        this.damageUpgrade = new DamageUpgrade({ x: 124 })

        // load level 1             // begin main loop
        this.loadLevel().then(() => this.loopHandle = requestAnimationFrame(this.loop.bind(this)));
    }

    get allObjects() {
        return [...this.walls, ...this.blocks, ...this.balls, this.ballGun];
    }

    get interfaceObjects() {
        return [this.ballBank, this.cashBank, this.bounceUpgrade, this.damageUpgrade, ...this.interfaces];
    }

    get gameObjects() {
        return [...this.walls, ...this.blocks, ...this.balls];
    }

    queue(ms, cb, args?) {
        const trigger = prevFrameTime + ms * (1 / this.timeFactor);
        this.actionQueue.push({ trigger, cb, args });
    }

    async loop(t: DOMHighResTimeStamp) {
        // timings
        frameCount++;
        deltaTime = (t - prevFrameTime) / 20;
        timestep = deltaTime * this.timeFactor;
        prevFrameTime = t;

        if (this.blocks.length == 0) {
            // load next level!
            this.level++;
            await this.loadLevel();
        }

        // action queue
        for (let i = this.actionQueue.length - 1; i >= 0; i--) {
            let fn = this.actionQueue[i];
            if (fn.trigger < prevFrameTime) {
                fn.cb(fn.args);
                this.actionQueue.splice(i, 1);
            }
        }

        // cleeeear
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.iCtx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (let i = this.balls.length - 1; i >= 0; i--) {
            if (this.balls[i].pos.y > lowerGameBound || this.balls[i].pos.y < 0 || this.balls[i].health <= 0) {
                this.balls.splice(i, 1);
            }
        }

        for (let i = this.blocks.length - 1; i >= 0; i--) {
            if (this.blocks[i].health <= 0) {
                this.blocks[i].die();
                this.blocks.splice(i, 1);
            }
        }

        // interface update
        for (let i = this.interfaces.length - 1; i >= 0; i--) {
            if (this.interfaces[i].dead) {
                this.interfaces.splice(i, 1);
                continue;
            }
            this.interfaces[i].update()
        }

        // update everything
        for (let o of this.allObjects) {
            o.update();
        }

        // draw everything
        for (let i of this.interfaceObjects) {
            i.draw(this.iCtx);
        }

        for (let o of this.gameObjects) {
            o.draw(this.ctx);
        }

        this.ballGun.draw(this.ctx);

        // TODO if frametime low enough?
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update();
            if (p.dead) { this.particles.splice(i, 1); continue; }
            p.draw(this.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}