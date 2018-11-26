window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    gridSize = 2;
    gridWidth = Math.round(width/gridSize);
    gridHeight = Math.round(height/gridSize);
    currentLine = 0;
    myMap = new MyMap(canvas, context, width,
		      height, gridSize);
//    myMap.drawGrid();

    playing = false;
}

var Draw = {
    play: function() {
	Draw.then = Date.now();
	Draw.frame();
	playing = true;
    },

    pause: function() {
	window.cancelAnimationFrame(Draw.animationFrame);
	playing = false;
    },
    
    frame: function() {
	Draw.setDelta();
	Draw.draw();
	if (window.currentLine < window.gridHeight - 1) {
	    (Draw.animationFrame = window.requestAnimationFrame(Draw.frame));
	} else {
	    playing = false;
	}
    },

    setDelta: function() {
	Draw.now = Date.now();
	Draw.delta = (Draw.now - Draw.then) / 1000; // seconds since last frame
	Draw.then = Draw.now;
    },

    draw: function() {
	if (currentLine == 0) paintSquare({x:gridWidth - 2, y:0});
	for (var col = window.gridWidth - 1; col > (window.gridWidth - currentLine - 3); col--) {
	    var code = myMap.isBlack({x:col, y: window.currentLine}) +
		(myMap.isBlack({x:col - 1, y: window.currentLine})*2) +
		(myMap.isBlack({x:col - 2, y: window.currentLine})*4);
	    switch (code) {
/*	    case 0:
	    case 4:
	    case 7:
		myMap.clearSquare({x:col - 1, y: window.currentLine + 1});
		break;*/
	    case 1:
	    case 2:
	    case 3:
	    case 5:
	    case 6:
		paintSquare({x:col - 1, y: window.currentLine + 1});
		break;
	    }
	}
	currentLine++;
    }
}

window.onclick = function() {
    debugger;
    (currentLine == gridHeight - 1) ? (myMap.clear() && (currentLine = 0)) : ((playing == true) ? Draw.pause() : Draw.play());
}
