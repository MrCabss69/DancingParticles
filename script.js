const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const NUM_POINTS = 5;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const audio = new Audio("exorcista.mp3");
audio.addEventListener("canplaythrough", () => audio.play());

let particles = [];
let lastCircleTime = Date.now() / 1000;
let lastCircleRadius = 380;
let direction = 1;

class Particle {
    constructor(angle, radius, direction) {
        this.angle = angle;
        this.radius = radius;
        this.direction = direction;
        this.size = 0;
    }

    update() {
        const currentTime = audio.currentTime;
        this.x = CANVAS_WIDTH / 2 + Math.cos(this.angle + this.direction * currentTime) * this.radius;
        this.y = CANVAS_HEIGHT / 2 + Math.sin(this.angle + this.direction * currentTime) * this.radius;
        this.size = Math.abs(10 * Math.sin(currentTime));
    }
}

function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
}

function drawEdge(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function createCircle(radius) {
    const newParticles = Array.from({ length: NUM_POINTS }, (_, i) => {
        const angle = 2 * Math.PI * i / NUM_POINTS;
        return new Particle(angle, radius, direction);
    });
    particles = [...particles, ...newParticles];
    direction *= -1;
}

function drawEdges() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5 + 0.2 * Math.sin(audio.currentTime);

    particles.forEach((start, i) => {
        const end = particles[(i + 1) % NUM_POINTS];
        drawEdge(start, end);
    });
}

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const currentTime = Date.now() / 1000;

    particles.forEach(particle => {
        particle.update();
        drawParticle(particle);
    });

    drawEdges();

    if (currentTime - lastCircleTime >= 5) {
        lastCircleTime = currentTime;
        lastCircleRadius -= 50;
        if (lastCircleRadius > 0) {
            createCircle(lastCircleRadius);
        }
    }

    requestAnimationFrame(animate);
}


// Crear el primer círculo de partículas y empezar la animación
createCircle(lastCircleRadius);
animate();