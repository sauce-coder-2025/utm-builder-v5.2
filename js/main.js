console.log('Loading main.js...');
console.log('CONFIG object available:', CONFIG);

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Campaign Organization dependencies
    const marketSelect = document.getElementById('market');
    if (marketSelect) {
        console.log('Market select found');
        marketSelect.addEventListener('change', () => {
            console.log('Market changed to:', marketSelect.value);
            FormManager.updateBrandOptions();
        });
    } else {
        console.error('Market select not found');
    }
    
    // Product Category dependency
    const productCategory = document.getElementById('productCategory');
    if (productCategory) {
        productCategory.addEventListener('change', () => {
            console.log('Product category changed to:', productCategory.value);
            FormManager.updateSubCategories();
        });
    }

    // Quarter dependency
    const quarterSelect = document.getElementById('quarter');
    if (quarterSelect) {
        quarterSelect.addEventListener('change', () => {
            console.log('Quarter changed to:', quarterSelect.value);
            FormManager.updateQuarterMonths();
        });
    }

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

    // Auto-name generation buttons
    const campaignNameBtn = document.querySelector('button[onclick="utmManager.generateUTM()"]');
    if (campaignNameBtn) {
        campaignNameBtn.addEventListener('click', () => utmManager.generateUTM());
    }

    const saveUtmBtn = document.querySelector('button[onclick="utmManager.saveUTM()"]');
    if (saveUtmBtn) {
        saveUtmBtn.addEventListener('click', () => utmManager.saveUTM());
    }

    const completeSessionBtn = document.querySelector('button[onclick="utmManager.completeSession()"]');
    if (completeSessionBtn) {
        completeSessionBtn.addEventListener('click', () => utmManager.completeSession());
    }

    // Initialize all dropdowns
    console.log('Initializing dropdowns...');
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateChannelDependencies();

    console.log('Initialization complete');
});
