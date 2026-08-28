/**
 * AVM ACADEMY & LIBRARY, KARELI - JAVASCRIPT CONTROLLER
 * Fully interactive vanilla JS handling modals, forms, gallery lightbox, 
 * review carousel, FAQ accordion, navigation, and WhatsApp link generation.
 */

// Global Configuration
const AVM_CONFIG = {
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "contact@avmacademykareli.com",
  maps: "ADD_GOOGLE_MAPS_LINK"
};

document.addEventListener('DOMContentLoaded', () => {
  initDynamicContactLinks();
  initStickyNavbar();
  initMobileNavigation();
  initSmoothScroll();
  initModals();
  initForms();
  initTestimonialSlider();
  initGallery();
  initFaqAccordion();
  initBackToTop();
  initScrollAnimations();
});

/* -------------------------------------------------------------------------- */
/* 1. Dynamic Contact & WhatsApp Links                                         */
/* -------------------------------------------------------------------------- */
function initDynamicContactLinks() {
  const cleanPhone = AVM_CONFIG.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = AVM_CONFIG.whatsapp.replace(/[^0-9]/g, '');

  // Populate phone links
  document.querySelectorAll('.js-phone-link').forEach(el => {
    el.setAttribute('href', `tel:${cleanPhone}`);
  });

  // Populate WhatsApp links
  document.querySelectorAll('.js-whatsapp-link').forEach(el => {
    const defaultMsg = encodeURIComponent("Hello AVM Academy & Library, I would like to enquire about courses and study seats.");
    el.setAttribute('href', `https://wa.me/${cleanWhatsApp}?text=${defaultMsg}`);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  // Maps link handler
  document.querySelectorAll('.js-maps-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Demo Notice: In the production website, this link will navigate directly to AVM Academy & Library's Google Maps location in Kareli, MP.");
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 2. Sticky Navbar & Scroll Effects                                          */
/* -------------------------------------------------------------------------- */
function initStickyNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* -------------------------------------------------------------------------- */
/* 3. Mobile Navigation Drawer                                                */
/* -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navDrawer = document.getElementById('mobileNavDrawer');
  const navBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-menu-item a');

  if (!hamburgerBtn || !navDrawer || !navBackdrop) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !navDrawer.classList.contains('is-open');
    navDrawer.classList.toggle('is-open', isOpen);
    navBackdrop.classList.toggle('is-open', isOpen);
    hamburgerBtn.classList.toggle('is-active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburgerBtn.addEventListener('click', () => toggleMenu());
  navBackdrop.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* -------------------------------------------------------------------------- */
/* 4. Smooth Anchor Scrolling                                                 */
/* -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.startsWith('#!')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navOffset = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Modals (Enquiry & Seat Booking)                                         */
/* -------------------------------------------------------------------------- */
function initModals() {
  // Common Modal Closer helper
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  // Close handlers on backdrop and close button
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    const closeBtns = modal.querySelectorAll('.js-modal-close');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => closeModal(modal));
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach(closeModal);
    }
  });

  // Hook up triggers for Enquiry Modal
  const enquiryModal = document.getElementById('enquiryModal');
  const enquiryCourseSelect = document.getElementById('enquiryCourseSelect');

  window.openEnquiryModal = function(prefillCourse = '') {
    if (!enquiryModal) return;
    // Reset form view
    const form = document.getElementById('enquiryForm');
    const successView = document.getElementById('enquirySuccessView');
    if (form) form.style.display = 'block';
    if (successView) successView.style.display = 'none';

    if (enquiryCourseSelect && prefillCourse) {
      enquiryCourseSelect.value = prefillCourse;
    }
    openModal(enquiryModal);
  };

  document.querySelectorAll('.js-open-enquiry-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const course = btn.getAttribute('data-course') || '';
      window.openEnquiryModal(course);
    });
  });

  // Hook up triggers for Seat Booking Modal
  const seatModal = document.getElementById('seatBookingModal');
  const seatHallSelect = document.getElementById('seatHallSelect');

  window.openSeatModal = function(hallType = 'AC') {
    if (!seatModal) return;
    // Reset form view
    const form = document.getElementById('seatBookingForm');
    const successView = document.getElementById('seatSuccessView');
    if (form) form.style.display = 'block';
    if (successView) successView.style.display = 'none';

    if (seatHallSelect && hallType) {
      seatHallSelect.value = hallType;
    }

    // Set default start date to tomorrow
    const startDateInput = document.getElementById('seatStartDate');
    if (startDateInput && !startDateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      startDateInput.value = tomorrow.toISOString().split('T')[0];
    }

    openModal(seatModal);
  };

  document.querySelectorAll('.js-open-seat-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const hall = btn.getAttribute('data-hall') || 'AC';
      window.openSeatModal(hall);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Form Handling & Interactive Validations                                 */
/* -------------------------------------------------------------------------- */
function initForms() {
  // 6A. Seat Booking Form Submission
  const seatForm = document.getElementById('seatBookingForm');
  const seatSuccessView = document.getElementById('seatSuccessView');
  const seatSuccessName = document.getElementById('seatSuccessName');
  const seatWhatsAppBtn = document.getElementById('seatWhatsAppShareBtn');

  if (seatForm && seatSuccessView) {
    seatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('seatStudentName').value.trim();
      const mobile = document.getElementById('seatMobileNumber').value.trim();
      const category = document.getElementById('seatCategorySelect').value;
      const hall = document.getElementById('seatHallSelect').value;
      const duration = document.getElementById('seatDurationSelect').value;
      const startDate = document.getElementById('seatStartDate').value;
      const message = document.getElementById('seatMessage').value.trim();

      if (!name || !mobile || !category || !hall || !duration || !startDate) {
        alert("Please fill in all mandatory fields before submitting.");
        return;
      }

      if (!/^\+?[0-9]{10,14}$/.test(mobile.replace(/\s+/g, ''))) {
        alert("Please enter a valid mobile number.");
        return;
      }

      // Populate personalized success screen
      if (seatSuccessName) {
        seatSuccessName.textContent = name;
      }

      // Configure WhatsApp share button
      if (seatWhatsAppBtn) {
        const cleanWhatsApp = AVM_CONFIG.whatsapp.replace(/[^0-9]/g, '');
        const waText = `Hello AVM Academy & Library, I am interested in booking an ${hall} study seat.\n\nName: ${name}\nMobile: ${mobile}\nCategory: ${category}\nHall Type: ${hall}\nDuration: ${duration}\nStart Date: ${startDate}${message ? '\nNotes: ' + message : ''}`;
        seatWhatsAppBtn.href = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waText)}`;
      }

      seatForm.style.display = 'none';
      seatSuccessView.style.display = 'block';
    });
  }

  // 6B. Enquiry Modal Form Submission
  const enquiryForm = document.getElementById('enquiryForm');
  const enquirySuccessView = document.getElementById('enquirySuccessView');
  const enquirySuccessName = document.getElementById('enquirySuccessName');
  const enquiryWhatsAppBtn = document.getElementById('enquiryWhatsAppShareBtn');

  if (enquiryForm && enquirySuccessView) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('enquiryName').value.trim();
      const mobile = document.getElementById('enquiryMobile').value.trim();
      const course = document.getElementById('enquiryCourseSelect').value;
      const notes = document.getElementById('enquiryNotes').value.trim();

      if (!name || !mobile || !course) {
        alert("Please fill in all required fields.");
        return;
      }

      if (!/^\+?[0-9]{10,14}$/.test(mobile.replace(/\s+/g, ''))) {
        alert("Please enter a valid mobile number.");
        return;
      }

      if (enquirySuccessName) {
        enquirySuccessName.textContent = name;
      }

      if (enquiryWhatsAppBtn) {
        const cleanWhatsApp = AVM_CONFIG.whatsapp.replace(/[^0-9]/g, '');
        const waText = `Hello AVM Academy & Library, I have an enquiry regarding ${course}.\n\nName: ${name}\nMobile: ${mobile}${notes ? '\nDetails: ' + notes : ''}`;
        enquiryWhatsAppBtn.href = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waText)}`;
      }

      enquiryForm.style.display = 'none';
      enquirySuccessView.style.display = 'block';
    });
  }

  // 6C. Contact Page Inline Form Submission
  const contactForm = document.getElementById('contactPageForm');
  const contactAlert = document.getElementById('contactFormAlert');

  if (contactForm && contactAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const mobile = document.getElementById('contactMobile').value.trim();
      const interest = document.getElementById('contactInterest').value;
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !mobile || !interest) {
        contactAlert.className = 'form-alert-msg is-error';
        contactAlert.textContent = "Please fill in Name, Mobile Number, and Interest Area.";
        return;
      }

      // Success notification
      contactAlert.className = 'form-alert-msg is-success';
      contactAlert.innerHTML = `<strong>Thank you, ${name}!</strong> Your demo enquiry has been submitted successfully. AVM Academy & Library will respond shortly.`;

      contactForm.reset();

      setTimeout(() => {
        contactAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 7. Testimonial / Review Carousel                                           */
/* -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.getElementById('reviewSliderTrack');
  const prevBtn = document.getElementById('reviewPrevBtn');
  const nextBtn = document.getElementById('reviewNextBtn');
  const dotsContainer = document.getElementById('reviewSliderDots');

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll('.review-slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoplayTimer = null;

  // Create dot indicators
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = `slider-dot ${i === 0 ? 'is-active' : ''}`;
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  }

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  };

  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoplay();
  });

  // Autoplay function
  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  };

  const resetAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
    startAutoplay();
  };

  // Pause on hover
  const sliderWrapper = document.querySelector('.review-slider-wrapper');
  if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    sliderWrapper.addEventListener('mouseleave', startAutoplay);
    sliderWrapper.addEventListener('touchstart', () => clearInterval(autoplayTimer), { passive: true });
  }

  startAutoplay();
}

/* -------------------------------------------------------------------------- */
/* 8. Photo Gallery Filtering & Fullscreen Lightbox                           */
/* -------------------------------------------------------------------------- */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!galleryItems.length) return;

  // Filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filterValue = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  // Lightbox functionality
  let currentVisibleItems = [];
  let currentLightboxIdx = 0;

  const updateVisibleGalleryList = () => {
    currentVisibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden'));
  };

  const showLightboxImage = (index) => {
    updateVisibleGalleryList();
    if (!currentVisibleItems.length) return;

    if (index < 0) {
      currentLightboxIdx = currentVisibleItems.length - 1;
    } else if (index >= currentVisibleItems.length) {
      currentLightboxIdx = 0;
    } else {
      currentLightboxIdx = index;
    }

    const item = currentVisibleItems[currentLightboxIdx];
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || img.getAttribute('alt') || 'AVM Academy Gallery';

    if (lightboxImg) lightboxImg.src = img.src;
    if (lightboxImg) lightboxImg.alt = title;
    if (lightboxCaption) lightboxCaption.textContent = title;
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleGalleryList();
      currentLightboxIdx = currentVisibleItems.indexOf(item);
      if (currentLightboxIdx === -1) currentLightboxIdx = 0;

      showLightboxImage(currentLightboxIdx);
      if (lightbox) {
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(currentLightboxIdx - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(currentLightboxIdx + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showLightboxImage(currentLightboxIdx - 1);
    } else if (e.key === 'ArrowRight') {
      showLightboxImage(currentLightboxIdx + 1);
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 9. FAQ Accordion                                                           */
/* -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Optional: Close all other FAQs for accordion behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
        }
      });

      item.classList.toggle('is-open', !isOpen);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 10. Back To Top Floating Button                                            */
/* -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 11. Subtle Scroll Reveal Animations                                        */
/* -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in-element').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in-element').forEach(el => observer.observe(el));
}
