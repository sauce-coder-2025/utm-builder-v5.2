// main.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');

    // Check for required dependencies
    if (!window.CONFIG) {
        console.error('CONFIG is not loaded');
        return;
    }

    if (!window.FormManager) {
        console.error('FormManager is not loaded');
        return;
    }

    // Attach event listeners
    function attachEventListener(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, handler);
        } else {
            console.error(`Element not found: ${elementId}`);
        }
    }

    // Market & Brand handlers
    attachEventListener('market', 'change', () => {
        FormManager.updateBrandOptions();
        FormManager.generateCampaignName();
    });

    attachEventListener('brand', 'change', () => {
        FormManager.generateCampaignName();
    });

    // Financial Year & Quarter handlers
    attachEventListener('financialYear', 'change', () => {
        FormManager.generateCampaignName();
    });

    attachEventListener('quarter', 'change', () => {
        FormManager.updateQuarterMonths();
        FormManager.generateCampaignName();
    });

    // Month & Media Objective handlers
    attachEventListener('month', 'change', () => {
        FormManager.generateCampaignName();
    });

    attachEventListener('mediaObjective', 'change', () => {
        FormManager.generateCampaignName();
    });

    // Product Category handlers
    attachEventListener('productCategory', 'change', () => {
        FormManager.updateSubCategories();
        FormManager.generateAdSetName();
    });

    attachEventListener('subCategory', 'change', () => {
        FormManager.generateAdSetName();
    });

    // Buy Type handler
    attachEventListener('buyType', 'change', () => {
        FormManager.generateAdSetName();
    });

    // Channel handlers
    attachEventListener('channelDropdown', 'change', () => {
        FormManager.updateChannelDependencies();
        FormManager.updateUTMFields();
    });

    attachEventListener('channelType', 'change', FormManager.updateUTMFields.bind(FormManager));
    
    // Manual toggle handlers
    attachEventListener('manualChannelToggle', 'change', FormManager.toggleManualChannel.bind(FormManager));
    attachEventListener('manualUtmToggle', 'change', FormManager.toggleManualUtm.bind(FormManager));

    // Initialize form state
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateChannelDependencies();
});
