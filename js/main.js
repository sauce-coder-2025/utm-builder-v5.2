document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading main.js...');
    console.log('CONFIG object available:', CONFIG);

    // Campaign Organization dependencies
    const marketSelect = document.getElementById('market');
    if (marketSelect) {
        console.log('Market select found');
        marketSelect.addEventListener('change', () => {
            console.log('Market changed to:', marketSelect.value);
            FormManager.updateBrandOptions();
            FormManager.generateCampaignName(); // Auto-generate on change
        });
    }
    
    // Product Category dependency
    const productCategory = document.getElementById('productCategory');
    if (productCategory) {
        productCategory.addEventListener('change', () => {
            console.log('Product category changed to:', productCategory.value);
            FormManager.updateSubCategories();
            FormManager.generateAdSetName(); // Auto-generate on change
        });
    }

    // Brand change listener
    document.getElementById('brand')?.addEventListener('change', () => {
        FormManager.generateCampaignName();
    });

    // Campaign timing listeners
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

    // Sub-category change listener
    document.getElementById('subCategory')?.addEventListener('change', () => {
        FormManager.generateAdSetName();
    });

    // Media objective change listener
    document.getElementById('mediaObjective')?.addEventListener('change', () => {
        FormManager.generateCampaignName();
        FormManager.generateAdSetName();
    });

    // Buy type change listener
    document.getElementById('buyType')?.addEventListener('change', () => {
        FormManager.generateAdSetName();
    });

    // Source/Medium dependencies
    const channelDropdown = document.getElementById('channelDropdown');
    if (channelDropdown) {
        channelDropdown.addEventListener('change', () => {
            console.log('Channel changed to:', channelDropdown.value);
            FormManager.updateChannelDependencies();
        });
    }

    const channelType = document.getElementById('channelType');
    if (channelType) {
        channelType.addEventListener('change', () => {
            console.log('Channel type changed to:', channelType.value);
            FormManager.updateBuyTypes();
        });
    }

    // Manual toggle handlers
    const manualChannelToggle = document.getElementById('manualChannelToggle');
    if (manualChannelToggle) {
        manualChannelToggle.addEventListener('change', () => {
            console.log('Manual channel toggle changed to:', manualChannelToggle.checked);
            FormManager.toggleManualChannel();
        });
    }

    const manualUtmToggle = document.getElementById('manualUtmToggle');
    if (manualUtmToggle) {
        manualUtmToggle.addEventListener('change', () => {
            console.log('Manual UTM toggle changed to:', manualUtmToggle.checked);
            FormManager.toggleManualUtm();
        });
    }

    // Initialize all dropdowns
    console.log('Initializing dropdowns...');
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateChannelDependencies();

    console.log('Initialization complete');
});
