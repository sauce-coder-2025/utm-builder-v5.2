class FormManager {
    static initialize() {
        console.log('Initializing FormManager');
        this.initializeDropdowns();
        this.addEventListeners();
    }

    static addEventListeners() {
        // Ensure all elements exist before adding listeners
        const elements = {
            market: document.getElementById('market'),
            brand: document.getElementById('brand'),
            productCategory: document.getElementById('productCategory'),
            subCategory: document.getElementById('subCategory'),
            financialYear: document.getElementById('financialYear'),
            quarter: document.getElementById('quarter'),
            month: document.getElementById('month'),
            mediaObjective: document.getElementById('mediaObjective'),
            specialField: document.getElementById('specialField'),
            promotionCheck: document.getElementById('promotionCheck'),
            npiCheck: document.getElementById('npiCheck'),
            channelDropdown: document.getElementById('channelDropdown'),
            channelType: document.getElementById('channelType'),
            manualChannelToggle: document.getElementById('manualChannelToggle'),
            manualUtmToggle: document.getElementById('manualUtmToggle')
        };

        // Verify all elements exist
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element ${key} not found`);
                return;
            }
        }

        // Add event listeners for campaign name generation
        elements.market.addEventListener('change', () => {
            this.updateBrandOptions();
            this.generateCampaignName();
        });

        elements.brand.addEventListener('change', () => this.generateCampaignName());
        
        elements.productCategory.addEventListener('change', () => {
            this.updateSubCategories();
            this.generateCampaignName();
        });
        
        elements.subCategory.addEventListener('change', () => {
            this.generateCampaignName();
            this.generateAdSetName();
        });
        
        elements.financialYear.addEventListener('change', () => this.generateCampaignName());
        
        elements.quarter.addEventListener('change', () => {
            this.updateQuarterMonths();
            this.generateCampaignName();
        });
        
        elements.month.addEventListener('change', () => this.generateCampaignName());
        elements.mediaObjective.addEventListener('change', () => this.generateCampaignName());
        elements.specialField.addEventListener('change', () => this.generateCampaignName());
        elements.promotionCheck.addEventListener('change', () => this.generateCampaignName());
        elements.npiCheck.addEventListener('change', () => this.generateCampaignName());

        // Channel dependency listeners
        elements.channelDropdown.addEventListener('change', () => {
            this.updateChannelDependencies();
            this.updateUTMFields();
        });

        elements.channelType.addEventListener('change', () => {
            this.updateBuyTypes();
            this.updateUTMFields();
            this.generateAdSetName();
        });

        // Toggle listeners
        elements.manualChannelToggle.addEventListener('change', () => this.toggleManualChannel());
        elements.manualUtmToggle.addEventListener('change', () => this.toggleManualUtm());

        // Ad name listener
        document.getElementById('adName').addEventListener('input', () => this.updateUTMFields());
    }

    static initializeDropdowns() {
        console.log('Initializing all dropdowns');
        this.updateBrandOptions();
        this.updateSubCategories();
        this.updateQuarterMonths();
        this.updateChannelDependencies();
    }

    static updateBrandOptions() {
        console.log('Updating brand options');
        const market = document.getElementById('market').value;
        const brandSelect = document.getElementById('brand');
        
        if (!brandSelect) {
            console.error('Brand select element not found');
            return;
        }
        
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
        console.log('Updating subcategories');
        const category = document.getElementById('productCategory').value;
        const subCategorySelect = document.getElementById('subCategory');
        
        if (!subCategorySelect) {
            console.error('Subcategory select element not found');
            return;
        }
        
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
        console.log('Updating quarter months');
        const quarter = document.getElementById('quarter').value;
        const monthSelect = document.getElementById('month');
        
        if (!monthSelect) {
            console.error('Month select element not found');
            return;
        }
        
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
        console.log('Updating channel dependencies');
        const isManual = document.getElementById('manualChannelToggle').checked;
        const channel = document.getElementById('channelDropdown').value;
        const channelTypeSelect = document.getElementById('channelType');
        const mediaObjectiveSelect = document.getElementById('mediaObjective');
        const buyTypeSelect = document.getElementById('buyType');
        
        if (!channelTypeSelect || !mediaObjectiveSelect || !buyTypeSelect) {
            console.error('One or more dependent select elements not found');
            return;
        }

        // Reset all dependent dropdowns
        channelTypeSelect.innerHTML = '<option value="">Select...</option>';
        mediaObjectiveSelect.innerHTML = '<option value="">Select...</option>';
        buyTypeSelect.innerHTML = '<option value="">Select...</option>';

        // Always add media objectives
        const objectives = ['Attract', 'Engage', 'Convert', 'Retain'];
        objectives.forEach(objective => {
            const option = document.createElement('option');
            option.value = objective;
            option.textContent = objective;
            mediaObjectiveSelect.appendChild(option);
        });

        if (isManual) {
            // Add manual channel types
            CONFIG.manualChannelTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                channelTypeSelect.appendChild(option);
            });
        } else if (channel && CONFIG.channelDependencies[channel]) {
            const dependencies = CONFIG.channelDependencies[channel];
            
            // Update channel types
            dependencies.channelTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                channelTypeSelect.appendChild(option);
            });

            // Update buy types
            dependencies.buyTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                buyTypeSelect.appendChild(option);
            });
        }
    }

    static updateBuyTypes() {
        const channelType = document.getElementById('channelType').value;
        const buyTypeSelect = document.getElementById('buyType');
        const isManual = document.getElementById('manualChannelToggle').checked;

        if (!buyTypeSelect) {
            console.error('Buy type select element not found');
            return;
        }

        buyTypeSelect.innerHTML = '<option value="">Select...</option>';

        if (isManual && channelType && CONFIG.manualBuyTypes[channelType]) {
            CONFIG.manualBuyTypes[channelType].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                buyTypeSelect.appendChild(option);
            });
        }
    }

    static generateCampaignName() {
        console.log('Generating campaign name');
        const market = document.getElementById('market').value;
        const brand = document.getElementById('brand').value;
        const financialYear = document.getElementById('financialYear').value;
        const quarter = document.getElementById('quarter').value;
        const month = document.getElementById('month').value;
        const mediaObjective = document.getElementById('mediaObjective').value;
        
        // New fields
        const specialField = document.getElementById('specialField').value;
        const promotionCheck = document.getElementById('promotionCheck').checked;
        const npiCheck = document.getElementById('npiCheck').checked;

        if (!market || !brand || !financialYear || !quarter) return;

        const brandAbbr = CONFIG.abbreviations.markets[market]?.[brand] || brand;
        const monthAbbr = month ? CONFIG.abbreviations.month[month] : '';
        const objectiveAbbr = mediaObjective ? CONFIG.abbreviations.mediaObjective[mediaObjective] : '';
        
        // New field abbreviations
        const specialFieldAbbr = specialField ? CONFIG.abbreviations.specialFields[specialField] : '';
        const promotionAbbr = promotionCheck ? CONFIG.abbreviations.specialFields['Promotion'] : '';
        const npiAbbr = npiCheck ? CONFIG.abbreviations.specialFields['NPI'] : '';

        const campaignElements = [
            brandAbbr, 
            financialYear, 
            quarter, 
            monthAbbr, 
            objectiveAbbr,
            specialFieldAbbr,
            promotionAbbr,
            npiAbbr
        ].filter(Boolean);
        
        const campaignName = campaignElements.join('_');
        document.getElementById('campaignName').value = campaignName;
        this.updateUTMFields();
    }

    static generateAdSetName() {
        console.log('Generating ad set name');
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

    static toggleManualChannel() {
        console.log('Toggling manual channel input');
        const isManual = document.getElementById('manualChannelToggle').checked;
        const dropdownDiv = document.getElementById('channelDropdown');
        const inputDiv = document.getElementById('channelInput');
        
        if (!dropdownDiv || !inputDiv) {
            console.error('Channel input elements not found');
            return;
        }

        dropdownDiv.style.display = isManual ? 'none' : 'block';
        inputDiv.style.display = isManual ? 'block' : 'none';
        
        if (isManual) {
            inputDiv.value = '';
            dropdownDiv.value = '';
            
            // Add event listener for manual input changes
            inputDiv.addEventListener('input', () => {
                this.updateUTMFields();
            });
        }
        
        this.updateChannelDependencies();
        this.updateUTMFields();
    }

    static toggleManualUtm() {
        console.log('Toggling manual UTM input');
        const isManual = document.getElementById('manualUtmToggle').checked;
        const utmFields = ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm'];
        
        utmFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.readOnly = !isManual;
                if (isManual) {
                    field.value = '';
                } else {
                    this.updateUTMFields();
                }
            }
        });
    }

    static updateUTMFields() {
        console.log('Updating UTM fields');
        if (document.getElementById('manualUtmToggle').checked) return;

        const isManualChannel = document.getElementById('manualChannelToggle').checked;
        const channel = isManualChannel 
            ? document.getElementById('channelInput').value 
            : document.getElementById('channelDropdown').value;
        const channelType = document.getElementById('channelType').value;
        const campaignName = document.getElementById('campaignName').value;
        const adName = document.getElementById('adName').value;

        // Update UTM fields
        document.getElementById('utmSource').value = Utils.formatUtmValue(channel);
        document.getElementById('utmMedium').value = Utils.formatUtmValue(channelType);
        document.getElementById('utmCampaign').value = Utils.formatUtmValue(campaignName);
        document.getElementById('utmContent').value = Utils.formatUtmValue(adName);
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
            adName: document.getElementById('adName').value,
            specialField: document.getElementById('specialField').value,
            promotionCheck: document.getElementById('promotionCheck').checked,
            npiCheck: document.getElementById('npiCheck').checked
        };
    }
}

// Initialize FormManager on window
if (typeof window !== 'undefined') {
    window.FormManager = FormManager;
}
