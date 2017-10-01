points = [];
var possiblyClicked;
labelColor = "yellow";
dragging = false;
document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    if (dragging && points.length > 0) {
	requestAnimationFrame(draw);
	points[possiblyClicked].x = event.clientX;
	points[possiblyClicked].y = event.clientY;
    }
}

document.onclick = function(event) {
    //    alert("clicked on ("+ event.clientX + ", " + event.clientY + ")");
   // if (points.length > pascal.length-1) {
//	alert("Não vou colocar mais ponto de controle não.");
    //  } else {
    //    alert("click: " +  event.button + ", " + event.which);
    requestAnimationFrame(draw);
    var clickedPoint = {x: event.clientX, y: event.clientY};
    if (event.clientX > 30 ||  event.clientY > 30) {
	if (points.length > 0) {
	    possiblyClicked = 0;
	    var curDist = utils.distance(clickedPoint, points[0]);
	    for (var i = 1; i < points.length; i += 1) {
		if (utils.distance(clickedPoint, points[i]) < curDist) {
		    possiblyClicked = i;
		    curDist = utils.distance(clickedPoint, points[i]);
		}
	    }
	}
	var rightclick, leftclick;
	if (!event) event = window.event;
	if (event.which) {
	    rightlick = (event.which == 3);
	    leftclick = (event.which == 1);
	} else if (event.button) {
	    rightlick = (event.button == 2);
	    leftclick = (event.button == 0);
	}
	if (leftclick) {
	    if (dragging) {
		dragging = false;
		
	    } else if (curDist < 6) {
		dragging = true;
		
	    } else {
		points.push(clickedPoint);
	    }
	} else if (rightlick) {
	    if (dragging) dragging = false;
	    else {
		if (curDist < 40) {
		    points.splice(possiblyClicked, 1);
		} else
		    points.pop();
	    }
	}
    } else if (event.clientX <= 15 && event.clientY <= 15) {
	if (labelColor === "red")
	    labelColor = "green";
	else if (labelColor === "green")
	    labelColor = "yellow";
	else if (labelColor === "yellow")
	    labelColor = "red";
    }	
    //}
};

// não aparecer o menu do botão direito do mouse.
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    // só o firefox não parece desabilitar o botão direito...
    if (typeof InstallTrigger === 'undefined') { // se não for o firefox
	requestAnimationFrame(draw);
	// faz o que faria no botão direito normalmente.
	if (dragging) dragging = false;
	else {
	    var clickedPoint = {x: event.clientX, y: event.clientY};
	    if (points.length > 0) {
		possiblyClicked = 0;
		var curDist = utils.distance(clickedPoint, points[0]);
		for (var i = 1; i < points.length; i += 1) {
		    if (utils.distance(clickedPoint, points[i]) < curDist) {
			possiblyClicked = i;
			curDist = utils.distance(clickedPoint, points[i]);
		    }
		}
	    }
	    if (curDist < 40) {
		points.splice(possiblyClicked, 1);
	    } else
		points.pop();
	}
    }
});
var canvas, context, width, height
window.onload = function() {
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    draw();
};

function draw() {
    context.clearRect(0, 0, width, height);
    
    context.fillStyle = labelColor;
    context.fillRect(0, 0, 15, 15);
    context.fillStyle = "black";
    context.strokeStyle="black";
    for (var i = 0; i < points.length - 1; i += 1) {
	context.beginPath();
	context.moveTo(points[i].x, points[i].y);
	context.lineTo(points[i+1].x, points[i+1].y);
	context.stroke();
	labelPoint(points[i], "b" + i, labelColor);
    }
    if (points.length > 0)
	labelPoint(points[points.length - 1], "b" + (points.length - 1), labelColor);
    
    var pFinal = {};
    var pFinalPrev = {};
    context.strokeStyle="red";
    if (points.length > 0) {
	pFinalPrev.x = points[0].x;
	pFinalPrev.y = points[0].y;
	for(var t = 0; t <= 1; t += 0.001) {
	    utils.nBezier(points, t, pFinal);
	    context.beginPath();
	    context.moveTo(pFinalPrev.x, pFinalPrev.y);
	    context.lineTo(pFinal.x, pFinal.y);
	    context.stroke();
	    pFinalPrev.x = pFinal.x;
	    pFinalPrev.y = pFinal.y;
	    
	}
    }

    for (var i = 0; i < points.length; i += 1) {
	context.beginPath();
	context.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2, false);
	context.fill();
    }
//    requestAnimationFrame(draw);
}

function labelPoint(p, name, color) {
    if (color === "yellow" || color === "green") {
	context.fillText(name, p.x + 10, p.y + 10);
	if (color === "green") {
	    context.fillText("x: " + Math.round(p.x), p.x + 10, p.y + 25);
	    context.fillText("y: " + Math.round(p.y), p.x + 10, p.y + 40);
	}
    }
}
