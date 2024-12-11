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

    // Add Auto buttons to campaign structure section
    // Campaign Name Auto button
    const campaignNameInput = document.getElementById('campaignName');
    const campaignNameWrapper = document.createElement('div');
    campaignNameWrapper.className = 'input-group-auto';
    
    if (campaignNameInput) {
        // Move the existing input
        const parent = campaignNameInput.parentNode;
        parent.removeChild(campaignNameInput);
        
        // Create and add the Auto button
        const autoButton = document.createElement('button');
        autoButton.type = 'button';
        autoButton.className = 'auto-button btn btn-sm';
        autoButton.textContent = 'Auto';
        autoButton.onclick = () => FormManager.generateCampaignName();
        
        // Add button and input to wrapper
        campaignNameWrapper.appendChild(autoButton);
        campaignNameWrapper.appendChild(campaignNameInput);
        parent.appendChild(campaignNameWrapper);
    }

    // Ad Set Auto button
    const adSetInput = document.getElementById('adSet');
    const adSetWrapper = document.createElement('div');
    adSetWrapper.className = 'input-group-auto';
    
    if (adSetInput) {
        // Move the existing input
        const parent = adSetInput.parentNode;
        parent.removeChild(adSetInput);
        
        // Create and add the Auto button
        const autoButton = document.createElement('button');
        autoButton.type = 'button';
        autoButton.className = 'auto-button btn btn-sm';
        autoButton.textContent = 'Auto';
        autoButton.onclick = () => FormManager.generateAdSetName();
        
        // Add button and input to wrapper
        adSetWrapper.appendChild(autoButton);
        adSetWrapper.appendChild(adSetInput);
        parent.appendChild(adSetWrapper);
    }

    // Initialize all dropdowns
    console.log('Initializing dropdowns...');
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateChannelDependencies();

    console.log('Initialization complete');
});
