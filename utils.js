var utils = {
    distance: function(p0, p1) {
	var dx = p1.x - p0.x,
	    dy = p1.y - p0.y;
	return Math.sqrt(dx * dx + dy * dy);
    },

    nBezier: function(points, t, pFinal) {
	var pFinal = pFinal || {};
	pFinal.x = 0;
	pFinal.y = 0;
	for (var i = 0; i < points.length; i += 1) {
	    while (points.length > pascal.length) {
		extendPascal();
	    }
	    var temp = pascal[points.length - 1][i]
	    temp = temp*Math.pow(1 - t, points.length - 1 - i)*
		Math.pow(t, i);
	    pFinal.x += temp*points[i].x;
	    pFinal.y += temp*points[i].y;
	}
	return pFinal;
    },

    nBezierv0: function(points, t, pFinal) {
	pFinal = this.objCopy(points);
	for (var i = 0; i < points.length - 1; i += 1) {
	    for (var j = 0; j < (points.length - 1 - i); j += 1) {
		pFinal[j].x = (1 - t)*pFinal[j].x + t*pFinal[j+1].x;
		pFinal[j].y = (1 - t)*pFinal[j].y + t*pFinal[j+1].y;
	    }
	}
	return pFinal[0];
    },

    objCopy: function(obj) {
	var novoObj = [];
	for (var i = 0; i < obj.length; i += 1) {
	    novoObj.push({x: obj[i].x, y: obj[i].y});
	}
	return novoObj;
    }

}, pascal = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
    [1, 6, 15, 20, 15, 6, 1],
    [1, 7, 21, 35, 35, 21, 7, 1],
    [1, 8, 28, 56, 70, 56, 28, 8, 1],
    [1, 9, 36, 84, 126, 126, 84, 36, 9, 1],
    [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1],
    [1, 11, 55, 165, 330, 462, 462, 330, 165, 55, 11, 1],
    [1, 12, 66, 220, 495, 792, 924, 792, 495, 220, 66, 12, 1]
];

extendPascal = function() {
    var newLine = [1];
    for (var i = 0; i < (pascal[pascal.length - 1].length - 1); i+= 1) {
	newLine.push(pascal[pascal.length - 1][i] +
		     pascal[pascal.length - 1][i+1]);
	}
    newLine.push(1);
    pascal.push(newLine);
};
