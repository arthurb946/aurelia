// 3D Stacked Scroll — property cards
(function() {
  const section = document.getElementById('stackedScroll');
  if (!section) return;

  const cards = section.querySelectorAll('.scard');
  const total = cards.length;

  // Each card gets a scroll segment
  // Total scroll height = cards * 100vh (set via CSS on the section)

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function update() {
    const rect = section.getBoundingClientRect();
    const sectionTop = -rect.top;
    const sectionHeight = rect.height - window.innerHeight;
    const progress = clamp(sectionTop / sectionHeight, 0, 1);

    // Each card occupies 1/total of the scroll range
    const segSize = 1 / total;

    cards.forEach((card, i) => {
      const segStart = i * segSize;
      const segEnd = (i + 1) * segSize;

      // How far through this card's segment are we?
      const raw = (progress - segStart) / segSize;
      const p = clamp(raw, 0, 1);

      if (i === total - 1) {
        // Last card: just comes up, never goes away
        const translateY = lerp(80, 0, p);
        const opacity = lerp(0, 1, clamp(p * 2, 0, 1));
        card.style.transform = `translateY(${translateY}px)`;
        card.style.opacity = opacity;
        card.style.zIndex = i + 1;
      } else {
        // Cards that will be replaced: slide up then scale down + tilt back
        let translateY, scale, rotateX, opacity;

        if (p < 0.4) {
          // Entering: slide up from below
          const ep = p / 0.4;
          translateY = lerp(80, 0, ep);
          scale = 1;
          rotateX = 0;
          opacity = lerp(0.3, 1, ep);
        } else {
          // Exiting: scale down and tilt back as next card comes
          const ep = (p - 0.4) / 0.6;
          translateY = lerp(0, -24, ep);
          scale = lerp(1, 0.88, ep);
          rotateX = lerp(0, 8, ep);
          opacity = lerp(1, 0.5, ep);
        }

        card.style.transform = `perspective(1200px) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`;
        card.style.opacity = opacity;
        card.style.zIndex = i + 1;
      }
    });

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();
