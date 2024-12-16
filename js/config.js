const firebaseConfig = {
    apiKey: "AIzaSyAeA92bKST_oMfhKqqKuaUh7eN5Qdqg1BQ",
    authDomain: "fisherpaykel-utm-builder-app.firebaseapp.com",
    projectId: "fisherpaykel-utm-builder-app",
    storageBucket: "fisherpaykel-utm-builder-app.firebasestorage.app",
    messagingSenderId: "98977816783",
    appId: "1:989778167843:web:96555b3ed1149a7a6dc996",
    measurementId: "G-DZ6MCDJVDY"
};

firebase.initializeApp(firebaseConfig);

const CONFIG = {
    // Market-Brand dependencies
    marketBrands: {
        'AU': ['F&P', 'Haier', 'Haier Home', 'Home Solutions', 'DCS'],
        'NZ': ['F&P', 'Haier', 'Haier Home', 'Home Solutions'],
        'US': ['F&P', 'DCS'],
        'UK': ['F&P'],
        'CA': ['F&P', 'DCS'],
        'SG': ['F&P'],
        'GBL': ['F&P', 'Haier', 'Haier Home', 'Home Solutions', 'DCS']
    },

    // Product category dependencies
    subCategories: {
        'Cooling': ['Refrigeration', 'Wine', 'Chest Freezer'],
        'Cooking': ['Ovens', 'Cooktops', 'Freestanding', 'Companions'],
        'Fabrice Care': ['Washing Machines', 'Dryers', 'Cabinets'],
        'Dishwashing': [],
        'Outdoor': ['Grills', 'Carts', 'Storage'],
        'Ventilation': [],
        'Accessories': ['Spare Parts', 'Accessories', 'Water Filters', 'Cleaning'],
        'Promotions': []
    },

    // Quarter-Month dependencies
    quarterMonths: {
        'Q1': ['January', 'February', 'March'],
        'Q2': ['April', 'May', 'June'],
        'Q3': ['July', 'August', 'September'],
        'Q4': ['October', 'November', 'December']
    },

    // Channel dependencies
    channelDependencies: {
        'Meta': {
            channelTypes: ['Paid Social', 'Social'],
            mediaObjectives: ['Attract', 'Engage', 'Convert', 'Retain'],
            buyTypes: ['Reach', 'Traffic', 'Conversion', 'Engagement']
        },
        'Tiktok': {
            channelTypes: ['Paid Social', 'Social'],
            mediaObjectives: ['Attract', 'Engage', 'Convert', 'Retain'],
            buyTypes: ['Reach', 'Traffic', 'Conversion', 'Engagement']
        },
        'LinkedIn': {
            channelTypes: ['Paid Social', 'Social'],
            mediaObjectives: ['Attract', 'Engage', 'Convert', 'Retain'],
            buyTypes: ['Reach', 'Traffic', 'Conversion', 'Engagement']
        },
        'Pinterest': {
            channelTypes: ['Paid Social', 'Social'],
            mediaObjectives: ['Attract', 'Engage', 'Convert', 'Retain'],
            buyTypes: ['Reach', 'Traffic', 'Conversion', 'Engagement']
        },
        'DV360': {
            channelTypes: ['Display', 'Video'],
            mediaObjectives: ['Attract', 'Engage', 'Convert', 'Retain'],
            buyTypes: ['Reach', 'Traffic', 'Conversion', 'Engagement']
        },
        'Offline': {
            channelTypes: ['Offline', 'Partnership'],
            mediaObjectives: ['Attract', 'Engage', 'Convert', 'Retain'],
            buyTypes: ['QR Code', 'Email', 'Website']
        },
        'Partnership': {
            channelTypes: ['Email', 'Website', 'Social', 'Paid Social', 'Offline'],
            mediaObjectives: ['Attract', 'Engage', 'Convert', 'Retain'],
            buyTypes: ['Email', 'Website', 'Social', 'Paid Social', 'Offline']
        }
    },

    // Manual channel settings
    manualChannelTypes: ['Offline', 'Partnership'],
    manualBuyTypes: {
        'Offline': ['QR Code'],
        'Partnership': ['Email', 'Website', 'Social', 'Paid Social', 'Offline']
    },

    // Consolidated Abbreviations
    abbreviations: {
        // Market-specific brand abbreviations
        markets: {
            'AU': {
                'F&P': 'FPAU',
                'Haier': 'HAIAU',
                'Haier Home': 'HHAU',
                'Home Solutions': 'HSAU',
                'DCS': 'DCSAU'
            },
            'NZ': {
                'F&P': 'FPNZ',
                'Haier': 'HAINZ',
                'Haier Home': 'HHNZ',
                'Home Solutions': 'HSNZ'
            },
            'US': {
                'F&P': 'FPUS',
                'DCS': 'DCSUS'
            },
            'UK': {
                'F&P': 'FPUK'
            },
            'CA': {
                'F&P': 'FPCA',
                'DCS': 'DCSCA'
            },
            'SG': {
                'F&P': 'FPSG'
            },
            'GBL': {
                'F&P': 'FPGBL',
                'Haier': 'HAIGBL',
                'Haier Home': 'HHGBL',
                'Home Solutions': 'HSGBL',
                'DCS': 'DCSGBL'
            }
        },
        // Special Fields Abbreviations
        specialFields: {
            'UKS': 'UKS',
            'UFC': 'UFC', 
            'MOT': 'MOT',
            'Promotion': 'PROMO',
            'NPI': 'NPI'
        },
        // Media objective abbreviations
        mediaObjective: {
            'Attract': 'ATT',
            'Engage': 'ENG',
            'Convert': 'CON',
            'Retain': 'RET'
        },
        // Month abbreviations
        month: {
            'January': 'JAN',
            'February': 'FEB',
            'March': 'MAR',
            'April': 'APR',
            'May': 'MAY',
            'June': 'JUN',
            'July': 'JUL',
            'August': 'AUG',
            'September': 'SEP',
            'October': 'OCT',
            'November': 'NOV',
            'December': 'DEC'
        },
        // Buy type abbreviations
        buyType: {
            'QR Code': 'QR',
            'Email': 'EMAIL',
            'Website': 'WEB',
            'Social': 'SOC',
            'Paid Social': 'PSOC',
            'Offline': 'OFF',
            'Reach': 'REACH',
            'Traffic': 'TRAFFIC',
            'Conversion': 'CONV',
            'Engagement': 'ENG',
            'Video Views': 'VIDV'
        },
        // Category abbreviations
        category: {
            'Cooling': 'COOL',
            'Cooking': 'COOK',
            'Fabrice Care': 'FAB',
            'Dishwashing': 'DISH',
            'Outdoor': 'OUT',
            'Ventilation': 'VENT',
            'Accessories': 'ACC',
            'Promotions': 'PROMO'
        },
        // Subcategory abbreviations
        subCategory: {
            'Refrigeration': 'REF',
            'Wine': 'WINE',
            'Chest Freezer': 'FREEZE',
            'Ovens': 'OVEN',
            'Cooktops': 'CTOP',
            'Freestanding': 'FREE',
            'Companions': 'COMP',
            'Washing Machines': 'WASH',
            'Dryers': 'DRY',
            'Cabinets': 'CAB',
            'Grills': 'GRILL',
            'Carts': 'CART',
            'Storage': 'STOR',
            'Spare Parts': 'SPARE',
            'Accessories': 'ACC',
            'Water Filters': 'FILT',
            'Cleaning': 'CLEAN'
        }
    }
};

// Ensure it's globally available
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
