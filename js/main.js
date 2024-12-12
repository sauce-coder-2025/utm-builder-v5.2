document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading main.js...');
    
    if (!window.FormManager) {
        console.error('FormManager not loaded!');
        return;
    }

    // Market change handler
    document.getElementById('market')?.addEventListener('change', () => {
        FormManager.updateBrandOptions();
        FormManager.generateCampaignName();
    });

    // Brand change handler
    document.getElementById('brand')?.addEventListener('change', () => {
        FormManager.generateCampaignName();
    });

    // Media Objective change handler
    document.getElementById('mediaObjective')?.addEventListener('change', () => {
        FormManager.generateCampaignName();
        FormManager.generateAdSetName();
    });

    // Campaign Timing handlers
    document.getElementById('financialYear')?.addEventListener('change', () => {
        FormManager.generateCampaignName();
    });

    document.getElementById('quarter')?.addEventListener('change', () => {
        FormManager.updateQuarterMonths();
        FormManager.generateCampaignName();
    });

    document.getElementById('month')?.addEventListener('change', () => {
        FormManager.generateCampaignName();
    });

    // Product Category handlers
    document.getElementById('productCategory')?.addEventListener('change', () => {
        FormManager.updateSubCategories();
        FormManager.generateAdSetName();
    });

    document.getElementById('subCategory')?.addEventListener('change', () => {
        FormManager.generateAdSetName();
    });

    // Buy Type handler
    document.getElementById('buyType')?.addEventListener('change', () => {
        FormManager.generateAdSetName();
    });

    // For UTM parameters
    document.getElementById('channelDropdown')?.addEventListener('change', () => {
        FormManager.updateChannelDependencies();
        FormManager.updateUTMFields();
    });

    document.getElementById('channelInput')?.addEventListener('input', () => {
        FormManager.updateUTMFields();
    });

    document.getElementById('channelType')?.addEventListener('change', () => {
        FormManager.updateUTMFields();
    });

    document.getElementById('campaignName')?.addEventListener('input', () => {
        FormManager.updateUTMFields();
    });

    document.getElementById('adName')?.addEventListener('input', () => {
        FormManager.updateUTMFields();
    });

    // Initialize dropdowns
    console.log('Initializing dropdowns...');
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateChannelDependencies();
});
