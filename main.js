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
// Button roll effect
document.querySelectorAll('.rot-btn').forEach(btn => {
  // Set button height to exactly one label height so overflow clips correctly
  const firstSpan = btn.querySelector('.btn-t');
  if (firstSpan) {
    btn.style.height = firstSpan.offsetHeight + 'px';
  }
  const wrap = btn.querySelector('.btn-wrap');
  if (!wrap) return;
  btn.addEventListener('mouseenter', () => {
    wrap.style.transform = 'translateY(-50%)';
  });
  btn.addEventListener('mouseleave', () => {
    wrap.style.transform = 'translateY(0)';
  });
});

// Count-up animation on stats bar
function countUp(el, target, duration) {
  let start = 0;
  const startTime = performance.now();
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObs.unobserve(entry.target);

    entry.target.querySelectorAll('.sbar-item').forEach(item => {
      const numEl = item.querySelector('.n');
      if (!numEl) return;

      // Extract the numeric value and any suffix (em, %, +)
      const raw = numEl.textContent.trim();
      const numMatch = raw.match(/^(\d+)/);
      if (!numMatch) return;

      const target = parseInt(numMatch[1]);
      // Find the suffix element (em tag inside .n)
      const suffix = numEl.querySelector('em');
      const suffixText = suffix ? suffix.outerHTML : '';

      // Clear and animate
      numEl.innerHTML = '0' + suffixText;
      const numTextNode = numEl.childNodes[0];

      let start = 0;
      const duration = 1800;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);
        numEl.innerHTML = current + suffixText;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  });
}, { threshold: 0.4 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObs.observe(statsBar);
