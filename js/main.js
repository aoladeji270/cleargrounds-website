/* ============================================================
   CLEARGROUNDS — MAIN JAVASCRIPT
============================================================ */

(function () {
  'use strict';

  /* ── Navbar: transparent → solid on scroll ──────────────── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 72);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run once on load


  /* ── Quote Modal ─────────────────────────────────────────── */
  const modal      = document.getElementById('quote-modal');
  const modalClose = document.getElementById('modal-close');
  const quoteButtons = document.querySelectorAll('.btn-quote');

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  quoteButtons.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });


  /* ── Hamburger / Mobile Nav ──────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  function toggleMenu() {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close nav when any link inside it is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking outside of it
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });


  /* ── Smooth Scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });


  /* ── Intersection Observer: fade-in on scroll ───────────── */
  var animElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Safety net — force all animated elements visible after 1 second
  // in case the observer misses any
  setTimeout(function () {
    animElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }, 1000);


  /* ── Landscaping image slider ───────────────────────────── */
  var slider = document.getElementById('landscaping-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots   = slider.querySelectorAll('.slider-dot');
    var current = 0;

    function goToSlide(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToSlide(i); });
    });

    setInterval(function () {
      goToSlide((current + 1) % slides.length);
    }, 3500);
  }

  /* ── Read More / Read Less toggle ───────────────────────── */
  document.querySelectorAll('.read-more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card    = btn.closest('.service-card');
      var moreEl  = card.querySelector('.card-more');
      var isOpen  = btn.getAttribute('aria-expanded') === 'true';

      moreEl.classList.toggle('hidden', isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
      btn.textContent = isOpen ? 'Read More +' : 'Read Less −';
    });
  });


  /* ── Garden photo gallery slider ────────────────────────── */
  var gallerySlider = document.getElementById('gallery-slider');
  if (gallerySlider) {
    var gSlides  = gallerySlider.querySelectorAll('.gallery-slide');
    var gDots    = gallerySlider.querySelectorAll('.gallery-dot');
    var gCounter = document.getElementById('gallery-counter');
    var gCurrent = 0;
    var total    = gSlides.length;

    function goToGallery(index) {
      gSlides[gCurrent].classList.remove('active');
      gDots[gCurrent].classList.remove('active');
      gCurrent = (index + total) % total;
      gSlides[gCurrent].classList.add('active');
      gDots[gCurrent].classList.add('active');
      if (gCounter) gCounter.textContent = (gCurrent + 1) + ' / ' + total;
    }

    gallerySlider.querySelector('.gallery-prev').addEventListener('click', function () {
      goToGallery(gCurrent - 1);
    });
    gallerySlider.querySelector('.gallery-next').addEventListener('click', function () {
      goToGallery(gCurrent + 1);
    });

    gDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToGallery(i); });
    });

    // Swipe support for mobile
    var touchStartX = 0;
    gallerySlider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    gallerySlider.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToGallery(diff > 0 ? gCurrent + 1 : gCurrent - 1);
    }, { passive: true });
  }

  /* ── Hero video fallback ─────────────────────────────────── */
  var heroVideo = document.querySelector('.hero-video');

  if (heroVideo) {
    heroVideo.addEventListener('error', function () {
      // Video failed to load — the CSS animated gradient background is already
      // visible beneath it, so simply hide the broken video element.
      heroVideo.style.display = 'none';
    });
  }

})();
