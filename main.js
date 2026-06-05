// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 80), {passive:true});

// Reveal on scroll
const obs = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.rev').forEach(el => obs.observe(el));

// Background colour shift
const bgColors = { light: '#faf7f2', warm: '#f2ebe0', dark: '#191613' };
const bgObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const theme = entry.target.dataset.bg;
      if (bgColors[theme]) document.body.style.backgroundColor = bgColors[theme];
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-bg]').forEach(s => bgObs.observe(s));

// Drag scroll
const track = document.getElementById('propTrack');
if (track) {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  document.addEventListener('mouseup', () => isDown = false);
  document.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.4;
  });

  // Thumb tracker
  const thumb = document.querySelector('.scroll-hint-thumb');
  if (thumb) {
    track.addEventListener('scroll', () => {
      const pct = track.scrollLeft / (track.scrollWidth - track.clientWidth);
      thumb.style.animation = 'none';
      thumb.style.left = (pct * 60) + '%';
    }, {passive: true});
  }
}

// Property filter
const pills = document.querySelectorAll('.filter-pills .pill');
const propCards = document.querySelectorAll('.prop-card');
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const f = pill.dataset.f;
    propCards.forEach(c => c.classList.toggle('dimmed', f !== 'all' && c.dataset.r !== f));
  });
});
