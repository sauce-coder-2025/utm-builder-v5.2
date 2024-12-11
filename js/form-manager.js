class FormManager {
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
        const market = document.getElementById('market').value;
        const brandSelect = document.getElementById('brand');
        
        this.logDebug('updateBrandOptions', { market, availableBrands: CONFIG.marketBrands[market] });
        
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

    // Quarter -> Month dependency
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

        // Clear dependent fields
        document.getElementById('campaignName').value = '';
        this.updateUTMFields();
    }

    // Source/Channel -> Medium dependency and others
    static updateChannelDependencies() {
        const isManual = document.getElementById('manualChannelToggle').checked;
        const channelTypeSelect = document.getElementById('channelType');
        const mediaObjectiveSelect = document.getElementById('mediaObjective');
        const buyTypeSelect = document.getElementById('buyType');
        
        // Update Medium (Channel Type) options
        channelTypeSelect.innerHTML = '<option value="">Select...</option>';
        
        if (isManual) {
            // Add manual channel types
            CONFIG.manualChannelTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                channelTypeSelect.appendChild(option);
            });
        } else {
            const channel = document.getElementById('channelDropdown').value;
            if (channel && CONFIG.channelDependencies[channel]) {
                CONFIG.channelDependencies[channel].channelTypes.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    channelTypeSelect.appendChild(option);
                });
            }
        }

        // Update media objectives
        mediaObjectiveSelect.innerHTML = '<option value="">Select...</option>';
        ['Attract', 'Engage', 'Convert', 'Retain'].forEach(objective => {
            const option = document.createElement('option');
            option.value = objective;
            option.textContent = objective;
            mediaObjectiveSelect.appendChild(option);
        });

        // Clear and update buy types
        buyTypeSelect.innerHTML = '<option value="">Select...</option>';
        this.updateBuyTypes();
        this.updateUTMFields();
    }

    // Medium (Channel Type) -> Buy Type dependency
    static updateBuyTypes() {
        const isManual = document.getElementById('manualChannelToggle').checked;
        const channelType = document.getElementById('channelType').value;
        const buyTypeSelect = document.getElementById('buyType');
        
        buyTypeSelect.innerHTML = '<option value="">Select...</option>';
        
        if (isManual && channelType) {
            const buyTypes = CONFIG.manualBuyTypes[channelType] || [];
            buyTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                buyTypeSelect.appendChild(option);
            });
        } else if (!isManual) {
            const channel = document.getElementById('channelDropdown').value;
            if (channel && CONFIG.channelDependencies[channel]) {
                CONFIG.channelDependencies[channel].buyTypes.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    buyTypeSelect.appendChild(option);
                });
            }
        }
        this.updateUTMFields();
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

    static getFormData() {
        return {
            baseUrl: document.getElementById('baseUrl').value,
            channel: document.getElementById('manualChannelToggle').checked ?
                    document.getElementById('channelInput').value :
                    document.getElementById('channelDropdown').value,
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
