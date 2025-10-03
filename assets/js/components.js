/* ==========================
   COMPONENT LOADER
   Loads navbar and footer dynamically across all pages
   Optimized for GitHub Pages
   ========================== */

(function() {
    'use strict';

    // Function to load HTML content
    async function loadComponent(elementId, componentPath) {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element #${elementId} not found`);
                return false;
            }
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                console.error(`HTTP error loading ${componentPath}! status: ${response.status}`);
                return false;
            }
            
            const html = await response.text();
            element.innerHTML = html;
            console.log(`✓ Loaded ${componentPath} successfully`);
            return true;
        } catch (error) {
            console.error(`Failed to load ${componentPath}:`, error);
            return false;
        }
    }

    // Function to highlight active nav link based on current page
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
        
        // Wait a bit for the nav to be loaded
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-menu a:not(.btn)');
            navLinks.forEach(link => {
                link.classList.remove('is-active');
                const href = link.getAttribute('href');
                
                if (!href) return;
                
                // Extract just the page part (before any #)
                const linkPage = href.split('#')[0] || 'index.html';
                
                // Only highlight if we're on the exact same page
                // For about.html, work.html, etc.
                if (linkPage === currentPage) {
                    // Don't highlight index.html links with hash fragments unless we're on home
                    if (linkPage === 'index.html' && href.includes('#') && currentPage === 'index.html') {
                        // On index.html, don't auto-highlight section links
                        // Let the scroll spy in main.js handle it
                        return;
                    }
                    link.classList.add('is-active');
                }
            });
        }, 100);
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function fixNavbarLinks() {
        const navbar = document.querySelector('.site-header');
        if (!navbar) {
            console.log('Navbar not found');
            return;
        }
        
        // Determine the correct path prefix based on current location
        const isInProjectsDir = window.location.pathname.includes('/pages/projects/');
        const isInLegalDir = window.location.pathname.includes('/pages/legal/');
        const isInPagesDir = window.location.pathname.includes('/pages/');
        
        let pathPrefix = '';
        if (isInProjectsDir || isInLegalDir) {
            pathPrefix = '../../';
        } else if (isInPagesDir) {
            pathPrefix = '../';
        }
        
        console.log('Current path:', window.location.pathname);
        console.log('Path prefix:', pathPrefix);
        
        // Update all navbar links
        const links = navbar.querySelectorAll('a');
        console.log('Found', links.length, 'navbar links');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                // If the link already starts with 'pages/', don't add prefix
                if (href.startsWith('pages/')) {
                    const newHref = pathPrefix + href;
                    console.log('Updating pages link:', href, '->', newHref);
                    link.setAttribute('href', newHref);
                } else {
                    console.log('Link already has correct path:', href);
                }
            }
        });
    }

    async function init() {
        // Determine the correct path to components based on current page location
        const isInPagesDir = window.location.pathname.includes('/pages/');
        const isInProjectsDir = window.location.pathname.includes('/pages/projects/');
        const isInLegalDir = window.location.pathname.includes('/pages/legal/');
        
        let componentPath = 'components/';
        if (isInProjectsDir) {
            componentPath = '../../components/';
        } else if (isInLegalDir) {
            componentPath = '../../components/';
        } else if (isInPagesDir) {
            componentPath = '../components/';
        }
        
        // Load navbar
        const navLoaded = await loadComponent('navbar-placeholder', componentPath + 'navbar.html');
        
        // Fix navbar links based on current location
        if (navLoaded) {
            // Add a small delay to ensure navbar is fully rendered
            setTimeout(() => {
                fixNavbarLinks();
            }, 100);
        }
        
        // Load footer
        const footerLoaded = await loadComponent('footer-placeholder', componentPath + 'footer.html');
        
        // Fallback: If footer didn't load, embed it directly
        if (!footerLoaded) {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder && !footerPlaceholder.innerHTML.trim()) {
                footerPlaceholder.innerHTML = `
<!-- Footer Component -->
<footer class="site-footer" role="contentinfo">
    <div class="footer-grid">
        <div class="footer-col">
            <h4 class="footer-title">Explore</h4>
            <ul class="footer-links">
                <li><a href="index.html#home">Home</a></li>
                <li><a href="work.html">Work</a></li>
                <li><a href="index.html#services">Services</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4 class="footer-title">Contact</h4>
            <ul class="footer-links">
                <li><a href="index.html#contact">Let's talk</a></li>
                <li><button id="copyEmailFooter" class="linklike" type="button">Copy email</button></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4 class="footer-title">Connect</h4>
            <div class="socials">
                <a class="social" href="https://linkedin.com/in/enmanuelyasell" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.6c0-1.58-.03-3.62-2.21-3.62-2.22 0-2.56 1.73-2.56 3.5V23h-4V8z"/></svg>
                </a>
                <a class="social" href="https://instagram.com/tokyo_houseparty" aria-label="Instagram" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a class="social" href="https://github.com/helloworldxdwastaken" aria-label="GitHub" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>© <span id="year-footer"></span> Enmanuel Yasell. Made with ❤️ and a lot of Wolt takeaways</p>
        <div class="footer-legal">
            <a href="terms-of-service.html">Terms of Service</a>
            <a href="legal-notice.html">Legal Notice</a>
        </div>
    </div>
    <div class="footer-watermark" aria-hidden="true">Enmanuel Yasell</div>
</footer>`;
            }
        }
        
        // Set active nav link
        setActiveNavLink();
        
        // Secondary check: Ensure footer is actually visible after a short delay
        setTimeout(() => {
            const footerElement = document.querySelector('.site-footer');
            const footerPlaceholder = document.getElementById('footer-placeholder');
            
            if (!footerElement && footerPlaceholder) {
                console.warn('Footer not found after initial load, injecting fallback...');
                footerPlaceholder.innerHTML = `
<!-- Footer Component (Fallback) -->
<footer class="site-footer" role="contentinfo">
    <div class="footer-grid">
        <div class="footer-col">
            <h4 class="footer-title">Explore</h4>
            <ul class="footer-links">
                <li><a href="index.html#home">Home</a></li>
                <li><a href="work.html">Work</a></li>
                <li><a href="index.html#services">Services</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4 class="footer-title">Contact</h4>
            <ul class="footer-links">
                <li><a href="index.html#contact">Let's talk</a></li>
                <li><button id="copyEmailFooter" class="linklike" type="button">Copy email</button></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4 class="footer-title">Connect</h4>
            <div class="socials">
                <a class="social" href="https://linkedin.com/in/enmanuelyasell" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.6c0-1.58-.03-3.62-2.21-3.62-2.22 0-2.56 1.73-2.56 3.5V23h-4V8z"/></svg>
                </a>
                <a class="social" href="https://instagram.com/tokyo_houseparty" aria-label="Instagram" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a class="social" href="https://github.com/helloworldxdwastaken" aria-label="GitHub" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>© <span id="year-footer"></span> Enmanuel Yasell. Made with ❤️ and a lot of Wolt takeaways</p>
        <div class="footer-legal">
            <a href="terms-of-service.html">Terms of Service</a>
            <a href="legal-notice.html">Legal Notice</a>
        </div>
    </div>
    <div class="footer-watermark" aria-hidden="true">Enmanuel Yasell</div>
</footer>`;
            }
        }, 500);
        
        // Dispatch custom event to notify that components are loaded
        window.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
})();
