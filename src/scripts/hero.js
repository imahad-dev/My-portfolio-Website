import * as THREE from 'three';

// Portrait as a field of particles: sampled from the photo, pushed in depth by brightness, lit from above,
// assembling once the loading screen lifts, scattering as the hero scrolls away, and parting around the pointer.
export async function start(stage, ready) {
  const canvas = stage.querySelector('canvas');
  const img = new Image();
  img.src = canvas.dataset.src;
  await img.decode();

  const phone = innerWidth < 760;
  const W = phone ? 150 : 300; // sampling columns: enough for the face to read as a photograph
  const H = Math.round((W * img.height) / img.width);
  const S = phone ? 1.2 : 1.5; // portrait is larger than the screen; the chest runs off behind the name
  const TOP = S - 0.04; // world y of the photo top edge: above the view, so the face sits in the upper third
  // desktop: portrait sits right of centre (72% across), leaving the left for the name
  const X = phone ? 0 : 0.22 * 2.2 * (stage.clientWidth / stage.clientHeight);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0, W, H);
  const px = g.getImageData(0, 0, W, H).data;

  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const pos = [], rnd = [], alpha = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const l = px[(y * W + x) * 4] / 255;
    const nx = x / W - 0.5, ny = 0.5 - y / H;
    // fade the grey backdrop at the sides and let the chest dissolve downwards
    // gentle tone curve instead of a hard threshold, so skin, beard and shirt keep their mid-tones
    const a = Math.pow(sm(0.26, 0.92, l), 1.15) * (1 - sm(0.72, 1, Math.abs(nx) / 0.5)) * sm(-0.36, -0.08, ny);
    if (a < 0.05) continue;
    // half a cell of jitter breaks the sampling grid, which otherwise shows as moire
    const j = () => ((Math.random() - 0.5) * S) / H;
    pos.push(nx * 2 * (W / H) * S + j(), ny * 2 * S + TOP - S + j(), (l - 0.5) * 0.4 * S);
    rnd.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random());
    alpha.push(a);
  }
  // dust hanging in the light
  for (let i = 0; i < (phone ? 150 : 500); i++) {
    const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1;
    pos.push(x * 4.5 - X, y * 1.3, Math.random() * 1.5 - 1);
    rnd.push(x * 1.5 - X / 3, y * 0.45, Math.random());
    alpha.push(0.15 + Math.random() * 0.4);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aRnd', new THREE.Float32BufferAttribute(rnd, 3));
  geo.setAttribute('aA', new THREE.Float32BufferAttribute(alpha, 1));
  const u = { uP: { value: 0 }, uT: { value: 0 }, uPx: { value: 1 }, uM: { value: new THREE.Vector2(9, 9) } };
  const mat = new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false,
    vertexShader: `
      attribute vec3 aRnd; attribute float aA;
      uniform float uP, uT, uPx; uniform vec2 uM; varying float vA;
      void main() {
        float t = clamp(uP * 1.5 - aRnd.z * 0.5, 0.0, 1.0); t = t * t * (3.0 - 2.0 * t);
        vec3 p = mix(vec3(aRnd.xy * 3.0, aRnd.z * 2.0 - 1.0), position, t);
        p.z += sin(uT * 0.8 + position.x * 6.0 + position.y * 4.0) * 0.014;
        vec2 d = p.xy - uM; float f = smoothstep(0.42, 0.0, length(d));
        p.xy += normalize(d + 1e-4) * f * 0.16; p.z += f * 0.32;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uPx * (0.75 + 0.9 * aA) / -mv.z;
        // top light: brighter towards the top of the frame
        vA = aA * t * (0.62 + 0.6 * smoothstep(-0.7, 1.0, position.y));
      }`,
    fragmentShader: `
      varying float vA;
      void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(vec3(1.0), min(1.0, vA * 1.7) * smoothstep(0.5, 0.36, d)); }`,
  });
  const points = new THREE.Points(geo, mat);
  const scene = new THREE.Scene();
  points.position.x = X;
  scene.add(points);

  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
  cam.position.set(0, 0, 3.5);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  const view = 2 * 3.5 * Math.tan((35 * Math.PI) / 360); // world height visible at z = 0

  function size() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    u.uPx.value = (((2 * S) / H) * (h * renderer.getPixelRatio()) / view) * 3.5 * 0.95;
  }
  size();
  addEventListener('resize', size);

  const ptr = { x: 0, y: 0 };
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    u.uM.value.set((ptr.x * view * cam.aspect) / 2 - X, (ptr.y * view) / 2);
  });
  stage.addEventListener('pointerleave', () => u.uM.value.set(9, 9));

  let visible = true, raf = 0, t0 = 0;
  ready.then(() => (t0 = performance.now()));
  function frame(now) {
    raf = visible ? requestAnimationFrame(frame) : 0;
    const t = t0 ? (now - t0) / 1000 : 0;
    const scrolled = Math.min(1, Math.max(0, scrollY / (stage.clientHeight * 0.9)));
    const target = Math.min(1, t / 2.2) * (1 - scrolled);
    u.uP.value += (target - u.uP.value) * 0.08;
    u.uT.value = now / 1000;
    points.rotation.y += (ptr.x * 0.18 - points.rotation.y) * 0.05;
    points.rotation.x += (-ptr.y * 0.08 - points.rotation.x) * 0.05;
    renderer.render(scene, cam);
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }).observe(stage);
  stage.classList.add('on');
}
