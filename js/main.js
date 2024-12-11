document.addEventListener('DOMContentLoaded', function() {
    // Campaign Organization dependencies
    document.getElementById('market').addEventListener('change', () => {
        FormManager.updateBrandOptions();
    });
    
    document.getElementById('productCategory').addEventListener('change', () => {
        FormManager.updateSubCategories();
    });

    // Campaign Timing dependencies
    document.getElementById('quarter').addEventListener('change', () => {
        FormManager.updateQuarterMonths();
    });

    // Campaign Details dependencies
    document.getElementById('channelDropdown').addEventListener('change', () => {
        FormManager.updateChannelDependencies();
    });
    
    document.getElementById('channelInput').addEventListener('input', () => {
        FormManager.updateChannelDependencies();
    });

    document.getElementById('channelType').addEventListener('change', () => {
        FormManager.updateBuyTypes();
    });

    // Manual toggles
    document.getElementById('manualChannelToggle').addEventListener('change', () => {
        FormManager.toggleManualChannel();
    });

    document.getElementById('manualUtmToggle').addEventListener('change', () => {
        FormManager.toggleManualUtm();
    });

    // UTM field updates
    document.getElementById('channelDropdown').addEventListener('change', FormManager.updateUTMFields);
    document.getElementById('channelInput').addEventListener('input', FormManager.updateUTMFields);
    document.getElementById('channelType').addEventListener('change', FormManager.updateUTMFields);
    document.getElementById('campaignName').addEventListener('input', FormManager.updateUTMFields);
    document.getElementById('adName').addEventListener('input', FormManager.updateUTMFields);

    // Add input formatters for manual UTM fields
    document.querySelectorAll('#utmSource, #utmMedium, #utmCampaign, #utmContent, #utmTerm')
        .forEach(input => {
            input.addEventListener('input', function() {
                if (document.getElementById('manualUtmToggle').checked) {
                    this.value = Utils.formatUtmValue(this.value);
                }
            });
        });

    // Auto button handlers
    document.querySelectorAll('.auto-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const input = this.closest('.input-group-auto').querySelector('input');
            if (input.id === 'campaignName') {
                FormManager.generateCampaignName();
            } else if (input.id === 'adSet') {
                FormManager.generateAdSetName();
            }
        });
    });

    // Initialize dropdowns
    FormManager.updateBrandOptions();
    FormManager.updateSubCategories();
    FormManager.updateQuarterMonths();
    FormManager.updateChannelDependencies();
});
