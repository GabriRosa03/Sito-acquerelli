// Caricamento dinamico della galleria

// Lightbox state
let currentPaintingIndex = 0;




// Helper to get current language keys
function getLangKeys() {
  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : (localStorage.getItem('site_lang') || 'it');
  return {
    titleKey: lang === 'it' ? 'title' : 'title_en',
    descKey: lang === 'it' ? 'description' : 'description_en'
  };
}

function loadGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  // Clear existing content for re-render
  galleryGrid.innerHTML = '';

  const { titleKey, descKey } = getLangKeys();
  // Safe access to translations
  const lang = localStorage.getItem('site_lang') || 'it';
  const btnText = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang]['gallery.btn_contact'] : "Richiedi Informazioni";

  paintings.forEach((painting, index) => {
    const card = document.createElement('div');
    card.className = 'painting-card';

    const img = document.createElement('img');
    // Use thumbnail if available, otherwise full source
    img.src = painting.thumb || painting.src;
    const title = painting[titleKey] || painting.title;
    img.alt = painting.alt || title;
    img.loading = "lazy"; // Lazy loading enabled

    // Gestione errore caricamento immagine
    img.onerror = function () {
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-size="16"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';
    };

    const description = painting[descKey] || painting.description;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'painting-info';

    // Create like button
    const paintingId = likeSystem.getPaintingId(painting);
    const hasLiked = likeSystem.hasUserLiked(paintingId);

    infoDiv.innerHTML = `
            <h3>${title}</h3>
            <p class="painting-description">${description}</p>
            <div class="painting-actions">
                <button class="btn-like ${hasLiked ? 'liked' : ''}" data-painting-id="${paintingId}" data-index="${index}">
                    <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span class="like-count" data-painting-id="${paintingId}">0</span>
                </button>
                <a href="contatti.html?opera=${encodeURIComponent(painting.title)}" class="btn-contact">${btnText}</a>
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

  // Load all likes from Firebase and update counters
  loadAllLikes();

  // Add click listeners to like buttons
  setupLikeButtons();

  // Deep Linking Check
  const urlParams = new URLSearchParams(window.location.search);
  const operaParam = urlParams.get('opera');
  if (operaParam) {
    const paintingIndex = paintings.findIndex(p => p.title === operaParam);
    if (paintingIndex !== -1) {
      openLightbox(paintingIndex);
    }
  }
}

// Like System Functions
async function loadAllLikes() {
  try {
    const allLikes = await likeSystem.getAllLikes();

    // Update all like counters
    Object.keys(allLikes).forEach(paintingId => {
      const count = allLikes[paintingId];
      updateLikeCounter(paintingId, count);
    });

    // Listen for real-time updates
    likeSystem.onAllLikesChange((allLikes) => {
      Object.keys(allLikes).forEach(paintingId => {
        const count = allLikes[paintingId];
        updateLikeCounter(paintingId, count);
      });
    });
  } catch (error) {
    console.error('Errore nel caricamento dei like:', error);
  }
}

function updateLikeCounter(paintingId, count) {
  const counters = document.querySelectorAll(`.like-count[data-painting-id="${paintingId}"]`);
  counters.forEach(counter => {
    counter.textContent = count || 0;
  });
}

function setupLikeButtons() {
  const likeButtons = document.querySelectorAll('.btn-like');

  likeButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.stopPropagation(); // Prevent opening lightbox

      const paintingId = button.dataset.paintingId;
      const paintingIndex = parseInt(button.dataset.index);
      const painting = paintings[paintingIndex];

      // Disable button during request
      button.disabled = true;

      try {
        // Toggle like
        const isNowLiked = await likeSystem.toggleLike(painting);

        // Update button state
        if (isNowLiked) {
          button.classList.add('liked');
          // Heart animation
          button.classList.add('heart-pop');
          setTimeout(() => button.classList.remove('heart-pop'), 300);
        } else {
          button.classList.remove('liked');
        }

        // The counter will be updated automatically by the real-time listener
      } catch (error) {
        console.error('Errore nel toggle del like:', error);
        alert('Errore nel salvare il like. Riprova.');
      } finally {
        button.disabled = false;
      }
    });
  });
}

function setupLightboxLikeButton() {
  const lightboxLikeBtn = document.getElementById('lightbox-like-btn');

  if (lightboxLikeBtn) {
    // Remove old listener if exists
    const newBtn = lightboxLikeBtn.cloneNode(true);
    lightboxLikeBtn.parentNode.replaceChild(newBtn, lightboxLikeBtn);

    newBtn.addEventListener('click', async (e) => {
      e.stopPropagation();

      const paintingId = newBtn.dataset.paintingId;
      const paintingIndex = parseInt(newBtn.dataset.index);
      const painting = paintings[paintingIndex];

      newBtn.disabled = true;

      try {
        const isNowLiked = await likeSystem.toggleLike(painting);

        if (isNowLiked) {
          newBtn.classList.add('liked');
          newBtn.classList.add('heart-pop');
          setTimeout(() => newBtn.classList.remove('heart-pop'), 300);
        } else {
          newBtn.classList.remove('liked');
        }
      } catch (error) {
        console.error('Errore nel toggle del like:', error);
        alert('Errore nel salvare il like. Riprova.');
      } finally {
        newBtn.disabled = false;
      }
    });
  }
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

  const { titleKey, descKey } = getLangKeys();
  const title = painting[titleKey] || painting.title;
  const description = painting[descKey] || painting.description;

  // Buttons text
  const lang = localStorage.getItem('site_lang') || 'it';
  const btnContactText = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang]['gallery.btn_contact'] : "Richiedi Informazioni";
  const btnShareText = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang]['gallery.btn_share'] : "Condividi";

  lightboxImg.src = painting.src;
  lightboxImg.alt = painting.alt || title;
  lightboxTitle.textContent = title;

  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentPaintingIndex + 1} / ${paintings.length}`;
  }

  // Get like info
  const paintingId = likeSystem.getPaintingId(painting);
  const hasLiked = likeSystem.hasUserLiked(paintingId);

  lightboxInfo.innerHTML = `
    <p>${description}</p>
    <div class="painting-actions" style="justify-content: center; margin-top: 1.5rem;">
        <button class="btn-like ${hasLiked ? 'liked' : ''}" data-painting-id="${paintingId}" data-index="${currentPaintingIndex}" id="lightbox-like-btn">
            <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="like-count" data-painting-id="${paintingId}">0</span>
        </button>
        <a href="contatti.html?opera=${encodeURIComponent(painting.title)}" class="btn-contact">${btnContactText}</a>
    </div>
  `;

  // Setup like button in lightbox
  setupLightboxLikeButton();
}

function sharePainting(displayTitle, originalTitle) {
  // Use originalTitle for ID param if available, else fallback
  const shareUrl = window.location.origin + window.location.pathname + '?opera=' + encodeURIComponent(originalTitle || displayTitle);

  const lang = localStorage.getItem('site_lang') || 'it';
  let shareText = `Ehi guarda che bel quadro di Davide Rosa: "${displayTitle}"`;

  if (lang === 'en') {
    shareText = `Hey check out this beautiful painting by Davide Rosa: "${displayTitle}"`;
  }

  const fullText = `${shareText}\n${shareUrl}`;

  // Web Share API
  if (navigator.share) {
    navigator.share({
      title: displayTitle,
      text: fullText,
      // Leaving 'url' empty to force WhatsApp/others to use the 'text' field which contains the URL.
      // This solves the issue where WhatsApp ignores 'text' if 'url' is present.
    })
      .then(() => console.log('Condiviso con successo'))
      .catch((error) => console.log('Errore nella condivisone:', error));
  } else {
    // Fallback WhatsApp (api.whatsapp.com is more reliable than wa.me for text+links)
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(waUrl, '_blank');
  }
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

  // ========================================
  // SERVICE WORKER REGISTRATION (Cache system)
  // ========================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }

  // ========================================
  // MOBILE SHARE BUTTON LISTENER
  // ========================================
  const mobileShareBtn = document.getElementById('lightbox-share-mobile');
  if (mobileShareBtn) {
    mobileShareBtn.addEventListener('click', (e) => {
      // Prevent bubbling if necessary, though it's separate from content
      e.stopPropagation();

      // Use currentPaintingIndex to get title
      if (typeof currentPaintingIndex !== 'undefined' && paintings[currentPaintingIndex]) {
        sharePainting(paintings[currentPaintingIndex].title);
      }
    });
  }

  // ========================================
  // IMAGE PROTECTION (No Right Click / No Drag)
  // ========================================
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
});

