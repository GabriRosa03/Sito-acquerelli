// Language Switcher Logic

// Helper check for availability
if (typeof translations === 'undefined') {
    console.error('Translations file not loaded.');
}

// Default language
let currentLang = localStorage.getItem('site_lang') || 'it';

// Global accessor
window.getCurrentLanguage = () => currentLang;

document.addEventListener('DOMContentLoaded', () => {
    // Inject Language Switcher Button
    injectSwitcher();

    // Apply initial language
    applyLanguage(currentLang);
});

function updateSwitcherButtons() {
    const switchers = document.querySelectorAll('.lang-switcher');
    switchers.forEach(btn => {
        const flagClass = currentLang === 'it' ? 'flag-it' : 'flag-en';
        const langText = currentLang === 'it' ? 'IT' : 'EN';

        btn.innerHTML = `
            <div class="lang-current-display">
                <span class="flag-circle ${flagClass}"></span>
                <span class="lang-text">${langText}</span>
                <svg class="change-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
            </div>
        `;
    });
}


function createSwitcherButton() {
    const switcher = document.createElement('button');
    switcher.className = 'lang-switcher';
    switcher.setAttribute('aria-label', 'Cambia lingua / Change language');
    switcher.addEventListener('click', toggleLanguage);
    return switcher;
}

function injectSwitcher() {
    // Desktop: Create fixed position switcher in top-right
    if (!document.querySelector('.lang-switcher-desktop')) {
        const desktopSwitcher = createSwitcherButton();
        desktopSwitcher.classList.add('lang-switcher-desktop');
        document.body.appendChild(desktopSwitcher);
    }

    // Mobile: inject at the bottom of mobile-nav
    const mobileNav = document.querySelector('.mobile-nav ul');
    if (mobileNav && !mobileNav.querySelector('.lang-switcher-mobile')) {
        const li = document.createElement('li');
        li.style.marginTop = 'auto'; // Push to bottom
        li.style.paddingTop = '1rem';
        li.style.borderTop = '1px solid rgba(255,255,255,0.1)';
        const mobileSwitcher = createSwitcherButton();
        mobileSwitcher.classList.add('lang-switcher-mobile');
        li.appendChild(mobileSwitcher);
        mobileNav.appendChild(li);
    }

    updateSwitcherButtons();
}

function toggleLanguage() {
    currentLang = currentLang === 'it' ? 'en' : 'it';
    localStorage.setItem('site_lang', currentLang);
    applyLanguage(currentLang);
    updateSwitcherButtons();
}

function applyLanguage(lang) {
    if (!translations[lang]) return;

    // Updates text content of elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) {
            // Check if it has HTML content inside (like links in bio)
            // If the translation string contains HTML tags, use innerHTML, else textContent
            if (translations[lang][key].includes('<')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Update placeholders
    const inputs = document.querySelectorAll('[data-translate-placeholder]');
    inputs.forEach(input => {
        const key = input.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            input.placeholder = translations[lang][key];
        }
    });

    // Update alt texts
    const alts = document.querySelectorAll('[data-translate-alt]');
    alts.forEach(img => {
        const key = img.getAttribute('data-translate-alt');
        if (translations[lang][key]) {
            img.alt = translations[lang][key];
        }
    });

    // Dispatch a custom event so other scripts (like paintings.js / script.js) can react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}
