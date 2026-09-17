/* =====================================================
   ELLIE CARE — app.js
   ===================================================== */


/* ── Envolver .thumb-row en contenedor con título ── */
document.querySelectorAll('.thumb-row').forEach(row => {
  const container = document.createElement('div');
  container.className = 'sc-container';

  const header = document.createElement('div');
  header.className = 'sc-header';
  header.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <span>Referencia visual — Hacer clic para aperturar</span>`;

  row.parentNode.insertBefore(container, row);
  container.appendChild(header);
  container.appendChild(row);
});

/* ── Fade-in al hacer scroll ── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i * 0.07) + 's';
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ── Copiar speech al portapapeles ── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-text');
    if (!text) return;

    const finish = () => {
      const orig = btn.getAttribute('data-orig') || 'Copiar';
      btn.textContent = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 2200);
    };

    if (!btn.hasAttribute('data-orig')) {
      btn.setAttribute('data-orig', btn.textContent.trim());
    }

    navigator.clipboard.writeText(text).then(finish).catch(() => {
      // Fallback
      const ta = Object.assign(document.createElement('textarea'), {
        value: text,
        style: 'position:fixed;opacity:0'
      });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      finish();
    });
  });
});

/* ── Timer 20 minutos (EVN-4) ── */
let timerInterval = null;
let secondsLeft   = 0;

function toggleTimer() {
  const btn   = document.getElementById('timer-btn');
  const label = document.getElementById('timer-label');

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    secondsLeft = 0;
    btn.classList.remove('running', 'done');
    label.textContent = 'Iniciar 20 min';
    return;
  }

  secondsLeft = 20 * 60;
  btn.classList.add('running');
  btn.classList.remove('done');

  function tick() {
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      btn.classList.remove('running');
      btn.classList.add('done');
      label.textContent = '⏰ ¡Tiempo! Hacer seguimiento ahora';
      return;
    }
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    label.textContent = `${m}:${s} restantes — clic para cancelar`;
    secondsLeft--;
  }

  tick();
  timerInterval = setInterval(tick, 1000);
}

/* ── Lightbox ── */
function openLightbox(src, caption) {
  document.getElementById('lightbox-img').src     = src;
  document.getElementById('lightbox-caption').textContent = caption || '';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeAfModal();
    ['ef','evn','evs','nd'].forEach(id => closeModal(id));
  }
});

/* ── Modales de eventos ── */
function openModal(id) {
  document.getElementById('modal-' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById('modal-' + id).classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Modal Assist Fe ── */
function openAfModal() {
  document.getElementById('af-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAfModal() {
  document.getElementById('af-modal').classList.remove('open');
  document.body.style.overflow = '';
}
