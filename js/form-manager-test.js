window.FormManager = class {
    static test() {
        console.log('FormManager test method called');
    }
    
    static updateBrandOptions() {
        console.log('updateBrandOptions called');
        const market = document.getElementById('market').value;
        const brandSelect = document.getElementById('brand');
        
        console.log('Market:', market);
        console.log('Brand select:', brandSelect);
        
        if (!market || !brandSelect) return;
        
        brandSelect.innerHTML = '<option value="">Select...</option>';
        
        if (CONFIG.marketBrands[market]) {
            CONFIG.marketBrands[market].forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });
        }
    }
}

// Verify FormManager is loaded
console.log('FormManager loaded:', typeof window.FormManager !== 'undefined');

// Test the class
window.FormManager.test();
