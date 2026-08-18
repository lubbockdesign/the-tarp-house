// The Tarp House - shared site behavior
document.addEventListener('DOMContentLoaded', () => {

  // mobile nav toggle
  const burger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // nav dropdown (Use Cases)
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.closest('.nav-dropdown');
      const wasOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!wasOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  });

  // back to top button
  const toTop = document.querySelector('.back-to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 500);
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // accordion (materials / faq)
  document.querySelectorAll('.acc-head').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // hover cards (3D tilt + background pan on mousemove)
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.hcard-wrap').forEach(wrap => {
      const card = wrap.querySelector('.hcard');
      const bg = wrap.querySelector('.hcard-bg');
      let width = 0, height = 0, resetTimer = null;

      const measure = () => {
        const rect = wrap.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      };
      measure();
      window.addEventListener('resize', measure);

      const applyTilt = (mouseX, mouseY) => {
        const px = width ? mouseX / width : 0;
        const py = height ? mouseY / height : 0;
        const rX = px * 30;
        const rY = py * -30;
        card.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;
        bg.style.transform = `translateX(${px * -40}px) translateY(${py * -40}px)`;
      };

      wrap.addEventListener('mouseenter', () => clearTimeout(resetTimer));
      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        applyTilt(mouseX, mouseY);
      });
      wrap.addEventListener('mouseleave', () => {
        resetTimer = setTimeout(() => applyTilt(0, 0), 1000);
      });
    });
  }

  // contact form -> mailto composer (static site, no backend)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const phone = (data.get('phone') || '').trim();
      const email = (data.get('email') || '').trim();
      const tarpType = (data.get('tarp_type') || '').trim();
      const message = (data.get('message') || '').trim();

      const subject = `Custom Tarp Inquiry from ${name || 'Website'}`;
      const body =
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Tarp Type Needed: ${tarpType}\n\n` +
        `Message:\n${message}`;

      const mailto = `mailto:josh@belttrailers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const successBox = document.getElementById('form-success');
      if (successBox) successBox.classList.add('show');

      window.location.href = mailto;
    });
  }
});
