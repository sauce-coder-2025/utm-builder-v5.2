document.addEventListener('DOMContentLoaded', function() {
    // Add market change listener
    document.getElementById('market').addEventListener('change', FormManager.updateBrandOptions);
    
    // Add quarter change listener
    document.getElementById('quarter').addEventListener('change', () => {
        FormManager.updateQuarterMonths();
    });

    // Add channel type change listener
    document.getElementById('channelType').addEventListener('change', () => {
        FormManager.updateBuyTypes();
    });

    // Add channel change listeners
    document.getElementById('channelDropdown').addEventListener('change', () => {
        FormManager.updateChannelDependencies();
    });
    
    document.getElementById('channelInput').addEventListener('input', () => {
        FormManager.updateChannelDependencies();
    });

    // Add manual channel toggle listener
    document.getElementById('manualChannelToggle').addEventListener('change', () => {
        FormManager.toggleManualChannel();
    });

    // Add product category change listener
    document.getElementById('productCategory').addEventListener('change', FormManager.updateSubCategories);

    // Add event listeners for UTM field updates
    document.getElementById('channel').addEventListener('change', FormManager.updateUTMFields);
    document.getElementById('otherChannel').addEventListener('input', FormManager.updateUTMFields);
    document.getElementById('channelType').addEventListener('change', FormManager.updateUTMFields);
    document.getElementById('campaignName').addEventListener('input', FormManager.updateUTMFields);
    document.getElementById('adName').addEventListener('input', FormManager.updateUTMFields);

    // Add manual UTM toggle listener
    document.getElementById('manualUtmToggle').addEventListener('change', () => FormManager.toggleManualUtm());

    // Add input formatters for manual UTM fields
    document.querySelectorAll('#utmSource, #utmMedium, #utmCampaign, #utmContent, #utmTerm')
        .forEach(input => {
            input.addEventListener('input', function() {
                if (document.getElementById('manualUtmToggle').checked) {
                    this.value = Utils.formatUtmValue(this.value);
                }
            });
        });

    // Add Auto buttons to campaign structure section
    // Campaign Name Auto button
    const campaignNameDiv = document.getElementById('campaignName').parentNode;
    const campaignNameWrapper = document.createElement('div');
    campaignNameWrapper.className = 'input-group-auto';
    
    // Move the existing input
    const campaignNameInput = document.getElementById('campaignName');
    campaignNameDiv.removeChild(campaignNameInput);
    
    // Add button and input to wrapper
    campaignNameWrapper.appendChild(Utils.createAutoButton(() => FormManager.generateCampaignName()));
    campaignNameWrapper.appendChild(campaignNameInput);
    campaignNameDiv.appendChild(campaignNameWrapper);

    // Ad Set Auto button
    const adSetDiv = document.getElementById('adSet').parentNode;
    const adSetWrapper = document.createElement('div');
    adSetWrapper.className = 'input-group-auto';
    
    // Move the existing input
    const adSetInput = document.getElementById('adSet');
    adSetDiv.removeChild(adSetInput);
    
    // Add button and input to wrapper
    adSetWrapper.appendChild(Utils.createAutoButton(() => FormManager.generateAdSetName()));
    adSetWrapper.appendChild(adSetInput);
    adSetDiv.appendChild(adSetWrapper);

    // Add click handlers for UTM generation buttons
    document.querySelector('button[onclick="generateUTM()"]')
        .addEventListener('click', () => utmManager.generateUTM());
    
    document.querySelector('button[onclick="saveUTM()"]')
        .addEventListener('click', () => utmManager.saveUTM());
    
    document.querySelector('button[onclick="completeSession()"]')
        .addEventListener('click', () => utmManager.completeSession());
});
