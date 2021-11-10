import Rect from './Rect.js';

export default class Sprite{
    constructor(x, y, fwd, speed){
        this.x = x;
        this.y = y;
        this.fwd = fwd;
        this.speed = speed;
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }

    reflectX(){
        this.fwd.x *= -1;
    }

    reflectY(){
        this.fwd.y *= -1;
    }

    getRect(){
        return new Rect(this.x, this.y, this.width, this.height);
    }
}