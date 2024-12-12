document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing main.js...');

    // Initialize form manager if it exists
    if (!window.FormManager) {
        console.error('FormManager not loaded!');
        return;
    }

    // Initialize form manager
    FormManager.initialize();
    
    // Attach event listeners for dropdowns
    // Market chain
    document.getElementById('market')?.addEventListener('change', () => {
        console.log('Market changed');
        FormManager.updateBrandOptions();
        FormManager.generateCampaignName();
    });

    // Product category chain
    document.getElementById('productCategory')?.addEventListener('change', () => {
        console.log('Product category changed');
        FormManager.updateSubCategories();
        FormManager.generateAdSetName();
    });

    // Quarter chain
    document.getElementById('quarter')?.addEventListener('change', () => {
        console.log('Quarter changed');
        FormManager.updateQuarterMonths();
        FormManager.generateCampaignName();
    });

    // Channel chain
    document.getElementById('channelDropdown')?.addEventListener('change', () => {
        console.log('Channel changed');
        FormManager.updateChannelDependencies();
    });

    // Campaign name generation triggers
    const campaignNameTriggers = ['brand', 'financialYear', 'month', 'mediaObjective'];
    campaignNameTriggers.forEach(triggerId => {
        document.getElementById(triggerId)?.addEventListener('change', () => {
            console.log(`${triggerId} changed - updating campaign name`);
            FormManager.generateCampaignName();
        });
    });

    // Ad set name generation triggers
    const adSetNameTriggers = ['subCategory', 'buyType'];
    adSetNameTriggers.forEach(triggerId => {
        document.getElementById(triggerId)?.addEventListener('change', () => {
            console.log(`${triggerId} changed - updating ad set name`);
            FormManager.generateAdSetName();
        });
    });

    // UTM field triggers
    document.getElementById('channelType')?.addEventListener('change', () => {
        FormManager.updateUTMFields();
    });

    document.getElementById('campaignName')?.addEventListener('input', () => {
        FormManager.updateUTMFields();
    });

    document.getElementById('adName')?.addEventListener('input', () => {
        FormManager.updateUTMFields();
    });

    // Manual toggle handlers
    document.getElementById('manualChannelToggle')?.addEventListener('change', () => {
        FormManager.toggleManualChannel();
    });

    document.getElementById('manualUtmToggle')?.addEventListener('change', () => {
        FormManager.toggleManualUtm();
    });

    // Initialize all dropdowns
    console.log('Initializing dropdowns...');
    FormManager.initializeDropdowns();
});
