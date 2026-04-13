/* =============================================
   RENDER PROJECTS FROM projects.js
============================================= */
(function () {
  const grid = document.getElementById('projects-grid');
  if (!grid || typeof projects === 'undefined') return;

  projects.filter(function (p) { return p.enable !== false; }).forEach(function (p) {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = p.enlace;
    if (p.enlace && p.enlace !== '#') {
      card.target = '_blank';
      card.rel = 'noopener';
    }

    const img = document.createElement('img');
    img.src = p.imagen || 'img/projects/placeholder.svg';
    img.alt = p.nombre;

    const label = document.createElement('p');
    label.className = 'card-label';
    label.textContent = p.nombre;

    card.appendChild(img);
    card.appendChild(label);
    grid.appendChild(card);
  });
})();

/* =============================================
   STARS BACKGROUND
============================================= */
(function () {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(time * s.speed + s.phase));
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), Math.ceil(s.r), Math.ceil(s.r));
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* =============================================
   SMOOTH SCROLL NAV
============================================= */
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
