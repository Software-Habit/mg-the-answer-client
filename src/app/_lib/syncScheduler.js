// /src/app/_lib/syncScheduler.js
import cron from 'node-cron';
import fetch from 'node-fetch';

// Check if running locally
const isLocal = process.env.APP_URL.includes('localhost');
const BASE_URL = isLocal ? `http://${process.env.APP_URL}` : `https://${process.env.APP_URL}`;

// Define the sync limits and parameters
const subscriptionSyncEndpoint = `${BASE_URL}/api/subscriptions/sync`;
const chargeSyncEndpoint = `${BASE_URL}/api/charges/sync`;
const syncLimit = 10000;
const maxDaysSinceUpdate = 7;

const syncData = async (endpoint, body) => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Dev-Password': process.env.DEV_PASSWORD
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        console.log(`Sync operation successful for ${endpoint}:`, data);
    } catch (error) {
        console.error(`Sync operation failed for ${endpoint}:`, error);
    }
};

// Schedule for Subscriptions Sync (every hour)
//0 * * * * - every hour
//*/5 * * * * - every 5 minutes
//0 0 1 1 * - every year
cron.schedule('0 0 1 1 *', () => {
    console.log('Running Subscriptions Sync');
    syncData(subscriptionSyncEndpoint, {
        sync_limit: syncLimit,
        max_days_since_update: maxDaysSinceUpdate,
    });
});

// Schedule for Charges Sync (every hour)
//0 * * * * - every hour
//*/5 * * * * - every 5 minutes
//0 0 1 1 * - every year
cron.schedule('0 0 1 1 *', () => {
    console.log('Running Charges Sync');
    syncData(chargeSyncEndpoint, {
        sync_limit: syncLimit,
        max_days_since_update: maxDaysSinceUpdate,
    });
});
