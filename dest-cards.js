// Fluid destination cards
(function() {
  const track = document.getElementById('dcTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.dc-card');

  cards.forEach((card) => {
    // Hover open/close
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('dc-open'));
      card.classList.add('dc-open');
      track.classList.add('has-open');
    });

    track.addEventListener('mouseleave', () => {
      cards.forEach(c => c.classList.remove('dc-open'));
      track.classList.remove('has-open');
    });

    // Cursor parallax on image
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      const img = card.querySelector('.dc-img');
      if (img) {
        img.style.transform = `scale(1.08) translate(${cx * 18}px, ${cy * 12}px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.dc-img');
      if (img) {
        img.style.transform = '';
      }
    });
  });
})();
