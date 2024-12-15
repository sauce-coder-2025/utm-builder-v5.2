console.log('View UTMs script loaded');

class UTMViewer {
    constructor() {
        console.log('UTM Viewer initializing');
        this.db = firebase.firestore();
        this.utmCollection = this.db.collection('utm_strings');
        this.filters = {};
        this.filterOptions = {
            market: new Set(),
            brand: new Set(),
            campaignName: new Set(),
            channel: new Set(),
            channelType: new Set(),
            financialYear: new Set(),
            quarter: new Set(),
            month: new Set(),
            utmSource: new Set(),
            utmMedium: new Set(),
            productCategory: new Set(),
            mediaObjective: new Set()
        };
        this.initializeEventListeners();
        this.loadFilterOptions();
        this.loadUTMs();
    }

    async loadFilterOptions() {
        try {
            console.log('Loading filter options');
            const snapshot = await this.utmCollection.get();
            snapshot.forEach(doc => {
                const data = doc.data();
                console.log('Processing document for filters:', data);
                Object.keys(this.filterOptions).forEach(filterKey => {
                    if (data[filterKey]) {
                        this.filterOptions[filterKey].add(data[filterKey]);
                    }
                });
            });

            console.log('Populated filters:', this.filterOptions);
            this.populateFilterDropdowns();
        } catch (error) {
            console.error('Error loading filter options:', error);
            this.showNotification('Error loading filter options: ' + error.message);
        }
    }

    populateFilterDropdowns() {
        Object.keys(this.filterOptions).forEach(filterKey => {
            const dropdownId = `filter${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`;
            const options = Array.from(this.filterOptions[filterKey]).sort();
            this.populateDropdown(dropdownId, options);
        });
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

        options.forEach(option => {
            const element = document.createElement('option');
            element.value = option;
            element.textContent = option;
            dropdown.appendChild(element);
        });
        console.log(`Populated dropdown ${elementId} with options:`, options);
    }

    initializeEventListeners() {
        // Filterable fields
        const filterFields = [
            'filterMarket', 'filterBrand', 'filterCampaignName', 'filterChannel',
            'filterChannelType', 'filterFinancialYear', 'filterQuarter', 'filterMonth',
            'filterUtmSource', 'filterUtmMedium', 'filterProductCategory', 'filterMediaObjective'
        ];

        // Filter change listeners
        filterFields.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    // Convert dropdown ID to filter key (e.g., 'filterBrand' -> 'brand')
                    const filterName = id.replace('filter', '').charAt(0).toLowerCase() + 
                                     id.replace('filter', '').slice(1);
                    
                    // Only set filter if a value is selected
                    if (e.target.value) {
                        this.filters[filterName] = e.target.value;
                    } else {
                        // Remove the filter if no value is selected
                        delete this.filters[filterName];
                    }
                    console.log('Current filters:', this.filters);
                    this.updateFilterOptions();
                    this.populateFilterDropdowns();
                    this.loadUTMs();
                });
            }
        });

        const clearButton = document.getElementById('clearFilters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                console.log('Clearing filters');
                this.clearFilters();
            });
        }
    }

    updateFilterOptions() {
        // Update filter options based on current filters
        const updatedOptions = { ...this.filterOptions };
        
        // Reset filter options that are not being used as filters
        Object.keys(updatedOptions).forEach(filterKey => {
            if (!this.filters[filterKey]) {
                updatedOptions[filterKey] = new Set();
            }
        });
        
        // Query the collection to update the filter options
        this.utmCollection.get().then(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data();
                
                // Update the filter options based on the current filters
                Object.keys(this.filters).forEach(filterKey => {
                    if (data[filterKey] === this.filters[filterKey]) {
                        Object.keys(updatedOptions).forEach(optionKey => {
                            if (data[optionKey]) {
                                updatedOptions[optionKey].add(data[optionKey]);
                            }
                        });
                    }
                });
            });
            
            console.log('Updated filter options:', updatedOptions);
            console.log('Filters applied:', this.filters);
            this.filterOptions = updatedOptions;
            this.populateFilterDropdowns();
        });
    }

    clearFilters() {
        // Reset filters object
        this.filters = {};
        this.loadFilterOptions(); // Ensure reloading happens after clear
        this.loadUTMs();
    }

    async loadUTMs() {
        try {
            console.log('Loading UTMs with filters:', this.filters);
            let query = this.utmCollection;

            // Dynamically apply filters based on current filter state
            Object.keys(this.filters).forEach(filterKey => {
                console.log(`Applying filter: ${filterKey} = ${this.filters[filterKey]}`);
                query = query.where(filterKey, '==', this.filters[filterKey]);
            });

            // Always order by timestamp
            query = query.orderBy('timestamp', 'desc');

            const snapshot = await query.get();
            console.log('Filtered documents found:', snapshot.size);
            this.displayUTMs(snapshot);
        } catch (error) {
            console.error('Error loading UTMs:', error);
            // Show error notification to user
            this.showNotification('Error loading UTMs: ' + error.message);
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
            .then(() => {
                console.log('UTM copied');
                this.showNotification('UTM copied to clipboard');
            })
            .catch(err => {
                console.error('Copy failed', err);
                this.showNotification('Failed to copy UTM');
            });
    }

    testUTM(utmString) {
        window.open(utmString, '_blank');
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.style.display = 'block';

            // Auto-hide after 5 seconds
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }
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
