class UTMManager {
    constructor() {
        this.utmLogData = [];
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

    saveUTM() {
        console.log('Saving UTM');
        const formData = FormManager.getFormData();
        
        // Add metadata
        formData.timestamp = new Date().toLocaleString();
        formData.creator = 'Unknown User'; // You can modify this based on your user management system
        
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

        // Check for duplicates
        if (this.utmLogData.some(data => data.utmString === formData.utmString)) {
            Utils.showNotification('This UTM has already been saved');
            return;
        }

        // Add to log data
        this.utmLogData.push(formData);

        // Update the UI
        this.addUTMToLog(formData);
        
        Utils.showNotification('UTM saved successfully');
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
            <td class="utm-actions">
                <button class="btn btn-sm btn-outline-primary me-2 small-btn" onclick="utmManager.copyUTM(this)" title="Copy UTM">
                    <i class="bi bi-clipboard"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger small-btn" onclick="utmManager.deleteUTM(this)" title="Delete UTM">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
            <td>${formData.timestamp}</td>
            <td>${formData.creator}</td>
            <td>${formData.utmCampaign}</td>
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

    deleteUTM(button) {
        console.log('Deleting UTM');
        const row = button.closest('tr');
        const utmString = row.querySelector('.utm-url').title;
        
        // Remove from data array
        this.utmLogData = this.utmLogData.filter(data => data.utmString !== utmString);
        
        // Remove from UI
        row.remove();
        
        Utils.showNotification('UTM deleted successfully');
    }

    completeSession() {
        console.log('Completing UTM session');
        const endSaveButton = document.getElementById('endSaveButton');
        const endSaveSpinner = document.getElementById('endSaveSpinner');

        if (this.utmLogData.length === 0) {
            Utils.showNotification('No UTMs to save. Please generate and save at least one UTM before completing the session.');
            return;
        }

        if (endSaveSpinner) {
            endSaveSpinner.style.display = 'inline-block';
        }

        try {
            // Here you would typically make an API call to save the session
            // For now, we'll just clear the form
            Utils.clearForm();
            this.utmLogData = [];
            document.getElementById('utmLog').innerHTML = '';
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

// Add to window object
if (typeof window !== 'undefined') {
    window.utmManager = utmManager;
}
