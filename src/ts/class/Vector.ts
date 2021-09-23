export class Vector {
    x: number;
    y: number;
    a: number;

    constructor(o?: VecOptions) {
        if (!o) {
            this.x = 0;
            this.y = 0;
            this.a = 0;
        } else {
            if (o.a !== undefined && o.x !== undefined) throw ("Vector: Not how vectors work that.");
            if (o.m !== undefined && o.x !== undefined) throw ("Vector: Not how vectors work that.");
            if (o.a !== undefined && o.y !== undefined) throw ("Vector: Not how vectors work that.");
            if (o.m !== undefined && o.y !== undefined) throw ("Vector: Not how vectors work that.");

            if (o.a !== undefined && o.m !== undefined) {
                this.x = o.m * Math.cos(o.a);
                this.y = o.m * Math.sin(o.a);
                this.a = saneRad(o.a);
            } else if (o.x !== undefined && o.y !== undefined) {
                this.x = o.x;
                this.y = o.y;
                this.recalcAngle();
            } else {
                throw ("Vector: invalid vector setup!");
            }
        }
    }

    getMag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    setMag(m) {
        // normalize then multiply :)
        this.normalize();
        this.setXY(this.x * m, this.y * m);
    }

    normalize() {
        let m = this.getMag();
        this.setXY(this.x / m, this.y / m);
    }

    setX(x) {
        this.x = x;
        this.recalcAngle();
    }

    setY(y) {
        this.y = y;
        this.recalcAngle();
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.recalcAngle();
    }

    recalcAngle() {
        this.a = saneRad(Math.atan2(this.y, this.x));
    }

    getAngle() {
        return this.a;
    }

    setAngle(a) {
        // recreate vector at angle keeping magnitude
        let temp = new Vector({ a: a, m: this.getMag() });
        this.setXY(temp.x, temp.y);
    }

    // Mutating functions
    addV(v: Vector) {
        this.x += v.x;
        this.y += v.y;
    }

    subtractV(v: Vector) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(s: number) {
        this.x *= s;
        this.y *= s;
    }

    // nonmutating functions
    iMult(s:number) {
        return new Vector({x:this.x*s, y:this.y*s});
    }
}

interface VecOptions {
    x?: number;
    y?: number;
    a?: number;
    m?: number;
}

function saneRad(n) {
    // converts negative or over 2pi rads to 0<n<2pi
    while (n > Math.PI * 2) {
        n -= Math.PI * 2;
    }

    while (n < 0) {
        n += Math.PI * 2;
    }

    return n;
}