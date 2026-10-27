'use strict';
(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  $('#year').textContent = String(new Date().getFullYear());
  const toggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  }
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      mobileNav.hidden = open;
      document.body.classList.toggle('menu-open', !open);
    });
    $$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1000) closeMenu(); });
  }
  const progress = $('#scroll-progress');
  let scrolling = false;
  function updateProgress() {
    scrolling = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  }
  window.addEventListener('scroll', () => { if (!scrolling) { scrolling = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) document.documentElement.classList.add('can-reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px 55px 0px' });
    elements.forEach(element => observer.observe(element));
  } else elements.forEach(element => element.classList.add('visible'));

  // Dependency-free, true WebGL rotating icosahedron. Graceful CSS fallback is always available.
  const canvas = $('#hero-webgl');
  const hero3d = $('.hero-3d-art');
  if (!canvas || !hero3d || reducedMotion.matches) return;
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }); } catch (_) { return; }
  if (!gl) return;
  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform float uTime;
    uniform vec2 uPointer;
    varying vec3 vNormal;
    varying vec3 vWorld;
    void main() {
      float x = uTime * 0.36 + uPointer.y * .17;
      float y = uTime * 0.48 + uPointer.x * .35;
      mat3 rx = mat3(1.,0.,0., 0.,cos(x),sin(x), 0.,-sin(x),cos(x));
      mat3 ry = mat3(cos(y),0.,-sin(y), 0.,1.,0., sin(y),0.,cos(y));
      mat3 rot = rx * ry;
      vec3 pos = rot * aPosition;
      vWorld = pos;
      vNormal = normalize(rot * aNormal);
      gl_Position = vec4(pos.xy * .71, pos.z * .12, 1.);
    }`;
  const fragmentSource = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vWorld;
    void main() {
      vec3 n = normalize(vNormal);
      vec3 light = normalize(vec3(-.65,.9,1.5));
      float diff = max(dot(n,light),0.0);
      float edge = pow(1.0-max(dot(n,vec3(0.,0.,1.)),0.0), 2.0);
      float gloss = pow(max(dot(reflect(-light,n),vec3(0.,0.,1.)),0.),12.);
      vec3 dark = vec3(.32,.43,.49);
      vec3 silver = vec3(.87,.93,.96);
      vec3 base = mix(dark,silver,.2 + .73 * diff);
      base += vec3(.2,.22,.23) * gloss;
      base += vec3(.1,.12,.13) * edge;
      float alpha = .94;
      gl_FragColor = vec4(min(base,vec3(1.)),alpha);
    }`;
  function makeShader(kind, source) {
    const shader = gl.createShader(kind);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  const vs = makeShader(gl.VERTEX_SHADER, vertexSource);
  const fs = makeShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return;
  const program = gl.createProgram();
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  // The 20 flat-shaded triangles of an icosahedron give the object real geometric facets.
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [ [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1] ];
  const faces = [ [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1] ];
  const data = [];
  const subtract = (a,b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const norm = a => { const l = Math.hypot(...a) || 1; return a.map(v => v/l); };
  faces.forEach(face => {
    const a = norm(verts[face[0]]), b = norm(verts[face[1]]), c = norm(verts[face[2]]);
    const normal = norm(cross(subtract(b,a),subtract(c,a)));
    [a,b,c].forEach(v => data.push(...v.map(x => x*.92), ...normal));
  });
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  [['aPosition',0],['aNormal',3]].forEach(([name, offset]) => {
    const attr = gl.getAttribLocation(program,name);
    if (attr >= 0) { gl.enableVertexAttribArray(attr); gl.vertexAttribPointer(attr,3,gl.FLOAT,false,6*4,offset*4); }
  });
  const timeLoc = gl.getUniformLocation(program,'uTime');
  const pointerLoc = gl.getUniformLocation(program,'uPointer');
  const pointer = {x:0,y:0};
  const hero = $('.hero');
  if (hero) hero.addEventListener('pointermove', e => {
    const box = hero.getBoundingClientRect();
    pointer.x = (e.clientX-box.left)/box.width*2-1;
    pointer.y = (e.clientY-box.top)/box.height*2-1;
  }, { passive:true });
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0,0,0,0);
  hero3d.classList.add('webgl-ready');
  const start = performance.now();
  let raf = 0;
  function draw(now) {
    if (!canvas.isConnected) return;
    const ratio = Math.min(devicePixelRatio || 1,2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0,0,width,height); }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(timeLoc, (now - start)/1000);
    gl.uniform2f(pointerLoc,pointer.x,pointer.y);
    gl.drawArrays(gl.TRIANGLES,0,data.length/6);
    if (!window.location.search.includes('snapshot=1')) raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(draw); });
})();
