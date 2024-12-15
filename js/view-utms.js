class UTMViewer {
    constructor() {
        this.db = firebase.firestore();
        this.utmCollection = this.db.collection('utm_strings');
        this.filters = {};
        this.CONFIG = window.CONFIG; // Access your CONFIG object
        this.initializeEventListeners();
        this.loadFilterOptions();
        this.loadUTMs();
    }

    async loadFilterOptions() {
        try {
            const snapshot = await this.utmCollection.get();
            const filters = {
                market: new Set(),
                brand: new Set(),
                category: new Set(),
                subCategory: new Set(),
                financialYear: new Set(),
                quarter: new Set(),
                month: new Set(),
                source: new Set(),
                medium: new Set(),
                mediaObjective: new Set(),
                buyType: new Set()
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                // Populate filter sets with data
                if (data.market) filters.market.add(data.market);
                if (data.brand) filters.brand.add(data.brand);
                if (data.category) filters.category.add(data.category);
                if (data.subCategory) filters.subCategory.add(data.subCategory);
                if (data.financialYear) filters.financialYear.add(data.financialYear);
                if (data.quarter) filters.quarter.add(data.quarter);
                if (data.month) filters.month.add(data.month);
                if (data.utmSource) filters.source.add(data.utmSource);
                if (data.utmMedium) filters.medium.add(data.utmMedium);
                if (data.mediaObjective) filters.mediaObjective.add(data.mediaObjective);
                if (data.buyType) filters.buyType.add(data.buyType);
            });

            // Populate dropdowns
            this.populateDropdown('filterMarket', Array.from(filters.market));
            this.populateDropdown('filterBrand', Array.from(filters.brand));
            this.populateDropdown('filterCategory', Array.from(filters.category));
            this.populateDropdown('filterSubCategory', Array.from(filters.subCategory));
            this.populateDropdown('filterFinancialYear', Array.from(filters.financialYear));
            this.populateDropdown('filterQuarter', Array.from(filters.quarter));
            this.populateDropdown('filterMonth', Array.from(filters.month));
            this.populateDropdown('filterSource', Array.from(filters.source));
            this.populateDropdown('filterMedium', Array.from(filters.medium));
            this.populateDropdown('filterMediaObjective', Array.from(filters.mediaObjective));
            this.populateDropdown('filterBuyType', Array.from(filters.buyType));

            // Set up dependencies
            this.setupFilterDependencies();
        } catch (error) {
            console.error('Error loading filter options:', error);
            Utils.showNotification('Error loading filter options');
        }
    }

    setupFilterDependencies() {
        // Market-Brand dependency
        document.getElementById('filterMarket')?.addEventListener('change', (e) => {
            const market = e.target.value;
            const brandSelect = document.getElementById('filterBrand');
            if (brandSelect) {
                const availableBrands = market ? this.CONFIG.marketBrands[market] || [] : [];
                this.updateDropdownOptions(brandSelect, availableBrands);
            }
        });

        // Category-SubCategory dependency
        document.getElementById('filterCategory')?.addEventListener('change', (e) => {
            const category = e.target.value;
            const subCategorySelect = document.getElementById('filterSubCategory');
            if (subCategorySelect) {
                const availableSubCategories = category ? this.CONFIG.subCategories[category] || [] : [];
                this.updateDropdownOptions(subCategorySelect, availableSubCategories);
            }
        });

        // Quarter-Month dependency
        document.getElementById('filterQuarter')?.addEventListener('change', (e) => {
            const quarter = e.target.value;
            const monthSelect = document.getElementById('filterMonth');
            if (monthSelect) {
                const availableMonths = quarter ? this.CONFIG.quarterMonths[quarter] || [] : [];
                this.updateDropdownOptions(monthSelect, availableMonths);
            }
        });
    }

    updateDropdownOptions(select, options) {
        const currentValue = select.value;
        select.innerHTML = '<option value="">All</option>';
        options.forEach(option => {
            const element = document.createElement('option');
            element.value = option;
            element.textContent = option;
            select.appendChild(element);
        });
        if (options.includes(currentValue)) {
            select.value = currentValue;
        }
    }

    populateDropdown(elementId, options) {
        const dropdown = document.getElementById(elementId);
        if (!dropdown) return;

        const firstOption = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(firstOption);

        options.sort().forEach(option => {
            const element = document.createElement('option');
            element.value = option;
            element.textContent = option;
            dropdown.appendChild(element);
        });
    }

    async loadUTMs() {
        try {
            let query = this.utmCollection.orderBy('timestamp', 'desc');

            // Apply all filters
            Object.entries(this.filters).forEach(([field, value]) => {
                if (value) {
                    // Map filter fields to database fields
                    let dbField = field;
                    switch(field) {
                        case 'source':
                            dbField = 'utmSource';
                            break;
                        case 'medium':
                            dbField = 'utmMedium';
                            break;
                        case 'campaign':
                            dbField = 'utmCampaign';
                            break;
                        // Add other field mappings as needed
                    }
                    query = query.where(dbField, '==', value);
                }
            });

            const snapshot = await query.get();
            this.displayUTMs(snapshot);
        } catch (error) {
            console.error('Error loading UTMs:', error);
            Utils.showNotification('Error loading UTMs');
        }
    }

    displayUTMs(snapshot) {
        const utmLog = document.getElementById('utmLog');
        if (!utmLog) return;

        utmLog.innerHTML = '';

        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="utm-actions d-flex">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="utmViewer.copyUTM('${data.utmString}')" title="Copy UTM">
                        <i class="bi bi-clipboard"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning me-2" onclick="utmViewer.testUTM('${data.utmString}')" title="Test UTM">
                        🧪
                    </button>
                </td>
                <td>${data.utmCampaign || ''}</td>
                <td>${data.utmSource || ''}</td>
                <td>${data.utmMedium || ''}</td>
                <td>${data.utmContent || ''}</td>
                <td class="utm-url" title="${data.utmString}">${data.utmString}</td>
            `;
            
            utmLog.appendChild(row);
        });
    }

    initializeEventListeners() {
        // Set up filter change listeners
        const filterIds = [
            'filterMarket', 'filterBrand', 'filterCategory', 'filterSubCategory',
            'filterFinancialYear', 'filterQuarter', 'filterMonth',
            'filterSource', 'filterMedium', 'filterMediaObjective', 'filterBuyType'
        ];

        filterIds.forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                // Remove 'filter' prefix and convert to camelCase
                const filterName = id.replace('filter', '').charAt(0).toLowerCase() + 
                                 id.replace('filter', '').slice(1);
                this.filters[filterName] = e.target.value;
            });
        });

        // Button listeners
        document.getElementById('applyFilters')?.addEventListener('click', () => {
            this.loadUTMs();
        });

        document.getElementById('clearFilters')?.addEventListener('click', () => {
            this.clearFilters();
        });
    }

    clearFilters() {
        this.filters = {};
        
        const filterIds = [
            'filterMarket', 'filterBrand', 'filterCategory', 'filterSubCategory',
            'filterFinancialYear', 'filterQuarter', 'filterMonth',
            'filterSource', 'filterMedium', 'filterMediaObjective', 'filterBuyType'
        ];

        filterIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.selectedIndex = 0;
        });

        this.loadUTMs();
    }

    copyUTM(utmString) {
        Utils.copyToClipboard(utmString);
    }

    testUTM(utmString) {
        window.open(utmString, '_blank');
    }
}

// Initialize UTM Viewer
const utmViewer = new UTMViewer();

// Add to window object
if (typeof window !== 'undefined') {
    window.utmViewer = utmViewer;
}
