/* ═══════════════════════════════════════
   GENESIS X — animations.js
   ═══════════════════════════════════════ */

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  const colors = ['#00f0ff','#ff00e5','#b829ff','#2979ff','#39ff14'];
  const count  = Math.min(100, Math.floor(window.innerWidth / 18));
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    size: Math.random() * 2 + .5,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * .4 + .1,
    pulse: Math.random() * Math.PI * 2,
  }));
  let mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; });
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.pulse += .02;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      if (Math.hypot(dx, dy) < 180) { p.x -= dx * .015; p.y -= dy * .015; }
      const glow = Math.sin(p.pulse) * .15 + .85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * glow, 0, Math.PI * 2);
      ctx.fillStyle  = p.color;
      ctx.globalAlpha = p.alpha * glow;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.fill(); ctx.shadowBlur = 0;
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d  = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle  = p.color;
          ctx.globalAlpha  = (1 - d / 140) * .08;
          ctx.lineWidth    = .5;
          ctx.stroke();
        }
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  })();
}

function initPreloader(onComplete) {
  const el     = document.getElementById('preloader');
  const fill   = document.getElementById('preloader-fill');
  const label  = document.getElementById('preloader-label');
  let progress = 0;
  const iv = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(iv);
      fill.style.width = '100%';
      label.textContent = 'SYSTEM READY... 100%';
      setTimeout(() => {
        el.classList.add('hide');
        setTimeout(onComplete, 800);
      }, 400);
      return;
    }
    fill.style.width = progress + '%';
    label.textContent = `INITIALIZING NEURAL SYSTEMS... ${Math.floor(progress)}%`;
  }, 200);
}

function typeWriter(el, text, delay = 45, startDelay = 0) {
  let i = 0;
  setTimeout(() => {
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);
    const iv = setInterval(() => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
      } else {
        clearInterval(iv);
        cursor.remove();
      }
    }, delay);
  }, startDelay);
}

function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const setSize = () => {
    canvas.width  = canvas.parentElement.clientWidth - 24;
    canvas.height = 500;
  };
  setSize();
  window.addEventListener('resize', setSize);
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  const nodes = [
    { label:'BRAIN',  color:'#00f0ff', speed:0,     orbit:0,   r:28, angle:0 },
    { label:'PLAN',   color:'#ff00e5', speed:.002,  orbit:120, r:14, angle:0 },
    { label:'EXEC',   color:'#b829ff', speed:.003,  orbit:120, r:14, angle:Math.PI*.4 },
    { label:'REVIEW', color:'#2979ff', speed:.0025, orbit:120, r:14, angle:Math.PI*.8 },
    { label:'MEMORY', color:'#39ff14', speed:.0035, orbit:120, r:14, angle:Math.PI*1.2 },
    { label:'EVOLVE', color:'#ff6600', speed:.003,  orbit:120, r:14, angle:Math.PI*1.6 },
  ];
  const outer = [
    { label:'Web',      color:'#00f0ff', angle:0 },
    { label:'Files',    color:'#ff00e5', angle:Math.PI/4 },
    { label:'Code',     color:'#b829ff', angle:Math.PI/2 },
    { label:'Market',   color:'#2979ff', angle:3*Math.PI/4 },
    { label:'Campaign', color:'#39ff14', angle:Math.PI },
    { label:'Logs',     color:'#ff6600', angle:5*Math.PI/4 },
    { label:'Patch',    color:'#ff1493', angle:3*Math.PI/2 },
    { label:'System',   color:'#00f0ff', angle:7*Math.PI/4 },
  ];
  let time = 0;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const rect = canvas.getBoundingClientRect();
    const mx = (mouse.x - rect.left - cx) * .02;
    const my = (mouse.y - rect.top  - cy) * .02;
    time++;
    [120, 200].forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx + mx*(idx+1), cy + my*(idx+1), r, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(0,240,255,${.04+idx*.01})`;
      ctx.lineWidth = 1; ctx.stroke();
    });
    nodes.forEach((n, i) => {
      if (i > 0) {
        n.angle += n.speed;
        n.x = cx + mx + Math.cos(n.angle) * n.orbit;
        n.y = cy + my + Math.sin(n.angle) * n.orbit;
      } else { n.x = cx + mx; n.y = cy + my; }
      ctx.beginPath(); ctx.moveTo(cx+mx, cy+my); ctx.lineTo(n.x, n.y);
      ctx.strokeStyle = `${n.color}18`; ctx.lineWidth = 1; ctx.stroke();
      const pPos = (time*.015 + i*.5) % 1;
      const px = cx+mx + (n.x-cx-mx)*pPos;
      const py = cy+my + (n.y-cy-my)*pPos;
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI*2);
      ctx.fillStyle = `${n.color}aa`;
      ctx.shadowColor = n.color; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle   = `${n.color}10`;
      ctx.strokeStyle = `${n.color}55`;
      ctx.lineWidth   = 1.5; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r+4, 0, Math.PI*2);
      ctx.strokeStyle = `${n.color}15`; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = n.color;
      ctx.font = `${i===0?'bold 10px':'8px'} monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
    });
    outer.forEach((t, i) => {
      const a  = t.angle + time*.0008;
      const tx = cx + mx + Math.cos(a)*200;
      const ty = cy + my + Math.sin(a)*200;
      const nearest = nodes[i%(nodes.length-1)+1] || nodes[1];
      ctx.beginPath(); ctx.moveTo(nearest.x, nearest.y); ctx.lineTo(tx, ty);
      ctx.strokeStyle = `${t.color}0a`; ctx.lineWidth = .5; ctx.stroke();
      ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI*2);
      ctx.fillStyle   = `${t.color}08`;
      ctx.strokeStyle = `${t.color}22`; ctx.lineWidth = 1; ctx.fill(); ctx.stroke();
      ctx.fillStyle = `${t.color}66`; ctx.font = '7px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(t.label, tx, ty);
    });
    requestAnimationFrame(draw);
  })();
}

function initTerminal() {
  const el = document.getElementById('terminal-phase');
  if (!el) return;
  const phases = [
    { text:'> Initializing neural pathways...',  color:'#00f0ff' },
    { text:'> Loading 12 integrated tools...',   color:'#ff00e5' },
    { text:'> Connecting vector memory...',       color:'#b829ff' },
    { text:'> System ready.',                    color:'#39ff14' },
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % phases.length;
    el.style.color   = phases[i].color;
    el.style.opacity = 0;
    el.style.transform = 'translateX(-15px)';
    setTimeout(() => {
      el.textContent    = phases[i].text;
      el.style.opacity  = 1;
      el.style.transform = 'translateX(0)';
    }, 100);
  }, 2500);
  el.textContent = phases[0].text;
  el.style.color = phases[0].color;
  el.style.transition = 'opacity .3s, transform .3s';
}

function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const delay = parseFloat(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay * 1000);
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '-60px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function initNavbar() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });
  const btn = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.innerHTML = menu.classList.contains('open')
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
  });
  document.querySelectorAll('#mobile-menu a').forEach(a => {
    a.addEventListener('click', () => { menu.classList.remove('open'); });
  });
}

function initDownload() {
  // ── الحل: رابط مباشر بدل JavaScript ──
  const btn   = document.getElementById('dl-btn');
  const icon  = document.getElementById('dl-icon');
  const label = document.getElementById('dl-label');

  // اجعل الزر رابطاً مباشراً
  btn.addEventListener('click', () => {
    window.location.href = 'Genesis-X-v4.zip';
  });
}
