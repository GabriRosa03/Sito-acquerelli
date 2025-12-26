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

    // Mobile info Header (Title + Like Count for Mobile - Read Only)
    const mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-info-header';
    mobileHeader.innerHTML = `
      <h3>${title}</h3>
      <div class="mobile-heart-display ${hasLiked ? 'liked' : ''}" data-painting-id="${paintingId}" style="display: flex; align-items: center; justify-content: center; min-width: 30px; min-height: 30px;">
          <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="like-count" data-painting-id="${paintingId}" style="margin-left: 5px; font-size: 0.9rem; color: #8E1C14; font-weight: 700;">0</span>
      </div>
    `;

    // Standard Desktop Info
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

    // Insert mobile header at the top of infoDiv, but we need to manage innerHTML carefully. 
    // Actually, innerHTML overwrote everything. Let's prepend or reconstruct.
    // Better strategy: construct innerHTML then prepend the mobile header if needed, or structured insert.
    // Let's use the provided structure and hide elements via CSS as planned.

    // We already set innerHTML above for desktop. Now let's prepend the mobile header.
    // BUT wait, on desktop we see Title in h3. on mobile we see Title in mobileHeader h3. 
    // We should hide the "standard" h3 on mobile via CSS if we have it in mobileHeader.
    // Or simpler: put the mobile header inside.

    infoDiv.innerHTML = ''; // Reset
    infoDiv.appendChild(mobileHeader);

    const desktopContent = document.createElement('div');
    desktopContent.innerHTML = `
            <h3 class="desktop-title">${title}</h3> <!-- Class to hide on mobile if needed, or just let valid CSS handle -->
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
    // We need to append the children of desktopContent
    while (desktopContent.firstChild) {
      infoDiv.appendChild(desktopContent.firstChild);
    }

    card.appendChild(img);
    card.appendChild(infoDiv);

    // Click per aprire lightbox
    img.addEventListener('click', () => {
      openLightbox(index);
    });

    mobileHeader.addEventListener('click', () => {
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

  // Add history state for back button support
  history.pushState({ lightboxOpen: true }, '', '#lightbox');
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

  const { titleKey, descKey } = getLangKeys();
  const title = painting[titleKey] || painting.title;
  const description = painting[descKey] || painting.description;

  // Buttons text
  const lang = localStorage.getItem('site_lang') || 'it';
  const btnContactText = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang]['gallery.btn_contact'] : "Richiedi Informazioni";

  lightboxImg.src = painting.src;
  lightboxImg.alt = painting.alt || title;

  // Reset Zoom
  lightboxImg.classList.remove('zoomed');
  lightboxImg.style.transform = '';

  lightboxTitle.textContent = title;

  // Populate Description
  if (lightboxDescription) {
    lightboxDescription.textContent = description;
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

  // Bind Share Button
  if (shareBtn) {
    shareBtn.onclick = (e) => {
      e.stopPropagation();
      sharePainting(title);
    };
  }

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
  if (scrollContainer) {
    scrollContainer.classList.add('closing');

    // Wait for animation to finish (400ms match CSS)
    setTimeout(() => {
      lightbox.classList.remove('active');
      scrollContainer.classList.remove('closing');
      document.body.style.overflow = '';
    }, 350); // Slightly less than 400ms to feel snappy and avoid flash
  } else {
    // Fallback if structure not found
    lightbox.classList.remove('active');
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadGallery();

  // Chiudi lightbox
  const lightboxClose = document.getElementById('lightbox-close-btn');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // History API - Back button closes lightbox
  window.addEventListener('popstate', (event) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      // VISUAL CLOSE with animation
      const scrollContainer = lightbox.querySelector('.lightbox-scroll-container');
      if (scrollContainer) {
        scrollContainer.classList.add('closing');
        setTimeout(() => {
          lightbox.classList.remove('active');
          scrollContainer.classList.remove('closing');
          document.body.style.overflow = '';
        }, 350);
      } else {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    // Note: We removed "Click outside to close" because the new layout is a full-screen scrollable page.
    // Accidental clicks on the background while scrolling were too likely.
    // Users should use the "X" button or Back button.

    // Gestures Logic (Swipe & Pinch)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Pinch variables
    let initialDistance = 0;
    let currentScale = 1;
    let isPinching = false;
    const lightboxImg = document.getElementById('lightbox-img');

    lightbox.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      } else if (e.touches.length === 2) {
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
      // Create heart overlay
      const heartOverlay = document.createElement('div');
      heartOverlay.className = 'like-heart-overlay';

      // Add class based on like state
      if (!isLiked) {
        heartOverlay.classList.add('unlike');
      }

      heartOverlay.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      `;

      const imageContainer = document.querySelector('.lightbox-image-container');
      if (imageContainer) {
        imageContainer.appendChild(heartOverlay);

        // Trigger animation
        setTimeout(() => heartOverlay.classList.add('animate'), 10);

        // Remove after animation
        setTimeout(() => {
          heartOverlay.remove();
        }, 1000);
      }
    }

    // Magnifying Glass functionality
    let magnifier = null;
    let isMagnifying = false;

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
      const lensSize = 250;
      const offset = 80; // Distance from finger

      // Direct position is the touch point (snappy follow)
      magnifier.style.left = `${x}px`;
      magnifier.style.top = `${y}px`;

      // Calculate the offset based on side
      const isRightSide = x > rect.width / 2;
      let targetOffsetX, targetOffsetY;

      if (isRightSide) {
        // Touch on right -> Lens moves to the left of the finger
        targetOffsetX = -lensSize - offset;
      } else {
        // Touch on left -> Lens moves to the right of the finger
        targetOffsetX = offset;
      }

      // Vertical offset: slightly above the finger center
      targetOffsetY = -lensSize / 2 - offset;

      // Boundary clamping: ensure the lens stays within the image rectangle
      const minOffsetX = -x;
      const maxOffsetX = rect.width - lensSize - x;
      const minOffsetY = -y;
      const maxOffsetY = rect.height - lensSize - y;

      targetOffsetX = Math.max(minOffsetX, Math.min(targetOffsetX, maxOffsetX));
      targetOffsetY = Math.max(minOffsetY, Math.min(targetOffsetY, maxOffsetY));

      // Update CSS variables for the smooth transform transition (defined in CSS)
      magnifier.style.setProperty('--offset-x', `${targetOffsetX}px`);
      magnifier.style.setProperty('--offset-y', `${targetOffsetY}px`);

      // Calculate background position for 3x zoom
      const bgX = -x * 3 + lensSize / 2;
      const bgY = -y * 3 + lensSize / 2;

      magnifier.style.backgroundImage = `url('${lightboxImg.src}')`;
      magnifier.style.backgroundSize = `${rect.width * 3}px ${rect.height * 3}px`;
      magnifier.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }

    function removeMagnifier() {
      if (magnifier) {
        magnifier.remove();
        magnifier = null;
        isMagnifying = false;
      }
    }

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

      if (e.changedTouches.length === 1) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
      }
    });

    function handleGesture() {
      const xDiff = touchEndX - touchStartX;
      const yDiff = touchEndY - touchStartY;

      // Thresholds
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // Horizontal Swipe
        if (Math.abs(xDiff) > 50) { // Min swipe distance
          if (xDiff > 0) {
            navigateLightbox(-1); // Right swipe -> Prev
          } else {
            navigateLightbox(1); // Left swipe -> Next
          }
        }
      }
      // Removed Vertical Swipe (Down) to Close to allow natural scrolling
    }
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
  backToTopBtn.innerHTML = '<img src="images/arrowUp.svg" alt="Scroll to top" style="width: 21px; height: 21px; opacity: 0.8;">';
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

