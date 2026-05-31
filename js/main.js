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


  /* ── Generic service card slider factory ────────────────── */
  function initCardSlider(id, interval) {
    var el = document.getElementById(id);
    if (!el) return;
    var slides = el.querySelectorAll('.slide');
    var dots   = el.querySelectorAll('.slider-dot');
    var cur    = 0;

    function go(index) {
      slides[cur].classList.remove('active');
      dots[cur].classList.remove('active');
      cur = (index + slides.length) % slides.length;
      slides[cur].classList.add('active');
      dots[cur].classList.add('active');
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { go(i); });
    });

    setInterval(function () { go(cur + 1); }, interval || 3500);
  }

  initCardSlider('landscaping-slider', 3500);
  initCardSlider('fencing-card-slider', 4000);
  initCardSlider('loft-card-slider',    4500);


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

  /* ── Loft slider ────────────────────────────────────────── */
  var loftSlider = document.getElementById('loft-slider');
  if (loftSlider) {
    var lSlides  = loftSlider.querySelectorAll('.gallery-slide');
    var lDots    = loftSlider.querySelectorAll('.gallery-dot');
    var lCounter = document.getElementById('loft-counter');
    var lCurrent = 0;
    var lTotal   = lSlides.length;

    function goToLoft(index) {
      lSlides[lCurrent].classList.remove('active');
      lDots[lCurrent].classList.remove('active');
      lCurrent = (index + lTotal) % lTotal;
      lSlides[lCurrent].classList.add('active');
      lDots[lCurrent].classList.add('active');
      if (lCounter) lCounter.textContent = (lCurrent + 1) + ' / ' + lTotal;
    }

    loftSlider.querySelector('.gallery-prev').addEventListener('click', function () {
      goToLoft(lCurrent - 1);
    });
    loftSlider.querySelector('.gallery-next').addEventListener('click', function () {
      goToLoft(lCurrent + 1);
    });

    lDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToLoft(i); });
    });

    var lTouchStartX = 0;
    loftSlider.addEventListener('touchstart', function (e) {
      lTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    loftSlider.addEventListener('touchend', function (e) {
      var diff = lTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToLoft(diff > 0 ? lCurrent + 1 : lCurrent - 1);
    }, { passive: true });
  }

  /* ── Fencing slider ─────────────────────────────────────── */
  var fencingSlider = document.getElementById('fencing-slider');
  if (fencingSlider) {
    var fSlides  = fencingSlider.querySelectorAll('.gallery-slide');
    var fDots    = fencingSlider.querySelectorAll('.gallery-dot');
    var fCounter = document.getElementById('fencing-counter');
    var fCurrent = 0;
    var fTotal   = fSlides.length;

    function goToFencing(index) {
      fSlides[fCurrent].classList.remove('active');
      fDots[fCurrent].classList.remove('active');
      fCurrent = (index + fTotal) % fTotal;
      fSlides[fCurrent].classList.add('active');
      fDots[fCurrent].classList.add('active');
      if (fCounter) fCounter.textContent = (fCurrent + 1) + ' / ' + fTotal;
    }

    fencingSlider.querySelector('.gallery-prev').addEventListener('click', function () {
      goToFencing(fCurrent - 1);
    });
    fencingSlider.querySelector('.gallery-next').addEventListener('click', function () {
      goToFencing(fCurrent + 1);
    });

    fDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToFencing(i); });
    });

    var fTouchStartX = 0;
    fencingSlider.addEventListener('touchstart', function (e) {
      fTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    fencingSlider.addEventListener('touchend', function (e) {
      var diff = fTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToFencing(diff > 0 ? fCurrent + 1 : fCurrent - 1);
    }, { passive: true });
  }

  /* ── Video slider (projects page) ──────────────────────── */
  var videoSlider = document.getElementById('video-slider');
  if (videoSlider) {
    var vSlides  = videoSlider.querySelectorAll('.video-slide');
    var vDots    = videoSlider.querySelectorAll('.gallery-dot');
    var vCounter = document.getElementById('video-counter');
    var vCurrent = 0;
    var vTotal   = vSlides.length;

    function goToVideo(index) {
      var leaving = vSlides[vCurrent].querySelector('video');
      if (leaving) leaving.pause();

      vSlides[vCurrent].classList.remove('active');
      vDots[vCurrent].classList.remove('active');
      vCurrent = (index + vTotal) % vTotal;
      vSlides[vCurrent].classList.add('active');
      vDots[vCurrent].classList.add('active');
      if (vCounter) vCounter.textContent = (vCurrent + 1) + ' / ' + vTotal;

      var arriving = vSlides[vCurrent].querySelector('video');
      if (arriving) {
        arriving.currentTime = 0;
        arriving.play().catch(function () {});
      }
    }

    videoSlider.querySelector('.gallery-prev').addEventListener('click', function () {
      goToVideo(vCurrent - 1);
    });
    videoSlider.querySelector('.gallery-next').addEventListener('click', function () {
      goToVideo(vCurrent + 1);
    });

    vDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToVideo(i); });
    });

    // Auto-advance to next slide when a non-looping video ends
    vSlides.forEach(function (slide) {
      var vid = slide.querySelector('video');
      if (vid && !vid.loop) {
        vid.addEventListener('ended', function () { goToVideo(vCurrent + 1); });
      }
    });

    // Swipe support
    var vTouchStartX = 0;
    videoSlider.addEventListener('touchstart', function (e) {
      vTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    videoSlider.addEventListener('touchend', function (e) {
      var diff = vTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToVideo(diff > 0 ? vCurrent + 1 : vCurrent - 1);
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
