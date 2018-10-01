
const BOID_RAD   = 10;
const NR_BOIDS   = 100;
const CANVAS_W   = 600;
const CANVAS_H   = 600;
const MIN_SPEED  = 5;
const MAX_SPEED  = 20;
const DTIME      = 0.3;
const NR_NEIGH   = 5;
const NEIGH_DIST = 50;

var boids = [];

var y = 100;
var x = 100;

function setup() {
  var canvas = createCanvas(CANVAS_W, CANVAS_H);  
  canvas.parent('sketch');
  stroke(0xec, 0xf0, 0xf1);
  frameRate(30);
  swarmInit();
}

function swarmInit() {
  /* fill boids with random values */
  for (var i = 0; i < NR_BOIDS; ++i) {
    var boid = {};
    boid.x  = Math.random() * CANVAS_W;
    boid.y  = Math.random() * CANVAS_H;
    boid.vx = (0.5 - Math.random()) * MAX_SPEED;
    boid.vy = (0.5 - Math.random()) * MAX_SPEED;
    boids.push(boid);
  }
}

function drawBoid(b) {
  ellipse(b.x, b.y, BOID_RAD, BOID_RAD);
}

function boidDist(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

var __boidScript = null;

function draw() { 
  background(0x2c, 0x3e, 0x50);
  noFill();
  rect(0, 0, CANVAS_W-1, CANVAS_H-1);
  fill(0xec, 0xf0, 0xf1);

  for (var i = 0; i < NR_BOIDS; ++i) {
    var c = 1;
    var peers = [];

    for (var j = 0; j < NR_BOIDS; ++j) {
      if (i != j) {
        var d = boidDist(boids[i], boids[j]);
        if (c <= NR_NEIGH && d < NEIGH_DIST) {
          peers.push(boids[j]);
          line(boids[i].x, boids[i].y, boids[j].x, boids[j].y);
          ++c;
        }
      }
    }

    if (__boidScript)
      boids[i] = __boidScript(boids[i], peers);

    /* Apply changes */
    //boids[i].vx = diff.vx;
    //boids[i].vy = diff.vy;

    /* Handle out of range */
    if (Math.abs(boids[i].vx) > MAX_SPEED)
        boids[i].vx = Math.sign(boids[i].vx) * MAX_SPEED;

    if (Math.abs(boids[i].vy) > MAX_SPEED)
        boids[i].vy = Math.sign(boids[i].vy) * MAX_SPEED;
    
    /* Simulation */
    boids[i].x += (boids[i].vx * DTIME) % CANVAS_W;
    boids[i].y += (boids[i].vy * DTIME) % CANVAS_H;

    /* Dynamics */
    if (boids[i].x < BOID_RAD) {boids[i].x = BOID_RAD; boids[i].vx *= -1;}
    if (boids[i].y < BOID_RAD) {boids[i].y = BOID_RAD; boids[i].vy *= -1;}
    if (boids[i].x > CANVAS_W - BOID_RAD) {boids[i].x = CANVAS_W - BOID_RAD; boids[i].vx *= -1;}
    if (boids[i].y > CANVAS_H - BOID_RAD) {boids[i].y = CANVAS_H - BOID_RAD; boids[i].vy *= -1;}
  }

  /* Draw boids */
  for (var i = 0; i < NR_BOIDS; ++i) {
    drawBoid(boids[i]);
  }
} 
