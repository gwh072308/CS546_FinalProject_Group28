// routes/stats.js

import { Router } from 'express';
import * as arrestsData from '../data/arrests.js';

const router = Router();

// GET /stats - Statistical Dashboard with real data
router.get('/', async (req, res) => {
    try {
        // Fetch real demographic data
        const demographicData = await arrestsData.getDemographicData();
        const crimeRanking = await arrestsData.getCrimeRanking(5);
        
        // Calculate stats from real data
        const totalArrests = demographicData.total || 0;
        
        // Find most common crime
        const mostCommonCrime = crimeRanking.length > 0 ? crimeRanking[0].offense : 'N/A';
        
        // Find borough with most arrests
        const boroughLabels = demographicData.boroughDemographicData?.labels || [];
        const boroughCounts = boroughLabels.map((label, i) => {
            const age18_25 = demographicData.boroughDemographicData.age18_25[i] || 0;
            const age25_45 = demographicData.boroughDemographicData.age25_45[i] || 0;
            const age45plus = demographicData.boroughDemographicData.age45plus[i] || 0;
            return { name: getBoroughName(label), count: age18_25 + age25_45 + age45plus };
        });
        boroughCounts.sort((a, b) => b.count - a.count);
        const boroughWithMostArrests = boroughCounts.length > 0 ? boroughCounts[0].name : 'N/A';
        
        // Top boroughs for display
        const topBoroughs = boroughCounts.slice(0, 5);

        const stats = {
            totalArrests,
            mostCommonCrime,
            boroughWithMostArrests,
            avgAge: 'N/A',
            topBoroughs
        };

        res.render('stats', {
            title: 'Statistical Dashboard',
            stats
        });
    } catch (e) {
        console.error(e);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while fetching statistics.'
        });
    }
});

// Helper function to convert borough code to full name
function getBoroughName(code) {
    const boroughMap = {
        'M': 'Manhattan',
        'K': 'Brooklyn',
        'Q': 'Queens',
        'B': 'Bronx',
        'S': 'Staten Island'
    };
    return boroughMap[code] || code;
}

// GET /stats/demographics - Fetch demographic data
router.get('/demographics', async (req, res) => {
    try {
        const demographicData = await arrestsData.getDemographicData();
        res.json(demographicData);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch demographic data' });
    }
});

export default router;