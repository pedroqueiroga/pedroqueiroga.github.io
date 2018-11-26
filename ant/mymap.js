function MyMap(canvas, context,
	       width, height, gridSize) {
    this.canvas = canvas;
    this.context = context;
    this.width = width;
    this.height = height;
    this.gridSize = gridSize;
    this.centerOfGrid = {x: Math.round((width/gridSize)/2),
			 y: Math.round((height/gridSize)/2)};
}

function clear() {
    context.clearRect(0, 0, width, height);
    return true;
}

function drawGrid() {
    context.strokeStyle = "black";
    var i, j;
    for (i = 0; i <= this.height; i+= this.gridSize) {
	context.beginPath();
	context.moveTo(0, i);
	context.lineTo(width, i);
	context.stroke();
	for (j = 0; j <= this.width; j += this.gridSize) {
	    context.beginPath();
	    context.moveTo(j, 0);
	    context.lineTo(j, height);
	    context.stroke();
	}
    }
}

function findPixel(square) {
    return {x: square.x * this.gridSize,
	    y: square.y * this.gridSize};
}

function paintSquare(sq) {
    var pixel = this.findPixel(sq);
    context.beginPath();
    context.rect(pixel.x, pixel.y,
		 this.gridSize,
		 this.gridSize);
    context.fillStyle = "black";
    context.fill();
}

function clearSquare(sq) {
    var pixel = this.findPixel(sq);
    context.beginPath();
    context.rect(pixel.x+1, pixel.y+1,
		 this.gridSize-2,
		 this.gridSize-2);
    context.fillStyle = "white";
    context.fill();
    context.fillStyle = "black";
}

function isBlack(sq) {
    var pixel = this.findPixel(sq);
    var color = context.getImageData(pixel.x + 1,
				     pixel.y + 1,
				     1,
				     1);
    return (color.data[0] == 0 &&
	    color.data[1] == 0 &&
	    color.data[2] == 0 &&
	    color.data[3] == 255) ? true : false;
}

function drawAnt(ant, color) {
    var pixel = this.findPixel(ant.getPos());
    context.beginPath();
    context.arc(pixel.x + this.gridSize/2,
		pixel.y + this.gridSize/2,
		this.gridSize/4,
		0,
		2 * Math.PI);
    switch (ant.facing) {
    case 'u':
	context.arc(pixel.x +
		    this.gridSize/2,
		    pixel.y +
		    this.gridSize/2 +
		    (- this.gridSize/4),
		    this.gridSize/5,
		    0,
		    2 * Math.PI);
	break;
    case 'r':
	context.arc(pixel.x +
		    this.gridSize/2 +
		    (this.gridSize/4),
		    pixel.y +
		    this.gridSize/2,
		    this.gridSize/5,
		    0,
		    2 * Math.PI);
	break;
    case 'd':
	context.arc(pixel.x +
		    this.gridSize/2,
		    pixel.y +
		    this.gridSize/2 +
		    (this.gridSize/4),
		    this.gridSize/5,
		    0,
		    2 * Math.PI);
	break;
    case 'l':
	context.arc(pixel.x +
		    this.gridSize/2 +
		    ( - this.gridSize/4),
		    pixel.y +
		    this.gridSize/2,
		    this.gridSize/5,
		    0,
		    2 * Math.PI);
	break;
    }
    context.fillStyle = color;
    context.fill();
    context.fillStyle = "black";
}

MyMap.prototype = {
    drawGrid: drawGrid,
    paintSquare: paintSquare,
    clearSquare: clearSquare,
    findPixel: findPixel,
    drawAnt: drawAnt,
    isBlack: isBlack,
    clear: clear
}
