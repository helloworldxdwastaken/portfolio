// Dynamic Component Loader
// Loads navbar and footer from central component files

(function() {
    'use strict';
    
    const basePath = window.location.pathname.includes('/pages/') ? '../../' : 
                     window.location.pathname.includes('/projects/') ? '../../../' : '/';
    
    // Load navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('/components/navbar.html')
            .then(response => response.text())
            .then(html => {
                navbarPlaceholder.outerHTML = html;
                initNavbar();
            })
            .catch(err => console.error('Error loading navbar:', err));
    }
    
    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/components/footer.html')
            .then(response => response.text())
            .then(html => {
                footerPlaceholder.outerHTML = html;
                initFooter();
            })
            .catch(err => console.error('Error loading footer:', err));
    }
    
    // Initialize navbar functionality
    function initNavbar() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('is-open');
                document.body.classList.toggle('nav-open');
            });
        }
        
        // Close mobile nav on link click
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu && navMenu.classList.contains('is-open')) {
                    navMenu.classList.remove('is-open');
                    navToggle?.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                }
            });
        });
        
        // Navbar scroll effect
        let lastScroll = 0;
        const header = document.querySelector('.site-header');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (header) {
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // Initialize footer functionality
    function initFooter() {
        // Set year
        const yearEl = document.getElementById('year-footer');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
        
        // Copy email button
        const copyBtn = document.getElementById('copyEmailFooter');
        const email = 'info.dronx@gmail.com';
        
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(email);
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = originalText; }, 1500);
                } catch (e) {
                    alert('Email: ' + email);
                }
            });
        }
    }
})();

