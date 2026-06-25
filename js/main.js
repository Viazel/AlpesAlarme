/**
 * Alpesalarme — Script principal
 * Navigation, animations, FAQ, formulaire
 */
(function () {
  'use strict';

  const PHONE = '0492681234';
  const PHONE_DISPLAY = '04 92 68 12 34';

  /* Header scroll */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Menu mobile */
  const burger = document.querySelector('.header__burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  function closeMobileNav() {
    burger?.classList.remove('header__burger--open');
    mobileNav?.classList.remove('mobile-nav--open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    burger?.classList.add('header__burger--open');
    mobileNav?.classList.add('mobile-nav--open');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  burger?.addEventListener('click', () => {
    const isOpen = burger.classList.contains('header__burger--open');
    isOpen ? closeMobileNav() : openMobileNav();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* Scroll reveal */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('reveal--visible'));
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq__item').forEach((item) => {
    const question = item.querySelector('.faq__question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');
      document.querySelectorAll('.faq__item--open').forEach((openItem) => {
        openItem.classList.remove('faq__item--open');
        openItem.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('faq__item--open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Validation formulaire */
  const forms = document.querySelectorAll('.contact-form');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const cleaned = phone.replace(/[\s.\-()]/g, '');
    return /^(?:(?:\+|00)33|0)[1-9](?:\d{8})$/.test(cleaned);
  }

  function showError(input, message) {
    input.classList.add('form__input--error');
    let errorEl = input.parentElement.querySelector('.form__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form__error';
      errorEl.setAttribute('role', 'alert');
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('form__input--error');
    const errorEl = input.parentElement.querySelector('.form__error');
    if (errorEl) errorEl.remove();
  }

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const email = form.querySelector('[name="email"]');
      const city = form.querySelector('[name="city"]');
      const message = form.querySelector('[name="message"]');
      const success = form.querySelector('.form__success');

      [name, phone, email, city, message].forEach((field) => {
        if (field) clearError(field);
      });

      if (name && !name.value.trim()) {
        showError(name, 'Veuillez indiquer votre nom.');
        valid = false;
      }

      if (phone && !validatePhone(phone.value)) {
        showError(phone, 'Numéro de téléphone invalide.');
        valid = false;
      }

      if (email && !validateEmail(email.value)) {
        showError(email, 'Adresse e-mail invalide.');
        valid = false;
      }

      if (city && !city.value.trim()) {
        showError(city, 'Veuillez indiquer votre ville.');
        valid = false;
      }

      if (message && !message.value.trim()) {
        showError(message, 'Veuillez décrire votre projet.');
        valid = false;
      }

      if (!valid) return;

      /* Simulation envoi — à connecter à un backend ou service email */
      if (success) {
        success.classList.add('form__success--visible');
        success.textContent = 'Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous 24 h.';
      }

      form.reset();

      setTimeout(() => {
        success?.classList.remove('form__success--visible');
      }, 8000);
    });

    form.querySelectorAll('.form__input, .form__textarea').forEach((input) => {
      input.addEventListener('input', () => clearError(input));
    });
  });

  /* Smooth scroll ancres internes */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileNav();
      }
    });
  });

  /* Tracking appels (placeholder analytics) */
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_call', { event_category: 'contact' });
      }
    });
  });

  /* Expose constantes pour usage éventuel */
  window.Alpesalarme = { PHONE, PHONE_DISPLAY };
})();
