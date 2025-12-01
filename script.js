// ========================================
// VENETIAN ARTIST PORTFOLIO - INTERACTIONS
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initLightbox();
  initSmoothScroll();
  initActiveNavigation();
  initEmailInquiry();
});

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================
function initLightbox() {
  const paintingCards = document.querySelectorAll('.painting-card');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-content img');
  const lightboxTitle = document.querySelector('.lightbox-info h2');
  const lightboxDesc = document.querySelector('.lightbox-info p');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  if (!lightbox) return; // Exit if no lightbox on page
  
  // Open lightbox when clicking on painting card
  paintingCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't open lightbox if clicking on inquiry button
      if (e.target.classList.contains('btn-inquiry') || 
          e.target.closest('.btn-inquiry')) {
        return;
      }
      
      const img = this.querySelector('img');
      const title = this.querySelector('.painting-info h3').textContent;
      const desc = this.querySelector('.painting-info p').textContent;
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });
  
  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ========================================
// EMAIL INQUIRY FUNCTIONALITY
// ========================================
function initEmailInquiry() {
  const inquiryButtons = document.querySelectorAll('.btn-inquiry');
  
  inquiryButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent lightbox from opening
      
      const card = this.closest('.painting-card');
      const title = card.querySelector('.painting-info h3').textContent;
      const desc = card.querySelector('.painting-info p').textContent;
      
      // Compose email
      const email = 'info@pittore-veneziano.it';
      const subject = encodeURIComponent(`Richiesta informazioni: ${title}`);
      const body = encodeURIComponent(
        `Buongiorno,\n\n` +
        `Sono interessato/a al dipinto "${title}".\n` +
        `${desc}\n\n` +
        `Vorrei ricevere maggiori informazioni riguardo:\n` +
        `- Disponibilità\n` +
        `- Prezzo\n` +
        `- Dimensioni\n` +
        `- Tecnica utilizzata\n\n` +
        `Cordiali saluti`
      );
      
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  });
}

// ========================================
// SMOOTH SCROLL FOR NAVIGATION
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only handle anchor links on same page
      if (href === '#' || href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ========================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ========================================
function initActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ========================================
// LAZY LOADING FOR IMAGES (PERFORMANCE)
// ========================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });
  
  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========================================
// FORM VALIDATION (FOR CONTACT PAGE)
// ========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('#name').value.trim();
    const email = this.querySelector('#email').value.trim();
    const message = this.querySelector('#message').value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
      alert('Per favore, compila tutti i campi.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Per favore, inserisci un indirizzo email valido.');
      return;
    }
    
    // Compose mailto link
    const subject = encodeURIComponent('Richiesta di contatto dal sito web');
    const body = encodeURIComponent(
      `Nome: ${name}\n` +
      `Email: ${email}\n\n` +
      `Messaggio:\n${message}`
    );
    
    window.location.href = `mailto:info@pittore-veneziano.it?subject=${subject}&body=${body}`;
  });
}
