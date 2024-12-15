class UTMManager {
    constructor() {
        // Initialize Firebase reference
        this.utmCollection = firebase.firestore().collection('utm_strings');
        console.log('UTM Manager initialized');
        this.clearUTMLog();
    }

    clearUTMLog() {
        console.log('Clearing UTM log...');
        const utmLog = document.getElementById('utmLog');
        if (utmLog) {
            while (utmLog.firstChild) {
                utmLog.removeChild(utmLog.firstChild);
            }
            utmLog.innerHTML = '';
            console.log('UTM log cleared');
        }
    }

    generateUTM() {
        console.log('Generating UTM URL');
        const formData = FormManager.getFormData();
        const utmSource = document.getElementById('utmSource').value.toLowerCase();
        const utmMedium = document.getElementById('utmMedium').value.toLowerCase();
        const utmCampaign = document.getElementById('utmCampaign').value.toLowerCase();
        const utmContent = document.getElementById('utmContent').value.toLowerCase();
        const utmTerm = document.getElementById('utmTerm').value.toLowerCase();

        // Validate required fields
        if (!formData.baseUrl) {
            Utils.showNotification('Please enter a Base URL');
            return;
        }

        if (!utmSource || !utmMedium || !utmCampaign) {
            Utils.showNotification('Please ensure Source, Medium, and Campaign fields are filled');
            return;
        }

        try {
            // Create and validate URL
            const url = new URL(formData.baseUrl.toLowerCase());
            
            // Add UTM parameters
            url.searchParams.set('utm_source', Utils.formatUtmValue(utmSource));
            url.searchParams.set('utm_medium', Utils.formatUtmValue(utmMedium));
            url.searchParams.set('utm_campaign', Utils.formatUtmValue(utmCampaign));
            
            if (utmContent) {
                url.searchParams.set('utm_content', Utils.formatUtmValue(utmContent));
            }
            if (utmTerm) {
                url.searchParams.set('utm_term', Utils.formatUtmValue(utmTerm));
            }

            // Show the generated UTM section
            const generatedUtm = document.getElementById('generatedUtm');
            const generatedUtmSection = document.getElementById('generatedUtmSection');
            
            if (!generatedUtm || !generatedUtmSection) {
                console.error('Generated UTM elements not found');
                return;
            }
            
            generatedUtm.textContent = url.toString();
            generatedUtmSection.style.display = 'block';
            
            // Scroll to the generated UTM
            generatedUtmSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error('URL generation error:', error);
            Utils.showNotification('Invalid URL format. Please check the Base URL.');
        }
    }

    async saveUTM() {
        console.log('Saving UTM');
        const formData = FormManager.getFormData();
        
        // Add metadata
        formData.timestamp = new Date().toISOString();
        
        // Add UTM parameters
        formData.utmSource = document.getElementById('utmSource').value;
        formData.utmMedium = document.getElementById('utmMedium').value;
        formData.utmCampaign = document.getElementById('utmCampaign').value;
        formData.utmContent = document.getElementById('utmContent').value;
        formData.utmTerm = document.getElementById('utmTerm').value;
        formData.utmString = document.getElementById('generatedUtm').textContent;
        
        if (!formData.utmString) {
            Utils.showNotification('Please generate a UTM URL first');
            return;
        }

        try {
            // Check for duplicates in Firebase
            const querySnapshot = await this.utmCollection
                .where('utmString', '==', formData.utmString)
                .get();

            if (!querySnapshot.empty) {
                Utils.showNotification('This UTM has already been saved');
                return;
            }

            // Save to Firebase
            await this.utmCollection.add(formData);

            // Update only the current session's log
            this.addUTMToLog(formData);
            
            Utils.showNotification('UTM saved successfully');
        } catch (error) {
            console.error('Error saving UTM:', error);
            Utils.showNotification('Error saving UTM');
        }
    }

    addUTMToLog(formData) {
        console.log('Adding UTM to log');
        const utmLog = document.getElementById('utmLog');
        
        if (!utmLog) {
            console.error('UTM log element not found');
            return;
        }

        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td class="utm-actions d-flex">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="utmManager.copyUTM(this)" title="Copy UTM">
                    <i class="bi bi-clipboard"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-2" onclick="utmManager.testUTM(this)" title="Test UTM">
                    🧪
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="utmManager.deleteUTM(this)" title="Delete UTM">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
            <td>${formData.utmCampaign}</td>
            <td>${formData.utmSource}</td>
            <td>${formData.utmMedium}</td>
            <td>${formData.utmContent}</td>
            <td class="utm-url" title="${formData.utmString}">${formData.utmString}</td>
        `;
        
        utmLog.appendChild(newRow);
        utmLog.parentElement.scrollTop = utmLog.parentElement.scrollHeight;
    }

    copyUTM(button) {
        console.log('Copying UTM');
        const utmString = button.closest('tr').querySelector('.utm-url').title;
        Utils.copyToClipboard(utmString);
    }

    testUTM(button) {
        console.log('Testing UTM');
        const utmString = button.closest('tr').querySelector('.utm-url').title;
        window.open(utmString, '_blank');
    }

    async deleteUTM(button) {
        console.log('Deleting UTM');
        const row = button.closest('tr');
        const utmString = row.querySelector('.utm-url').title;
        
        try {
            // Find and delete from Firebase
            const querySnapshot = await this.utmCollection
                .where('utmString', '==', utmString)
                .get();

            querySnapshot.forEach(async (doc) => {
                await doc.ref.delete();
            });
            
            // Remove from UI
            row.remove();
            
            Utils.showNotification('UTM deleted successfully');
        } catch (error) {
            console.error('Error deleting UTM:', error);
            Utils.showNotification('Error deleting UTM');
        }
    }

    async completeSession() {
        console.log('Completing UTM session');
        const endSaveSpinner = document.getElementById('endSaveSpinner');

        if (endSaveSpinner) {
            endSaveSpinner.style.display = 'inline-block';
        }

        try {
            Utils.clearForm();
            this.clearUTMLog();
            Utils.showNotification('Session completed successfully');
        } catch (error) {
            console.error('Session completion error:', error);
            Utils.showNotification('Error completing session');
        } finally {
            if (endSaveSpinner) {
                endSaveSpinner.style.display = 'none';
            }
        }
    }
}

// Initialize UTM Manager
const utmManager = new UTMManager();

// Clear logs when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, clearing logs...');
    utmManager.clearUTMLog();
});

// Clear logs when page refreshes
window.addEventListener('load', () => {
    console.log('Page refreshed, clearing logs...');
    utmManager.clearUTMLog();
});

// Add to window object
if (typeof window !== 'undefined') {
    window.utmManager = utmManager;
}
