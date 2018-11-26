window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    gridSize = 7;
    myMap = new MyMap(canvas, context, width,
		      height, gridSize);
    ant = new Ant(width/gridSize/2,
		  height/gridSize/2,
		  width/gridSize,
		  height/gridSize);
    
    myMap.drawGrid();
    playing = true;
    Draw.play();
    qtdPassos = 0;
};
// Full Blog Post: http://viget.com/extend/time-based-animation
var Draw = {
    play: function() {
	Draw.then = Date.now();
	Draw.frame();
    },

    pause: function() {
	window.cancelAnimationFrame(Draw.animationFrame);
    },
    
    frame: function() {
	Draw.setDelta();
	Draw.draw();
	Draw.animationFrame = window.requestAnimationFrame(Draw.frame);
    },

    setDelta: function() {
	Draw.now = Date.now();
	Draw.delta = (Draw.now - Draw.then) / 1000; // seconds since last frame
	Draw.then = Draw.now;
    },

    draw: function() {
	if (myMap.isBlack(ant.getPos())) {
	    myMap.clearSquare(ant.getPos());
	    ant.turnRight90();
	} else {
	    myMap.paintSquare(ant.getPos());
	    ant.turnLeft90();
	}
	ant.move();
	window.qtdPassos++;
	console.log(window.qtdPassos);
	myMap.drawAnt(ant, "red");
    }
}
/*
function draw() {
    if (myMap.isBlack(ant.getPos())) {
	myMap.clearSquare(ant.getPos());
	ant.turnRight90();
    } else {
	myMap.paintSquare(ant.getPos());
	ant.turnLeft90();
    }
    ant.move();
    myMap.drawAnt(ant.getPos(), "red");
    
    requestAnimationFrame(draw);
}
*/
window.onclick = function() {
    (playing == true) ? Draw.pause() : Draw.play();
    playing = !playing;
}
