import { bg, rh, rs } from "../main.js";
import { Ball } from "./Ball.js";
import { Block } from "./Block.js";
import { Wall } from "./Wall.js";
import { BallGun } from "./BallGun.js";

export const lowerGameBound = 500;

export class BallGame {
    walls: Wall[];
    balls: Ball[];
    blocks: Block[];

    // Main canvas
    cnv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // Interface Canvas
    iCnv: HTMLCanvasElement;
    iCtx: CanvasRenderingContext2D;

    // DOM stuff
    targetDiv: HTMLDivElement;
    targetBB: DOMRect;

    naturalGameBB: { x: number, y: number, width: number, height: number };

    score: number;
    ballBank: number;

    ballGun: BallGun;

    loopHandle;

    constructor() {
        // Setup natural sizes
        this.naturalGameBB = {
            x: 0,
            y: 0,
            width: 320,
            height: 568
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
        this.score = 0;
        this.balls = [];
        this.walls = [];
        this.blocks = [];

        // Setup initial objects
        this.ballGun = new BallGun;

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

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                console.log(i,j);
                this.blocks.push(new Block({ x: bg(i), y: bg(j), health: Number(`${i}${j}`) }))
            }
        }

        // add interaction handlers
        this.targetDiv.addEventListener('touchstart', e => {
            e.preventDefault();

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

                this.ballGun.fire(this.balls, 100);
            }

            this.targetDiv.addEventListener('touchend', upFn);
        })

        this.targetDiv.addEventListener('mousedown', e => {
            e.preventDefault();

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
                
                this.ballGun.fire(this.balls, 100);
            }

            this.targetDiv.addEventListener('mouseup', upFn);
        })

        // TEST
        // this.testDraw();

        // Begin main loop
        this.loopHandle = requestAnimationFrame(this.loop.bind(this));
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

    testDraw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.iCtx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.strokeStyle = '#696969';
        this.ctx.beginPath();
        this.ctx.moveTo(rs(160), 0);
        this.ctx.lineTo(rs(160), rs(568));
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.fillStyle = '#FF000088';
        this.ctx.fillRect(rs(50), rs(50), rs(100), rs(100));

        this.iCtx.fillStyle = '#0000FF88';
        this.iCtx.fillRect(rs(75), rs(75), rs(100), rs(100));

        this.ctx.fillStyle = '#FF0000FF';
        this.ctx.fillRect(rs(100), rs(100), rs(100), rs(100));

        this.iCtx.fillStyle = '#0000FFFF';
        this.iCtx.fillRect(rs(125), rs(125), rs(100), rs(100));

        let bk = new Block({ x: 118, y: 300, health: 1 });
        bk.draw(this.ctx);

        let bk2 = new Block({ x: 150, y: 300, health: 10 });
        bk2.draw(this.ctx);

        let bk3 = new Block({ x: 182, y: 300, health: 100 });
        bk3.draw(this.ctx);

        let bl = new Ball({ x: 200, y: 400, a: 0 });
        bl.draw(this.ctx);

        let w = new Wall({ x: 100, y: 450, width: 200, height: 10 });
        w.draw(this.ctx);

        this.ballGun.draw(this.ctx);
    }

    get allObjects() {
        return [...this.walls, ...this.blocks, ...this.balls, this.ballGun];
    }

    get interfaceObjects() {
        return [];
    }

    get gameObjects() {
        return [...this.walls, ...this.blocks, ...this.balls, this.ballGun];
    }

    loop(t: DOMHighResTimeStamp) {
        // cleeeear
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (let i = this.balls.length - 1; i >= 0; i--) {
            if (this.balls[i].pos.y > lowerGameBound || this.balls[i].pos.y < 0 || this.balls[i].health <= 0) {
                this.balls.splice(i, 1);
            }
        }

        for (let i = this.blocks.length - 1; i >= 0; i--) {
            if (this.blocks[i].health <= 0) {
                this.blocks.splice(i, 1);
            }
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

        requestAnimationFrame(this.loop.bind(this));
    }
}