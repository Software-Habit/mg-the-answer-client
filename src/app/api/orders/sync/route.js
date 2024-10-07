// /app/api/orders/sync/route.js
import { syncData } from '@/app/_lib/syncService';
import Order from '@/models/order';
import { fetchOrders } from '@/app/_lib/rechargeService';

export async function POST(req) {
    const { sync_limit, max_days_since_update } = await req.json();

    return syncData({
        fetchFunction: fetchOrders,
        model: Order,
        idField: 'order_id',  // Use order_id for orders
        sync_limit,
        max_days_since_update
    });
}
