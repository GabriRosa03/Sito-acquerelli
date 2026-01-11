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

  // Show loading overlay
  const loadingOverlay = document.getElementById('gallery-loading');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
  }

  let loadedCount = 0;
  const totalImages = paintings.length;

  paintings.forEach((painting, index) => {
    const card = document.createElement('div');
    card.className = 'painting-card';

    const img = document.createElement('img');
    const title = painting[titleKey] || painting.title;

    // Create Image Container (for Hover Overlay)
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    imgContainer.style.position = 'relative';
    imgContainer.style.overflow = 'hidden';
    imgContainer.style.borderRadius = '8px';

    // Use thumbnail if available, otherwise full source
    img.src = painting.thumb || painting.src;
    img.alt = painting.alt || title;

    // Optimized Loading Strategy: Load first 6 eagerly, others lazy
    img.loading = index < 6 ? "eager" : "lazy";

    // Handle Image Load - Hide loading when first images are ready
    img.onload = function () {
      loadedCount++;
      // Hide loading overlay after first 6 images are loaded
      if (loadedCount >= 6 && loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
        }, 300);
      }
    };

    // Gestione errore caricamento immagine
    img.onerror = function () {
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-size="16"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';
      loadedCount++;
      if (loadedCount >= 6 && loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
        }, 300);
      }
    };

    // Display dimensions instead of description with explicit labels
    let description = "";
    if (painting.dimensions) {
      const isEn = lang === 'en';
      const widthLabel = isEn ? 'Width' : 'Larghezza';
      const heightLabel = isEn ? 'Height' : 'Altezza';
      description = `${widthLabel}: ${painting.dimensions.width} cm | ${heightLabel}: ${painting.dimensions.height} cm`;
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'painting-info';

    // Create like button
    const paintingId = likeSystem.getPaintingId(painting);
    const hasLiked = likeSystem.hasUserLiked(paintingId);

    const hoverOverlay = document.createElement('div');
    hoverOverlay.className = 'hover-overlay';
    hoverOverlay.innerHTML = `
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
        <span>SCOPRI</span>
    `;

    imgContainer.appendChild(img);
    imgContainer.appendChild(hoverOverlay);

    // Click on overlay to open lightbox
    hoverOverlay.addEventListener('click', () => {
      openLightbox(index);
    });

    // Universal Info Block (Title + Likes)
    infoDiv.innerHTML = `
      <h3>${title}</h3>
      <div class="card-likes-wrapper">
          <button class="btn-like ${hasLiked ? 'liked' : ''}" data-painting-id="${paintingId}" data-index="${index}" aria-label="Mi piace">
              <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="like-count" data-painting-id="${paintingId}">0</span>
          </button>
      </div>
    `;

    card.appendChild(imgContainer);
    card.appendChild(infoDiv);

    // Click per aprire lightbox
    img.addEventListener('click', () => {
      openLightbox(index);
    });

    // Click on title to open lightbox
    const titleEl = infoDiv.querySelector('h3');
    if (titleEl) {
      titleEl.style.cursor = 'pointer';
      titleEl.addEventListener('click', () => {
        openLightbox(index);
      });
    }

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
    const paintingIndex = paintings.findIndex(p => {
      const { titleKey } = getLangKeys();
      const pTitle = p[titleKey] || p.title;
      return pTitle === operaParam || p.title === operaParam;
    });
    if (paintingIndex !== -1) {
      // Use a flag to avoid pushState during initial load
      window.isInitialDeepLink = true;
      openLightbox(paintingIndex);
      window.isInitialDeepLink = false;
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
  const safeCount = count || 0;

  // Standard buttons
  const counters = document.querySelectorAll(`.like-count[data-painting-id="${paintingId}"]`);
  counters.forEach(counter => {
    counter.textContent = safeCount;
  });

  // Mobile indicators (previously mobile-like-indicator, now inline)
  // Our new structure uses .like-count inside .mobile-heart-display which has data-painting-id.
  // The above selector `.like-count[data-painting-id="${paintingId}"]` ALREADY catches the span inside the mobile div 
  // because I added the data attribute to the SPAN in the new HTML.
  // So no extra code needed here for the number.
}

function setupLikeButtons() {
  const likeButtons = document.querySelectorAll('.btn-like');

  likeButtons.forEach(button => {
    // Avoid double binding if called multiple times, though here it's called once per load
    button.removeEventListener('click', handleLikeClick);
    button.addEventListener('click', handleLikeClick);
  });
}

// Extracted handler to use for both grid and lightbox buttons
async function handleLikeClick(e) {
  e.stopPropagation(); // Prevent opening lightbox

  const button = e.currentTarget;
  const paintingId = button.dataset.paintingId;
  const paintingIndex = parseInt(button.dataset.index);
  const painting = paintings[paintingIndex];

  // Disable button during request
  button.disabled = true;

  try {
    // Toggle like
    const isNowLiked = await likeSystem.toggleLike(painting);

    // Update button state (find ALL buttons for this painting to sync them)
    // Select both .btn-like AND .mobile-heart-display
    const relatedButtons = document.querySelectorAll(`.btn-like[data-painting-id="${paintingId}"], .mobile-heart-display[data-painting-id="${paintingId}"]`);

    // Pass isNowLiked: true for Like, false for Unlike
    triggerLikeCelebration(button, isNowLiked);

    relatedButtons.forEach(btn => {
      if (isNowLiked) {
        btn.classList.add('liked');
        // Only add animation to interactive buttons
        if (btn.classList.contains('btn-like')) {
          btn.classList.add('heart-pop');
          setTimeout(() => btn.classList.remove('heart-pop'), 300);
        }
      } else {
        btn.classList.remove('liked');
      }
    });

    // The counter will be updated automatically by the real-time listener
  } catch (error) {
    console.error('Errore nel toggle del like:', error);
    alert('Errore nel salvare il like. Riprova.');
  } finally {
    button.disabled = false;
  }
}

function setupLightboxLikeButton() {
  // Re-bind all like buttons, including new ones in lightbox
  const likeButtons = document.querySelectorAll('#lightbox .btn-like');
  likeButtons.forEach(button => {
    button.removeEventListener('click', handleLikeClick);
    button.addEventListener('click', handleLikeClick);
  });
}

// Lightbox
function openLightbox(index) {
  currentPaintingIndex = index;
  const painting = paintings[currentPaintingIndex];

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxInfo = document.getElementById('lightbox-info'); // This is the inner container div

  if (!lightbox || !lightboxImg || !lightboxTitle) return;

  updateLightboxContent(painting);

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Immersive Mode: Ensure header is hidden if we want full immersion, 
  // but CSS fullscreen handles most.

  // Add history state for back button support and SEO-friendly URL
  const { titleKey } = getLangKeys();
  const paintingTitle = painting[titleKey] || painting.title;
  const newUrl = window.location.origin + window.location.pathname + '?opera=' + encodeURIComponent(paintingTitle);

  if (window.isInitialDeepLink) {
    history.replaceState({ lightboxOpen: true, paintingIndex: index }, '', newUrl);
  } else {
    history.pushState({ lightboxOpen: true, paintingIndex: index }, '', newUrl);
  }
}

function updateLightboxContent(painting) {
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxCounter = document.getElementById('lightbox-counter');

  // New Layout Elements
  const likeContainer = document.getElementById('lightbox-like-container');
  const shareBtn = document.getElementById('lightbox-share-btn');
  const ctaBtn = document.getElementById('lightbox-cta');

  const { titleKey } = getLangKeys();
  const title = painting[titleKey] || painting.title;
  // const description = painting[descKey] || painting.description;

  // Buttons text
  const lang = localStorage.getItem('site_lang') || 'it';

  let description = "";
  if (painting.dimensions) {
    const isEn = lang === 'en';
    const widthLabel = isEn ? 'Width' : 'Larghezza';
    const heightLabel = isEn ? 'Height' : 'Altezza';
    description = `${widthLabel}: ${painting.dimensions.width} cm | ${heightLabel}: ${painting.dimensions.height} cm`;
  }

  const btnContactText = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang]['gallery.btn_contact'] : "Richiedi Informazioni";

  lightboxImg.src = painting.src;
  lightboxImg.alt = painting.alt || title;

  // Reset Zoom
  lightboxImg.classList.remove('zoomed');
  lightboxImg.style.transform = '';

  lightboxTitle.textContent = title;

  // Populate Description (which is now DIMENSIONS)
  if (lightboxDescription) {
    lightboxDescription.textContent = description;
    lightboxDescription.style.fontStyle = 'italic'; // Add styling to make it look nicer
  }

  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentPaintingIndex + 1} / ${paintings.length}`;
  }

  // Get like info
  const paintingId = likeSystem.getPaintingId(painting);
  const hasLiked = likeSystem.hasUserLiked(paintingId);

  // Update Like Button in Secondary Nav
  if (likeContainer) {
    likeContainer.innerHTML = `
        <button class="btn-like ${hasLiked ? 'liked' : ''}" data-painting-id="${paintingId}" data-index="${currentPaintingIndex}">
            <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="like-count" data-painting-id="${paintingId}">...</span>
        </button>
      `;
  }

  // Update CTA Button
  if (ctaBtn) {
    ctaBtn.href = `contatti.html?opera=${encodeURIComponent(painting.title)}`;
    ctaBtn.textContent = btnContactText;
  }

  // Bind Share Button (Mobile Only)
  const shareBtnDesktop = document.getElementById('lightbox-share-btn-desktop');

  if (shareBtn) {
    shareBtn.onclick = (e) => {
      e.stopPropagation();
      sharePainting(title);
    };
  }

  // Desktop share button is handled by persistent listener in loadGallery()
  // to avoid OS dialog and enable copy action.

  // Detect vertical painting and optimize layout
  lightboxImg.onload = () => {
    const isVertical = lightboxImg.naturalHeight > lightboxImg.naturalWidth * 1.3;
    const lightboxContent = document.querySelector('.lightbox-content');

    if (isVertical) {
      lightboxImg.classList.add('vertical-painting');
      if (lightboxContent) {
        lightboxContent.classList.add('has-vertical-painting');
      }
    } else {
      lightboxImg.classList.remove('vertical-painting');
      if (lightboxContent) {
        lightboxContent.classList.remove('has-vertical-painting');
      }
    }
  };

  // Refresh counters immediately
  likeSystem.getLikes(painting).then(c => updateLikeCounter(paintingId, c));

  // Setup listeners for NEW buttons
  setupLightboxLikeButton();

  // Sync address bar URL if lightbox is already active (navigation)
  const lightbox = document.getElementById('lightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    const newUrl = window.location.origin + window.location.pathname + '?opera=' + encodeURIComponent(title);
    history.replaceState({ lightboxOpen: true, paintingIndex: currentPaintingIndex }, '', newUrl);
  }
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

  // Add closing class to trigger animation
  const scrollContainer = lightbox.querySelector('.lightbox-scroll-container');
  const sidebar = document.getElementById('lightbox-sidebar-action');

  if (sidebar) {
    sidebar.classList.add('closing');
  }

  if (scrollContainer) {
    scrollContainer.classList.add('closing');

    // Wait for animation to finish (400ms match CSS)
    setTimeout(() => {
      lightbox.classList.remove('active');
      scrollContainer.classList.remove('closing');
      if (sidebar) sidebar.classList.remove('closing');
      document.body.style.overflow = '';
    }, 500); // Increased to 500ms to match CSS transition
  } else {
    // Fallback if structure not found
    lightbox.classList.remove('active');
    if (sidebar) sidebar.classList.remove('closing');
    document.body.style.overflow = '';
  }

  // Handle History State
  if (history.state && history.state.lightboxOpen) {
    history.back();
  } else if (window.location.hash === '#lightbox') {
    // Clean up hash if present differently
    history.back();
  }
}

function openRoomView() {
  const overlay = document.getElementById('room-view-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const paintingOnWall = document.getElementById('painting-on-wall');

  if (overlay && lightboxImg && paintingOnWall) {
    const painting = paintings[currentPaintingIndex];
    paintingOnWall.src = lightboxImg.src;
    overlay.classList.add('active');

    // Reset position and calculate proportional scale
    const container = document.querySelector('.painting-on-wall-container');
    if (container) {
      container.style.top = '40%';
      container.style.left = '50%';

      // Calculate REAL proportional dimensions based on cm measurements
      let width = 31; // default fallback (increased from 30)
      let height = 'auto'; // default

      if (painting.dimensions) {
        // TRUE PROPORTIONAL SCALING
        // Use a reference scale: 1 cm = 0.8% of viewport width
        // This ensures paintings maintain their real proportions
        const scaleFactor = 0.97; // % of viewport width per cm (increased from 0.8)

        // Calculate both width and height based on real cm dimensions
        const realWidth = painting.dimensions.width * scaleFactor;
        const realHeight = painting.dimensions.height * scaleFactor;

        // Clamp width between 15% and 60% of screen width
        width = Math.max(15, Math.min(realWidth, 60));

        // Calculate proportional height maintaining the REAL aspect ratio
        // If width was clamped, adjust height proportionally
        const widthRatio = width / realWidth;
        height = realHeight * widthRatio;

        // Set both dimensions to maintain real proportions
        container.style.width = `${width}%`;
        container.style.height = `${height}%`;
      } else {
        container.style.width = `${width}%`;
        container.style.height = 'auto';
      }
    }

    // Update room info with dimensions
    updateRoomViewInfo();

    // Initialize touch interactions for the room view
    initRoomViewInteractions();
  }
}

function closeRoomView() {
  const overlay = document.getElementById('room-view-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function updateRoomViewInfo() {
  const painting = paintings[currentPaintingIndex];
  const dimensionsElement = document.getElementById('room-dimensions');

  if (painting.dimensions && dimensionsElement) {
    const lang = localStorage.getItem('site_lang') || 'it';
    const isEn = lang === 'en';

    // Format: "Larghezza: 40 cm  |  Altezza: 30 cm"
    const widthLabel = isEn ? 'Width' : 'Larghezza';
    const heightLabel = isEn ? 'Height' : 'Altezza';

    const dimensionText = `${widthLabel}: ${painting.dimensions.width} cm &nbsp;&nbsp;|&nbsp;&nbsp; ${heightLabel}: ${painting.dimensions.height} cm`;
    dimensionsElement.innerHTML = dimensionText;
  }
}

let roomViewInteractionsInitialized = false;

function initRoomViewInteractions() {
  if (roomViewInteractionsInitialized) return; // Prevent multiple bindings

  // Background Switching Logic
  const bgOptions = document.querySelectorAll('.room-bg-option');
  const roomBgImage = document.getElementById('room-bg-image');

  if (bgOptions.length > 0 && roomBgImage) {
    bgOptions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing if we add close-on-click-outside later

        // Remove active class from all
        bgOptions.forEach(b => b.classList.remove('active'));

        // Add active to current
        // If clicked on image inside button
        const targetBtn = e.currentTarget;
        targetBtn.classList.add('active');

        // Update background image
        const newSrc = targetBtn.dataset.bg;
        if (newSrc) {
          // Preload/Swap
          roomBgImage.style.opacity = '0.5'; // Fade out slightly
          setTimeout(() => {
            roomBgImage.src = newSrc;
            roomBgImage.onload = () => {
              roomBgImage.style.opacity = '1';
            };
            // Fallback if cached
            if (roomBgImage.complete) roomBgImage.style.opacity = '1';
          }, 150);
        }
      });
    });
  }

  // Dragging functionality has been disabled as per user request.
  // This function is kept to avoid breaking calls from other parts of the code.

  roomViewInteractionsInitialized = true;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');

  console.log('Hamburger initialization:', {
    foundHamburger: !!hamburger,
    foundMobileNav: !!mobileNav,
    currentPage: window.location.pathname
  });

  if (hamburger && mobileNav) {
    // Dynamically create overlay if it doesn't exist
    let overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-nav-overlay';
      // Insert as first child so it's behind header in DOM order
      document.body.insertBefore(overlay, document.body.firstChild);
    }

    function toggleMenu() {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      overlay.classList.toggle('active');

      const isActive = mobileNav.classList.contains('active');
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking overlay (the darkened area)
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    const navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  } else {
    console.warn('Hamburger or MobileNav NOT found on this page!');
  }

  loadGallery();

  // Chiudi lightbox
  const lightboxClose = document.getElementById('lightbox-close-btn');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Sidebar Close Action (Desktop)
  const lightboxSidebar = document.getElementById('lightbox-sidebar-action');
  if (lightboxSidebar) {
    lightboxSidebar.addEventListener('click', closeLightbox);
  }

  // Room View Button
  const roomViewBtn = document.getElementById('lightbox-room-btn');
  const roomViewBtnDesktop = document.getElementById('lightbox-room-btn-desktop');

  if (roomViewBtn) {
    roomViewBtn.addEventListener('click', openRoomView);
  }
  if (roomViewBtnDesktop) {
    roomViewBtnDesktop.addEventListener('click', openRoomView);
  }

  // Room View Close
  const roomViewClose = document.getElementById('room-view-close');
  if (roomViewClose) {
    roomViewClose.addEventListener('click', closeRoomView);
  }

  // Desktop Share Button - Copy Link
  const shareBtnDesktop = document.getElementById('lightbox-share-btn-desktop');
  if (shareBtnDesktop) {
    shareBtnDesktop.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        // Copy current URL to clipboard
        await navigator.clipboard.writeText(window.location.href);

        // Visual feedback: add 'copied' class
        shareBtnDesktop.classList.add('copied');

        // Remove class after 2 seconds
        setTimeout(() => {
          shareBtnDesktop.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
        // Fallback: try older method
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        shareBtnDesktop.classList.add('copied');
        setTimeout(() => {
          shareBtnDesktop.classList.remove('copied');
        }, 2000);
      }
    });
  }

  // History API - Back button closes lightbox
  window.addEventListener('popstate', (event) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      const scrollContainer = lightbox.querySelector('.lightbox-scroll-container');
      const sidebar = document.getElementById('lightbox-sidebar-action');

      if (scrollContainer && !scrollContainer.classList.contains('closing')) {
        scrollContainer.classList.add('closing');
        if (sidebar) sidebar.classList.add('closing');

        setTimeout(() => {
          lightbox.classList.remove('active');
          scrollContainer.classList.remove('closing');
          if (sidebar) sidebar.classList.remove('closing');
          document.body.style.overflow = '';
        }, 500); // Unified to 500ms
      } else if (!scrollContainer) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  // Pinch & Zoom state
  let initialDistance = 0;
  let currentScale = 1;
  let isPinching = false;

  if (lightbox && lightboxImg) {
    // Re-enable "Click outside to close" for the new Desktop Layout (Left side backdrop)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Touch events for Pinch zoom on mobile lightbox
    lightbox.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        isPinching = true;
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      }
    }, { passive: false });

    lightbox.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && isPinching) {
        e.preventDefault(); // Prevent page scroll while zooming
        const currentDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );

        // Limit zoom
        let scaleDiff = currentDistance / initialDistance;
        let newScale = Math.max(1, Math.min(currentScale * scaleDiff, 3));

        if (lightboxImg) {
          lightboxImg.style.transform = `scale(${newScale})`;
        }
      }
    }, { passive: false });

    // Double-tap to Like functionality
    let lastTap = 0;
    const doubleTapDelay = 300; // ms

    lightboxImg.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < doubleTapDelay && tapLength > 0) {
        // Double tap detected!
        e.preventDefault();
        handleDoubleTapLike();
        lastTap = 0; // Reset to avoid triple-tap
      } else {
        lastTap = currentTime;
      }
    });

    function handleDoubleTapLike() {
      const likeBtn = document.querySelector('#lightbox-like-container .btn-like');
      if (!likeBtn) return;

      // Check current like state BEFORE clicking
      const wasLiked = likeBtn.classList.contains('liked');

      // Trigger like action
      likeBtn.click();

      // Show animated heart overlay with appropriate color
      showLikeAnimation(!wasLiked); // Pass new state
    }

    function showLikeAnimation(isLiked) {
      const likeBtn = document.querySelector('#lightbox-like-container .btn-like');
      triggerLikeCelebration(likeBtn || document.body, isLiked);
    }
  }

  // Magnifying Glass functionality
  let magnifier = null;
  let isMagnifying = false;

  if (lightboxImg) {
    lightboxImg.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && !isPinching) {
        // Single finger touch - activate magnifier
        createMagnifier();
        updateMagnifier(e.touches[0]);
      }
    });

    lightboxImg.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && magnifier && !isPinching) {
        e.preventDefault();
        updateMagnifier(e.touches[0]);
      }
    });

    lightboxImg.addEventListener('touchend', () => {
      removeMagnifier();
    });

    // MOUSE SUPPORT (Desktop Zoom - Hover)
    lightboxImg.addEventListener('mouseenter', () => {
      createMagnifier();
    });

    lightboxImg.addEventListener('mouseleave', () => {
      removeMagnifier();
    });

    lightboxImg.addEventListener('mousemove', (e) => {
      // Track movement only if magnifier exists
      if (isMagnifying && magnifier) {
        e.preventDefault();
        updateMagnifier(e);
      }
    });
  }

  // Window listeners removed as we only care about hovering the image directly


  function createMagnifier() {
    if (magnifier) return;

    magnifier = document.createElement('div');
    magnifier.className = 'magnifier-lens';

    const imageContainer = document.querySelector('.lightbox-image-container');
    if (imageContainer) {
      imageContainer.appendChild(magnifier);
      isMagnifying = true;
    }
  }

  function updateMagnifier(touch) {
    if (!magnifier || !lightboxImg) return;

    const rect = lightboxImg.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Larger magnifier size
    const lensSize = 170;
    const offset = 80; // Distance from finger

    // Direct position is the touch point (snappy follow)
    magnifier.style.left = `${x}px`;
    magnifier.style.top = `${y}px`;

    // Calculate actual rendered image dimensions (handling object-fit: contain)
    const naturalRatio = lightboxImg.naturalWidth / lightboxImg.naturalHeight;
    const boxWidth = rect.width;
    const boxHeight = rect.height;
    const boxRatio = boxWidth / boxHeight;

    let renderedWidth, renderedHeight;
    let imgOffsetX = 0;
    let imgOffsetY = 0;

    if (naturalRatio > boxRatio) {
      // Image is constrained by width, has bars top/bottom
      renderedWidth = boxWidth;
      renderedHeight = boxWidth / naturalRatio;
      imgOffsetY = (boxHeight - renderedHeight) / 2;
    } else {
      // Image is constrained by height, has bars left/right
      renderedHeight = boxHeight;
      renderedWidth = boxHeight * naturalRatio;
      imgOffsetX = (boxWidth - renderedWidth) / 2;
    }

    // Adjust touch coordinates relative to the actual painting content
    const contentX = x - imgOffsetX;
    const contentY = y - imgOffsetY;

    // Calculate the offset based on side
    const isRightSide = x > rect.width / 2;
    let targetOffsetX, targetOffsetY;

    // Check if it's a mouse event (closer to cursor, no side flipping)
    const isMouse = touch instanceof MouseEvent;

    if (isMouse) {
      // DESKTOP: Quadrant Logic to keep lens on screen
      const isTopHalf = y < rect.height / 2;

      // Horizontal Logic (Left/Right flip)
      if (isRightSide) {
        // Cursor on Right -> Lens on Left
        // User requested more detachment (was 15px, increasing to 30px)
        targetOffsetX = -lensSize - 30;
      } else {
        // Cursor on Left -> Lens on Right
        targetOffsetX = 30;
      }

      // Vertical Logic (Top/Bottom flip)
      if (isTopHalf) {
        // Cursor on Top -> Lens Below
        // Position 30px below cursor
        targetOffsetY = 30;
      } else {
        // Cursor on Bottom -> Lens Above
        // Position bottom of lens 30px above cursor
        targetOffsetY = -lensSize - 30;
      }
    } else {
      // MOBILE: Offset to avoid finger obstruction
      if (isRightSide) {
        targetOffsetX = -lensSize - offset;
      } else {
        targetOffsetX = offset;
      }
      // Vertical offset: slightly above the finger center
      targetOffsetY = -lensSize / 2 - offset;
    }

    // Boundary clamping: ensure the lens stays within the image rectangle
    // Adjust min/max based on the calculated target offsets relative to cursor X/Y?
    // Actually, standard clamping is complex with offsets. 
    // Let's just keep the lens fully visible if possible, or allow it to go to edge.
    // For now, relax clamping for mouse to ensure smooth tracking
    if (!isMouse) {
      const minOffsetX = -x;
      const maxOffsetX = rect.width - lensSize - x;
      const minOffsetY = -y;
      const maxOffsetY = rect.height - lensSize - y;

      targetOffsetX = Math.max(minOffsetX, Math.min(targetOffsetX, maxOffsetX));
      targetOffsetY = Math.max(minOffsetY, Math.min(targetOffsetY, maxOffsetY));
    }

    // Update CSS variables for the smooth transform transition (defined in CSS)
    magnifier.style.setProperty('--offset-x', `${targetOffsetX}px`);
    magnifier.style.setProperty('--offset-y', `${targetOffsetY}px`);

    // Calculate background position relative to actual content for 3x zoom
    const bgX = -contentX * 3 + lensSize / 2;
    const bgY = -contentY * 3 + lensSize / 2;

    magnifier.style.backgroundImage = `url('${lightboxImg.src}')`;
    magnifier.style.backgroundSize = `${renderedWidth * 3}px ${renderedHeight * 3}px`;
    magnifier.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }

  function removeMagnifier() {
    if (magnifier) {
      magnifier.remove();
      magnifier = null;
      isMagnifying = false;
    }
  }

  if (lightbox) {
    lightbox.addEventListener('touchend', (e) => {
      if (isPinching) {
        // Reset Zoom on release for creating a "Lens" feel, or stay zoomed?
        // Current logic: Reset to avoid complex panning logic.
        if (e.touches.length < 2) {
          isPinching = false;
          if (lightboxImg) {
            lightboxImg.style.transform = '';
            lightboxImg.classList.remove('zoomed');
            currentScale = 1;
          }
        }
        return;
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



  // Keys navigation
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    } else {
      // Allow escape for menu even if lightbox not active
      const ham = document.getElementById('hamburger-btn');
      const mob = document.getElementById('mobile-nav');
      if (e.key === 'Escape') {
        if (ham && ham.classList.contains('active')) {
          ham.classList.remove('active');
          mob.classList.remove('active');
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
  backToTopBtn.innerHTML = '<img src="images/arrowUp.svg" alt="Scroll to top" style="width: 19px; height: 19px; opacity: 0.8;">';
  backToTopBtn.ariaLabel = 'Torna in cima';
  document.body.appendChild(backToTopBtn);

  // Scroll variables
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  const scrollThreshold = 100; // Minimum scroll to show button

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollBottom = documentHeight - (scrollTop + windowHeight);

    // Hide button when near bottom of page (within 200px of footer)
    const bottomThreshold = 200;

    // Back to Top Visibility
    if (scrollTop > scrollThreshold && scrollBottom > bottomThreshold) {
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


  // ========================================
  // IMAGE PROTECTION (No Right Click / No Drag)
  // ========================================
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

});

// Like Celebration Animation Utility (Elegant & Minimal)
function triggerLikeCelebration(originNode, isLiked = true) {
  if (!originNode) return;

  const isLightbox = !!originNode.closest('#lightbox');
  const container = isLightbox ? document.querySelector('.lightbox-image-container') : document.body;
  if (!container) return;

  const overlay = document.createElement('div');
  overlay.className = `like-overlay-elegant ${!isLiked ? 'unlike-celebration' : ''}`;

  if (isLiked) {
    overlay.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
      </svg>
    `;
  } else {
    // Beautiful simplified broken heart (split in two halves)
    overlay.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="broken-heart-svg">
        <path class="heart-half-left" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09L12 8.5V21.35z" fill="currentColor"/>
        <path class="heart-half-right" d="M12 21.35V8.5c1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
      </svg>
    `;
  }

  // Center it in the container
  container.appendChild(overlay);

  // Cleanup
  setTimeout(() => overlay.remove(), 1000);
}
