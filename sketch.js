//about
// This sketch simulates a bouncing ball that changes color upon hitting the walls.
// The wall that was hit last is highlighted by a white bar.
// The background color changes to match the inverse of the ball's color.
// The ball's speed can be adjusted by clicking the mouse buttons.
// I wanted to take this as an opportunity to practice vector math and physics concepts.
// concepts used: functions, variables, conditionals, mouse interaction, vector math, physics(reflection)
//declare variables
let ballPos, ballVel;
let ballSize;
let boundsMinX, boundsMaxX, boundsMinY, boundsMaxY;
let topWall,
    bottomWall,
    leftWall,
    rightWall,
    topWallNormal,
    bottomWallNormal,
    leftWallNormal,
    rightWallNormal;
let lastBounce;
let speedFactor;
let bgColor;
function setup() {
    createCanvas(400, 400);
    ballPos = new p5.Vector(100, 100);
    ballVel = new p5.Vector(random(1, 5), random(6, 10));
    ballSize = 20;
    boundsMinX = 0;
    boundsMaxX = width;
    boundsMinY = 0;
    boundsMaxY = height;
    lastBounce = "";
    speedFactor = 1.1;
    bgColor = color(220);
    topWall = new p5.Vector(boundsMinX, boundsMinY);
    topWallNormal = new p5.Vector(0, -1);
    bottomWall = new p5.Vector(boundsMinX, boundsMaxY);
    bottomWallNormal = new p5.Vector(0, 1);
    leftWall = new p5.Vector(boundsMinX, boundsMinY);
    leftWallNormal = new p5.Vector(-1, 0);
    rightWall = new p5.Vector(boundsMaxX, boundsMinY);
    rightWallNormal = new p5.Vector(1, 0);
} // see: https://gamedev.stackexchange.com/questions/15911/how-do-i-calculate-the-exit-vectors-of-colliding-projectiles
function calculateReflection(velocity, normal) {
    normal = normal.copy().normalize();
    let reflected = velocity.sub(normal.mult(velocity.dot(normal)).mult(2));
    return reflected;
} // these are additional functions i wrote to help solidfy my understanding but were not ultimately needed
// PVector calculateReflection(PVector velocity, PVector point1, PVector point2) {
//   PVector normal = calculateNormal(point1, point2);
//   PVector reflected = velocity.sub(normal.mult(velocity.dot(normal)).mult(2));
//   return reflected;
// }
// PVector calculateNormal(PVector point1, PVector point2) {
//   PVector normal = point2.copy().sub(point1).normalize();
//   return normal;
// }
// draw a simple line to show what wall the ball bounced off of
function highlightBounce(str) {
    if (str == null) str = "";
    if (str != "") {
        pushStyle(); // really useful tool so that any style changes in this function don't affect the rest of the sketch, i.e. no side effects
        stroke(255, 255, 255);
        strokeWeight(8); //check last bounce
        if (str == "top") {
            line(boundsMinX, boundsMinY, boundsMaxX, boundsMinY);
        } else if (str == "bottom") {
            line(boundsMinX, boundsMaxY, boundsMaxX, boundsMaxY);
        } else if (str == "left") {
            line(boundsMinX - 1, boundsMinY, boundsMinX - 1, boundsMaxY);
        } else if (str == "right") {
            line(boundsMaxX, boundsMinY, boundsMaxX, boundsMaxY);
        }
        popStyle(); // restore previous style, used in conjunction with pushStyle()
    }
} // shuffle the ball color
function shuffleColor() {
    let r = random(100, 225);
    let g = random(100, 255);
    let b = random(100, 255);
    fill(r, g, b); // https://stackoverflow.com/questions/6961725/algorithm-for-calculating-inverse-color
    bgColor = color(255 - r, 255 - g, 255 - b); //get the inverse of the ball colors as the bg
} // left click => ball speed up
// right click => ball slow down
function checkSpeedToggle() {
    if (mousePressed) {
        if (mouseButton == LEFT_ARROW) {
            ballVel.mult(speedFactor);
        } else if (mouseButton == RIGHT_ARROW) {
            ballVel.div(speedFactor);
        }
    }
}
function draw() {
    // do all computations before drawing
    // clamp ball position inside of walls
    ballPos.x = constrain(ballPos.x, 0, width);
    ballPos.y = constrain(ballPos.y, 0, height); // check for wall collisions
    if (ballPos.y + ballSize / 2 >= bottomWall.y) {
        // the reassignment step here is unnecessary as the function is mutative
        ballVel = calculateReflection(ballVel, bottomWallNormal);
        lastBounce = "bottom";
        shuffleColor();
    }
    if (ballPos.y - ballSize / 2 <= topWall.y) {
        ballVel = calculateReflection(ballVel, topWallNormal);
        lastBounce = "top";
        shuffleColor();
    }
    if (ballPos.x + ballSize / 2 >= rightWall.x) {
        ballVel = calculateReflection(ballVel, rightWallNormal);
        lastBounce = "right";
        shuffleColor();
    }
    if (ballPos.x - ballSize / 2 <= leftWall.x) {
        ballVel = calculateReflection(ballVel, leftWallNormal);
        lastBounce = "left";
        shuffleColor();
    }
    ballPos.add(ballVel);
    checkSpeedToggle(); // perform drawing
    background(bgColor);
    ellipse(ballPos.x, ballPos.y, ballSize, ballSize);
    highlightBounce(lastBounce);
}

