// Utility functions
const Utils = {
    formatUtmValue(value) {
        if (!value) return '';
        return value.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_-]/g, '');
    },

    showNotification(message, duration = 3000) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
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

    createAutoButton(onclick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'auto-button btn btn-sm';
        button.textContent = 'Auto';
        button.onclick = onclick;
        return button;
    },

    clearForm() {
        document.querySelectorAll('.form-select, .form-control').forEach(element => {
            element.value = '';
        });
        document.getElementById('generatedUtmSection').style.display = 'none';
        document.getElementById('otherChannelDiv').style.display = 'none';
        document.getElementById('manualUtmToggle').checked = false;
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification('Copied to clipboard!'))
            .catch(err => this.showNotification('Failed to copy: ' + err));
    }
};
