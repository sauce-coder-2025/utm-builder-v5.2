document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading main.js...');
    
    if (!window.FormManager) {
        console.error('FormManager not loaded');
        return;
    }

    if (!window.CONFIG) {
        console.error('CONFIG not loaded');
        return;
    }

    // Campaign name generation triggers
    const campaignFields = ['market', 'brand', 'financialYear', 'quarter', 'month', 'mediaObjective'];
    campaignFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('change', () => {
                console.log(`${fieldId} changed`);
                if (fieldId === 'market') FormManager.updateBrandOptions();
                if (fieldId === 'quarter') FormManager.updateQuarterMonths();
                FormManager.generateCampaignName();
            });
        } else {
            console.error(`Element not found: ${fieldId}`);
        }
    });

    // Ad set name generation triggers
    const adSetFields = ['productCategory', 'subCategory', 'buyType'];
    adSetFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('change', () => {
                console.log(`${fieldId} changed`);
                if (fieldId === 'productCategory') FormManager.updateSubCategories();
                FormManager.generateAdSetName();
            });
        } else {
            console.error(`Element not found: ${fieldId}`);
        }
    });

    // UTM field update triggers
    const utmTriggerFields = ['channelDropdown', 'channelInput', 'channelType', 'campaignName', 'adName'];
    utmTriggerFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            const eventType = ['channelInput', 'campaignName', 'adName'].includes(fieldId) ? 'input' : 'change';
            element.addEventListener(eventType, () => {
                console.log(`${fieldId} ${eventType}`);
                if (fieldId === 'channelDropdown') FormManager.updateChannelDependencies();
                FormManager.updateUTMFields();
            });
        } else {
            console.error(`Element not found: ${fieldId}`);
        }
    });

    // Manual toggle handlers
    document.getElementById('manualChannelToggle')?.addEventListener('change', () => {
        console.log('Manual channel toggle changed');
        FormManager.toggleManualChannel();
    });

    document.getElementById('manualUtmToggle')?.addEventListener('change', () => {
        console.log('Manual UTM toggle changed');
        FormManager.toggleManualUtm();
    });

    // Initialize form state
    console.log('Initializing form state...');
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateUTMFields();
}

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded, starting initialization...');
    initializeApp();
});
