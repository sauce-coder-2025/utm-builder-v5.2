console.log('View UTMs script loaded');

class UTMViewer {
    constructor() {
        console.log('UTM Viewer initializing');
        this.db = firebase.firestore();
        this.utmCollection = this.db.collection('utm_strings');
        this.filters = {};
        this.loadUTMs();
    }

    async loadUTMs() {
        try {
            console.log('Loading UTMs');
            const snapshot = await this.utmCollection.orderBy('timestamp', 'desc').get();
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
                <td>${data.utmCampaign || ''}</td>
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
