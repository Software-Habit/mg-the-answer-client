// /app/_lib/syncService.js
import dbConnect from '@/app/_lib/dbConnect';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs'; // For date manipulation

// Generic sync service function
export async function syncData({
    fetchFunction,        // Function to fetch data from ReCharge (e.g., fetchSubscriptions)
    model,                // MongoDB model (e.g., Subscription, Order)
    idField,              // Field to use as the unique identifier (e.g., subscription_id, charge_id)
    sync_limit = 10,      // Total number of documents to sync
    max_days_since_update = 3,  // Filter for data updated in the last X days
    rechargeLimit = 250,   // Max number of records to fetch from ReCharge at once
    batchSize = 100        // Number of upserts to process in parallel
}) {
    let totalProcessed = 0;
    let page = 1;
    let firstSyncedDocument = null; // To store the first synced document

    // If sync_limit is smaller than rechargeLimit, set rechargeLimit to sync_limit
    if (sync_limit < rechargeLimit) {
        rechargeLimit = sync_limit;
    }

    // Determine the date for the updated_at_min filter
    let updated_at_min = null;
    if (max_days_since_update !== 'all_time') {
        const date = dayjs().subtract(max_days_since_update, 'day').format('YYYY-MM-DD');
        updated_at_min = date;
    }

    await dbConnect();

    try {
        while (totalProcessed < sync_limit) {
            // Fetch data using the provided fetchFunction
            const data = await fetchFunction(rechargeLimit, page, updated_at_min);
            if (data.length === 0) break;

            // Process in batches of batchSize
            const batches = [];
            for (let i = 0; i < data.length; i += batchSize) {
                const batch = data.slice(i, i + batchSize);

                const updatePromises = batch.map(async (item) => {
                    if (totalProcessed >= sync_limit) return;

                    // Use the dynamic ID field (e.g., subscription_id, charge_id, etc.)
                    const result = await model.findOneAndUpdate(
                        { [idField]: item.id },  // Use the provided `idField`
                        item,
                        { upsert: true, new: true } // Return the new document
                    );

                    // Capture the first synced document
                    if (totalProcessed === 0) {
                        firstSyncedDocument = result;
                    }

                    totalProcessed++;
                });

                // Push the batch of updates to be processed in parallel
                batches.push(Promise.all(updatePromises));
            }

            // Wait for all batches to finish processing
            await Promise.all(batches);

            page++;
        }

        return NextResponse.json({
            message: `Synced ${totalProcessed} documents.`
            //firstDocument: firstSyncedDocument // Include the first synced document in the response
        });
    } catch (error) {
        console.error('An error occurred during sync:', error);
        return NextResponse.json({ message: 'Server error during sync' }, { status: 500 });
    }
}
