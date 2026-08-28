(() => {
  const heading = document.querySelector('[data-mask-heading]');
  const videoFrame = heading?.querySelector('.maskedHeading__videoFrame');
  if (!heading || !videoFrame) return;

  const updatePosition = event => {
    const rect = heading.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * -28;
    const y = ((event.clientY - rect.top) / rect.height - .5) * -16;
    videoFrame.style.transform = `translate(${x}px, ${y}px)`;
  };

  heading.addEventListener('pointermove', updatePosition);
  heading.addEventListener('pointerleave', () => {
    videoFrame.style.transform = 'translate(0, 0)';
  });
})();

(() => {
  const audio = document.getElementById('background-music');
  const toggle = document.getElementById('music-toggle');
  if (!audio || !toggle) return;

  const updateButton = playing => {
    toggle.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  };

  toggle.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        updateButton(true);
      } catch {
        updateButton(false);
      }
    } else {
      audio.pause();
      updateButton(false);
    }
  });
})();

(() => {
  const accordion = document.querySelector('[data-project-accordion]');
  if (!accordion) return;
  const panels = [...accordion.querySelectorAll('.accordionPanel')];

  const activate = panel => {
    panels.forEach(item => {
      const active = item === panel;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    });
  };

  panels.forEach(panel => {
    panel.addEventListener('pointerenter', () => activate(panel));
    panel.addEventListener('focus', () => activate(panel));
    panel.addEventListener('click', () => activate(panel));
  });
})();

(() => {
  const container = document.querySelector('[data-falling-text]');
  if (!container || !window.Matter) return;

  const copy = container.querySelector('.fallingText__copy');
  const makeWords = (text, falls) => text.split(/\s+/).map(word => {
    const span = document.createElement('span');
    span.className = `fallingText__word${falls ? ' is-highlighted' : ''}`;
    span.textContent = word;
    return span;
  });
  const fragments = [...copy.querySelectorAll('.fallingText__summary, .fallingText__fallingSource')]
    .flatMap(source => makeWords(source.textContent.trim(), source.classList.contains('fallingText__fallingSource')));
  copy.replaceChildren(...fragments);

  let started = false;
  const begin = () => {
    if (started || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    started = true;
    container.classList.add('is-falling');

    const { Engine, World, Bodies, Body, Runner, Mouse, MouseConstraint, Events } = window.Matter;
    const bounds = container.getBoundingClientRect();
    const engine = Engine.create();
    engine.gravity.y = .58;
    const wall = { isStatic: true, restitution: .45, friction: .65, render: { visible: false } };
    const floor = Bodies.rectangle(bounds.width / 2, bounds.height + 24, bounds.width + 80, 48, wall);
    const left = Bodies.rectangle(-24, bounds.height / 2, 48, bounds.height + 48, wall);
    const right = Bodies.rectangle(bounds.width + 24, bounds.height / 2, 48, bounds.height + 48, wall);
    const words = [...copy.querySelectorAll('.fallingText__word.is-highlighted')].map(source => {
      const rect = source.getBoundingClientRect();
      const sourceStyle = window.getComputedStyle(source);
      const body = Bodies.rectangle(rect.left - bounds.left + rect.width / 2, rect.top - bounds.top + rect.height / 2, rect.width, rect.height, {
        restitution: .45,
        friction: .45,
        frictionAir: .018
      });
      Body.setVelocity(body, { x: (Math.random() - .5) * 1.2, y: 0 });
      const element = source.cloneNode(true);
      element.classList.add('is-physics-word');
      element.style.width = `${rect.width}px`;
      element.style.height = `${rect.height}px`;
      element.style.fontFamily = sourceStyle.fontFamily;
      element.style.fontSize = sourceStyle.fontSize;
      element.style.fontWeight = sourceStyle.fontWeight;
      element.style.lineHeight = sourceStyle.lineHeight;
      element.style.letterSpacing = sourceStyle.letterSpacing;
      element.style.whiteSpace = 'nowrap';
      element.style.left = `${body.position.x}px`;
      element.style.top = `${body.position.y}px`;
      element.style.transform = 'translate(-50%, -50%)';
      source.style.visibility = 'hidden';
      container.append(element);
      return { element, body };
    });

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: .16, render: { visible: false } } });
    World.add(engine.world, [floor, left, right, mouseConstraint, ...words.map(word => word.body)]);
    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, 'afterUpdate', () => words.forEach(({ element, body }) => {
      element.style.left = `${body.position.x}px`;
      element.style.top = `${body.position.y}px`;
      element.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
    }));
  };

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      container.addEventListener('click', begin, { once: true });
    }
  }, { threshold: .35 });
  observer.observe(container);
})();
