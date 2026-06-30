const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-site");
const canvas = document.getElementById("splash-canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
let particles = [];
let mouse = { x: width / 2, y: height / 2 };
let lastMouse = { x: width / 2, y: height / 2 };

canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

function createParticle(x, y, movement) {
  const particleCount = Math.min(12, Math.max(4, Math.floor(movement / 4)));

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.8 + 0.4;
    const size = Math.random() * 32 + 12;

    const palette = [
      "rgba(255, 183, 3,",
      "rgba(142, 202, 230,",
      "rgba(251, 133, 0,",
      "rgba(33, 158, 188,"
    ];

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.8,
      vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.8,
      size,
      alpha: Math.random() * 0.18 + 0.12,
      decay: Math.random() * 0.006 + 0.004,
      shrink: Math.random() * 0.01 + 0.965,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
}

window.addEventListener("mousemove", (event) => {
  if (!intro || intro.classList.contains("intro--hidden")) return;

  mouse.x = event.clientX;
  mouse.y = event.clientY;

  const dx = mouse.x - lastMouse.x;
  const dy = mouse.y - lastMouse.y;
  const movement = Math.sqrt(dx * dx + dy * dy);

  if (movement > 6) {
    createParticle(mouse.x, mouse.y, movement);
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = "blur(10px)";

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.985;
    particle.vy *= 0.985;

    particle.size *= particle.shrink;
    particle.alpha -= particle.decay;

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size
    );

    gradient.addColorStop(0, `${particle.color}${particle.alpha})`);
    gradient.addColorStop(0.55, `${particle.color}${particle.alpha * 0.45})`);
    gradient.addColorStop(1, `${particle.color}0)`);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    if (particle.alpha <= 0 || particle.size <= 1) {
      particles.splice(index, 1);
    }
  });

  ctx.restore();

  requestAnimationFrame(animateParticles);
}

animateParticles();

enterButton.addEventListener("click", () => {
  intro.classList.add("intro--hidden");

  setTimeout(() => {
    intro.style.display = "none";
  }, 700);
});
