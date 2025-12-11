// routes/stats.js

import { Router } from 'express';
import * as arrestsData from '../data/arrests.js';

const router = Router();

// for now using sample numbers - later we can replace with real Mongo stats
router.get('/', async (req,res) => {
    try {
        const stats = {
            totalArrests: 54230,
            mostCommonCrime: 'PETIT LARCENY',
            boroughWithMostArrests: 'BROOKLYN',
            avgAge: 33.7,
            topBoroughs: [
                { name: 'BROOKLYN', count: 18540 },
                { name: 'MANHATTAN', count: 14210 },
                { name: 'BRONX', count: 11875 },
                { name: 'QUEENS', count: 9250 },
                { name: 'STATEN ISLAND', count: 2355 }
            ]
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