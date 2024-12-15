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
            const markets = new Set();
            const brands = new Set();
            const channels = new Set();
            const campaigns = new Set();

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.market) markets.add(data.market);
                if (data.brand) brands.add(data.brand);
                if (data.channel) channels.add(data.channel);
                if (data.campaignName) campaigns.add(data.campaignName);
            });

            this.populateDropdown('filterMarket', Array.from(markets));
            this.populateDropdown('filterBrand', Array.from(brands));
            this.populateDropdown('filterChannel', Array.from(channels));
            this.populateDropdown('filterCampaign', Array.from(campaigns));
        } catch (error) {
            console.error('Error loading filter options:', error);
            Utils.showNotification('Error loading filter options');
        }
    }

    populateDropdown(elementId, options) {
        const dropdown = document.getElementById(elementId);
        if (!dropdown) return;

        // Keep the first option (All...)
        const firstOption = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(firstOption);

        // Add new options
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

            // Apply filters
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
        ['filterMarket', 'filterBrand', 'filterChannel', 'filterCampaign'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                this.filters[id.replace('filter', '').toLowerCase()] = e.target.value;
            });
        });

        document.getElementById('applyFilters')?.addEventListener('click', () => {
            this.loadUTMs();
        });

        document.getElementById('clearFilters')?.addEventListener('click', () => {
            this.clearFilters();
        });
    }

    clearFilters() {
        this.filters = {};
        
        ['filterMarket', 'filterBrand', 'filterChannel', 'filterCampaign'].forEach(id => {
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
