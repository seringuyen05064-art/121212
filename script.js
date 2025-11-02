// Basic interactions: reveal staggering, hero parallax
document.addEventListener('DOMContentLoaded', () => {
  // set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // reveal sections
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('.reveal-section');
  const items = document.querySelectorAll('.reveal-item');

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const sObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    sections.forEach(s => sObs.observe(s));

    const iObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const idx = Number(en.target.getAttribute('data-index') || 0);
          en.target.style.transitionDelay = `${Math.min(12, idx) * 70}ms`;
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(i => iObs.observe(i));
  } else {
    sections.forEach(s => s.classList.add('visible'));
    items.forEach(i => i.classList.add('visible'));
  }

  // simple parallax on hero (lightweight)
  const visual = document.getElementById('heroVisual');
  if (!visual || prefersReduced) return;

  let bounds = visual.getBoundingClientRect();
  let mx = 0, my = 0, tx = 0, ty = 0;
  const friction = 0.09;
  const max = 12;

  function onMove(e) {
    const x = (e.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
    const y = (e.clientY - (bounds.top + bounds.height / 2)) / bounds.height;
    mx = Math.max(-1, Math.min(1, x));
    my = Math.max(-1, Math.min(1, y));
  }

  function raf() {
    tx += (mx - tx) * friction;
    ty += (my - ty) * friction;
    const rx = -tx * max;
    const ry = -ty * max;
    visual.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(raf);
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('resize', () => { bounds = visual.getBoundingClientRect(); }, { passive: true });
  requestAnimationFrame(raf);
});
