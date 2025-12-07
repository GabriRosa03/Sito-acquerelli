// Caricamento dinamico della galleria
function loadGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  paintings.forEach(painting => {
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
      openLightbox(painting);
    });

    galleryGrid.appendChild(card);
  });
}

// Lightbox
function openLightbox(painting) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxInfo = document.getElementById('lightbox-info');

  if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxInfo) return;

  lightboxImg.src = painting.src;
  lightboxImg.alt = painting.alt || painting.title;
  lightboxTitle.textContent = painting.title;
  lightboxInfo.innerHTML = `<p>${painting.description}</p>`;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
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

  // Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburger-btn');
  const nav = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      // Prevent body scroll when menu is open
      if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      // Also close menu
      if (hamburger && hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
});
