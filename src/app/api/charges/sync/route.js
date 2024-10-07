import { syncData } from '@/app/_lib/syncService';
import Charge from '@/models/charge';
import { fetchCharges } from '@/app/_lib/rechargeService';
import mongoose from 'mongoose';

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
        fetchFunction: async (rechargeLimit, page, updated_at_min) => {
            const charges = await fetchCharges(rechargeLimit, page, updated_at_min);

            // Calculate subscription_products_total for each charge
            charges.forEach(charge => {
                let subscriptionTotal = 0;

                // Calculate totals for line items with "subscription" purchase_item_type
                charge.line_items.forEach((lineItem) => {
                    if (lineItem.purchase_item_type === 'subscription') {
                        const totalPrice = parseFloat(lineItem.total_price) || 0;
                        subscriptionTotal += totalPrice;
                    }
                });

                // Add shipping prices to the subscription total (if applicable)
                let shippingTotal = 0;
                if (charge.shipping_lines) {
                    charge.shipping_lines.forEach((shippingLine) => {
                        const shippingPrice = parseFloat(shippingLine.price) || 0;
                        shippingTotal += shippingPrice;
                    });
                }

                // Store the total as subscription_products_total
                charge.subscription_products_total = mongoose.Types.Decimal128.fromString(
                    (subscriptionTotal + shippingTotal).toFixed(2)
                );
            });

            return charges;
        },
        model: Charge,
        idField: 'charge_id',  // Use charge_id for charges
        sync_limit,
        max_days_since_update
    });
}
