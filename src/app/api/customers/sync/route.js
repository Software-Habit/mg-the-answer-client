// /app/api/customers/sync/route.js
import { syncData } from '@/app/_lib/syncService';
import Customer from '@/models/customer';
import { fetchCustomers } from '@/app/_lib/rechargeService';

export async function POST(req) {
    const { sync_limit, max_days_since_update } = await req.json();

    return syncData({
        fetchFunction: fetchCustomers,
        model: Customer,
        idField: 'customer_id',  // Use customer_id for customers
        sync_limit,
        max_days_since_update
    });
}
