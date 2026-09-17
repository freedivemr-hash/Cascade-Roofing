/**
 * Cascade Roofing Portland - Master Application Logic
 * WCAG 2.1 AA / ADA Compliant | Zero Emojis | Frictionless UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibilityBar();
  initMobileDrawer();
  initHeaderScroll();
  initBeforeAfterSlider();
  initServiceAreaExplorer();
  initTestimonialCarousel();
  initFaqAccordion();
  initInspectionForms();
});

/* --------------------------------------------------------------------------
   1. Accessibility Toolbar & Modal (Contrast, Font Size, Statement)
   -------------------------------------------------------------------------- */
function initAccessibilityBar() {
  const contrastBtn = document.getElementById('btn-toggle-contrast');
  const textBtn = document.getElementById('btn-toggle-text');
  const modalBtn = document.getElementById('btn-a11y-statement');
  const modal = document.getElementById('a11y-modal');
  const modalClose = document.getElementById('modal-close-btn');

  // Restore stored preferences
  if (localStorage.getItem('cr_high_contrast') === 'true') {
    document.body.classList.add('high-contrast-mode');
    contrastBtn?.setAttribute('aria-pressed', 'true');
  }
  if (localStorage.getItem('cr_large_text') === 'true') {
    document.body.classList.add('large-text-mode');
    textBtn?.setAttribute('aria-pressed', 'true');
  }

  // Contrast toggle
  contrastBtn?.addEventListener('click', () => {
    const isContrast = document.body.classList.toggle('high-contrast-mode');
    contrastBtn.setAttribute('aria-pressed', isContrast.toString());
    localStorage.setItem('cr_high_contrast', isContrast.toString());
    announceToScreenReader(isContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
  });

  // Text size toggle
  textBtn?.addEventListener('click', () => {
    const isLarge = document.body.classList.toggle('large-text-mode');
    textBtn.setAttribute('aria-pressed', isLarge.toString());
    localStorage.setItem('cr_large_text', isLarge.toString());
    announceToScreenReader(isLarge ? 'Large text mode enabled' : 'Default text size restored');
  });

  // Modal Dialog with Focus Trap
  let previousActiveElement = null;

  modalBtn?.addEventListener('click', () => {
    previousActiveElement = document.activeElement;
    modal?.classList.add('active');
    modal?.setAttribute('aria-hidden', 'false');
    modalClose?.focus();
    document.addEventListener('keydown', handleModalKeydown);
  });

  function closeModal() {
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleModalKeydown);
    previousActiveElement?.focus();
  }

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function handleModalKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
    if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
}

/* --------------------------------------------------------------------------
   2. Dedicated Mobile Slide-Out Drawer (Fixed Overlap Issue)
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    closeBtn?.focus();
    document.addEventListener('keydown', handleDrawerKeydown);
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleDrawerKeydown);
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  function handleDrawerKeydown(e) {
    if (e.key === 'Escape') {
      closeDrawer();
    }
    if (e.key === 'Tab') {
      const focusables = drawer.querySelectorAll('button, [href], input, select, textarea');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
}

/* --------------------------------------------------------------------------
   3. Sticky Header Elevation on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Accessible Before & After Comparison Slider
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const slider = document.getElementById('roof-comparison-range');
  const afterWrap = document.getElementById('comparison-after-wrap');
  const handleLine = document.getElementById('comparison-handle-line');
  const handleKnob = document.getElementById('comparison-handle-knob');

  if (!slider || !afterWrap) return;

  function updateSliderPosition(val) {
    afterWrap.style.width = `${val}%`;
    if (handleLine) handleLine.style.left = `${val}%`;
    if (handleKnob) handleKnob.style.left = `${val}%`;
  }

  slider.addEventListener('input', (e) => {
    updateSliderPosition(e.target.value);
  });

  slider.addEventListener('keydown', (e) => {
    let current = parseInt(slider.value, 10);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      current = Math.max(0, current - 5);
      slider.value = current;
      updateSliderPosition(current);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      current = Math.min(100, current + 5);
      slider.value = current;
      updateSliderPosition(current);
      e.preventDefault();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Service Area Explorer
   -------------------------------------------------------------------------- */
function initServiceAreaExplorer() {
  const cityPills = document.querySelectorAll('.city-pill');
  const mapCityName = document.getElementById('map-city-name');
  const mapResponseTag = document.getElementById('map-response-tag');
  const mapCrewInfo = document.getElementById('map-crew-info');
  const mapCompletedCount = document.getElementById('map-completed-count');

  const cityData = {
    'portland': {
      name: 'Portland Metro (All Quadrants)',
      response: 'Priority Dispatch Available',
      crew: 'Tigard & Central Headquarters Operations',
      completed: '8,400+ Projects Completed'
    },
    'beaverton': {
      name: 'Beaverton & Cedar Hills',
      response: '24-48 Hr On-Site Consultation',
      crew: 'Westside Residential Specialist Team',
      completed: '2,890+ Projects Completed'
    },
    'tigard': {
      name: 'Tigard (Hampton St HQ)',
      response: 'Direct Local Service',
      crew: 'Main Operations Hub & Material Yard',
      completed: '3,150+ Projects Completed'
    },
    'lake-oswego': {
      name: 'Lake Oswego & West Haven',
      response: 'Priority Consultation',
      crew: 'Architectural & Premium Shingle Craftsmen',
      completed: '1,960+ Projects Completed'
    },
    'hillsboro': {
      name: 'Hillsboro & Orenco Station',
      response: '24-48 Hr On-Site Consultation',
      crew: 'High-Wind Valley & Commercial Team',
      completed: '2,110+ Projects Completed'
    },
    'west-linn': {
      name: 'West Linn & Wilsonville',
      response: 'Priority Consultation',
      crew: 'South Metro Steep-Slope Specialists',
      completed: '1,430+ Projects Completed'
    }
  };

  cityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      cityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cityKey = pill.dataset.city;
      const data = cityData[cityKey];
      if (data && mapCityName) {
        mapCityName.textContent = data.name;
        if (mapResponseTag) mapResponseTag.textContent = data.response;
        if (mapCrewInfo) mapCrewInfo.textContent = data.crew;
        if (mapCompletedCount) mapCompletedCount.textContent = data.completed;
        announceToScreenReader(`Selected area: ${data.name}. Response: ${data.response}`);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Testimonials Carousel with WCAG Pause/Play
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const playPauseBtn = document.getElementById('carousel-play-pause');
  const indicators = document.querySelectorAll('.indicator-dot');

  if (!cards.length) return;

  let currentIndex = 0;
  let isPlaying = true;
  let autoTimer = null;

  function showSlide(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
        card.removeAttribute('hidden');
      } else {
        card.classList.remove('active');
        card.setAttribute('hidden', 'true');
      }
    });

    indicators.forEach((dot, i) => {
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });

    currentIndex = index;
  }

  function nextSlide() {
    showSlide((currentIndex + 1) % cards.length);
  }

  function prevSlide() {
    showSlide((currentIndex - 1 + cards.length) % cards.length);
  }

  nextBtn?.addEventListener('click', nextSlide);
  prevBtn?.addEventListener('click', prevSlide);

  indicators.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(nextSlide, 7500);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  playPauseBtn?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAutoPlay();
      playPauseBtn.setAttribute('aria-label', 'Pause testimonial slider');
      playPauseBtn.innerHTML = `<svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      announceToScreenReader('Testimonial carousel playing');
    } else {
      stopAutoPlay();
      playPauseBtn.setAttribute('aria-label', 'Play testimonial slider');
      playPauseBtn.innerHTML = `<svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      announceToScreenReader('Testimonial carousel paused');
    }
  });

  const viewport = document.querySelector('.carousel-viewport');
  viewport?.addEventListener('mouseenter', stopAutoPlay);
  viewport?.addEventListener('mouseleave', () => { if (isPlaying) startAutoPlay(); });
  viewport?.addEventListener('focusin', stopAutoPlay);
  viewport?.addEventListener('focusout', () => { if (isPlaying) startAutoPlay(); });

  startAutoPlay();
}

/* --------------------------------------------------------------------------
   7. Accessible FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(contentId);

      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherContent = document.getElementById(otherTrigger.getAttribute('aria-controls'));
          otherContent?.setAttribute('aria-hidden', 'true');
        }
      });

      trigger.setAttribute('aria-expanded', (!isExpanded).toString());
      content?.setAttribute('aria-hidden', isExpanded.toString());
    });
  });
}

/* --------------------------------------------------------------------------
   8. Inspection & Consultation Forms Validation (Frictionless)
   -------------------------------------------------------------------------- */
function initInspectionForms() {
  const forms = document.querySelectorAll('.quote-form, .inspection-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const alertBox = form.querySelector('.form-alert');

      let hasErrors = false;
      let errorMsg = '';

      if (nameInput && !nameInput.value.trim()) {
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.focus();
        hasErrors = true;
        errorMsg = 'Please enter your full name.';
      } else if (nameInput) {
        nameInput.removeAttribute('aria-invalid');
      }

      if (!hasErrors && phoneInput && !phoneInput.value.trim()) {
        phoneInput.setAttribute('aria-invalid', 'true');
        phoneInput.focus();
        hasErrors = true;
        errorMsg = 'Please enter your phone number so our senior estimator can confirm your inspection.';
      } else if (phoneInput) {
        phoneInput.removeAttribute('aria-invalid');
      }

      if (alertBox) {
        if (hasErrors) {
          alertBox.className = 'form-alert error';
          alertBox.textContent = errorMsg;
          alertBox.setAttribute('role', 'alert');
          alertBox.style.display = 'block';
        } else {
          alertBox.className = 'form-alert success';
          alertBox.innerHTML = `<strong>Thank you, ${escapeHtml(nameInput.value)}!</strong> Your free inspection request has been received. Our senior estimator will call you at ${escapeHtml(phoneInput.value)} to confirm your scheduled appointment.`;
          alertBox.setAttribute('role', 'status');
          alertBox.style.display = 'block';
          form.reset();
          announceToScreenReader('Inspection request successfully submitted.');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Helper: Screen Reader Live Region Announcer
   -------------------------------------------------------------------------- */
function announceToScreenReader(message) {
  let announcer = document.getElementById('a11y-live-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-live-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
