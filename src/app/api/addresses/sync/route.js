// /app/api/addresses/sync/route.js
import { syncData } from '@/app/_lib/syncService';
import Address from '@/models/address';
import { fetchAddresses } from '@/app/_lib/rechargeService';

export async function POST(req) {
    const { sync_limit, max_days_since_update } = await req.json();

    return syncData({
        fetchFunction: fetchAddresses,
        model: Address,
        idField: 'address_id',  // Use address_id for addresses
        sync_limit,
        max_days_since_update
    });
}
