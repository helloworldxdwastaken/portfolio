/* ==========================
   SIMPLE VISITOR LOGGER
   ========================== */

class SimpleLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000; // Maximum logs to keep in memory
        this.init();
    }

    init() {
        // Load existing logs
        this.loadLogs();
        
        // Log current visit
        this.logVisit();
        
        // Set up periodic logging
        this.setupPeriodicLogging();
        
        // Log page unload
        window.addEventListener('beforeunload', () => {
            this.logPageExit();
        });
    }

    logVisit() {
        const visitData = {
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            page: window.location.href,
            path: window.location.pathname,
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
            sessionId: this.getSessionId()
        };

        this.addLog(visitData);
        console.log('📝 Visit logged:', visitData);
    }

    logPageExit() {
        const exitData = {
            timestamp: new Date().toISOString(),
            action: 'page_exit',
            page: window.location.href,
            timeOnPage: this.getTimeOnPage(),
            sessionId: this.getSessionId()
        };

        this.addLog(exitData);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('simpleLoggerSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('simpleLoggerSessionId', sessionId);
        }
        return sessionId;
    }

    getTimeOnPage() {
        const startTime = sessionStorage.getItem('pageStartTime');
        if (startTime) {
            return Math.round((Date.now() - parseInt(startTime)) / 1000);
        }
        return 0;
    }

    addLog(logData) {
        this.logs.push(logData);
        
        // Keep only the most recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
        
        this.saveLogs();
    }

    saveLogs() {
        try {
            localStorage.setItem('simpleLoggerLogs', JSON.stringify(this.logs));
        } catch (error) {
            console.error('Error saving logs:', error);
        }
    }

    loadLogs() {
        try {
            const savedLogs = localStorage.getItem('simpleLoggerLogs');
            if (savedLogs) {
                this.logs = JSON.parse(savedLogs);
            }
        } catch (error) {
            console.error('Error loading logs:', error);
            this.logs = [];
        }
    }

    setupPeriodicLogging() {
        // Log every 30 seconds if user is still on page
        setInterval(() => {
            const activityData = {
                timestamp: new Date().toISOString(),
                action: 'page_activity',
                page: window.location.href,
                timeOnPage: this.getTimeOnPage(),
                sessionId: this.getSessionId()
            };
            this.addLog(activityData);
        }, 30000);
    }

    // Export logs as CSV
    exportAsCSV() {
        if (this.logs.length === 0) {
            console.log('No logs to export');
            return;
        }

        const headers = [
            'Timestamp', 'Date', 'Time', 'Page', 'Path', 'Referrer', 
            'User Agent', 'Language', 'Timezone', 'Screen Resolution', 
            'Viewport Size', 'Connection Type', 'Cookie Enabled', 
            'Online Status', 'Session ID', 'Action', 'Time on Page'
        ];

        const csvContent = [
            headers.join(','),
            ...this.logs.map(log => [
                log.timestamp || '',
                log.date || '',
                log.time || '',
                log.page || '',
                log.path || '',
                (log.referrer || '').replace(/,/g, ';'), // Replace commas in referrer
                (log.userAgent || '').replace(/,/g, ';'), // Replace commas in user agent
                log.language || '',
                log.timezone || '',
                log.screenResolution || '',
                log.viewportSize || '',
                log.connectionType || '',
                log.cookieEnabled || '',
                log.onlineStatus || '',
                log.sessionId || '',
                log.action || 'visit',
                log.timeOnPage || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `visitor-logs-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Export logs as JSON
    exportAsJSON() {
        const exportData = {
            exportDate: new Date().toISOString(),
            totalLogs: this.logs.length,
            logs: this.logs
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `visitor-logs-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Get statistics
    getStats() {
        const stats = {
            totalVisits: this.logs.filter(log => !log.action || log.action === 'visit').length,
            uniqueSessions: new Set(this.logs.map(log => log.sessionId)).size,
            totalPageViews: this.logs.length,
            mostVisitedPages: {},
            referrers: {},
            browsers: {},
            countries: {} // Would need IP geolocation for this
        };

        this.logs.forEach(log => {
            // Count page visits
            if (log.path) {
                stats.mostVisitedPages[log.path] = (stats.mostVisitedPages[log.path] || 0) + 1;
            }

            // Count referrers
            if (log.referrer) {
                stats.referrers[log.referrer] = (stats.referrers[log.referrer] || 0) + 1;
            }

            // Count browsers (simplified)
            if (log.userAgent) {
                const browser = this.getBrowserFromUserAgent(log.userAgent);
                stats.browsers[browser] = (stats.browsers[browser] || 0) + 1;
            }
        });

        return stats;
    }

    getBrowserFromUserAgent(userAgent) {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        return 'Other';
    }

    // Clear all logs
    clearLogs() {
        this.logs = [];
        localStorage.removeItem('simpleLoggerLogs');
        console.log('🗑️ All logs cleared');
    }
}

// Initialize logger when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set page start time
    sessionStorage.setItem('pageStartTime', Date.now().toString());
    
    // Initialize logger
    window.simpleLogger = new SimpleLogger();
    
    // Add to console for easy access
    console.log('📊 Simple Logger initialized!');
    console.log('💡 Use simpleLogger.exportAsCSV() to download logs as CSV');
    console.log('💡 Use simpleLogger.exportAsJSON() to download logs as JSON');
    console.log('💡 Use simpleLogger.getStats() to view statistics');
    console.log('💡 Use simpleLogger.clearLogs() to clear all logs');
});
