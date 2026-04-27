'use strict';

// ─── EmailJS ──────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'Wz449TlNCdesghBJu';
const EMAILJS_SERVICE_ID  = 'service_8bldwws';
const EMAILJS_TEMPLATE_ID = 'template_27t86vr';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ─── Navigation ──────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function navigateTo(sectionId) {
  sections.forEach(s => s.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));

  const target = document.getElementById(sectionId);
  const link = document.querySelector(`[data-section="${sectionId}"]`);

  if (target) target.classList.add('active');
  if (link) link.classList.add('active');

  // Re-trigger animations
  if (target) {
    target.querySelectorAll('[class*="animate-"]').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });
  }

  closeSidebar();
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

// "Learn more" button on home
document.querySelectorAll('[data-section]').forEach(el => {
  if (el.tagName === 'BUTTON') {
    el.addEventListener('click', () => navigateTo(el.dataset.section));
  }
});

// ─── Mobile Sidebar ───────────────────────────────────────
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');
const overlay = document.querySelector('.sidebar-overlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

toggle.addEventListener('click', openSidebar);
overlay.addEventListener('click', closeSidebar);

// ─── Contact Modal ────────────────────────────────────────
const ctaBtn = document.getElementById('cta-btn');
const backdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const contactForm = document.getElementById('contact-form');

function openModal(e) {
  e.preventDefault();
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  backdrop.querySelector('input, textarea')?.focus();
}

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

ctaBtn.addEventListener('click', openModal);
document.getElementById('cta-btn-mobile')?.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
});

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');

  const senderName    = contactForm.querySelector('#name').value.trim();
  const senderEmail   = contactForm.querySelector('#email').value.trim();
  const senderMessage = contactForm.querySelector('#message').value.trim();
  if (!senderName || !senderEmail || !senderMessage) return;

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      title:    senderName,
      name:     senderName,
      email:    senderEmail,
      message:  senderMessage,
      time:     new Date().toLocaleString(),
      reply_to: senderEmail,
    });

    btn.textContent = 'Message sent ✓';
    btn.style.background = '#2ecc71';
    setTimeout(() => {
      closeModal();
      contactForm.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      btn.style.background = '';
    }, 2200);
  } catch {
    btn.textContent = 'Failed — try again';
    btn.style.background = '#e74c3c';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
    }, 3000);
  }
});

// ─── Typed name effect ────────────────────────────────────
const nameEl = document.getElementById('typed-name');
if (nameEl) {
  const name = nameEl.textContent;
  nameEl.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    nameEl.textContent += name[i++];
    if (i === name.length) clearInterval(timer);
  }, 80);
}
