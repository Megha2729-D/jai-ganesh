/* ============================================================
   main.js — Jaiganesh Catering Services
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Navigation ─────────────────────────────────── */
  const toggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileClose');


  function openMenu() {
    if (mobileNav) mobileNav.classList.add('open');
    if (overlay) overlay.classList.add('active');

    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowY = 'hidden';
  }

  function closeMenu() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (overlay) overlay.classList.remove('active');

    document.documentElement.style.overflowY = '';
    document.body.style.overflowY = '';
  }

  toggle && toggle.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  overlay && overlay.addEventListener('click', closeMenu);

  // Mobile sub-menus
  document.querySelectorAll('.mobile-has-children > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const sub = link.nextElementSibling;
      if (sub) sub.classList.toggle('open');
    });
  });

  /* ── Sticky Header shadow ──────────────────────────────── */
  const masthead = document.getElementById('masthead');
  window.addEventListener('scroll', function () {
    if (!masthead) return;
    if (window.scrollY > 60) {
      masthead.style.boxShadow = '0 3px 16px rgba(0,0,0,0.15)';
    } else {
      masthead.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    }
  });


  /* ── Hero Slider with Drag & Swipe ─────────────────── */
  const slider = document.querySelector('.hero-slider');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');

  let current = 0;
  let timer;
  let startX = 0;
  let isDragging = false;
  let dragDistance = 0;

  const dragThreshold = 50;

  function showSlide(idx) {
    if (!slides.length) return;

    current = (idx + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  function prevSlide() {
    showSlide(current - 1);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
  }

  function resetTimer() {
    startTimer();
  }

  /* ── Dot Navigation ─────────────────────────────── */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      resetTimer();
    });
  });

  /* ── Mouse Drag ─────────────────────────────────── */
  slider.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    dragDistance = 0;
    slider.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    dragDistance = e.clientX - startX;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;

    isDragging = false;
    slider.classList.remove('dragging');

    if (dragDistance < -dragThreshold) {
      nextSlide();
      resetTimer();
    } else if (dragDistance > dragThreshold) {
      prevSlide();
      resetTimer();
    }

    dragDistance = 0;
  });

  /* ── Touch Swipe (Mobile) ───────────────────────── */
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const distance = endX - startX;

    if (Math.abs(distance) > dragThreshold) {
      if (distance < 0) {
        nextSlide();
      } else {
        prevSlide();
      }

      resetTimer();
    }
  }, { passive: true });

  /* ── Prevent Image Drag Ghost ───────────────────── */
  slider.querySelectorAll('img').forEach((img) => {
    img.draggable = false;
  });

  /* ── Initialize ─────────────────────────────────── */
  if (slides.length > 0) {
    showSlide(0);
    startTimer();
  }

  /* ── Testimonial Slider ────────────────────────────────── */
  var tSlides = document.querySelectorAll('.testimonial-slide-item');
  var tDots = document.querySelectorAll('.testimonial-dot');
  var tCurrent = 0;
  var tTimer;

  function showTestimonial(idx) {
    var track = document.querySelector('.testimonial-track');
    if (!track || tSlides.length === 0) return;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    tDots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    tCurrent = idx;
  }

  function nextTestimonial() {
    showTestimonial((tCurrent + 1) % tSlides.length);
  }

  function startTTimer() { tTimer = setInterval(nextTestimonial, 4500); }
  function resetTTimer() { clearInterval(tTimer); startTTimer(); }

  if (tSlides.length > 0) {
    showTestimonial(0);
    startTTimer();
    tDots.forEach(function (d, i) {
      d.addEventListener('click', function () { showTestimonial(i); resetTTimer(); });
    });
  }

  /* ── Services Slider ────────────────────────────────────── */
  var sTrack = document.querySelector('.services-track');
  var sCards = document.querySelectorAll('.service-card-new');
  var sDots = document.querySelectorAll('.services-dot');
  var sPrev = document.getElementById('sPrev');
  var sNext = document.getElementById('sNext');
  var sCurrent = 0;

  function getCardsToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function showServices(idx) {
    if (!sTrack || sCards.length === 0) return;
    var cardsToShow = getCardsToShow();
    var maxIndex = sCards.length - cardsToShow;

    var slideIdx = idx;
    if (slideIdx < 0) slideIdx = 0;
    if (slideIdx > maxIndex) slideIdx = maxIndex;

    var cardWidth = sCards[0].clientWidth;
    var gap = 20; // Matches flex gap in CSS
    var shift = slideIdx * (cardWidth + gap);
    sTrack.style.transform = 'translateX(-' + shift + 'px)';

    var dotIdx = idx;
    if (dotIdx < 0) dotIdx = 0;
    if (dotIdx >= sDots.length) dotIdx = sDots.length - 1;

    sDots.forEach(function (d, i) {
      d.classList.toggle('active', i === dotIdx);
    });
    sCurrent = dotIdx;
  }

  if (sCards.length > 0) {
    showServices(0);
    window.addEventListener('resize', function () {
      // Reset to first slide on resize so card width is recalculated correctly
      sCurrent = 0;
      showServices(0);
    });

    sDots.forEach(function (d, i) {
      d.addEventListener('click', function () { showServices(i); });
    });

    sPrev && sPrev.addEventListener('click', function () {
      showServices(sCurrent - 1);
    });
    sNext && sNext.addEventListener('click', function () {
      showServices(sCurrent + 1);
    });
  }

  /* ── Sticky Enquiry Form ───────────────────────────────── */
  var enquiryTab = document.getElementById('enquiryTab');
  var enquiryPanel = document.getElementById('enquiryPanel');

  enquiryTab && enquiryTab.addEventListener('click', function () {
    enquiryPanel && enquiryPanel.classList.toggle('open');
  });

  /* Enquiry form submit */
  /* Enquiry Form Validation + WhatsApp */
  (function () {
    var enquiryForm = document.getElementById('enquiryForm');

    if (!enquiryForm) return;

    var nameInput = document.getElementById('enqName');
    var phoneInput = document.getElementById('enqPhone');
    var guestInput = document.getElementById('enqGuest');
    var dateInput = document.getElementById('enqDate');
    var serviceInput = document.getElementById('enqService');
    var successMessage = document.getElementById('formSuccess');

    // WhatsApp number with country code, without + or spaces.
    var whatsappNumber = '919790640876';

    var fields = [
      nameInput,
      phoneInput,
      guestInput,
      dateInput,
      serviceInput
    ];

    function showError(input, message) {
      var field = input.closest('.form-field');
      var error = field.querySelector('.error-message');

      error.textContent = message;
      input.classList.add('input-error');
      input.classList.remove('input-valid');
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      var field = input.closest('.form-field');
      var error = field.querySelector('.error-message');

      error.textContent = '';
      input.classList.remove('input-error');
      input.classList.add('input-valid');
      input.setAttribute('aria-invalid', 'false');
    }

    function validateField(input) {
      var value = input.value.trim();

      if (input === nameInput) {
        if (!value) {
          showError(input, 'Please enter your first name.');
          return false;
        }

        if (value.length < 2) {
          showError(input, 'Name must contain at least 2 characters.');
          return false;
        }

        if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u.test(value)) {
          showError(input, 'Please enter a valid name.');
          return false;
        }
      }

      if (input === phoneInput) {
        var digits = value.replace(/\D/g, '');

        if (!value) {
          showError(input, 'Please enter your phone number.');
          return false;
        }

        if (!/^[+\d\s().-]+$/.test(value) ||
          digits.length < 7 ||
          digits.length > 15) {
          showError(input, 'Please enter a valid phone number (7–15 digits).');
          return false;
        }
      }

      if (input === guestInput) {
        var guests = Number(value);

        if (!value) {
          showError(input, 'Please enter the number of guests.');
          return false;
        }

        if (!Number.isInteger(guests) || guests < 1 || guests > 100000) {
          showError(input, 'Please enter a whole number between 1 and 100000.');
          return false;
        }
      }

      if (input === dateInput) {
        if (!value) {
          showError(input, 'Please select your event date.');
          return false;
        }

        // Compare dates using local calendar dates.
        var selectedDate = new Date(value + 'T00:00:00');
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(selectedDate.getTime())) {
          showError(input, 'Please select a valid date.');
          return false;
        }

        if (selectedDate < today) {
          showError(input, 'Event date cannot be in the past.');
          return false;
        }
      }

      if (input === serviceInput && !value) {
        showError(input, 'Please select an occasion.');
        return false;
      }

      clearError(input);
      return true;
    }

    // Validate on change/input and remove errors when corrected.
    fields.forEach(function (input) {
      var eventName = input.tagName === 'SELECT' ? 'change' : 'input';

      input.addEventListener(eventName, function () {
        validateField(input);
      });

      input.addEventListener('blur', function () {
        validateField(input);
      });
    });

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;

      fields.forEach(function (input) {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        var firstInvalid = enquiryForm.querySelector('.input-error');

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }

      var name = nameInput.value.trim();
      var phone = phoneInput.value.trim();
      var guests = guestInput.value.trim();
      var date = dateInput.value;
      var occasion = serviceInput.value;

      // Format the selected date for the WhatsApp message.
      var dateParts = date.split('-');
      var formattedDate = dateParts[2] + '/' +
        dateParts[1] + '/' + dateParts[0];

      var message =
        'Hello! I would like to enquire about your catering services.\n\n' +
        '*Enquiry Details*\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Number of Guests: ' + guests + '\n' +
        'Event Date: ' + formattedDate + '\n' +
        'Occasion: ' + occasion + '\n\n' +
        'Please contact me regarding this enquiry.';

      var whatsappURL =
        'https://wa.me/' + whatsappNumber +
        '?text=' + encodeURIComponent(message);

      if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.textContent = 'Opening WhatsApp with your enquiry...';
      }

      // Open WhatsApp. The user must press Send inside WhatsApp.
      var whatsappWindow = window.open(whatsappURL, '_blank');

      if (whatsappWindow) {
        whatsappWindow.opener = null;
      } else {
        // Fallback if the browser blocks the new tab.
        window.location.href = whatsappURL;
      }
    });
  })();

  /* ── Scroll to Top ─────────────────────────────────────── */
  var scrollBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', function () {
    if (!scrollBtn) return;
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollBtn && scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Gallery Filter (gallery.html) ────────────────────── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      document.querySelectorAll('.gallery-item').forEach(function (item) {
        if (cat === 'all' || item.getAttribute('data-cat') === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── Menu Accordion (menu.html) ──────────────────────── */
  var accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      var item = this.parentElement;
      var targetId = this.getAttribute('data-target');
      var content = document.getElementById(targetId);

      if (item.classList.contains('active')) {
        item.classList.remove('active');
        content.style.display = 'none';
      } else {
        document.querySelectorAll('.accordion-item').forEach(function (el) {
          el.classList.remove('active');
        });
        document.querySelectorAll('.accordion-content').forEach(function (el) {
          el.style.display = 'none';
        });
        item.classList.add('active');
        content.style.display = 'block';
      }
    });
  });

  /* ── Contact Form ──────────────────────────────────────── */
  var contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = document.getElementById('contactSuccess');
    if (msg) {
      msg.style.display = 'block';
      contactForm.reset();
      setTimeout(function () { msg.style.display = 'none'; }, 4000);
    }
  });

});
