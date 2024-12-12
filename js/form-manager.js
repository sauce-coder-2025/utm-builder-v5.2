// form-manager.js
window.FormManager = class {
    static logDebug(method, ...args) {
        console.log(`FormManager.${method}:`, ...args);
    }

    static generateCampaignName() {
        this.logDebug('generateCampaignName', 'called');
        
        const market = document.getElementById('market').value;
        const brand = document.getElementById('brand').value;
        const financialYear = document.getElementById('financialYear').value;
        const quarter = document.getElementById('quarter').value;
        const month = document.getElementById('month').value;
        const mediaObjective = document.getElementById('mediaObjective').value;

        if (!market || !brand || !financialYear || !quarter) {
            this.logDebug('generateCampaignName', 'missing required fields');
            return;
        }

        // Get brand abbreviation from config
        const brandAbbr = CONFIG.abbreviations.markets[market]?.[brand];
        if (!brandAbbr) {
            this.logDebug('generateCampaignName', 'brand abbreviation not found', { market, brand });
            return;
        }

        // Get month and objective abbreviations
        const monthAbbr = month ? CONFIG.abbreviations.month[month] : '';
        const objectiveAbbr = mediaObjective ? CONFIG.abbreviations.mediaObjective[mediaObjective] : '';

        const campaignName = [brandAbbr, financialYear, quarter, monthAbbr, objectiveAbbr]
            .filter(Boolean)
            .join('_')
            .toUpperCase();

        this.logDebug('generateCampaignName', 'generated name:', campaignName);
        document.getElementById('campaignName').value = campaignName;
        this.updateUTMFields();
    }

    static generateAdSetName() {
        this.logDebug('generateAdSetName', 'called');
        
        const productCategory = document.getElementById('productCategory').value;
        const subCategory = document.getElementById('subCategory').value;
        const buyType = document.getElementById('buyType').value;

        if (!productCategory || !buyType) {
            this.logDebug('generateAdSetName', 'missing required fields');
            return;
        }

        const categoryAbbr = CONFIG.abbreviations.category[productCategory];
        const subCategoryAbbr = subCategory ? CONFIG.abbreviations.subCategory[subCategory] : '';
        const buyTypeAbbr = CONFIG.abbreviations.buyType[buyType];

        const adSetName = [categoryAbbr, subCategoryAbbr, buyTypeAbbr]
            .filter(Boolean)
            .join('_')
            .toUpperCase();

        this.logDebug('generateAdSetName', 'generated name:', adSetName);
        document.getElementById('adSet').value = adSetName;
        this.updateUTMFields();
    }

    static updateBrandOptions() {
        const market = document.getElementById('market').value;
        const brandSelect = document.getElementById('brand');
        
        this.logDebug('updateBrandOptions', { market });
        
        brandSelect.innerHTML = '<option value="">Select...</option>';
        if (market && CONFIG.marketBrands[market]) {
            CONFIG.marketBrands[market].forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });
        }

        document.getElementById('campaignName').value = '';
        this.updateUTMFields();
    }

    static updateSubCategories() {
        const category = document.getElementById('productCategory').value;
        const subCategorySelect = document.getElementById('subCategory');
        
        this.logDebug('updateSubCategories', { category });
        
        subCategorySelect.innerHTML = '<option value="">Select...</option>';
        if (category && CONFIG.subCategories[category]) {
            CONFIG.subCategories[category].forEach(subcat => {
                const option = document.createElement('option');
                option.value = subcat;
                option.textContent = subcat;
                subCategorySelect.appendChild(option);
            });
        }

        document.getElementById('adSet').value = '';
        this.updateUTMFields();
    }

    static updateQuarterMonths() {
        const quarter = document.getElementById('quarter').value;
        const monthSelect = document.getElementById('month');
        
        this.logDebug('updateQuarterMonths', { quarter });
        
        monthSelect.innerHTML = '<option value="">Select...</option>';
        if (quarter && CONFIG.quarterMonths[quarter]) {
            CONFIG.quarterMonths[quarter].forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                monthSelect.appendChild(option);
            });
        }

        document.getElementById('campaignName').value = '';
        this.updateUTMFields();
    }

    static updateUTMFields() {
        const isManual = document.getElementById('manualUtmToggle').checked;
        if (isManual) return;

        const channelValue = document.getElementById('manualChannelToggle').checked ? 
            document.getElementById('channelInput').value : 
            document.getElementById('channelDropdown').value;
        const channelType = document.getElementById('channelType').value;
        const campaignName = document.getElementById('campaignName').value;
        const adName = document.getElementById('adName').value;

        const fields = {
            utmSource: channelValue,
            utmMedium: channelType,
            utmCampaign: campaignName,
            utmContent: adName
        };

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = Utils.formatUtmValue(value);
            }
        });
    }
};
