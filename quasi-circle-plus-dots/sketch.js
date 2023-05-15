let x, y, xb, yb;
const width = 800;
const height = 800;
const step = 1;

const mem = {};
const memb = {};

function setup() {
  x = 0;
  xb = 0;
  createCanvas(width, height);
  noStroke();
}

const f = (x) => {
  return x*x*x;
};

const fb = (x) => {
  return x*x;
};

const colorPicker = (d3) => {
  d3 = d3 || Math.floor(Math.random() * 3);
  const colorTable = {
    0: () => (fill(255,0,0), 0),
    1: () => (fill(0,255,0), 1),
    2: () => (fill(0,0,255), 2),
  };
  return colorTable[d3]();
};

const a = () => {
  x += step;
  y = f(x) % height;
  const c = colorPicker();
  mem[x] = [y, c];
    
  ellipse(x, y, 8, 8);
};

const b = () => {
  xb += step;
  yb = fb(xb) % height;
  const c = colorPicker();
  memb[xb] = [yb, c];
    
  ellipse(xb, yb, 8, 8);
};

function draw() {
  background(0, 0, 0);
  if (xb >= width && x >= width) {
    for (let i = 1; i < width; i += step) {
      rotate(millis() / 1000000);
      const [y, c] = mem[i];
      colorPicker(c);
      ellipse(i, y, 8, 8);
    }
    for (let i = 1; i < width; i += step) {
      rotate(-millis() / 10000000);
      const [yb, cb] = memb[i];
      colorPicker(cb);
      ellipse(i, yb, 8, 8);
    }
  } else {
    a();
    b();
  }
}
