window.FormManager = class {
    static initialize() {
        console.log('Initializing FormManager');
        this.attachEventListeners();
    }

    static attachEventListeners() {
        // Market change handler
        document.getElementById('market')?.addEventListener('change', () => {
            this.updateBrandOptions();
            this.generateCampaignName();
        });

        // Brand change handler
        document.getElementById('brand')?.addEventListener('change', () => {
            this.generateCampaignName();
        });

        // Media Objective change handler
        document.getElementById('mediaObjective')?.addEventListener('change', () => {
            this.generateCampaignName();
            this.generateAdSetName();
        });

        // Campaign Timing handlers
        document.getElementById('financialYear')?.addEventListener('change', () => {
            this.generateCampaignName();
        });

        document.getElementById('quarter')?.addEventListener('change', () => {
            this.updateQuarterMonths();
            this.generateCampaignName();
        });

        document.getElementById('month')?.addEventListener('change', () => {
            this.generateCampaignName();
        });

        // Product Category handlers
        document.getElementById('productCategory')?.addEventListener('change', () => {
            this.updateSubCategories();
            this.generateAdSetName();
        });

        document.getElementById('subCategory')?.addEventListener('change', () => {
            this.generateAdSetName();
        });

        // Buy Type handler
        document.getElementById('buyType')?.addEventListener('change', () => {
            this.generateAdSetName();
        });

        // Source/Medium handlers
        document.getElementById('channelDropdown')?.addEventListener('change', () => {
            this.updateChannelDependencies();
        });

        document.getElementById('channelType')?.addEventListener('change', () => {
            this.updateBuyTypes();
        });

        // Manual toggle handlers
        document.getElementById('manualChannelToggle')?.addEventListener('change', () => {
            this.toggleManualChannel();
        });

        document.getElementById('manualUtmToggle')?.addEventListener('change', () => {
            this.toggleManualUtm();
        });
    }

    static updateBrandOptions() {
        const market = document.getElementById('market').value;
        const brandSelect = document.getElementById('brand');
        
        brandSelect.innerHTML = '<option value="">Select...</option>';
        if (market && CONFIG.marketBrands[market]) {
            CONFIG.marketBrands[market].forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });
        }
    }

    static updateSubCategories() {
        const category = document.getElementById('productCategory').value;
        const subCategorySelect = document.getElementById('subCategory');
        const options = CONFIG.subCategories[category] || [];
        
        subCategorySelect.innerHTML = '<option value="">Select...</option>';
        options.forEach(option => {
            const option = document.createElement('option');
            option.value = option;
            option.textContent = option;
            subCategorySelect.appendChild(option);
        });

        this.updateUTMFields();
    }

    // Add all other methods from the previous FormManager class...

    static generateCampaignName() {
        const market = document.getElementById('market').value;
        const brand = document.getElementById('brand').value;
        const financialYear = document.getElementById('financialYear').value;
        const quarter = document.getElementById('quarter').value;
        const month = document.getElementById('month').value;
        const mediaObjective = document.getElementById('mediaObjective').value;

        if (!market || !brand || !financialYear || !quarter) return;

        const brandAbbr = CONFIG.abbreviations.markets[market]?.[brand] || brand;
        const monthAbbr = month ? CONFIG.abbreviations.month[month] : '';
        const objectiveAbbr = mediaObjective ? CONFIG.abbreviations.mediaObjective[mediaObjective] : '';

        const campaignElements = [brandAbbr, financialYear, quarter, monthAbbr, objectiveAbbr].filter(Boolean);
        const campaignName = campaignElements.join('_').toUpperCase();
        
        document.getElementById('campaignName').value = campaignName;
        this.updateUTMFields();
    }

    static generateAdSetName() {
        const productCategory = document.getElementById('productCategory').value;
        const subCategory = document.getElementById('subCategory').value;
        const buyType = document.getElementById('buyType').value;

        if (!productCategory || !buyType) return;

        const categoryAbbr = CONFIG.abbreviations.category[productCategory] || productCategory;
        const subCategoryAbbr = subCategory ? CONFIG.abbreviations.subCategory[subCategory] : '';
        const buyTypeAbbr = CONFIG.abbreviations.buyType[buyType] || buyType;

        const adSetElements = [categoryAbbr, subCategoryAbbr, buyTypeAbbr].filter(Boolean);
        const adSetName = adSetElements.join('_').toUpperCase();
        
        document.getElementById('adSet').value = adSetName;
        this.updateUTMFields();
    }
}
