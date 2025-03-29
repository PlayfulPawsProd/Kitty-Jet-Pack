// --- RAINBOW TRAIL PARTICLES --- NEW!
let rainbowTrail = [];
let rainbowHue = 0; // To cycle through rainbow colors

// --- NEW Rainbow Trail Functions ---
function spawnRainbowParticle() {
    if (!kitty) return;
    // Spawn near jetpack nozzles
    let spawnX = kitty.x + random(-kitty.size * 0.2, kitty.size * 0.2);
    let spawnY = kitty.y + kitty.size * 0.5 + random(5); // Slightly below nozzles
    let particleSize = random(kitty.size * 0.05, kitty.size * 0.15);
    let particle = {
        x: spawnX,
        y: spawnY,
        vx: random(-0.5, 0.5), // Slight horizontal drift
        vy: random(0.5, 1.5),  // Initial downward velocity
        hue: rainbowHue % 360, // Use current hue
        alpha: 1.0,            // Start fully opaque (use life for fade)
        size: particleSize,
        life: 1.0             // Use life instead of alpha directly for fading
    };
    rainbowTrail.push(particle);
    rainbowHue += 5; // Increment hue for next particle (adjust speed as desired)
}

function updateAndDrawRainbowTrail(scrollSpeed) {
    noStroke();
    // Switch to HSB mode ONLY for drawing the trail particles
    push(); // Save current drawing style (including color mode)
    colorMode(HSB, 360, 100, 100, 1); // Set HSB temporarily

    for (let i = rainbowTrail.length - 1; i >= 0; i--) {
        let p = rainbowTrail[i];

        // Update position
        p.y += p.vy + scrollSpeed; // Fall down relative to background scroll
        p.x += p.vx;

        // Update drift and life
        p.vx += random(-0.1, 0.1); // Slightly change drift
        p.vx *= 0.98; // Dampen drift
        p.life -= 0.02; // Decrease life (adjust for fade duration)

        // Remove if faded out or off screen
        if (p.life <= 0 || p.y > height + p.size) {
            rainbowTrail.splice(i, 1);
        } else {
            // Draw particle (e.g., ellipse)
            // Use HSB color mode set in setup()
            fill(p.hue, 90, 100, p.life * 0.7); // Use life for alpha, keep bright
            ellipse(p.x, p.y, p.size * p.life); // Size shrinks as it fades
        }
    }

    pop(); // Restore previous drawing style (back to RGB color mode!)
}