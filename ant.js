function Ant(x, y, windowWidth, windowHeight) {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.xLimit = Math.round(windowWidth);
    this.yLimit = Math.round(windowHeight);
    this.facing = 'r';
}

function move() {
    switch (this.facing) {
    case 'u':
	this.moveUp();
	break;
    case 'r':
	this.moveRight();
	break;
    case 'd':
	this.moveDown();
	break;
    case 'l':
	this.moveLeft();
	break;
    }
}

function moveUp() {
    this.y = (((this.y - 1) % this.yLimit) + this.yLimit) % this.yLimit;
    //(this.y > 0) && this.y--;
}

function moveDown() {
    this.y = (((this.y + 1) % this.yLimit) + this.yLimit) % this.yLimit;
    //(this.y < this.yLimit) && this.y++;
}

function moveRight() {
    this.x = (((this.x + 1) % this.xLimit) + this.xLimit) % this.xLimit;
    //(this.x < this.xLimit) && this.x++;
}

function moveLeft() {
    this.x = (((this.x - 1) % this.xLimit) + this.xLimit) % this.xLimit;
    //(this.x > 0) && this.x--;
}

function getPos() {
    return {x: this.x, y: this.y}
}

function turnRight90() {
    switch (this.facing) {
    case 'u':
	this.facing = 'r';
	break;
    case 'r':
	this.facing = 'd';
	break;
    case 'd':
	this.facing = 'l';
	break;
    case 'l':
	this.facing = 'u';
	break;
    }
}

function turnLeft90() {
    switch (this.facing) {
    case 'u':
	this.facing = 'l';
	break;
    case 'l':
	this.facing = 'd';
	break;
    case 'd':
	this.facing = 'r';
	break;
    case 'r':
	this.facing = 'u';
	break;
    }
}

Ant.prototype = {
    moveUp: moveUp,
    moveDown: moveDown,
    moveRight: moveRight,
    moveLeft: moveLeft,
    move: move,
    getPos: getPos,
    turnRight90: turnRight90,
    turnLeft90: turnLeft90
}
