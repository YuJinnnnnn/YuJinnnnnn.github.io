const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-site");
const canvas = document.getElementById("splash-canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
let smokeParticles = [];

let mouse = {
  x: width / 2,
  y: height / 2
};

let lastMouse = {
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

const smokeColors = [
  "rgba(0, 255, 213,",
  "rgba(170, 80, 255,",
  "rgba(255, 0, 180,",
  "rgba(80, 120, 255,",
  "rgba(210, 255, 80,"
];

function createSmoke(x, y, movement) {
  const count = Math.min(10, Math.max(3, Math.floor(movement / 10)));

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 34;
    const size = Math.random() * 180 + 90;

    smokeParticles.push({
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.25,
      size: size,
      alpha: Math.random() * 0.16 + 0.08,
      decay: Math.random() * 0.0014 + 0.0009,
      growth: Math.random() * 0.45 + 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.006,
      color: smokeColors[Math.floor(Math.random() * smokeColors.length)]
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

  if (movement > 4) {
    createSmoke(mouse.x, mouse.y, movement);
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
  }
});

function drawSmokeParticle(particle) {
  const gradient = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    particle.size
  );

  gradient.addColorStop(0, `${particle.color}${particle.alpha})`);
  gradient.addColorStop(0.22, `${particle.color}${particle.alpha * 0.75})`);
  gradient.addColorStop(0.48, `${particle.color}${particle.alpha * 0.32})`);
  gradient.addColorStop(0.76, `${particle.color}${particle.alpha * 0.1})`);
  gradient.addColorStop(1, `${particle.color}0)`);

  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.scale(1.45, 0.72);
  ctx.translate(-particle.x, -particle.y);

  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function animateSmoke() {
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(34px)";

  smokeParticles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.993;
    particle.vy *= 0.993;

    particle.size += particle.growth;
    particle.alpha -= particle.decay;
    particle.rotation += particle.rotationSpeed;

    drawSmokeParticle(particle);

    if (particle.alpha <= 0 || particle.size > 420) {
      smokeParticles.splice(index, 1);
    }
  });

  ctx.restore();

  if (smokeParticles.length > 160) {
    smokeParticles.splice(0, smokeParticles.length - 160);
  }

  requestAnimationFrame(animateSmoke);
}

animateSmoke();

enterButton.addEventListener("click", () => {
  intro.classList.add("intro--hidden");

  setTimeout(() => {
    intro.style.display = "none";
  }, 900);
});
