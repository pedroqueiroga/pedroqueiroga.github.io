const myPoints = [
  [100, 50],
  [300, 100],
  [200, 300],
  [100, 300],
];
var len = myPoints.length;
var i = 0;
var buttonAdd, buttonNext, buttonPrev;
var cnv;
var pointSize = 10;

function setup() {
  cnv = createCanvas(400, 400);

  buttonPrev = createButton('Previous frame');
  buttonPrev.position(cnv.position().x,
    height + cnv.position().y);
  buttonPrev.mousePressed(prevFrame);

  buttonNext = createButton('Next frame');
  buttonNext.position(cnv.position().x + buttonPrev.size().width,
    buttonPrev.position().y);
  buttonNext.mousePressed(nextFrame);

  background(190);
  drawLabels(myPoints);
}

function draw() {
  len = myPoints.length;
  background(190);
  drawClosedCurveVertex(myPoints, i);
  drawLabels(myPoints);
}

function mouseClicked() {
  if (isPointInCanvas(mouseX, mouseY)) {
    const i = getPoint(mouseX, mouseY);
    if (i !== false) {
      myPoints.splice(i, 1);
      return;
    }
    myPoints.push([mouseX, mouseY]);
  }
}

function getPoint(x, y) {
  for (const i in myPoints) {
    const p = myPoints[+i];
    if ((p[0] - pointSize < x && x < p[0] + pointSize) &&
      (p[1] - pointSize < y && y < p[1] + pointSize)) {
      return +i;
    }
  }
  return false;
}
function isPointInCanvas(x, y) {
  if (x < 0 || x > cnv.width) {
    return false;
  }
  if (y < 0 || y > cnv.height) {
    return false;
  }
  return true;
}

function nextFrame() {
  if (++i >= len) {
    i = len - 1;
  }
}

function prevFrame() {
  if (--i < 0) {
    i = 0;
  }
}

function drawClosedCurveVertex(myPoints, max) {
  if (myPoints.length < 2) return;
  let usedPoints = [];
  beginShape();

  // start by using the last point as the initial control point
  let idx = myPoints.length - 1;
  curveVertex(...myPoints[idx]);
  usedPoints.push(idx);

  // add each point to the curve
  for (const i in myPoints) {
    if (+i > max) break;
    curveVertex(...myPoints[+i]);
    usedPoints.push(+i);
  }

  // to close the curve, we need to create the last curve.
  // for that, we must go to the first point
  idx = 0;
  curveVertex(...myPoints[idx]);
  usedPoints.push(idx);

  // and use the next point as a control point.
  idx = 1;
  curveVertex(...myPoints[idx]);
  usedPoints.push(idx);
  endShape();


  textSize(10);
  noStroke();
  text('Points used to draw this curve (first and last are control points only)', 5, height - 30);

  textSize(20);
  text(usedPoints.join(', '), 10, height - 10);
  stroke(0);

  for (var i = 0; i < usedPoints.length - 1; i++) {
    drawDottedLine(myPoints[usedPoints[i]], myPoints[usedPoints[i + 1]]);
  }
}

function drawLabels(myPoints) {
  strokeWeight(pointSize);
  for (const i in myPoints) {
    const myPoint = myPoints[+i];
    let ts = 32;
    textSize(ts);
    let textY = myPoint[1] - ts / 2;
    if (myPoint[1] > height / 2) {
      textY = myPoint[1] + ts;
    }
    noStroke();
    text(i, myPoint[0], textY);
    stroke(0);
    point(...myPoint);
  }
  strokeWeight(1);
}

function drawDottedLine(p1, p2) {
  let step = 1 / 10;
  stroke(100);
  strokeWeight(3);
  for (let i = 0; i <= 1; i += step) {
    let x = lerp(p1[0], p2[0], i);
    let y = lerp(p1[1], p2[1], i);

    point(x, y);
  }
  stroke(0);
  strokeWeight(1);
}
