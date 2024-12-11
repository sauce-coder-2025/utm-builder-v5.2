const CONFIG = {
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
        }
    },

    // Abbreviation mappings
    abbreviations: {
        markets: {
            'AU': {
                'F&P': 'FPAU',
                'Haier': 'HAIAU',
                'Haier Home': 'HHAU',
                'Home Solutions': 'HSAU',
                'DCS': 'DCSAU'
            },
            // Add other market abbreviations...
        },
        mediaObjective: {
            'Attract': 'ATT',
            'Engage': 'ENG',
            'Convert': 'CON',
            'Retain': 'RET'
        },
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
        }
    }
};
