import { syncData } from '@/app/_lib/syncService';
import Subscription from '@/models/subscription';
import { fetchSubscriptions } from '@/app/_lib/rechargeService';

export async function POST(req) {
    // Restrict access to local environment or Heroku
    const allowedHosts = ['localhost', '127.0.0.1'];
    const host = req.headers.get('host');
    const forwardedFor = req.headers.get('x-forwarded-for');

    // Include the app URL is used
    if (process.env.APP_URL) {
        allowedHosts.push(process.env.APP_URL);
    }

    // Check if request is from an allowed host or forwarded IP
    if (!allowedHosts.some(allowedHost => host.includes(allowedHost) || forwardedFor?.includes(allowedHost))) {
        //return new Response('Access denied', { status: 403 });
    }

    const { sync_limit, max_days_since_update } = await req.json();

    return syncData({
        fetchFunction: fetchSubscriptions,
        model: Subscription,
        idField: 'subscription_id',  // Use subscription_id for subscriptions
        sync_limit,
        max_days_since_update
    });
}
