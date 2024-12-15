console.log('View UTMs script loaded');

class UTMViewer {
    constructor() {
        console.log('UTM Viewer initializing');
        this.db = firebase.firestore();
        this.utmCollection = this.db.collection('utm_strings');
        this.filters = {};
        this.initializeEventListeners();
        this.loadFilterOptions();
        this.loadUTMs();
    }
    // ... rest of the code

class UTMViewer {
    constructor() {
        this.db = firebase.firestore();
        this.utmCollection = this.db.collection('utm_strings');
        this.filters = {};
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
                channel: new Set(),
                campaign: new Set()
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.market) filters.market.add(data.market);
                if (data.brand) filters.brand.add(data.brand);
                if (data.channel) filters.channel.add(data.channel);
                if (data.campaignName) filters.campaign.add(data.campaignName);
            });

            // Populate dropdowns
            this.populateDropdown('filterMarket', Array.from(filters.market));
            this.populateDropdown('filterBrand', Array.from(filters.brand));
            this.populateDropdown('filterChannel', Array.from(filters.channel));
            this.populateDropdown('filterCampaign', Array.from(filters.campaign));

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
                if (brandSelect && window.CONFIG && window.CONFIG.marketBrands) {
                    const availableBrands = market ? window.CONFIG.marketBrands[market] : [];
                    this.updateDropdownOptions(brandSelect, availableBrands || []);
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
            let query = this.utmCollection;

            // Apply filters one by one
            if (this.filters.market) {
                query = query.where('market', '==', this.filters.market);
            }
            if (this.filters.brand) {
                query = query.where('brand', '==', this.filters.brand);
            }
            if (this.filters.channel) {
                query = query.where('channel', '==', this.filters.channel);
            }
            if (this.filters.campaign) {
                query = query.where('campaignName', '==', this.filters.campaign);
            }

            // Add orderBy last
            query = query.orderBy('timestamp', 'desc');

            const snapshot = await query.get();
            
            // Debug log
            console.log('Documents found:', snapshot.size);
            snapshot.forEach(doc => {
                console.log('Document data:', doc.data());
            });

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
        const filterIds = ['filterMarket', 'filterBrand', 'filterChannel', 'filterCampaign'];

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
        
        const filterIds = ['filterMarket', 'filterBrand', 'filterChannel', 'filterCampaign'];

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
