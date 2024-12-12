// Declare FormManager class
window.FormManager = class FormManager {
    static logDebug(method, ...args) {
        console.log(`FormManager.${method}:`, ...args);
    }

    // Product Category -> Sub Category dependency
    static updateSubCategories() {
        const category = document.getElementById('productCategory').value;
        const subCategorySelect = document.getElementById('subCategory');
        const options = CONFIG.subCategories[category] || [];
        
        subCategorySelect.innerHTML = '<option value="">Select...</option>';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            subCategorySelect.appendChild(optionElement);
        });

        // Clear any dependent fields
        this.updateUTMFields();
    }

    // Market -> Brand dependency
    static updateBrandOptions() {
        console.log('updateBrandOptions called');
        const market = document.getElementById('market').value;
        const brandSelect = document.getElementById('brand');
        
        console.log('Market value:', market);
        console.log('CONFIG:', CONFIG);
        console.log('Available brands:', CONFIG.marketBrands[market]);
        
        brandSelect.innerHTML = '<option value="">Select...</option>';
        if (market && CONFIG.marketBrands[market]) {
            CONFIG.marketBrands[market].forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });
        }

        // Clear dependent fields
        document.getElementById('campaignName').value = '';
        this.updateUTMFields();
    }

    static generateCampaignName() {
        const market = document.getElementById('market').value;
        const brand = document.getElementById('brand').value;
        const financialYear = document.getElementById('financialYear').value;
        const quarter = document.getElementById('quarter').value;
        const month = document.getElementById('month').value;
        const mediaObjective = document.getElementById('mediaObjective').value;

        if (!market || !brand || !financialYear || !quarter) return;

        // Get brand abbreviation from config
        const brandAbbr = CONFIG.abbreviations.markets[market]?.[brand] || brand;
        
        // Get month abbreviation
        const monthAbbr = month ? CONFIG.abbreviations.month[month] : '';
        
        // Get objective abbreviation
        const objectiveAbbr = mediaObjective ? CONFIG.abbreviations.mediaObjective[mediaObjective] : '';

        // Construct campaign name
        const campaignElements = [
            brandAbbr,
            financialYear,
            quarter,
            monthAbbr,
            objectiveAbbr
        ].filter(Boolean);

        const campaignName = campaignElements.join('_').toUpperCase();
        document.getElementById('campaignName').value = campaignName;
        this.updateUTMFields();
    }

    // Add other methods here...

    static updateUTMFields() {
        const isManual = document.getElementById('manualUtmToggle').checked;
        if (isManual) return;

        const isManualChannel = document.getElementById('manualChannelToggle').checked;
        const channelValue = isManualChannel ? 
            document.getElementById('channelInput').value : 
            document.getElementById('channelDropdown').value;
        const channelType = document.getElementById('channelType').value;
        const campaignName = document.getElementById('campaignName').value;
        const adName = document.getElementById('adName').value;
        
        document.getElementById('utmSource').value = Utils.formatUtmValue(channelValue);
        document.getElementById('utmMedium').value = Utils.formatUtmValue(channelType);
        document.getElementById('utmCampaign').value = Utils.formatUtmValue(campaignName);
        document.getElementById('utmContent').value = Utils.formatUtmValue(adName);
    }
};

// Add to window object and log
window.FormManager = FormManager;
console.log('FormManager loaded:', typeof FormManager !== 'undefined');
