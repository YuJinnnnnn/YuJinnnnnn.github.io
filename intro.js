const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-site");
const canvas = document.getElementById("splash-canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
let particles = [];

let mouse = {
  x: width / 2,
  y: height / 2
};

let trail = {
  x: width / 2,
  y: height / 2
};

canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

const palette = [
  "rgba(0, 255, 213,",
  "rgba(255, 0, 204,",
  "rgba(128, 0, 255,",
  "rgba(0, 136, 255,",
  "rgba(255, 255, 0,"
];

function createParticle(x, y, intensity = 1) {
  const particleCount = Math.floor(10 + intensity * 10);

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.6 + 0.5;
    const size = Math.random() * 90 + 38;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      alpha: Math.random() * 0.22 + 0.16,
      decay: Math.random() * 0.0035 + 0.0018,
      shrink: Math.random() * 0.006 + 0.982,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
}

window.addEventListener("mousemove", (event) => {
  if (!intro || intro.classList.contains("intro--hidden")) return;

  const dx = event.clientX - mouse.x;
  const dy = event.clientY - mouse.y;
  const movement = Math.sqrt(dx * dx + dy * dy);

  mouse.x = event.clientX;
  mouse.y = event.clientY;

  if (movement > 2) {
    createParticle(mouse.x, mouse.y, Math.min(movement / 20, 3));
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  trail.x += (mouse.x - trail.x) * 0.08;
  trail.y += (mouse.y - trail.y) * 0.08;

  if (!intro.classList.contains("intro--hidden")) {
    createParticle(trail.x, trail.y, 0.35);
  }

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(18px)";

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.988;
    particle.vy *= 0.988;

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
    gradient.addColorStop(0.35, `${particle.color}${particle.alpha * 0.55})`);
    gradient.addColorStop(0.72, `${particle.color}${particle.alpha * 0.18})`);
    gradient.addColorStop(1, `${particle.color}0)`);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    if (particle.alpha <= 0 || particle.size <= 3) {
      particles.splice(index, 1);
    }
  });

  ctx.restore();

  if (particles.length > 420) {
    particles.splice(0, particles.length - 420);
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();

enterButton.addEventListener("click", () => {
  intro.classList.add("intro--hidden");

  setTimeout(() => {
    intro.style.display = "none";
  }, 900);
});
