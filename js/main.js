document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading main.js...');

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

    // Source/Medium handlers
    document.getElementById('channelDropdown')?.addEventListener('change', () => {
        FormManager.updateChannelDependencies();
    });

    document.getElementById('channelType')?.addEventListener('change', () => {
        FormManager.updateBuyTypes();
    });

    // Manual toggle handlers
    document.getElementById('manualChannelToggle')?.addEventListener('change', () => {
        FormManager.toggleManualChannel();
    });

    document.getElementById('manualUtmToggle')?.addEventListener('change', () => {
        FormManager.toggleManualUtm();
    });

    // Initialize dropdowns
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateChannelDependencies();
});
