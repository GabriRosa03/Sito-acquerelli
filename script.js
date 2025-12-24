// Caricamento dinamico della galleria

// Lightbox state
let currentPaintingIndex = 0;




function loadGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  paintings.forEach((painting, index) => {
    const card = document.createElement('div');
    card.className = 'painting-card';

    const img = document.createElement('img');
    img.src = painting.src;
    img.alt = painting.alt || painting.title;

    // Gestione errore caricamento immagine
    img.onerror = function () {
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-size="16"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';
    };

    const infoDiv = document.createElement('div');
    infoDiv.className = 'painting-info';
    infoDiv.innerHTML = `
            <h3>${painting.title}</h3>
            <p class="painting-description">${painting.description}</p>
            <div class="painting-actions">
                <a href="contatti.html?opera=${encodeURIComponent(painting.title)}" class="btn-contact">Richiedi Informazioni</a>
            </div>
        `;

    card.appendChild(img);
    card.appendChild(infoDiv);

    // Click per aprire lightbox
    img.addEventListener('click', () => {
      openLightbox(index);
    });

    galleryGrid.appendChild(card);
  });
}

// Lightbox
function openLightbox(index) {
  currentPaintingIndex = index;
  const painting = paintings[currentPaintingIndex];

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxInfo = document.getElementById('lightbox-info');

  if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxInfo) return;

  updateLightboxContent(painting);

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightboxContent(painting) {
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxInfo = document.getElementById('lightbox-info');
  const lightboxCounter = document.getElementById('lightbox-counter');

  lightboxImg.src = painting.src;
  lightboxImg.alt = painting.alt || painting.title;
  lightboxTitle.textContent = painting.title;

  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentPaintingIndex + 1} / ${paintings.length}`;
  }
  lightboxInfo.innerHTML = `
    <p>${painting.description}</p>
    <div class="painting-actions" style="justify-content: center; margin-top: 1.5rem;">
        <a href="contatti.html?opera=${encodeURIComponent(painting.title)}" class="btn-contact">Richiedi Informazioni</a>
    </div>
  `;
}

function navigateLightbox(direction) {
  currentPaintingIndex += direction;

  // Wrap around
  if (currentPaintingIndex < 0) {
    currentPaintingIndex = paintings.length - 1;
  } else if (currentPaintingIndex >= paintings.length) {
    currentPaintingIndex = 0;
  }

  updateLightboxContent(paintings[currentPaintingIndex]);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadGallery();

  // Chiudi lightbox
  const lightboxClose = document.querySelector('.lightbox-close');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Navigation Buttons
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing lightbox when clicking button
      navigateLightbox(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing lightbox when clicking button
      navigateLightbox(1);
    });
  }

  // Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      // Prevent body scroll when menu is open
      if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
    const navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Keys navigation
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    } else {
      // Allow escape for menu even if lightbox not active
      const hamburger = document.getElementById('hamburger-btn');
      const mobileNav = document.getElementById('mobile-nav');
      if (e.key === 'Escape') {
        if (hamburger && hamburger.classList.contains('active')) {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    }
  });


  // ========================================
  // BACK TO TOP BUTTON & SMART HEADER
  // ========================================

  // Inject Back to Top Button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.innerHTML = '&#8679;'; // Up arrow
  backToTopBtn.ariaLabel = 'Torna in cima';
  document.body.appendChild(backToTopBtn);

  // Scroll variables
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  const scrollThreshold = 100; // Minimum scroll to show button

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Back to Top Visibility
    if (scrollTop > scrollThreshold) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    // Smart Header (Only on mobile/small screens if requested, but logic here applies generally or can be scoped)
    // The user requested: "header should reappear when user scrolling down a bit but then scrolls up a bit"
    // Apply this logic mainly when the menu is NOT open
    if (!hamburger || !hamburger.classList.contains('active')) {
      if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        // Scrolling Down
        header.classList.add('header-hidden');
      } else {
        // Scrolling Up
        header.classList.remove('header-hidden');
      }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  });

  // Back to Top Action
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

