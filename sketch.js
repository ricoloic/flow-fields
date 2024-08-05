const scl = 20;
const grid = [];
const points = [];
let cols;
let rows;
const noiseScale = 0.1;
let time = 0;
const increment = 0.1;

function setup() {
    createCanvas(600, 600);
    background(0);

    cols = ceil(width / scl) + 1;
    rows = ceil(height / scl) + 1;

    for (let i = 0; i < cols; i++) {
        grid[i] = [];

        for (let j = 0; j < rows; j++) {
            const nx = noiseScale * i;
            const ny = noiseScale * j;
            const value = noise(nx, ny);
            const angle = map(value, 0, 1, 0, TWO_PI);
            grid[i][j] = p5.Vector.fromAngle(angle);
        }
    }

    for (let i = 0; i < 100; i++) {
        points[i] = Point.init(createVector(random(width), random(height)));
    }
}

const mult = 5;

function draw() {
    // background(0);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const nx = noiseScale * i;
            const ny = noiseScale * j;
            const nt = noiseScale * time;
            const value = noise(nx, ny, nt);
            const angle = map(value, 0, 1, 0, TWO_PI);
            grid[i][j] = p5.Vector.fromAngle(angle).mult(0.3);

            // const vector = grid[i][j];
            // const x = i * scl;
            // const y = j * scl;
            // line(x + (scl / 2), y + (scl / 2), x + (vector.x * mult) + (scl / 2), y + (vector.y * mult) + (scl / 2));
        }
    }

    stroke(255, 10);
    strokeWeight(1);
    for (let i = 0; i < points.length; i++) {
        line(points[i].previous.x, points[i].previous.y, points[i].position.x, points[i].position.y);
    }
    
    for (let k = 0; k < points.length; k++) {
        points[k].edge();
        const i = floor(points[k].position.x / scl);
        const j = floor(points[k].position.y / scl);
        const cell = grid[i][j];
        points[k].applyForce(cell);
        points[k].update();
    }

    time += increment;
}

class Point {
    /**
     * @param {p5.Vector} position 
     */
    constructor(position) {
        this.previous = position.copy();
        this.position = position.copy();
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }

    /**
     * @param {p5.Vector} position 
     */
    static init(position) {
        return new Point(position);
    }

    /**
     * @param {p5.Vector} force 
     */
    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.previous = this.position.copy();

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.acceleration.mult(0);
        this.velocity.mult(0.95);
    }

    edge() {
        if (this.position.x < 0) {
            this.position.x = width;
        } else if (this.position.x > width) {
            this.position.x = 0;
        }

        if (this.position.y < 0) {
            this.position.y = height;
        } else if (this.position.y > height) {
            this.position.y = 0;
        }
    }
}
