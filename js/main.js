document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing main.js...');

    // Initialize form manager if it exists
    if (!window.FormManager) {
        console.error('FormManager not loaded!');
        return;
    }

    // Initialize form manager
    FormManager.initialize();
    
    // Market chain
    document.getElementById('market')?.addEventListener('change', () => {
        console.log('Market changed');
        FormManager.updateBrandOptions();
        FormManager.generateCampaignName();
    });

    // Brand chain
    document.getElementById('brand')?.addEventListener('change', () => {
        console.log('Brand changed');
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

    // Financial Year handler
    document.getElementById('financialYear')?.addEventListener('change', () => {
        console.log('Financial year changed');
        FormManager.generateCampaignName();
    });

    // Month handler
    document.getElementById('month')?.addEventListener('change', () => {
        console.log('Month changed');
        FormManager.generateCampaignName();
    });

    // Media Objective handler
    document.getElementById('mediaObjective')?.addEventListener('change', () => {
        console.log('Media objective changed');
        FormManager.generateCampaignName();
        FormManager.generateAdSetName();
    });

    // Sub Category handler
    document.getElementById('subCategory')?.addEventListener('change', () => {
        console.log('Sub category changed');
        FormManager.generateAdSetName();
    });

    // Buy Type handler
    document.getElementById('buyType')?.addEventListener('change', () => {
        console.log('Buy type changed');
        FormManager.generateAdSetName();
    });

    // UTM field triggers
    document.getElementById('channelType')?.addEventListener('change', () => {
        console.log('Channel type changed');
        FormManager.updateUTMFields();
    });

    document.getElementById('campaignName')?.addEventListener('input', () => {
        console.log('Campaign name changed');
        FormManager.updateUTMFields();
    });

    document.getElementById('adName')?.addEventListener('input', () => {
        console.log('Ad name changed');
        FormManager.updateUTMFields();
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

    // Initialize all dropdowns
    console.log('Initializing dropdowns...');
    FormManager.initializeDropdowns();
});

// Add window load debug logging
window.addEventListener('load', function() {
    console.log('Window loaded');
    console.log('CONFIG loaded:', typeof CONFIG !== 'undefined');
    console.log('FormManager loaded:', typeof FormManager !== 'undefined');
    console.log('Utils loaded:', typeof Utils !== 'undefined');
});
