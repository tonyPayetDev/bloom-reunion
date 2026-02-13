/* ============================================
   BLOOM RÉUNION - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    // Trigger on load if already scrolled
    if (window.scrollY > 50) navbar.classList.add('scrolled');
  }

  // === MOBILE MENU TOGGLE ===
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // === HERO PARTICLES ===
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
    }
  }

  // === COUNTDOWN TIMER ===
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    // Set event date — update this for next event
    const eventDate = new Date('2026-05-10T10:00:00+04:00').getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = eventDate - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<div class="countdown-item"><span class="number">C\'est</span><span class="label">Aujourd\'hui !</span></div>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdownEl.innerHTML = `
        <div class="countdown-item">
          <span class="number">${days}</span>
          <span class="label">Jours</span>
        </div>
        <div class="countdown-item">
          <span class="number">${String(hours).padStart(2, '0')}</span>
          <span class="label">Heures</span>
        </div>
        <div class="countdown-item">
          <span class="number">${String(minutes).padStart(2, '0')}</span>
          <span class="label">Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="number">${String(seconds).padStart(2, '0')}</span>
          <span class="label">Secondes</span>
        </div>
      `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // === PROGRAMME TABS ===
  const programmeTabs = document.querySelectorAll('.programme-tab');
  const programmeContents = document.querySelectorAll('.programme-content');
  programmeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      programmeTabs.forEach(t => t.classList.remove('active'));
      programmeContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // === SCROLL REVEAL ANIMATIONS ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // === FAQ ACCORDION ===
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('active');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });
        // Open clicked
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // === PRESTATAIRES FILTER ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const prestaCards = document.querySelectorAll('.prestataire-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      prestaCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.5s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // === BOOKING MODAL ===
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-overlay');
  const bookingBtns = document.querySelectorAll('[data-booking]');

  let currentBooking = {
    type: '',
    price: 0,
    quantity: 1
  };

  if (bookingBtns.length > 0 && modalOverlay) {
    bookingBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.booking;
        const price = parseFloat(btn.dataset.price);
        const name = btn.dataset.name;

        currentBooking = { type, price, quantity: 1, name };
        updateBookingSummary();
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    modalCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target === btn) {
          modalOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Prevent modal content from closing when clicked
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  // Quantity controls
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus = document.querySelector('.qty-plus');
  const qtyValue = document.querySelector('.quantity-value');

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (currentBooking.quantity > 1) {
        currentBooking.quantity--;
        updateBookingSummary();
      }
    });
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (currentBooking.quantity < 10) {
        currentBooking.quantity++;
        updateBookingSummary();
      }
    });
  }

  function updateBookingSummary() {
    const nameEl = document.getElementById('booking-name');
    const priceEl = document.getElementById('booking-price');
    const totalEl = document.getElementById('booking-total');
    const qtyEl = document.querySelector('.quantity-value');

    if (nameEl) nameEl.textContent = currentBooking.name || '';
    if (priceEl) priceEl.textContent = currentBooking.price.toFixed(2) + ' €';
    if (qtyEl) qtyEl.textContent = currentBooking.quantity;
    if (totalEl) totalEl.textContent = (currentBooking.price * currentBooking.quantity).toFixed(2) + ' €';
  }

  // === BOOKING FORM SUBMIT ===
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(bookingForm);
      const data = {
        ...currentBooking,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
      };

      // Simulate booking confirmation
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <div style="text-align: center; padding: 2rem 0;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">&#10003;</div>
            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1rem;">Réservation Confirmée !</h3>
            <p style="color: #666; margin-bottom: 0.5rem;">Merci <strong>${data.firstName}</strong> !</p>
            <p style="color: #666; margin-bottom: 1.5rem;">Un email de confirmation a été envoyé à <strong>${data.email}</strong></p>
            <div style="background: #FDF2F0; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem;">
              <p><strong>${data.name}</strong></p>
              <p>${data.quantity} billet(s) - Total : ${(data.price * data.quantity).toFixed(2)} €</p>
            </div>
            <p style="font-size: 0.85rem; color: #999;">Vous recevrez votre e-billet par email sous 24h.</p>
          </div>
        `;
      }
    });
  }

  // === CONTACT FORM ===
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Envoyé !';
      btn.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // === SMOOTH SCROLL FOR ANCHORS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navH = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // === ACTIVE NAV LINK BASED ON CURRENT PAGE ===
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '/' && linkPath === 'index.html') || currentPath.endsWith(linkPath)) {
      link.classList.add('active');
    }
  });

});
