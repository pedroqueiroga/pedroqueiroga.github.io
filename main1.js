points = [];
var hull = [];
var possiblyClicked;
labelColor = "yellow";
cpFillStyle = "black";
hullFillStyle = "black";
polygonFillStyle = "black";
curveFillStyle = "black";
hmmmFillStyle = "black";
dragging = false;
tamanhoBloquinho = 15;
raioPontinho = 4;
document.onmousemove = handleMouseMove;
var resolucao = 0.0009765625;
function handleMouseMove(event) {
    if (dragging && points.length > 0) {
	var newpoints = points.slice();
	newpoints.splice(possiblyClicked, 1);
	convexHull.remove(hull, newpoints, points[possiblyClicked]);
	points[possiblyClicked].x = event.clientX;
	points[possiblyClicked].y = event.clientY;
	convexHull.insert(hull, points[possiblyClicked]);
	requestAnimationFrame(draw);
    }
}

function atualizaPossiblyClicked(clickedPoint) {
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
    return curDist
}

function trocaLabelColor() {
    if (labelColor === "red")
	labelColor = "green";
    else if (labelColor === "green")
	labelColor = "yellow";
    else if (labelColor === "yellow")
	labelColor = "red";
}

function trocaFillStyle(fs) {
    if (fs === "black") {
	return "gray";
    } else {
	return "black";
    }
}

document.onclick = function(event) {
    var clickedPoint = {x: event.clientX, y: event.clientY};
    debugger;
    if (event.clientX > tamanhoBloquinho + 15 ||
	event.clientY > tamanhoBloquinho + 185) {
	var curDist = atualizaPossiblyClicked(clickedPoint);
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
	    } else if (curDist < raioPontinho + 2) {
		dragging = true;
	    } else {
		points.push(clickedPoint);
		convexHull.insert(hull, {x: event.clientX, y: event.clientY});
		console.log("current hull:");
		for(var i = 0; i < hull.length; ++i){
		    console.log(hull[i]);
		}
		console.log("----fin----");
	    }
	} else if (rightlick) {
	    if (dragging) dragging = false;
	    else {
		var p;
		if (curDist < raioPontinho*11) {
		    var p = points[possiblyClicked];
		    points.splice(possiblyClicked, 1);
		} else {
		    var p = points.pop();
		}
		convexHull.remove(hull, points, p);
	    }
	}
    } else if (event.clientX <= tamanhoBloquinho) {
	bloquinhosLogic();
    }
    requestAnimationFrame(draw);
};

// não aparecer o menu do botão direito do mouse.
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    // só o firefox não parece desabilitar o botão direito...
    if (typeof InstallTrigger === 'undefined') { // se não for o firefox
	if (event.clientX > tamanhoBloquinho + 15 ||
	    event.clientY > tamanhoBloquinho + 185) {
	    if (dragging) dragging = false;
	    else {
		var clickedPoint = {x: event.clientX, y: event.clientY};
		var curDist = atualizaPossiblyClicked(clickedPoint);
		var p;
		if (curDist < raioPontinho*11) {
		    var p = points[possiblyClicked];
		    points.splice(possiblyClicked, 1);
		} else {
		    var p = points.pop();
		}
		convexHull.remove(hull, points, p);
	    }
	} else if (event.clientX <= tamanhoBloquinho) {
	    bloquinhosLogic();
	}
	requestAnimationFrame(draw);
    }
});

function bloquinhosLogic() {
    if (event.clientY <= tamanhoBloquinho) {
	trocaLabelColor();
    } else if (event.clientY <= tamanhoBloquinho + 30 && event.clientY > tamanhoBloquinho) {
	cpFillStyle = trocaFillStyle(cpFillStyle);
    } else if (event.clientY <= tamanhoBloquinho + 60 && event.clientY > tamanhoBloquinho + 30) {
	hullFillStyle = trocaFillStyle(hullFillStyle);
    } else if (event.clientY <= tamanhoBloquinho + 90 && event.clientY > tamanhoBloquinho + 60) {
	polygonFillStyle = trocaFillStyle(polygonFillStyle);
    } else if (event.clientY <= tamanhoBloquinho + 115 && event.clientY > tamanhoBloquinho + 90) {
	curveFillStyle = trocaFillStyle(curveFillStyle);
    } else if (event.clientY <= tamanhoBloquinho + 140 && event.clientY > tamanhoBloquinho + 115) {
	escolheRes();
    } else if (event.clientY <= tamanhoBloquinho + 170 && event.clientY > tamanhoBloquinho + 140) {
	hmmmFillStyle = trocaFillStyle(hmmmFillStyle);
    }
}

var canvas, context, width, height
window.onload = function() {
    resolucao = 0.000244140625;
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    draw();
};

function escolheRes() {
    resolucao=Math.max(parseFloat(prompt("Informe a resolucao da curva","0.5")),0.000244140625);
    resolucao = isNaN(resolucao) ? 0.000244140625 : resolucao;
}

function draw() {
    context.clearRect(0, 0, width, height);

    drawSomeBlock(cpFillStyle, "b", 10);
    drawSomeBlock(hullFillStyle, "h", 40);
    drawSomeBlock(polygonFillStyle, "p", 65);
    drawSomeBlock(curveFillStyle, "c", 95);
    drawSomeBlock("black", "r", 120);
    drawSomeBlock(hmmmFillStyle, "!", 150);
    context.fillStyle = labelColor;
    context.fillRect(0, 0, tamanhoBloquinho, tamanhoBloquinho);
    context.fillStyle = "gray";
    context.strokeStyle="lightgray";
    for (var i = 0; i < points.length - 1; i += 1) {
	context.beginPath();
	context.moveTo(points[i].x, points[i].y);
	context.lineTo(points[i+1].x, points[i+1].y);
	if (polygonFillStyle === "black") {
	    context.stroke();
	}
	if (i == 0) context.fillStyle = "black";
	else context.fillStyle = "gray";
	labelPoint(points[i], "b" + i, labelColor);
    }
    if (points.length > 0) {
	context.fillStyle = "black";
	labelPoint(points[points.length - 1], "b" + (points.length - 1), labelColor);
    }
    
    var pFinal = {};
    var pFinalPrev = {};
    if (curveFillStyle === "black") {
	context.strokeStyle="black";

	if (hmmmFillStyle === "black") {
	    if (points.length > 0) {
		pFinalPrev.x = points[0].x;
		pFinalPrev.y = points[0].y;
		for(var t = 0; t <= 1; t += resolucao) {
		    utils.nBezier(points, t, pFinal);
		    context.beginPath();
		    context.moveTo(pFinalPrev.x, pFinalPrev.y);
		    context.lineTo(pFinal.x, pFinal.y);
		    context.stroke();
		    pFinalPrev.x = pFinal.x;
		    pFinalPrev.y = pFinal.y;
		}
		context.beginPath();
		context.moveTo(pFinalPrev.x, pFinalPrev.y);
		context.lineTo(points[points.length-1].x, points[points.length-1].y);
		context.stroke();
	    }
	} else {
	    if (points.length > 0) {
		pFinalPrev.x = points[0].x;
		pFinalPrev.y = points[0].y;
		for(var t = 0; t <= 1; t += resolucao) {
		    pFinal = utils.nBezierv0(points, t, pFinal);
		    context.beginPath();
		    context.moveTo(pFinalPrev.x, pFinalPrev.y);
		    context.lineTo(pFinal.x, pFinal.y);
		    context.stroke();
		    pFinalPrev.x = pFinal.x;
		    pFinalPrev.y = pFinal.y;
		}
		context.beginPath();
		context.moveTo(pFinalPrev.x, pFinalPrev.y);
		context.lineTo(points[points.length-1].x, points[points.length-1].y);
		context.stroke();
	    }
	}
    }
    
    if (cpFillStyle === "black") {
	for (var i = 0; i < points.length; i += 1) {
	    if (i == 0 || i == points.length - 1) {
		context.strokeStyle = context.fillStyle = "black";
	    } else {
		context.strokeStyle = context.fillStyle = "gray";
	    }
	    context.beginPath();
	    context.arc(points[i].x, points[i].y, raioPontinho, 0, Math.PI * 2, false);

	    context.fill();
	}
    }
    //    requestAnimationFrame(draw);

    if (hullFillStyle === "black") {
	if(hull.length > 0) {
	    context.strokeStyle="pink";
	    for (var i = 0; i < hull.length - 1; i += 1) {
		context.beginPath();
		context.moveTo(hull[i].x, hull[i].y);
		context.lineTo(hull[i+1].x, hull[i+1].y);
		context.stroke();
	    }
	    context.beginPath();
	    context.moveTo(hull[hull.length - 1].x, hull[hull.length - 1].y);
	    context.lineTo(hull[0].x, hull[0].y);
	    context.stroke();
	}
    }
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
// desenha o bloquinho para ocultar/exibir pontos de controle
function drawSomeBlock(fs, letra, offset) {
    context.font="30px Verdana";
    context.fillStyle=fs;
    //    context.fillRect(0, tamanhoBloquinho, tamanhoBloquinho, tamanhoBloquinho);
    context.fillText(letra, 0, tamanhoBloquinho*2 + offset);
    context.font="10px Verdana";
}
