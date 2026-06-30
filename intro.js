const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-site");
const canvas = document.getElementById("splash-canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
let particles = [];

canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

function createParticle(x, y) {
  const particleCount = 5;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x,
      y,
      size: Math.random() * 18 + 6,
      speedX: (Math.random() - 0.5) * 2.2,
      speedY: (Math.random() - 0.5) * 2.2,
      alpha: 0.28,
      color: Math.random() > 0.5
        ? "rgba(250, 180, 40,"
        : "rgba(120, 210, 215,"
    });
  }
}

window.addEventListener("mousemove", (event) => {
  if (!intro || intro.classList.contains("intro--hidden")) return;
  createParticle(event.clientX, event.clientY);
});

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.size *= 0.965;
    particle.alpha -= 0.006;

    ctx.beginPath();
    ctx.fillStyle = `${particle.color}${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    if (particle.alpha <= 0 || particle.size <= 0.5) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

enterButton.addEventListener("click", () => {
  intro.classList.add("intro--hidden");

  setTimeout(() => {
    intro.style.display = "none";
  }, 700);
});
