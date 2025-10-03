/* ==========================
   GOOGLE ANALYTICS INTEGRATION
   ========================== */

// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID'; // Replace with your GA4 Measurement ID

// Google Analytics 4 (GA4) Implementation
function initializeGoogleAnalytics() {
    if (GA_MEASUREMENT_ID === 'GA_MEASUREMENT_ID') {
        console.log('⚠️ Google Analytics not configured. Please add your GA4 Measurement ID.');
        return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
            'custom_parameter_1': 'visitor_type',
            'custom_parameter_2': 'session_duration'
        }
    });

    // Track custom events
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        referrer: document.referrer
    });

    console.log('📊 Google Analytics initialized');
}

// Enhanced tracking functions
function trackCustomEvent(eventName, parameters = {}) {
    if (window.gtag) {
        gtag('event', eventName, {
            ...parameters,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
        console.log(`📈 Custom event tracked: ${eventName}`, parameters);
    }
}

function trackPageView(pagePath, pageTitle) {
    if (window.gtag) {
        gtag('config', GA_MEASUREMENT_ID, {
            page_path: pagePath,
            page_title: pageTitle
        });
        console.log(`📄 Page view tracked: ${pageTitle} - ${pagePath}`);
    }
}

function trackUserEngagement(action, element) {
    if (window.gtag) {
        gtag('event', 'user_engagement', {
            engagement_type: action,
            element_type: element.tagName,
            element_id: element.id,
            element_class: element.className,
            page: window.location.pathname
        });
        console.log(`👆 User engagement tracked: ${action} on ${element.tagName}`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGoogleAnalytics();
    
    // Track button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('button, .btn, a[href]')) {
            trackUserEngagement('click', e.target);
        }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
        trackCustomEvent('form_submit', {
            form_id: e.target.id,
            form_class: e.target.className
        });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackCustomEvent('scroll_depth', {
                    scroll_percentage: scrollDepth
                });
            }
        }
    });

    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackCustomEvent('time_on_page', {
            seconds_on_page: timeOnPage
        });
    });
});

// Export functions for manual tracking
window.analytics = {
    trackEvent: trackCustomEvent,
    trackPage: trackPageView,
    trackEngagement: trackUserEngagement
};
