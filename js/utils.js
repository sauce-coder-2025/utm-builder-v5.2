const Utils = {
    formatUtmValue(value) {
        if (!value) return '';
        // Convert to lowercase, replace spaces with underscores and remove special characters
        return value.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_-]/g, '');
    },

    showNotification(message, duration = 3000) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        if (!notification || !notificationMessage) {
            console.error('Notification elements not found');
            return;
        }

        notificationMessage.textContent = message;
        notification.style.display = 'block';
        notification.classList.remove('hiding');
        
        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.style.display = 'none';
                notification.classList.remove('hiding');
            }, 300);
        }, duration);
    },

    clearForm() {
        // Clear all form inputs
        document.querySelectorAll('.form-select, .form-control').forEach(element => {
            element.value = '';
        });

        // Reset specific sections
        document.getElementById('generatedUtmSection').style.display = 'none';
        
        // Reset manual toggles
        document.getElementById('manualChannelToggle').checked = false;
        document.getElementById('manualUtmToggle').checked = false;

        // Reset UTM fields
        const utmFields = ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm'];
        utmFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
                field.readOnly = true;
            }
        });

        // Clear channel input if it exists
        const channelInput = document.getElementById('channelInput');
        if (channelInput) {
            channelInput.style.display = 'none';
            channelInput.value = '';
        }

        // Show channel dropdown
        const channelDropdown = document.getElementById('channelDropdown');
        if (channelDropdown) {
            channelDropdown.style.display = 'block';
            channelDropdown.value = '';
        }
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                this.showNotification('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                this.showNotification('Failed to copy to clipboard');
            });
    },

    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (err) {
            return false;
        }
    },

    sanitizeString(str) {
        if (!str) return '';
        return str.trim()
            .replace(/[^\w\s-]/g, '')  // Remove special characters except hyphen
            .replace(/\s+/g, '_')      // Replace spaces with underscores
            .toLowerCase();
    },

    createAutoButton(onclick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'auto-button btn btn-sm';
        button.textContent = 'Auto';
        button.onclick = onclick;
        return button;
    },

    addLoadingState(element) {
        if (!element) return;
        element.disabled = true;
        element.dataset.originalText = element.textContent;
        element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    },

    removeLoadingState(element) {
        if (!element) return;
        element.disabled = false;
        element.textContent = element.dataset.originalText || element.textContent;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Initialize Utils on window
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}
