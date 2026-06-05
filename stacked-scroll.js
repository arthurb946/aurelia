// Aceternity-style animated property cards
(function() {
  const section = document.getElementById('stackedScroll');
  if (!section) return;

  const cards    = Array.from(section.querySelectorAll('.at-img-card'));
  const slides   = Array.from(section.querySelectorAll('.at-slide'));
  const dots     = Array.from(section.querySelectorAll('.at-dot'));
  const btnPrev  = document.getElementById('atPrev');
  const btnNext  = document.getElementById('atNext');
  const total    = cards.length;
  let current    = 0;
  let animating  = false;

  // Positions: 0 = front/active, 1 = second, 2 = third, 'out' = exiting
  const positions = ['0', '1', '2'];

  function setPositions(activeIdx) {
    cards.forEach((card, i) => {
      const offset = (i - activeIdx + total) % total;
      if (offset < positions.length) {
        card.dataset.pos = positions[offset];
      } else {
        card.dataset.pos = '2';
      }
    });
  }

  function goTo(next) {
    if (animating || next === current) return;
    animating = true;

    const prev = current;
    current = next;

    // Flick the active card out
    cards[prev].dataset.pos = 'out';

    // Restack remaining
    setTimeout(() => {
      setPositions(current);
    }, 80);

    // Text transition
    slides[prev].classList.remove('active');
    slides[current].classList.add('active');

    // Dots
    dots[prev].classList.remove('active');
    dots[current].classList.add('active');

    setTimeout(() => { animating = false; }, 650);
  }

  function next() { goTo((current + 1) % total); }
  function prev() { goTo((current - 1 + total) % total); }

  // Init
  setPositions(0);

  btnNext && btnNext.addEventListener('click', next);
  btnPrev && btnPrev.addEventListener('click', prev);
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.i)));
  });

  // Auto-advance every 5s
  let timer = setInterval(next, 5000);
  section.addEventListener('mouseenter', () => clearInterval(timer));
  section.addEventListener('mouseleave', () => { timer = setInterval(next, 5000); });

  // Touch swipe
  let touchStartX = 0;
  section.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  section.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  }, { passive: true });
})();
