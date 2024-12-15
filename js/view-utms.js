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

    async loadFilterOptions() {
        try {
            console.log('Loading filter options');
            const snapshot = await this.utmCollection.get();
            const filters = {
                market: new Set(),
                brand: new Set(),
                channel: new Set(),
                campaignName: new Set()
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                console.log('Processing document for filters:', data);
                if (data.market) filters.market.add(data.market);
                if (data.brand) filters.brand.add(data.brand);
                if (data.channel) filters.channel.add(data.channel);
                if (data.campaignName) filters.campaignName.add(data.campaignName);
            });

            console.log('Populated filters:', filters);

            // Populate dropdowns
            this.populateDropdown('filterMarket', Array.from(filters.market));
            this.populateDropdown('filterBrand', Array.from(filters.brand));
            this.populateDropdown('filterChannel', Array.from(filters.channel));
            this.populateDropdown('filterCampaign', Array.from(filters.campaignName));
        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    }

    populateDropdown(elementId, options) {
        const dropdown = document.getElementById(elementId);
        if (!dropdown) {
            console.error(`Dropdown not found: ${elementId}`);
            return;
        }

        const firstOption = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(firstOption);

        options.sort().forEach(option => {
            const element = document.createElement('option');
            element.value = option;
            element.textContent = option;
            dropdown.appendChild(element);
        });
        console.log(`Populated dropdown ${elementId} with options:`, options);
    }

    initializeEventListeners() {
        // Filter change listeners
        ['filterMarket', 'filterBrand', 'filterChannel', 'filterCampaign'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const filterName = id.replace('filter', '').charAt(0).toLowerCase() + 
                                     id.replace('filter', '').slice(1);
                    this.filters[filterName] = e.target.value;
                    console.log('Filter updated:', filterName, e.target.value);
                });
            }
        });

        // Button listeners
        const applyButton = document.getElementById('applyFilters');
        if (applyButton) {
            applyButton.addEventListener('click', () => {
                console.log('Applying filters:', this.filters);
                this.loadUTMs();
            });
        }

        const clearButton = document.getElementById('clearFilters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                console.log('Clearing filters');
                this.clearFilters();
            });
        }
    }

    clearFilters() {
        this.filters = {};
        ['filterMarket', 'filterBrand', 'filterChannel', 'filterCampaign'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.selectedIndex = 0;
        });
        this.loadUTMs();
    }

    async loadUTMs() {
        try {
            console.log('Loading UTMs with filters:', this.filters);
            let query = this.utmCollection;

            // Apply filters
            if (this.filters.market) {
                query = query.where('market', '==', this.filters.market);
            }
            if (this.filters.brand) {
                query = query.where('brand', '==', this.filters.brand);
            }
            if (this.filters.channel) {
                query = query.where('channel', '==', this.filters.channel);
            }
            if (this.filters.campaignName) {
                query = query.where('campaignName', '==', this.filters.campaignName);
            }

            // Add orderBy last
            query = query.orderBy('timestamp', 'desc');

            const snapshot = await query.get();
            console.log('Documents found:', snapshot.size);
            this.displayUTMs(snapshot);
        } catch (error) {
            console.error('Error loading UTMs:', error);
        }
    }

    displayUTMs(snapshot) {
        const utmLog = document.getElementById('utmLog');
        if (!utmLog) {
            console.error('UTM Log element not found');
            return;
        }

        utmLog.innerHTML = '';

        if (snapshot.empty) {
            utmLog.innerHTML = '<tr><td colspan="6" class="text-center">No UTMs found</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log('Displaying UTM:', data);
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

    copyUTM(utmString) {
        navigator.clipboard.writeText(utmString)
            .then(() => console.log('UTM copied'))
            .catch(err => console.error('Copy failed', err));
    }

    testUTM(utmString) {
        window.open(utmString, '_blank');
    }
}

// Initialize UTM Viewer
console.log('Creating UTM Viewer instance');
const utmViewer = new UTMViewer();

// Add to window object
if (typeof window !== 'undefined') {
    window.utmViewer = utmViewer;
    console.log('UTM Viewer added to window');
}
