class FormManager {
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

    static updateChannelDependencies() {
        const isManual = document.getElementById('manualChannelToggle').checked;
        const channel = isManual ? 
            document.getElementById('channelInput').value :
            document.getElementById('channelDropdown').value;
        const channelTypeSelect = document.getElementById('channelType');
        const mediaObjectiveSelect = document.getElementById('mediaObjective');
        const buyTypeSelect = document.getElementById('buyType');
        
        // Update channel types
        channelTypeSelect.innerHTML = '<option value="">Select...</option>';
        if (channel && CONFIG.channelDependencies[channel]) {
            CONFIG.channelDependencies[channel].channelTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                channelTypeSelect.appendChild(option);
            });
        }

        // Update media objectives
        mediaObjectiveSelect.innerHTML = '<option value="">Select...</option>';
        if (channel && CONFIG.channelDependencies[channel]) {
            CONFIG.channelDependencies[channel].mediaObjectives.forEach(objective => {
                const option = document.createElement('option');
                option.value = objective;
                option.textContent = objective;
                mediaObjectiveSelect.appendChild(option);
            });
        }

        // Update buy types
        buyTypeSelect.innerHTML = '<option value="">Select...</option>';
        if (channel && CONFIG.channelDependencies[channel]) {
            CONFIG.channelDependencies[channel].buyTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                buyTypeSelect.appendChild(option);
            });
        }
    }

    static generateCampaignName() {
        const market = document.getElementById('market').value;
        const brand = document.getElementById('brand').value;
        const mediaObjective = document.getElementById('mediaObjective').value;
        const financialYear = document.getElementById('financialYear').value;
        const quarter = document.getElementById('quarter').value;
        const month = document.getElementById('month').value;

        if (!market || !brand || !mediaObjective || !financialYear || !quarter || !month) {
            Utils.showNotification('Please fill in all required fields first');
            return;
        }

        const marketBrandCode = CONFIG.abbreviations.markets[market][brand];
        const objectiveCode = CONFIG.abbreviations.mediaObjective[mediaObjective];
        const monthCode = CONFIG.abbreviations.month[month];

        const campaignName = `${marketBrandCode}_${objectiveCode}_${financialYear}_${quarter}_${monthCode}`;
        document.getElementById('campaignName').value = campaignName;
        
        this.updateUTMFields();
    }

    static generateAdSetName() {
        const mediaObjective = document.getElementById('mediaObjective').value;
        const buyType = document.getElementById('buyType').value;
        const category = document.getElementById('productCategory').value;
        const subCategory = document.getElementById('subCategory').value;

        if (!mediaObjective || !buyType) {
            Utils.showNotification('Please select Media Objective and Buy Type first');
            return;
        }

        const objectiveCode = CONFIG.abbreviations.mediaObjective[mediaObjective];
        const buyTypeCode = CONFIG.abbreviations.buyType[buyType];
        const categoryCode = category ? CONFIG.abbreviations.category[category] || '' : '';
        const subCategoryCode = subCategory ? '_' + (CONFIG.abbreviations.subCategory[subCategory] || '') : '';
        
        const adSetName = `${objectiveCode}_${buyTypeCode}${categoryCode ? '_' + categoryCode : ''}${subCategoryCode}`;
        document.getElementById('adSet').value = adSetName;
    }

    static toggleManualChannel() {
        const isManual = document.getElementById('manualChannelToggle').checked;
        const channelDropdown = document.getElementById('channelDropdown');
        const channelInput = document.getElementById('channelInput');
        
        channelDropdown.style.display = isManual ? 'none' : 'block';
        channelInput.style.display = isManual ? 'block' : 'none';
        
        // Clear values when switching
        if (isManual) {
            channelDropdown.value = '';
            channelInput.value = '';
        } else {
            channelInput.value = '';
            channelDropdown.value = '';
        }
        
        // Update dependent fields
        this.updateChannelDependencies();
        this.updateUTMFields();
    }

    static toggleManualUtm() {
        const isManual = document.getElementById('manualUtmToggle').checked;
        const utmFields = ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent'];
        
        utmFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.readOnly = !isManual;
            if (!isManual) {
                this.updateUTMFields();
            }
        });
    }

    static updateUTMFields() {
        const isManual = document.getElementById('manualUtmToggle').checked;
        if (isManual) return;

        const channel = document.getElementById('channel');
        const otherChannel = document.getElementById('otherChannel');
        const channelType = document.getElementById('channelType');
        const campaignName = document.getElementById('campaignName');
        const adName = document.getElementById('adName');
        
        const channelValue = channel.value === 'other' ? otherChannel.value : channel.value;
        
        document.getElementById('utmSource').value = Utils.formatUtmValue(channelValue);
        document.getElementById('utmMedium').value = Utils.formatUtmValue(channelType.value);
        document.getElementById('utmCampaign').value = Utils.formatUtmValue(campaignName.value);
        document.getElementById('utmContent').value = Utils.formatUtmValue(adName.value);
    }

    static getFormData() {
        return {
            baseUrl: document.getElementById('baseUrl').value,
            channel: document.getElementById('channel').value === 'other' ? 
                    document.getElementById('otherChannel').value : 
                    document.getElementById('channel').value,
            campaignName: document.getElementById('campaignName').value,
            adName: document.getElementById('adName').value,
            adSet: document.getElementById('adSet').value,
            medium: document.getElementById('channelType').value.toLowerCase(),
            market: document.getElementById('market').value,
            brand: document.getElementById('brand').value,
            productCategory: document.getElementById('productCategory').value,
            subCategory: document.getElementById('subCategory').value,
            financialYear: document.getElementById('financialYear').value,
            quarter: document.getElementById('quarter').value,
            month: document.getElementById('month').value,
            mediaObjective: document.getElementById('mediaObjective').value,
            buyType: document.getElementById('buyType').value,
            channelType: document.getElementById('channelType').value
        };
    }
}
