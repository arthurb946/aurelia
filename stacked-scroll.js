(function() {
  const section = document.getElementById('stackedScroll');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.scard'));
  const total = cards.length;

  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  function update() {
    const rect = section.getBoundingClientRect();
    // How far we've scrolled into the section (0 = top, 1 = bottom)
    const scrolled = clamp(-rect.top / (rect.height - window.innerHeight), 0, 1);
    const segSize = 1 / total;

    cards.forEach((card, i) => {
      const segStart = i * segSize;
      const segEnd   = (i + 1) * segSize;

      // Progress through THIS card's window
      const raw = (scrolled - segStart) / segSize;
      const p   = clamp(raw, 0, 1);

      let opacity, scale, translateY, rotateX, zIndex;

      if (i === 0 && scrolled < segSize) {
        // First card: fully visible until next card arrives
        const exitP = clamp(scrolled / segSize, 0, 1);
        const ep = clamp((exitP - 0.5) / 0.5, 0, 1);
        scale      = 1 - ep * 0.1;
        rotateX    = ep * 6;
        translateY = ep * -20;
        opacity    = 1 - ep * 0.5;
        zIndex     = total - i;
      } else if (p <= 0) {
        // Not yet reached — hidden below
        opacity    = 0;
        scale      = 1;
        rotateX    = 0;
        translateY = 60;
        zIndex     = total - i;
      } else if (p < 0.45) {
        // Entering: slide up from below
        const ep = ease(p / 0.45);
        translateY = 60 * (1 - ep);
        opacity    = ep;
        scale      = 1;
        rotateX    = 0;
        zIndex     = total - i;
      } else if (p < 1 && i < total - 1) {
        // Exiting: scale + tilt back as next arrives
        const ep = ease((p - 0.45) / 0.55);
        translateY = -20 * ep;
        scale      = 1 - ep * 0.1;
        rotateX    = ep * 6;
        opacity    = 1 - ep * 0.5;
        zIndex     = total - i;
      } else {
        // Last card or fully shown — stay put
        opacity    = 1;
        scale      = 1;
        rotateX    = 0;
        translateY = 0;
        zIndex     = total - i;
      }

      card.style.zIndex   = zIndex;
      card.style.opacity  = opacity;
      card.style.transform = `perspective(1400px) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`;
    });
  }

  // Set initial state — first card fully visible
  cards.forEach((card, i) => {
    card.style.opacity   = i === 0 ? '1' : '0';
    card.style.transform = 'perspective(1400px) translateY(0px) scale(1) rotateX(0deg)';
    card.style.zIndex    = cards.length - i;
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  update();
})();
