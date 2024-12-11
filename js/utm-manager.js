class UTMManager {
    constructor() {
        this.utmLogData = [];
    }

    generateUTM() {
        const formData = FormManager.getFormData();
        const utmSource = document.getElementById('utmSource').value.toLowerCase();
        const utmMedium = document.getElementById('utmMedium').value.toLowerCase();
        const utmCampaign = document.getElementById('utmCampaign').value.toLowerCase();
        const utmContent = document.getElementById('utmContent').value.toLowerCase();
        const utmTerm = document.getElementById('utmTerm').value.toLowerCase();

        if (!formData.baseUrl) {
            Utils.showNotification('Please enter a Base URL');
            return;
        }

        if (!utmSource || !utmMedium || !utmCampaign) {
            Utils.showNotification('Please ensure Source, Medium, and Campaign fields are filled');
            return;
        }

        try {
            const url = new URL(formData.baseUrl.toLowerCase());
            
            // Add UTM parameters
            url.searchParams.set('utm_source', utmSource);
            url.searchParams.set('utm_medium', utmMedium);
            url.searchParams.set('utm_campaign', utmCampaign);
            
            if (utmContent) url.searchParams.set('utm_content', utmContent);
            if (utmTerm) url.searchParams.set('utm_term', utmTerm);

            // Show the generated UTM section
            const generatedUtm = document.getElementById('generatedUtm');
            const generatedUtmSection = document.getElementById('generatedUtmSection');
            
            generatedUtm.textContent = url.toString();
            generatedUtmSection.style.display = 'block';
            
            generatedUtmSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            Utils.showNotification('Invalid URL format. Please check the Base URL.');
        }
    }

    saveUTM() {
        const formData = FormManager.getFormData();
        
        // Add metadata
        formData.timestamp = new Date().toLocaleString();
        formData.creator = 'Unknown User';
        
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

        // Add to local storage
        this.utmLogData.push(formData);

        // Update the UI
        this.addUTMToLog(formData);
        
        Utils.showNotification('UTM saved successfully');
    }

    addUTMToLog(formData) {
        const utmLog = document.getElementById('utmLog');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td class="utm-actions">
                <button class="btn btn-sm btn-outline-primary me-2 small-btn" onclick="utmManager.copyUTM(this)">💾</button>
                <button class="btn btn-sm btn-outline-danger small-btn" onclick="utmManager.deleteUTM(this)">🚫</button>
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
        const utmString = button.closest('tr').querySelector('.utm-url').title;
        Utils.copyToClipboard(utmString);
    }

    deleteUTM(button) {
        const row = button.closest('tr');
        const utmString = row.querySelector('.utm-url').title;
        this.utmLogData = this.utmLogData.filter(data => data.utmString !== utmString);
        row.remove();
        Utils.showNotification('UTM deleted successfully');
    }

    completeSession() {
        const endSaveButton = document.getElementById('endSaveButton');
        const endSaveSpinner = document.getElementById('endSaveSpinner');

        if (this.utmLogData.length === 0) {
            Utils.showNotification('No UTMs to save. Please generate and save at least one UTM before completing the session.');
            return;
        }

        // Here you would typically save to a backend
        // For GitHub Pages demo, we'll just clear the form
        Utils.clearForm();
        this.utmLogData = [];
        document.getElementById('utmLog').innerHTML = '';
        Utils.showNotification('Session completed successfully');
    }
}

// Create global instance
const utmManager = new UTMManager();
