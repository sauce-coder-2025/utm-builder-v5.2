console.log('View UTMs script loaded');

class UTMViewer {
    constructor() {
        console.log('UTM Viewer initializing');
        this.db = firebase.firestore();
        this.utmCollection = this.db.collection('utm_strings');
        this.filters = {};
        this.activeFilters = new Set();
        this.searchTerm = '';
        this.columnVisibility = this.loadColumnVisibility();
        this.viewMode = localStorage.getItem('viewMode') || 'standard';
        this.filterPresets = this.loadFilterPresets();
        
        // Define all available columns and their configuration
        this.columns = [
            { id: 'market', name: 'Market', visible: true, sortable: true },
            { id: 'brand', name: 'Brand', visible: true, sortable: true },
            { id: 'campaignName', name: 'Campaign', visible: true, sortable: true },
            { id: 'channel', name: 'Channel', visible: true, sortable: true },
            { id: 'channelType', name: 'Channel Type', visible: true, sortable: true },
            { id: 'financialYear', name: 'Financial Year', visible: true, sortable: true },
            { id: 'quarter', name: 'Quarter', visible: true, sortable: true },
            { id: 'month', name: 'Month', visible: true, sortable: true },
            { id: 'productCategory', name: 'Product Category', visible: true, sortable: true },
            { id: 'mediaObjective', name: 'Media Objective', visible: true, sortable: true },
            { id: 'utmSource', name: 'Source', visible: true, sortable: true },
            { id: 'utmMedium', name: 'Medium', visible: true, sortable: true },
            { id: 'utmContent', name: 'Content', visible: true, sortable: true },
            { id: 'utmString', name: 'UTM URL', visible: true, sortable: false }
        ];

        this.initializeComponents();
        this.initializeEventListeners();
        this.loadFilterOptions();
        this.loadUTMs();

        // Add notification close handler
        const closeNotification = document.getElementById('closeNotification');
        if (closeNotification) {
            closeNotification.addEventListener('click', () => {
                document.getElementById('notification').style.display = 'none';
            });
        }
    }

    loadColumnVisibility() {
        const saved = localStorage.getItem('columnVisibility');
        return saved ? JSON.parse(saved) : {};
    }

    loadFilterPresets() {
        const saved = localStorage.getItem('filterPresets');
        return saved ? JSON.parse(saved) : [];
    }

    saveColumnVisibility() {
        const visibility = {};
        this.columns.forEach(col => {
            visibility[col.id] = col.visible;
        });
        localStorage.setItem('columnVisibility', JSON.stringify(visibility));
    }

    saveFilterPresets() {
        localStorage.setItem('filterPresets', JSON.stringify(this.filterPresets));
    }

    initializeComponents() {
        // Initialize Select2 for enhanced dropdowns
        $('.select2').select2({
            placeholder: 'Select options',
            allowClear: true,
            width: '100%',
            tags: true,
            tokenSeparators: [',', ' ']
        });

        // Initialize column visibility controls
        this.initializeColumnControls();

        // Set initial view mode
        this.applyViewMode();
        
        // Initialize tooltips using Bootstrap 5 syntax
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
initializeColumnControls() {
        const columnToggles = document.getElementById('columnToggles');
        columnToggles.innerHTML = this.columns.map(column => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="toggle_${column.id}" 
                    ${column.visible ? 'checked' : ''}>
                <label class="form-check-label" for="toggle_${column.id}">
                    ${column.name}
                </label>
            </div>
        `).join('');

        // Add event listeners for column toggles
        columnToggles.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const columnId = e.target.id.replace('toggle_', '');
                this.toggleColumn(columnId, e.target.checked);
            });
        });
    }

    initializeEventListeners() {
        // Global search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // View toggle
        document.getElementById('toggleView').addEventListener('click', () => {
            this.toggleViewMode();
        });

        // Filter panel toggle
        document.getElementById('toggleFilters').addEventListener('click', () => {
            this.toggleFilterPanel();
        });

        // Export button
        document.getElementById('exportCsv').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Save preset
        document.getElementById('savePreset').addEventListener('click', () => {
            this.saveFilterPreset();
        });

        // Table header sorting
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                this.handleSort(header.dataset.sort);
            });
        });

        // Initialize filter change listeners
        this.columns.forEach(column => {
            const filterId = `filter${column.id.charAt(0).toUpperCase() + column.id.slice(1)}`;
            const element = document.getElementById(filterId);
            if (element) {
                $(element).on('change', (e) => {
                    this.handleFilterChange(column.id, $(element).val());
                });
            }
        });
    }

    async loadFilterOptions() {
        try {
            console.log('Loading filter options');
            const snapshot = await this.utmCollection.get();
            
            const options = {};
            this.columns.forEach(column => {
                options[column.id] = new Set();
            });

            snapshot.forEach(doc => {
                const data = doc.data();
                this.columns.forEach(column => {
                    if (data[column.id]) {
                        options[column.id].add(data[column.id]);
                    }
                });
            });

            // Populate all dropdowns
            this.columns.forEach(column => {
                const sortedOptions = Array.from(options[column.id]).sort();
                this.populateDropdown(`filter${column.id.charAt(0).toUpperCase() + column.id.slice(1)}`, sortedOptions);
            });

        } catch (error) {
            console.error('Error loading filter options:', error);
            this.showNotification('Error loading filter options: ' + error.message);
        }
    }
    populateDropdown(elementId, options) {
        const dropdown = $(`#${elementId}`);
        if (!dropdown.length) return;

        // Clear existing options while preserving selected values
        const selectedValues = dropdown.val() || [];
        dropdown.empty();

        // Add options
        options.forEach(option => {
            if (option) {
                dropdown.append(new Option(option, option, false, selectedValues.includes(option)));
            }
        });

        // Trigger change to refresh Select2
        dropdown.trigger('change');
    }

    handleFilterChange(columnId, values) {
        if (values && values.length) {
            this.filters[columnId] = values;
            this.activeFilters.add(columnId);
        } else {
            delete this.filters[columnId];
            this.activeFilters.delete(columnId);
        }

        this.updateActiveFiltersDisplay();
        this.loadUTMs();
    }

    updateActiveFiltersDisplay() {
        const container = document.querySelector('#activeFilters .d-flex');
        container.innerHTML = '';

        this.activeFilters.forEach(filterId => {
            const values = this.filters[filterId];
            const column = this.columns.find(col => col.id === filterId);
            
            if (values && values.length) {
                values.forEach(value => {
                    const chip = document.createElement('div');
                    chip.className = 'badge bg-primary d-flex align-items-center gap-2';
                    chip.innerHTML = `
                        <span>${column.name}: ${value}</span>
                        <button type="button" class="btn-close btn-close-white" 
                            aria-label="Remove filter"></button>
                    `;
                    
                    chip.querySelector('.btn-close').addEventListener('click', () => {
                        this.removeFilter(filterId, value);
                    });
                    
                    container.appendChild(chip);
                });
            }
        });
    }

    removeFilter(filterId, value) {
        const select = $(`#filter${filterId.charAt(0).toUpperCase() + filterId.slice(1)}`);
        const currentValues = select.val() || [];
        const newValues = currentValues.filter(v => v !== value);
        
        select.val(newValues).trigger('change');
        this.handleFilterChange(filterId, newValues);
    }

    handleGlobalSearch(term) {
        this.searchTerm = term.toLowerCase();
        this.loadUTMs();
    }

    toggleViewMode() {
        this.viewMode = this.viewMode === 'standard' ? 'compact' : 'standard';
        localStorage.setItem('viewMode', this.viewMode);
        this.applyViewMode();
    }

    applyViewMode() {
        const table = document.getElementById('utmTable');
        if (this.viewMode === 'compact') {
            table.classList.add('table-sm');
        } else {
            table.classList.remove('table-sm');
        }
    }

    toggleFilterPanel() {
        const filterPanel = document.getElementById('filterPanel');
        const utmPanel = document.getElementById('utmPanel');
        const isCollapsed = filterPanel.classList.contains('collapsed');
        
        if (isCollapsed) {
            filterPanel.classList.remove('collapsed');
            utmPanel.classList.remove('expanded');
            filterPanel.style.width = '25%';
        } else {
            filterPanel.classList.add('collapsed');
            utmPanel.classList.add('expanded');
            filterPanel.style.width = '60px';
        }
    }
    async loadUTMs() {
        try {
            console.log('Loading UTMs with filters:', this.filters);
            let query = this.utmCollection;

            // Apply filters
            Object.entries(this.filters).forEach(([field, values]) => {
                if (values && values.length) {
                    console.log(`Applying filter for ${field}:`, values);
                    query = query.where(field, 'in', values);
                }
            });

            // Always order by timestamp
            query = query.orderBy('timestamp', 'desc');

            try {
                const snapshot = await query.get();
                console.log('Raw documents found:', snapshot.size);
                
                // Debug: Log first document
                if (!snapshot.empty) {
                    const firstDoc = snapshot.docs[0].data();
                    console.log('Sample document:', firstDoc);
                }
                
                // Apply search filter in memory
                let filteredData = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (this.searchTerm) {
                        const matchesSearch = Object.values(data).some(value => 
                            value && value.toString().toLowerCase().includes(this.searchTerm)
                        );
                        if (matchesSearch) {
                            filteredData.push(data);
                        }
                    } else {
                        filteredData.push(data);
                    }
                });

                console.log('Filtered data count:', filteredData.length);
                if (filteredData.length > 0) {
                    console.log('Sample filtered data:', filteredData[0]);
                }

                this.displayUTMs(filteredData);
            } catch (error) {
                if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
                    const indexUrlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/);
                    const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
                    
                    let errorMessage = 'This combination of filters requires a database index. ';
                    if (indexUrl) {
                        errorMessage += `<a href="${indexUrl}" target="_blank" class="alert-link">Click here to create the index</a>`;
                        errorMessage += '<br>After creating the index, please wait a few minutes and try again.';
                    }
                    
                    this.showNotification(errorMessage, true);
                    console.log('Index required for query with filters:', this.filters);
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error loading UTMs:', error);
            this.showNotification('Error loading UTMs: ' + error.message);
        }
    }

    displayUTMs(data) {
        console.log('Starting displayUTMs with data length:', data.length);
        const utmLog = document.getElementById('utmLog');
        if (!utmLog) {
            console.error('UTM Log element not found');
            return;
        }

        utmLog.innerHTML = '';

        if (!data.length) {
            console.log('No data to display');
            utmLog.innerHTML = '<tr><td colspan="15" class="text-center">No UTMs found</td></tr>';
            return;
        }

        data.forEach((item, index) => {
            console.log(`Processing item ${index}:`, item);
            const row = document.createElement('tr');
            
            // Helper function to safely display data with fallback
            const displayValue = (value) => value || '';
            
            row.innerHTML = `
                <td class="utm-actions d-flex">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="utmViewer.copyUTM('${item.utmString}')" title="Copy UTM">
                        <i class="bi bi-clipboard"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning me-2" onclick="utmViewer.testUTM('${item.utmString}')" title="Test UTM">
                        🧪
                    </button>
                </td>
                ${this.columns.map(column => `
                    <td class="utm-field" title="${displayValue(item[column.id])}" 
                        style="display: ${column.visible ? '' : 'none'}">
                        ${displayValue(item[column.id])}
                    </td>
                `).join('')}
            `;
            
            utmLog.appendChild(row);
        });
        
        console.log('Finished displaying UTMs');
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

    exportToCSV() {
        const table = document.getElementById('utmTable');
        const rows = Array.from(table.querySelectorAll('tr'));
        
        // Get visible columns
        const visibleColumns = this.columns.filter(col => col.visible);
        
        // Prepare CSV content
        const csvContent = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            return visibleColumns.map(col => {
                const cell = cells[this.columns.findIndex(c => c.id === col.id) + 1];
                return cell ? `"${cell.textContent.replace(/"/g, '""')}"` : '';
            }).join(',');
        }).join('\n');
        
        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'utm_export.csv';
        link.click();
    }

    clearFilters() {
        this.filters = {};
        this.activeFilters.clear();
        this.searchTerm = '';
        
        // Reset all select2 dropdowns
        $('.select2').val(null).trigger('change');
        
        // Clear global search
        document.getElementById('globalSearch').value = '';
        
        // Update display and reload data
        this.updateActiveFiltersDisplay();
        this.loadUTMs();
    }

    saveFilterPreset() {
        const name = prompt('Enter a name for this filter preset:');
        if (name) {
            const preset = {
                name,
                filters: { ...this.filters },
                timestamp: new Date().toISOString()
            };
            
            this.filterPresets.push(preset);
            this.saveFilterPresets();
            this.updateFilterPresetsDisplay();
        }
    }

    showNotification(message, allowHTML = false) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        if (notification && notificationMessage) {
            if (allowHTML) {
                notificationMessage.innerHTML = message;
            } else {
                notificationMessage.textContent = message;
            }
            notification.style.display = 'block';

            // Don't auto-hide index creation messages
            if (!message.includes('requires a database index')) {
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 5000);
            }
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
