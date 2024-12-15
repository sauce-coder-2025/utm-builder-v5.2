class UTMManager {
    constructor() {
        // Initialize Firebase reference
        this.utmCollection = firebase.firestore().collection('utm_strings');
        
        // Clear the UTM log on page load
        this.clearUTMLog();
    }

    clearUTMLog() {
        const utmLog = document.getElementById('utmLog');
        if (utmLog) {
            utmLog.innerHTML = '';
        }
    }

    generateUTM() {
        // Your existing generateUTM code...
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

    // Your existing copy, test, and delete methods...

    async completeSession() {
        console.log('Completing UTM session');
        const endSaveSpinner = document.getElementById('endSaveSpinner');

        if (endSaveSpinner) {
            endSaveSpinner.style.display = 'inline-block';
        }

        try {
            Utils.clearForm();
            this.clearUTMLog(); // Clear the log
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
