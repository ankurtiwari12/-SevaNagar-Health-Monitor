// Error Handler for SevaNagar Health Dashboard

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Don't show popup for chart destroy errors
    if (event.error && event.error.message && event.error.message.includes('destroy is not a function')) {
        console.warn('Chart destroy error (non-critical):', event.error.message);
        return;
    }
    
    // Show user-friendly error message for other errors
    if (event.error && event.error.message) {
        showErrorNotification('An error occurred: ' + event.error.message);
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error message
    if (event.reason && event.reason.message) {
        showErrorNotification('A network error occurred: ' + event.reason.message);
    }
});

// Function to show error notifications
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Function to check if all required elements exist
function checkRequiredElements() {
    const requiredElements = [
        'totalCases',
        'hospitalBeds', 
        'vaccinationRate',
        'outbreakAlerts',
        'caseDataTable',
        'alertPanel',
        'heatmap',
        'hospitalChart',
        'vaccinationChart'
    ];
    
    const missingElements = [];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        console.warn('Missing elements:', missingElements);
        return false;
    }
    
    return true;
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Error handler initialized');
    
    // Check for required elements after a short delay
    setTimeout(() => {
        if (!checkRequiredElements()) {
            console.warn('Some required elements are missing. Dashboard may not function properly.');
        }
    }, 1000);
});

// Safe function execution wrapper
function safeExecute(fn, context = null) {
    try {
        return fn.call(context);
    } catch (error) {
        console.error('Error in safe execution:', error);
        return null;
    }
}

// Safe async function execution wrapper
async function safeExecuteAsync(fn, context = null) {
    try {
        return await fn.call(context);
    } catch (error) {
        console.error('Error in safe async execution:', error);
        return null;
    }
}

// Export functions for global use
window.safeExecute = safeExecute;
window.safeExecuteAsync = safeExecuteAsync;
window.showErrorNotification = showErrorNotification;