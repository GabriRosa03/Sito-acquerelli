/**
 * Davide Rosa Website - Footer Loader
 * 
 * This script injects the standard footer into all pages.
 * Usage: <div id="site-footer-container"></div> in HTML where footer should go.
 */

document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('site-footer-container');

    if (footerContainer) {
        footerContainer.innerHTML = `
        <footer class="site-footer">
            <div class="footer-paper-texture"></div>
            <div class="footer-content">
                <!-- Column 1: Brand & About -->
                <div class="footer-column footer-about">
                    <div class="footer-brand">
                        <img src="images/logoPapiPng.png" alt="Davide Rosa Logo" class="footer-logo">
                        <h3>Davide Rosa</h3>
                    </div>
                    <p class="footer-description">
                        Esploro le atmosfere di Venezia attraverso la trasparenza dell'acquerello, 
                        catturando la luce, l'acqua e il silenzio della Laguna. 
                        Questo portfolio digitale raccoglie la mia visione artistica e le opere che celebrano la nostra città.
                    </p>
                </div>

                <!-- Column 2: Navigation with Details -->
                <div class="footer-column footer-nav-detailed">
                    <div class="nav-item-detailed">
                        <a href="index.html" class="nav-title" data-translate="nav.home">Home</a>
                        <span class="nav-desc">L'inizio del viaggio</span>
                    </div>
                    <div class="nav-item-detailed">
                        <a href="gallery.html" class="nav-title" data-translate="nav.gallery">Galleria</a>
                        <span class="nav-desc">Tutte le opere e collezioni</span>
                    </div>
                    <div class="nav-item-detailed">
                        <a href="biografia.html" class="nav-title" data-translate="nav.biography">Biografia</a>
                        <span class="nav-desc">La mia storia e ispirazione</span>
                    </div>
                    <div class="nav-item-detailed">
                        <a href="materiali.html" class="nav-title" data-translate="nav.materials">Materiali</a>
                        <span class="nav-desc">Strumenti e tecniche</span>
                    </div>
                    <div class="nav-item-detailed">
                        <a href="contatti.html" class="nav-title" data-translate="nav.contacts">Contatti</a>
                        <span class="nav-desc">Scrivimi per info o acquisti</span>
                    </div>
                </div>

                <!-- Column 3: Social -->
                <div class="footer-column footer-social">
                    <h4 class="footer-heading">Seguimi sui Social</h4>
                    <div class="footer-social-icons">
                        <!-- Instagram -->
                        <a href="https://www.instagram.com/davide_rosa_watercolors" target="_blank" class="social-icon-link" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <!-- YouTube -->
                        <a href="https://www.youtube.com/@DavideRosaWatercolors" target="_blank" class="social-icon-link" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.97-1.96C18.84 4 12 4 12 4s-6.84 0-8.57.46a2.78 2.78 0 0 0-1.97 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.97 1.96c1.73.46 8.57.46 8.57.46s6.84 0 8.57-.46a2.78 2.78 0 0 0 1.97-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar: Legal & Signature -->
            <div class="footer-bottom">
                <div class="footer-legal-links">
                    <a href="privacy.html">Privacy Policy</a>
                    <span class="separator">•</span>
                    <a href="cookie-policy.html">Cookie Policy</a>
                    <span class="separator">•</span>
                    <span>&copy; 2025 Davide Rosa</span>
                </div>
                <div class="footer-credit">
                    Designed with ❤️ by <a href="https://www.instagram.com/gabrielerosa_/" target="_blank">Gabriele Rosa</a>
                </div>
            </div>
        </footer>
        `;

        // Re-trigger translations if the translation script is already loaded
        // This is a safety check: usually translations run on DOMContentLoaded too.
        // If this script runs AFTER translations, we need to call updateTranslations() manually if accessible.
        // Assuming updateLanguage() or similar exists globally.
        if (typeof updateLanguage === 'function') {
            // Small delay to ensure DOM is ready
            setTimeout(updateLanguage, 0);
        } else {
            // If language-switcher.js listens to DOMContentLoaded, it might race. 
            // Ideally we dispatch an event.
            document.dispatchEvent(new Event('FooterLoaded'));
        }
    }
});
