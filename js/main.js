// Add these event listeners to your existing ones in main.js

// For campaign name generation
document.getElementById('market')?.addEventListener('change', () => {
    FormManager.updateBrandOptions();
    FormManager.generateCampaignName();
});

document.getElementById('brand')?.addEventListener('change', FormManager.generateCampaignName.bind(FormManager));
document.getElementById('financialYear')?.addEventListener('change', FormManager.generateCampaignName.bind(FormManager));
document.getElementById('quarter')?.addEventListener('change', () => {
    FormManager.updateQuarterMonths();
    FormManager.generateCampaignName();
});
document.getElementById('month')?.addEventListener('change', FormManager.generateCampaignName.bind(FormManager));
document.getElementById('mediaObjective')?.addEventListener('change', FormManager.generateCampaignName.bind(FormManager));

// For ad set name generation
document.getElementById('productCategory')?.addEventListener('change', () => {
    FormManager.updateSubCategories();
    FormManager.generateAdSetName();
});
document.getElementById('subCategory')?.addEventListener('change', FormManager.generateAdSetName.bind(FormManager));
document.getElementById('buyType')?.addEventListener('change', FormManager.generateAdSetName.bind(FormManager));

// For UTM parameters
document.getElementById('channelDropdown')?.addEventListener('change', () => {
    FormManager.updateChannelDependencies();
    FormManager.updateUTMFields();
});

document.getElementById('channelInput')?.addEventListener('input', FormManager.updateUTMFields.bind(FormManager));
document.getElementById('channelType')?.addEventListener('change', FormManager.updateUTMFields.bind(FormManager));
document.getElementById('campaignName')?.addEventListener('input', FormManager.updateUTMFields.bind(FormManager));
document.getElementById('adName')?.addEventListener('input', FormManager.updateUTMFields.bind(FormManager));
