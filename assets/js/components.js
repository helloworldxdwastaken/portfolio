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
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
            console.warn(`Element #${elementId} not found`);
            return false;
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

    async function init() {
        // Load navbar
        await loadComponent('navbar-placeholder', 'components/navbar.html');
        
        // Load footer
        await loadComponent('footer-placeholder', 'components/footer.html');
        
        // Set active nav link
        setActiveNavLink();
        
        // Dispatch custom event to notify that components are loaded
        window.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
})();
