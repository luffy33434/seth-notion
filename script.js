const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height;

// Configuration
const STAR_COUNT = 3000;   // Number of stars
const SPEED = 2;           // Base speed (smooth and majestic)
const STAR_SIZE = 2;       // Max size of a star
const STAR_COLOR = '#000'; // Black stars

// State
const stars = [];
let mouseX = 0;
let mouseY = 0;

// Initialize sizing
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    // Reset center point for mouse interaction
    if (mouseX === 0) mouseX = width / 2;
    if (mouseY === 0) mouseY = height / 2;
}

// Star Object
class Star {
    constructor() {
        this.init(true); // true = random start position along Z
    }

    init(randomZ = false) {
        // X and Y are random coordinates centered around 0
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;

        // Z is depth. 
        // If randomZ is true, we place it anywhere in the tunnel (0 to width).
        // If false (resetting), we place it at the very back (width).
        this.z = randomZ ? Math.random() * width : width;

        this.pz = this.z; // Previous Z (for trails if needed, currently unused but good for expansion)
    }

    update() {
        // Move star closer
        this.z -= SPEED;

        // Reset if it passes the camera (z <= 0)
        if (this.z <= 0) {
            this.init(false);
        }
    }

    draw() {
        // Perspective projection logic
        // We shift the "vanishing point" based on mouse position for a 3D feel
        let offsetX = mouseX - width / 2;
        let offsetY = mouseY - height / 2;

        // Standard perspective formula: x' = x / z
        let sx = (this.x / this.z) * width + (width / 2) + (offsetX * 0.5 * (1 - this.z / width));
        let sy = (this.y / this.z) * width + (height / 2) + (offsetY * 0.5 * (1 - this.z / width));

        // Radius calculation: Closer stars are larger
        let radius = (1 - this.z / width) * STAR_SIZE;

        // Don't draw if radius is invalid or off screen
        if (radius <= 0) return;

        ctx.beginPath();
        ctx.fillStyle = STAR_COLOR;
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Setup
window.addEventListener('resize', resize);

// Add subtle mouse parallax
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Init
resize();
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
}

// Animation Loop
function animate() {
    // 1. Clear Screen
    ctx.fillStyle = "#fdfbf6";
    ctx.fillRect(0, 0, width, height);

    // 2. Update and Draw Stars
    for (const star of stars) {
        star.update();
        star.draw();
    }

    // 3. Loop
    requestAnimationFrame(animate);
}

animate();
