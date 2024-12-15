class UTMViewer {
    constructor() {
        this.db = firebase.firestore();
        this.utmCollection = this.db.collection('utm_strings');
        this.filters = {};
        this.CONFIG = window.CONFIG;
        this.initializeEventListeners();
        this.loadFilterOptions();
        this.loadUTMs();
    }

    async loadFilterOptions() {
        try {
            const snapshot = await this.utmCollection.get();
            const filters = {
                // Campaign Organization
                market: new Set(),
                brand: new Set(),
                category: new Set(),
                subCategory: new Set(),
                
                // Campaign Timing
                financialYear: new Set(),
                quarter: new Set(),
                month: new Set(),
                
                // Campaign Details
                source: new Set(),
                medium: new Set(),
                channel: new Set(),
                channelType: new Set(),
                mediaObjective: new Set(),
                buyType: new Set()
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.market) filters.market.add(data.market);
                if (data.brand) filters.brand.add(data.brand);
                if (data.category) filters.category.add(data.category);
                if (data.subCategory) filters.subCategory.add(data.subCategory);
                if (data.financialYear) filters.financialYear.add(data.financialYear);
                if (data.quarter) filters.quarter.add(data.quarter);
                if (data.month) filters.month.add(data.month);
                if (data.source) filters.source.add(data.source);
                if (data.medium) filters.medium.add(data.medium);
                if (data.channel) filters.channel.add(data.channel);
                if (data.channelType) filters.channelType.add(data.channelType);
                if (data.mediaObjective) filters.mediaObjective.add(data.mediaObjective);
                if (data.buyType) filters.buyType.add(data.buyType);
            });

            // Populate all dropdowns
            Object.entries(filters).forEach(([key, values]) => {
                const elementId = 'filter' + key.charAt(0).toUpperCase() + key.slice(1);
                this.populateDropdown(elementId, Array.from(values));
            });

            // Set up filter dependencies
            this.setupFilterDependencies();
        } catch (error) {
            console.error('Error loading filter options:', error);
            Utils.showNotification('Error loading filter options');
        }
    }

    setupFilterDependencies() {
        // Market-Brand dependency
        const marketSelect = document.getElementById('filterMarket');
        if (marketSelect) {
            marketSelect.addEventListener('change', (e) => {
                const market = e.target.value;
                const brandSelect = document.getElementById('filterBrand');
                if (brandSelect && this.CONFIG.marketBrands) {
                    const availableBrands = market ? this.CONFIG.marketBrands[market] : [];
                    this.updateDropdownOptions(brandSelect, availableBrands || []);
                }
            });
        }

        // Category-SubCategory dependency
        const categorySelect = document.getElementById('filterCategory');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                const category = e.target.value;
                const subCategorySelect = document.getElementById('filterSubCategory');
                if (subCategorySelect && this.CONFIG.subCategories) {
                    const availableSubCategories = category ? this.CONFIG.subCategories[category] : [];
                    this.updateDropdownOptions(subCategorySelect, availableSubCategories || []);
                }
            });
        }

        // Quarter-Month dependency
        const quarterSelect = document.getElementById('filterQuarter');
        if (quarterSelect) {
            quarterSelect.addEventListener('change', (e) => {
                const quarter = e.target.value;
                const monthSelect = document.getElementById('filterMonth');
                if (monthSelect && this.CONFIG.quarterMonths) {
                    const availableMonths = quarter ? this.CONFIG.quarterMonths[quarter] : [];
                    this.updateDropdownOptions(monthSelect, availableMonths || []);
                }
            });
        }
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

            // Apply all active filters
            Object.entries(this.filters).forEach(([field, value]) => {
                if (value) {
                    query = query.where(field, '==', value);
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

        if (snapshot.empty) {
            utmLog.innerHTML = '<tr><td colspan="6" class="text-center">No UTMs found matching the selected filters</td></tr>';
            return;
        }

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
                <td>${data.campaignName || ''}</td>
                <td>${data.source || ''}</td>
                <td>${data.medium || ''}</td>
                <td>${data.content || ''}</td>
                <td class="utm-url" title="${data.utmString}">${data.utmString}</td>
            `;
            
            utmLog.appendChild(row);
        });
    }

    initializeEventListeners() {
        // Set up filter change listeners for all filter dropdowns
        const filterIds = [
            'filterMarket', 'filterBrand', 'filterCategory', 'filterSubCategory',
            'filterFinancialYear', 'filterQuarter', 'filterMonth',
            'filterSource', 'filterMedium', 'filterChannel', 'filterChannelType',
            'filterMediaObjective', 'filterBuyType'
        ];

        filterIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const filterName = id.replace('filter', '').charAt(0).toLowerCase() + 
                                     id.replace('filter', '').slice(1);
                    this.filters[filterName] = e.target.value;
                });
            }
        });

        // Button listeners
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.loadUTMs());
        }

        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    clearFilters() {
        this.filters = {};
        
        const filterIds = [
            'filterMarket', 'filterBrand', 'filterCategory', 'filterSubCategory',
            'filterFinancialYear', 'filterQuarter', 'filterMonth',
            'filterSource', 'filterMedium', 'filterChannel', 'filterChannelType',
            'filterMediaObjective', 'filterBuyType'
        ];

        filterIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.selectedIndex = 0;
            }
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
