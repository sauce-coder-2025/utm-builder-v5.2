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
        this.logDebug('generateAdSetName', 'called');
        
        const productCategory = document.getElementById('productCategory').value;
        const subCategory = document.getElementById('subCategory').value;
        const buyType = document.getElementById('buyType').value;

        if (!productCategory || !buyType) {
            this.logDebug('generateAdSetName', 'missing required fields');
            return;
        }

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
