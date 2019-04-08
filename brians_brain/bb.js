window.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    let x = ev.clientX;
    let y = ev.clientY;

    myMap.paintSquare({x:Math.round(x/gridSize), y:Math.round(y/gridSize)});
}, false);

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    gridSize = 7;
    gridWidth = Math.round(width/gridSize);
    gridHeight = Math.round(height/gridSize);
    currentLine = 0;
    myMap = new MyMap(canvas, context, width,
		      height, gridSize);
    //myMap.drawGrid();

    // initial seed
    middleX = Math.round(gridWidth/2);
    middleY = Math.round(gridHeight/2);

    myMap.paintSquare({x:middleX, y:middleY});
    myMap.paintSquare({x:middleX+1, y:middleY});
    myMap.paintSquare({x:middleX, y:middleY-1});
    myMap.paintSquare({x:middleX+1, y:middleY-1});

    myMap.paintSquare({x:middleX-1, y:middleY}, "red");
    myMap.paintSquare({x:middleX+1, y:middleY+1}, "red");
    myMap.paintSquare({x:middleX+2, y:middleY-1}, "red");
    myMap.paintSquare({x:middleX, y:middleY-2}, "red");
    

    playing = true;
    Draw.play();
};

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
	Draw.animationFrame = window.requestAnimationFrame(Draw.frame);
    },

    setDelta: function() {
        Draw.now = Date.now();
        Draw.delta = (Draw.now - Draw.then) / 1000;
        Draw.then = Draw.now;
    },

    draw: function() {
        let listOfModifications = [];
        for (let col = 0; col < window.gridWidth; col++) {
            for (let line = 0; line < window.gridHeight; line++) {
                let sq = {x:col, y:line};
                // console.log("inspecting square", sq);
                if (myMap.isBlack(sq)) {
                    // on -> dying
                    listOfModifications.push([sq, "red"]);
                } else if (myMap.isRed(sq)) {
                    // dying -> off
                    listOfModifications.push([sq, "clear"]);
                } else {
                    // off cells
                    // check for exactly 2 black (on) neighbours
                    // if true, off -> on
                    let nNeighbours = myMap.isBlack({x:col,y:line+1}) +
                        myMap.isBlack({x:col,y:line-1}) +
                        myMap.isBlack({x:col-1,y:line}) +
                        myMap.isBlack({x:col+1,y:line}) +
                        myMap.isBlack({x:col+1,y:line+1}) +
                        myMap.isBlack({x:col+1,y:line-1}) +
                        myMap.isBlack({x:col-1,y:line+1}) +
                        myMap.isBlack({x:col-1,y:line-1});
                    if (nNeighbours == 2) {
                        listOfModifications.push([sq, "black"]);
                    }
                }
            }
        }
        debugger;
        for (let mod of listOfModifications) {
            if (mod[1] == "clear") myMap.clearSquare(mod[0]);
            else myMap.paintSquare(...mod);
        }
    }
};

window.onclick = function() {
    debugger;
    (playing == true) ? Draw.pause() : Draw.play();
};

