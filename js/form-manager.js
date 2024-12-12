class FormManager {
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

        // Construct campaign name: BRAND_FY_QUARTER_MONTH_OBJECTIVE
        const campaignElements = [
            brandAbbr,
            financialYear,
            quarter,
            monthAbbr,
            objectiveAbbr
        ].filter(Boolean); // Remove empty values

        const campaignName = campaignElements.join('_').toUpperCase();
        document.getElementById('campaignName').value = campaignName;
        
        // Update UTM fields
        this.updateUTMFields();
    }

    static generateAdSetName() {
        const productCategory = document.getElementById('productCategory').value;
        const subCategory = document.getElementById('subCategory').value;
        const buyType = document.getElementById('buyType').value;

        if (!productCategory || !buyType) return;

        // Get abbreviations from config
        const categoryAbbr = CONFIG.abbreviations.category[productCategory] || productCategory;
        const subCategoryAbbr = subCategory ? CONFIG.abbreviations.subCategory[subCategory] : '';
        const buyTypeAbbr = CONFIG.abbreviations.buyType[buyType] || buyType;

        // Construct ad set name: CATEGORY_SUBCATEGORY_BUYTYPE
        const adSetElements = [
            categoryAbbr,
            subCategoryAbbr,
            buyTypeAbbr
        ].filter(Boolean);

        const adSetName = adSetElements.join('_').toUpperCase();
        document.getElementById('adSet').value = adSetName;
        
        // Update UTM fields
        this.updateUTMFields();
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

    static generateCampaignName() {
        const data = this.getFormData();
        if (!data.market || !data.brand || !data.financialYear || !data.quarter) return;

        // Format: MARKET_BRAND_FY_QUARTER_MONTH_OBJECTIVE
        const campaignElements = [
            data.market,
            data.brand,
            data.financialYear,
            data.quarter,
            data.month,
            data.mediaObjective
        ].filter(Boolean); // Remove empty values

        const campaignName = campaignElements.join('_').toLowerCase();
        document.getElementById('campaignName').value = campaignName;
        
        // Update UTM campaign parameter
        document.getElementById('utmCampaign').value = campaignName;
    }

    static generateAdSetName() {
        const data = this.getFormData();
        if (!data.productCategory || !data.buyType) return;

        // Format: PRODUCTCATEGORY_SUBCATEGORY_BUYTYPE
        const adSetElements = [
            data.productCategory,
            data.subCategory,
            data.buyType
        ].filter(Boolean);

        const adSetName = adSetElements.join('_').toLowerCase();
        document.getElementById('adSet').value = adSetName;
        
        // Update UTM content parameter if ad name is empty
        if (!document.getElementById('adName').value) {
            document.getElementById('utmContent').value = adSetName;
        }
    }

    static updateBrandOptions() {
        const market = document.getElementById('market').value;
        const brandSelect = document.getElementById('brand');
        
        // Clear existing options
        brandSelect.innerHTML = '<option value="">Select...</option>';
        
        // Add brands based on market
        const brands = {
            'AU': ['Brand1_AU', 'Brand2_AU'],
            'NZ': ['Brand1_NZ', 'Brand2_NZ'],
            'US': ['Brand1_US', 'Brand2_US'],
            // Add other market-brand mappings
        };

        if (brands[market]) {
            brands[market].forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });
        }
    }

    static updateChannelDependencies() {
        const channel = document.getElementById('channelDropdown').value;
        const mediumSelect = document.getElementById('channelType');
        const objectiveSelect = document.getElementById('mediaObjective');
        
        // Update UTM source
        document.getElementById('utmSource').value = channel.toLowerCase();
        
        // Clear and update medium options
        mediumSelect.innerHTML = '<option value="">Select...</option>';
        const mediums = {
            'Meta': ['paid_social', 'organic_social'],
            'Tiktok': ['paid_social', 'organic_social'],
            'LinkedIn': ['paid_social', 'organic_social'],
            'DV360': ['display', 'video'],
            // Add other channel-medium mappings
        };

        if (mediums[channel]) {
            mediums[channel].forEach(medium => {
                const option = document.createElement('option');
                option.value = medium;
                option.textContent = medium;
                mediumSelect.appendChild(option);
            });
        }

        // Update UTM medium when medium is selected
        mediumSelect.onchange = () => {
            document.getElementById('utmMedium').value = mediumSelect.value.toLowerCase();
        };
    }

    static updateSubCategories() {
        const category = document.getElementById('productCategory').value;
        const subCategorySelect = document.getElementById('subCategory');
        
        // Clear existing options
        subCategorySelect.innerHTML = '<option value="">Select...</option>';
        
        // Add subcategories based on category
        const subcategories = {
            'Cooling': ['Air Conditioning', 'Fans'],
            'Cooking': ['Ovens', 'Cooktops', 'Rangehoods'],
            // Add other category-subcategory mappings
        };

        if (subcategories[category]) {
            subcategories[category].forEach(subcat => {
                const option = document.createElement('option');
                option.value = subcat;
                option.textContent = subcat;
                subCategorySelect.appendChild(option);
            });
        }
    }

    static updateQuarterMonths() {
        const quarter = document.getElementById('quarter').value;
        const monthSelect = document.getElementById('month');
        
        // Clear existing options
        monthSelect.innerHTML = '<option value="">Select...</option>';
        
        // Add months based on quarter
        const months = {
            'Q1': ['Jul', 'Aug', 'Sep'],
            'Q2': ['Oct', 'Nov', 'Dec'],
            'Q3': ['Jan', 'Feb', 'Mar'],
            'Q4': ['Apr', 'May', 'Jun']
        };

        if (months[quarter]) {
            months[quarter].forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                monthSelect.appendChild(option);
            });
        }
    }

    static toggleManualChannel() {
        const isManual = document.getElementById('manualChannelToggle').checked;
        document.getElementById('channelDropdown').style.display = isManual ? 'none' : 'block';
        document.getElementById('channelInput').style.display = isManual ? 'block' : 'none';
    }

    static toggleManualUtm() {
        const isManual = document.getElementById('manualUtmToggle').checked;
        const utmFields = ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent'];
        utmFields.forEach(field => {
            document.getElementById(field).readOnly = !isManual;
        });
    }
}
