/* ==========================
   VISITOR ANALYTICS TRACKING
   ========================== */

class VisitorTracker {
    constructor() {
        this.namespace = 'enmanuelyasell.com';
        this.countApiUrl = 'https://api.countapi.xyz';
        this.visitorKey = 'visitor_count';
        this.pageViewKey = 'page_views';
        this.sessionKey = 'session_tracking';
        
        this.init();
    }

    init() {
        // Check if user has visited before
        const hasVisited = localStorage.getItem('hasVisited');
        const sessionId = this.getOrCreateSessionId();
        
        // Track unique visitor
        if (!hasVisited) {
            this.trackUniqueVisitor();
            localStorage.setItem('hasVisited', 'true');
        }
        
        // Track page view
        this.trackPageView();
        
        // Track session
        this.trackSession(sessionId);
        
        // Log visitor info to console (for development)
        this.logVisitorInfo();
    }

    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = this.generateSessionId();
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async trackUniqueVisitor() {
        try {
            const response = await fetch(`${this.countApiUrl}/hit/${this.namespace}/${this.visitorKey}`);
            const data = await response.json();
            console.log('Unique visitor tracked:', data.value);
        } catch (error) {
            // Silently fail - local tracking still works
            console.log('📊 Local tracking active (CountAPI unavailable)');
        }
    }

    async trackPageView() {
        try {
            const response = await fetch(`${this.countApiUrl}/hit/${this.namespace}/${this.pageViewKey}`);
            const data = await response.json();
            console.log('Page view tracked:', data.value);
        } catch (error) {
            // Silently fail - local tracking still works
            console.log('📊 Local tracking active (CountAPI unavailable)');
        }
    }

    async trackSession(sessionId) {
        try {
            const sessionData = {
                sessionId: sessionId,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                screenResolution: `${screen.width}x${screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`
            };

            // Store session data locally (since we can't send to server)
            const sessions = JSON.parse(localStorage.getItem('visitorSessions') || '[]');
            sessions.push(sessionData);
            
            // Keep only last 50 sessions to avoid storage bloat
            if (sessions.length > 50) {
                sessions.splice(0, sessions.length - 50);
            }
            
            localStorage.setItem('visitorSessions', JSON.stringify(sessions));
            
            console.log('Session tracked:', sessionData);
        } catch (error) {
            console.error('Error tracking session:', error);
        }
    }

    logVisitorInfo() {
        const visitorInfo = {
            timestamp: new Date().toISOString(),
            page: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };

        console.log('🔍 Visitor Info:', visitorInfo);
        
        // Store in localStorage for later export
        const logs = JSON.parse(localStorage.getItem('visitorLogs') || '[]');
        logs.push(visitorInfo);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('visitorLogs', JSON.stringify(logs));
    }

    // Method to export logs (for manual download)
    exportLogs() {
        const logs = JSON.parse(localStorage.getItem('visitorLogs') || '[]');
        const sessions = JSON.parse(localStorage.getItem('visitorSessions') || '[]');
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalLogs: logs.length,
            totalSessions: sessions.length,
            logs: logs,
            sessions: sessions
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `visitor-logs-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Method to get visitor count
    async getVisitorCount() {
        try {
            const response = await fetch(`${this.countApiUrl}/get/${this.namespace}/${this.visitorKey}`);
            const data = await response.json();
            return data.value;
        } catch (error) {
            console.error('Error getting visitor count:', error);
            return 0;
        }
    }

    // Method to get page view count
    async getPageViewCount() {
        try {
            const response = await fetch(`${this.countApiUrl}/get/${this.namespace}/${this.pageViewKey}`);
            const data = await response.json();
            return data.value;
        } catch (error) {
            console.error('Error getting page view count:', error);
            return 0;
        }
    }
}

// Initialize tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io') || window.location.hostname.includes('pages.dev');
    
    if (isGitHubPages) {
        console.log('🌐 GitHub Pages detected - using enhanced tracking');
    }
    
    window.visitorTracker = new VisitorTracker();
    
    // Initialize click tracking
    initializeClickTracking();
    
    // Add export button to console for easy access
    console.log('📊 Visitor Tracker initialized!');
    console.log('💡 Use visitorTracker.exportLogs() to download visitor data');
    console.log('💡 Use visitorTracker.getVisitorCount() to get unique visitor count');
    console.log('💡 Use visitorTracker.getPageViewCount() to get total page views');
    console.log('💡 Use visitorTracker.getClickStats() to view click analytics');
    
});

// Click tracking functionality
function initializeClickTracking() {
    // Track all clicks
    document.addEventListener('click', (e) => {
        trackClick(e);
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
        trackFormSubmission(e);
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackScrollDepth(scrollDepth);
            }
        }
    });

    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackTimeOnPage(timeOnPage);
    });
}

function trackClick(event) {
    const clickData = {
        timestamp: new Date().toISOString(),
        type: 'click',
        element: {
            tagName: event.target.tagName,
            id: event.target.id || null,
            className: event.target.className || null,
            text: event.target.textContent?.substring(0, 50) || null,
            href: event.target.href || null,
            type: event.target.type || null
        },
        page: window.location.pathname,
        coordinates: {
            x: event.clientX,
            y: event.clientY
        },
        sessionId: getSessionId()
    };

    // Store click data
    storeInteractionData(clickData);
}

function trackFormSubmission(event) {
    const formData = {
        timestamp: new Date().toISOString(),
        type: 'form_submit',
        form: {
            id: event.target.id || null,
            className: event.target.className || null,
            action: event.target.action || null,
            method: event.target.method || null
        },
        page: window.location.pathname,
        sessionId: getSessionId()
    };

    storeInteractionData(formData);
}

function trackScrollDepth(depth) {
    const scrollData = {
        timestamp: new Date().toISOString(),
        type: 'scroll_depth',
        depth: depth,
        page: window.location.pathname,
        sessionId: getSessionId()
    };

    storeInteractionData(scrollData);
}

function trackTimeOnPage(seconds) {
    const timeData = {
        timestamp: new Date().toISOString(),
        type: 'time_on_page',
        duration: seconds,
        page: window.location.pathname,
        sessionId: getSessionId()
    };

    storeInteractionData(timeData);
}

function storeInteractionData(data) {
    try {
        const interactions = JSON.parse(localStorage.getItem('visitorInteractions') || '[]');
        interactions.push(data);
        
        // Keep only last 500 interactions to avoid storage bloat
        if (interactions.length > 500) {
            interactions.splice(0, interactions.length - 500);
        }
        
        localStorage.setItem('visitorInteractions', JSON.stringify(interactions));
    } catch (error) {
        console.error('Error storing interaction data:', error);
    }
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('analyticsSessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('analyticsSessionId', sessionId);
    }
    return sessionId;
}

// Add click analytics methods to VisitorTracker
VisitorTracker.prototype.getClickStats = function() {
    try {
        const interactions = JSON.parse(localStorage.getItem('visitorInteractions') || '[]');
        
        const stats = {
            totalClicks: interactions.filter(i => i.type === 'click').length,
            totalFormSubmissions: interactions.filter(i => i.type === 'form_submit').length,
            totalScrollDepth: interactions.filter(i => i.type === 'scroll_depth').length,
            totalTimeOnPage: interactions.filter(i => i.type === 'time_on_page').length,
            mostClickedElements: {},
            mostClickedPages: {},
            clickCoordinates: [],
            averageScrollDepth: 0,
            averageTimeOnPage: 0
        };

        // Analyze clicks
        interactions.forEach(interaction => {
            if (interaction.type === 'click') {
                // Most clicked elements
                const elementKey = `${interaction.element.tagName}${interaction.element.id ? '#' + interaction.element.id : ''}${interaction.element.className ? '.' + interaction.element.className.split(' ')[0] : ''}`;
                stats.mostClickedElements[elementKey] = (stats.mostClickedElements[elementKey] || 0) + 1;
                
                // Most clicked pages
                stats.mostClickedPages[interaction.page] = (stats.mostClickedPages[interaction.page] || 0) + 1;
                
                // Click coordinates
                stats.clickCoordinates.push({
                    x: interaction.coordinates.x,
                    y: interaction.coordinates.y,
                    page: interaction.page
                });
            }
            
            // Average scroll depth
            if (interaction.type === 'scroll_depth') {
                stats.averageScrollDepth = (stats.averageScrollDepth + interaction.depth) / 2;
            }
            
            // Average time on page
            if (interaction.type === 'time_on_page') {
                stats.averageTimeOnPage = (stats.averageTimeOnPage + interaction.duration) / 2;
            }
        });

        return stats;
    } catch (error) {
        console.error('Error getting click stats:', error);
        return null;
    }
};

VisitorTracker.prototype.exportInteractionData = function() {
    try {
        const interactions = JSON.parse(localStorage.getItem('visitorInteractions') || '[]');
        const stats = this.getClickStats();
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalInteractions: interactions.length,
            stats: stats,
            interactions: interactions
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `interaction-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('📊 Interaction data exported!');
    } catch (error) {
        console.error('Error exporting interaction data:', error);
    }
};

// Add synchronous methods for easier access
VisitorTracker.prototype.getLocalVisitorCount = function() {
    try {
        const visitors = JSON.parse(localStorage.getItem('visitorLogs') || '[]');
        return visitors.length;
    } catch (error) {
        return 0;
    }
};

VisitorTracker.prototype.getLocalPageViewCount = function() {
    try {
        const logs = JSON.parse(localStorage.getItem('visitorLogs') || '[]');
        return logs.reduce((total, log) => total + (log.pageViews || 1), 0);
    } catch (error) {
        return 0;
    }
};

// Track page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible');
    } else {
        console.log('👁️ Page became hidden');
    }
});

// Track page unload
window.addEventListener('beforeunload', () => {
    console.log('👋 Visitor leaving page');
});
