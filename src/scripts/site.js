const $ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Section parts rise in once as they enter the viewport.
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
  { rootMargin: '0px 0px -8% 0px' },
);
$('.rv').forEach((e) => io.observe(e));

// Fit a one-line wordmark to its box. data-fit="24" caps the size at 24vw.
function fit() {
  for (const el of $('[data-fit]')) {
    const inner = el.firstElementChild;
    el.style.fontSize = '100px';
    const cs = getComputedStyle(el);
    const room = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const cap = el.dataset.fit ? (innerWidth * el.dataset.fit) / 100 : Infinity;
    // 0.98: heavy glyphs overhang their advance width, so leave a hair of room
    el.style.fontSize = Math.min((98 * room) / inner.offsetWidth, cap) + 'px';
  }
}
fit();
addEventListener('resize', fit);
document.fonts?.ready.then(fit);

// Project screens tilt in 3D with their distance from the middle of the viewport, flat when centred.
const shots = $('.pshot .laptop');
if (shots.length && !reduce) {
  const tilt = () => {
    for (const s of shots) {
      const r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const t = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
      s.style.setProperty('--t', t.toFixed(3));
      s.style.setProperty('--a', Math.abs(t).toFixed(3));
    }
  };
  tilt();
  addEventListener('scroll', tilt, { passive: true });
  addEventListener('resize', tilt);
}

// ID badge: tilts toward the pointer and swings from its lanyard as a damped pendulum.
// Scrolling and a passing pointer both give it a push.
const hang = document.querySelector('.hang');
if (hang && !reduce) {
  const id = hang.querySelector('.id'), sec = hang.closest('section');
  const clamp = (x, m) => Math.max(-m, Math.min(m, x));
  let a = 0, v = 0, lastY = scrollY, raf = 0;
  sec.addEventListener('pointermove', (e) => {
    const r = id.getBoundingClientRect();
    id.style.setProperty('--ry', clamp((e.clientX - r.left - r.width / 2) / r.width, 1) * 14 + 'deg');
    id.style.setProperty('--rx', clamp((e.clientY - r.top - r.height / 2) / r.height, 1) * -10 + 'deg');
    v += clamp(e.movementX || 0, 40) * 0.012;
  });
  sec.addEventListener('pointerleave', () => (id.style.setProperty('--ry', '0deg'), id.style.setProperty('--rx', '0deg')));
  addEventListener('scroll', () => ((v += clamp(scrollY - lastY, 120) * 0.006), (lastY = scrollY)), { passive: true });
  const swing = () => {
    v = (v - a * 0.02) * 0.972; // spring back to rest, with a little air resistance
    a = clamp(a + v, 16);
    hang.style.setProperty('--sw', a.toFixed(2) + 'deg');
    raf = requestAnimationFrame(swing);
  };
  // only simulate while the badge is on screen; it gets a first push as it arrives
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !raf) (v += 2.2), (raf = requestAnimationFrame(swing));
    else if (!e.isIntersecting) (cancelAnimationFrame(raf), (raf = 0));
  }).observe(sec);
}

// ID badge flip.
$('.id').forEach((b) => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true')));

// Proof sentence: one name lit at a time.
const names = $('.proof p span');
if (names.length && !reduce) {
  let i = 0;
  setInterval(() => (names[i].classList.remove('lit'), (i = (i + 1) % names.length), names[i].classList.add('lit')), 2000);
}

// Email links: mailto does nothing on a machine with no mail app, so each one also copies the address and says so.
const toast = Object.assign(document.createElement('p'), { className: 'toast' });
toast.setAttribute('role', 'status');
document.body.append(toast);
let hide;
$('a[href^="mailto:"]').forEach((a) =>
  a.addEventListener('click', () => {
    const to = a.href.slice(7).split('?')[0];
    navigator.clipboard?.writeText(to).then(() => {
      toast.textContent = `Copied ${to}. Your mail app opens too, if you have one.`;
      toast.classList.add('on');
      clearTimeout(hide);
      hide = setTimeout(() => toast.classList.remove('on'), 4500);
    }, () => {});
  }),
);

// Approval gate: the visitor approves the request and their mail app opens with it filled in.
const gate = document.querySelector('.gate');
if (gate) {
  const say = gate.querySelector('[aria-live]');
  gate.addEventListener('submit', (e) => {
    e.preventDefault();
    const what = gate.what.value, when = gate.when.value;
    const body = `Hi Mahad,\n\nI approved your request. I'd like to talk about ${what.toLowerCase()}, starting ${when.toLowerCase()}.\n\n`;
    const su = encodeURIComponent('Approved: ' + what), bd = encodeURIComponent(body);
    location.href = `mailto:${gate.dataset.to}?subject=${su}&body=${bd}`;
    say.textContent = 'Approved. Your mail app is opening with the request filled in.';
    // many visitors have no mail app set up, so the same message is offered in Gmail, plus the bare address
    gate.querySelector('[data-gmail]').href = `https://mail.google.com/mail/?view=cm&fs=1&to=${gate.dataset.to}&su=${su}&body=${bd}`;
    gate.querySelector('[data-alt]').hidden = false;
  });
  gate.querySelector('[data-copy]').addEventListener('click', () =>
    navigator.clipboard.writeText(gate.dataset.to).then(
      () => (say.textContent = 'Email address copied.'),
      () => (say.textContent = 'Could not copy. The address is ' + gate.dataset.to),
    ),
  );
  gate.querySelector('[data-no]').addEventListener('click', () => (say.textContent = 'No problem. Nothing was sent, and the request stays in the queue.'));
}
