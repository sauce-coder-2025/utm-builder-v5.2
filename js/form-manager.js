class FormManager {
    static initialize() {
        this.attachEventListeners();
        this.initializeDropdowns();
    }

    static initializeDropdowns() {
        this.updateBrandOptions();
        this.updateSubCategories();
        this.updateQuarterMonths();
        this.updateChannelDependencies();
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
        
        subCategorySelect.innerHTML = '<option value="">Select...</option>';
        if (category && CONFIG.subCategories[category]) {
            CONFIG.subCategories[category].forEach(subCat => {
                const option = document.createElement('option');
                option.value = subCat;
                option.textContent = subCat;
                subCategorySelect.appendChild(option);
            });
        }
    }

    static updateQuarterMonths() {
        const quarter = document.getElementById('quarter').value;
        const monthSelect = document.getElementById('month');
        
        monthSelect.innerHTML = '<option value="">Select...</option>';
        if (quarter && CONFIG.quarterMonths[quarter]) {
            CONFIG.quarterMonths[quarter].forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                monthSelect.appendChild(option);
            });
        }
    }

    static updateChannelDependencies() {
        const channel = document.getElementById('channelDropdown').value;
        const channelTypeSelect = document.getElementById('channelType');
        const mediaObjectiveSelect = document.getElementById('mediaObjective');
        const buyTypeSelect = document.getElementById('buyType');
        
        // Reset all dependent dropdowns
        channelTypeSelect.innerHTML = '<option value="">Select...</option>';
        mediaObjectiveSelect.innerHTML = '<option value="">Select...</option>';
        buyTypeSelect.innerHTML = '<option value="">Select...</option>';

        if (channel && CONFIG.channelDependencies[channel]) {
            const dependencies = CONFIG.channelDependencies[channel];
            
            // Update channel types
            dependencies.channelTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                channelTypeSelect.appendChild(option);
            });

            // Update media objectives
            dependencies.mediaObjectives.forEach(objective => {
                const option = document.createElement('option');
                option.value = objective;
                option.textContent = objective;
                mediaObjectiveSelect.appendChild(option);
            });

            // Update buy types
            dependencies.buyTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                buyTypeSelect.appendChild(option);
            });
        }

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

        const brandAbbr = CONFIG.abbreviations.markets[market]?.[brand] || brand;
        const monthAbbr = month ? CONFIG.abbreviations.month[month] : '';
        const objectiveAbbr = mediaObjective ? CONFIG.abbreviations.mediaObjective[mediaObjective] : '';

        const campaignElements = [brandAbbr, financialYear, quarter, monthAbbr, objectiveAbbr]
            .filter(Boolean);
        
        const campaignName = campaignElements.join('_');
        document.getElementById('campaignName').value = campaignName;
        this.updateUTMFields();
    }

    static generateAdSetName() {
        const productCategory = document.getElementById('productCategory').value;
        const subCategory = document.getElementById('subCategory').value;
        const buyType = document.getElementById('buyType').value;

        if (!productCategory) return;

        const categoryAbbr = CONFIG.abbreviations.category[productCategory] || productCategory;
        const subCategoryAbbr = subCategory ? CONFIG.abbreviations.subCategory[subCategory] : '';
        const buyTypeAbbr = buyType ? CONFIG.abbreviations.buyType[buyType] : '';

        const adSetElements = [categoryAbbr, subCategoryAbbr, buyTypeAbbr]
            .filter(Boolean);
            
        const adSetName = adSetElements.join('_');
        document.getElementById('adSet').value = adSetName;
    }

    static updateUTMFields() {
        if (document.getElementById('manualUtmToggle').checked) return;

        const channel = document.getElementById('channelDropdown').value;
        const channelType = document.getElementById('channelType').value;
        const campaignName = document.getElementById('campaignName').value;
        const adName = document.getElementById('adName').value;

        // Update UTM fields
        document.getElementById('utmSource').value = Utils.formatUtmValue(channel);
        document.getElementById('utmMedium').value = Utils.formatUtmValue(channelType);
        document.getElementById('utmCampaign').value = Utils.formatUtmValue(campaignName);
        document.getElementById('utmContent').value = Utils.formatUtmValue(adName);
    }

    static toggleManualChannel() {
        const isManual = document.getElementById('manualChannelToggle').checked;
        const dropdownDiv = document.getElementById('channelDropdown');
        const inputDiv = document.getElementById('channelInput');

        dropdownDiv.style.display = isManual ? 'none' : 'block';
        inputDiv.style.display = isManual ? 'block' : 'none';
        
        if (isManual) {
            inputDiv.value = '';
        } else {
            dropdownDiv.value = '';
        }
        
        this.updateChannelDependencies();
    }

    static toggleManualUtm() {
        const isManual = document.getElementById('manualUtmToggle').checked;
        const utmFields = ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent'];
        
        utmFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.readOnly = !isManual;
            if (isManual) {
                field.value = '';
            } else {
                this.updateUTMFields();
            }
        });
    }

    static getFormData() {
        return {
            market: document.getElementById('market').value,
            brand: document.getElementById('brand').value,
            productCategory: document.getElementById('productCategory').value,
            subCategory: document.getElementById('subCategory').value,
            financialYear: document.getElementById('financialYear').value,
            quarter: document.getElementById('quarter').value,
            month: document.getElementById('month').value,
            channel: document.getElementById('channelDropdown').value,
            channelType: document.getElementById('channelType').value,
            mediaObjective: document.getElementById('mediaObjective').value,
            buyType: document.getElementById('buyType').value,
            baseUrl: document.getElementById('baseUrl').value,
            campaignName: document.getElementById('campaignName').value,
            adSet: document.getElementById('adSet').value,
            adName: document.getElementById('adName').value
        };
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    FormManager.initialize();
});
