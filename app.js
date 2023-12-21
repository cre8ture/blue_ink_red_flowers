let pmouseX = 0;
let pmouseY = 0;
let sharedAngle = 180;
const walkersCount = 30;
const innerWalker_min = 5
const innerWalker_max = 15
const allWalkers = [];
let particle;
let particleBuffer
let redParticles = [];
let landedParticles = [];
let buffer;


function setup() {
 
    createCanvas(windowWidth, windowHeight * 2);
    background(245, 222, 179); // Set a slightly beige old paper background
    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        let walkers = [];
        let randomWalkersCount = random(innerWalker_min, innerWalker_max);
        for (let i = 0; i < randomWalkersCount; i++) {
            let colorChangeSpeed = random(0.001, 0.0001);
            let walker = new Walker(x, y, colorChangeSpeed);
            walker.timestamp = Date.now(); // Add timestamp when the walker is created
            walkers.push(walker);
        }
        allWalkers.push(walkers);
    }

}
function draw() {
    for (let walks of allWalkers) {
        let i = 0;
        for (let walker of walks) {
            walker.step();
            walker.display();

            if (Date.now() - walker.timestamp >= 1000) { // If 1 second has passed
                push(); // Save the current drawing style
                translate(walker.x, walker.y); // Move the origin to the text's position
                // scale(1, -1); // Flip vertically
                fill(255, 0, 0); // Set the text color to red
                textFont('Georgia'); // Use a different font
                noStroke(); // Remove the stroke
                smooth(); // Enable smooth drawing
                const dateStringArr = new Date(walker.timestamp).toLocaleTimeString().split('')
                dateStringArr.forEach((char, i) => {
                    rotate(-HALF_PI); // Rotate 90 degrees counter-clockwise

                    text(char, 0, i)
                })
                // text(new Date(walker.timestamp).toLocaleTimeString(), 0, 0); // Display the time
                pop(); // Restore the previous drawing style
                walker.timestamp = Date.now(); // Update the timestamp
            }
            i++
    }}
  }
  
  class Particle {
    constructor(x, y, vx, vy) {
      this.pos = createVector(x, y);
      this.vel = createVector(vx, vy);
      this.size = 30;
    }
  
    update(g) {
      // Adjust the y-coordinate of the velocity
      this.vel.y = -abs(sin(frameCount / 100));
      this.pos.add(this.vel);
      this.size *= 0.99; // Shrink the particle
      this.color = g.color(0, 0, 0, 127); // Set the color to black with 50% opacity
    }
   
    display(g) {
        g.stroke(this.color);
        g.strokeWeight(this.size);
        g.point(this.pos.x, this.pos.y);
    }
  }
  class RedParticle {
    constructor() {
        this.position = createVector(random(width), 0);
        this.velocity = createVector(0, random(1, 3));
        this.color = color(255, 0, 0); // Red color
        this.previousPosition = this.position.copy(); // Store the previous position of the particle
    }

    update() {
        this.previousPosition = this.position.copy(); // Update the previous position
        this.position.add(this.velocity);
    }

    display() {
        stroke(245, 222, 179); // Set the stroke color to the background color
        strokeWeight(2);
        point(this.previousPosition.x, this.previousPosition.y); // Draw a point at the previous position

        stroke(this.color); // Set the stroke color to the particle color
        point(this.position.x, this.position.y); // Draw the particle at its current position
    }

    displayOnBuffer(g) {
        g.stroke(this.color);
        g.strokeWeight(2);
        g.point(this.position.x, this.position.y); // Draw on the buffer
    }

    hasLanded() {
        return this.position.y >= height;
    }
    displayNoTrail() {
        stroke(this.color);
        strokeWeight(2);
        point(this.position.x, this.position.y); // Only draw the current position
    }
    displayCurrentOnly() {
        // Set stroke for current particle position
        stroke(this.color);
        strokeWeight(2);

        // Draw only the current position of the particle
        point(this.position.x, this.position.y);
    }
}
class Walker {
    constructor(x = width / 2, y = height / 2, colorChangeSpeed = 0.01) {
        this.x = x // width / 2;
        this.y = y //height / 2;
        this.px = this.x; // previous x
        this.py = this.y; // previous y
        // this.angle = sharedAngle; // use shared direction
        this.angle = -PI / 2; // point downward
        this.color = color(0); // start with black color
        this.targetColor = color(255); // end with white color
        this.colorChangeSpeed = colorChangeSpeed// 0.01; // speed of color change
    }

    display() {
        let d = dist(this.x, this.y, width / 2, height / 2); // distance from the center
        let sw = map(d, 0, width / 2, 8, 1); // map the distance to a stroke weight
        // stroke(this.color);
        stroke(0, 0, 225);

        strokeWeight(sw); // set the stroke weight
        fill(0, 0, 225)
        line(this.px, this.py, this.x, this.y); // draw a line from the previous position to the current position


    }

    step() {
        this.px = this.x;
        this.py = this.y;

        // add some randomness to the direction
        this.angle += random(-0.01, 0.01); // reduced from -0.1, 0.1 to -0.01, 0.01

        // move in the current direction
        this.x += cos(this.angle);
        this.y += sin(this.angle);

        // add some randomness to the position
        this.x += random(-1, 1); // reduced from -5, 5 to -1, 1
        this.y += random(-1, 1); // reduced from -5, 5 to -1, 1

        // change the color gradually
        this.color = lerpColor(this.color, this.targetColor, this.colorChangeSpeed);

    }
}