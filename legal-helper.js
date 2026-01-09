document.addEventListener('DOMContentLoaded', function () {
    console.log('--- Cookie Consent Script Loaded ---');

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';

    // Cookie Banner HTML Template
    banner.innerHTML = `
        <div class="cookie-content">
            <h3>La tua privacy è importante</h3>
            <p>
                Utilizziamo cookie tecnici per far funzionare il sito e, previo tuo consenso, cookie analitici di terze parti (Firebase/Google) per capire come utilizzi il sito. 
                Puoi consultare la nostra <a href="cookie-policy.html">Cookie Policy</a> e <a href="privacy.html">Privacy Policy</a> per maggiori dettagli.
            </p>
        </div>
        <div class="cookie-actions">
            <button id="btn-decline-cookies" class="btn-cookie btn-decline">Rifiuta</button>
            <button id="btn-accept-cookies" class="btn-cookie btn-accept">Accetta Tutti</button>
        </div>
    `;

    // Append to body
    document.body.appendChild(banner);
    console.log('Cookie banner appended to body');

    const acceptBtn = document.getElementById('btn-accept-cookies');
    const declineBtn = document.getElementById('btn-decline-cookies');

    // Check current status
    let consent = null;
    try {
        consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        console.log('Current consent status:', consent);
    } catch (e) {
        console.warn('LocalStorage access denied:', e);
    }

    if (consent === 'accepted') {
        if (typeof window.initAnalytics === 'function') {
            window.initAnalytics();
            console.log('Analytics initialized (Consent: accepted)');
        }
    } else if (consent === 'declined') {
        console.log('Analytics blocked (Consent: declined)');
    } else {
        // No choice made -> Show banner
        console.log('No consent found. Showing banner...');

        // Force style just in case CSS fails to load
        banner.style.display = 'flex';

        setTimeout(() => {
            banner.classList.add('visible');
            console.log('Banner visible class added');
        }, 500);
    }


    // Handle Accept
    acceptBtn.addEventListener('click', () => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }

        banner.classList.remove('visible');

        // Init Analytics dynamically
        if (typeof window.initAnalytics === 'function') {
            window.initAnalytics();
            console.log('Analytics initialized after consent.');
        }

        // Wait for animation then remove
        setTimeout(() => {
            banner.remove();
        }, 600);
    });

    // Handle Decline
    declineBtn.addEventListener('click', () => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
        banner.classList.remove('visible');
        console.log('Cookies declined. Analytics will not be initialized.');

        setTimeout(() => {
            banner.remove();
        }, 600);
    });
});
