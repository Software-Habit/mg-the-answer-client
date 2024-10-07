import Charge from '@/models/charge';
import dbConnect from '@/app/_lib/dbConnect';

export async function GET(req) {
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
        return new Response('Access denied', { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        // Total Renewals: type = "recurring", scheduled_at between startDate and endDate
        const totalRenewals = await Charge.countDocuments({
            type: 'recurring',
            scheduled_at: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        // Total New Subscription Orders: type = "checkout", created_at between startDate and endDate
        const totalNewSubscriptions = await Charge.countDocuments({
            type: 'checkout',
            status: 'success',
            created_at: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        // Renewal Revenue: Sum of `subscription_products_total` for type = "recurring"
        const renewalRevenueResults = await Charge.aggregate([
            {
                $match: {
                    type: 'recurring',
                    scheduled_at: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $toDouble: "$subscription_products_total" } }
                }
            }
        ]);
        const renewalRevenue = renewalRevenueResults[0]?.totalRevenue || 0;

        // New Subscription Revenue: Sum of `subscription_products_total` for type = "checkout"
        const newSubscriptionRevenueResults = await Charge.aggregate([
            {
                $match: {
                    type: 'checkout',
                    created_at: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $toDouble: "$subscription_products_total" } }
                }
            }
        ]);
        const newSubscriptionRevenue = newSubscriptionRevenueResults[0]?.totalRevenue || 0;

        return new Response(
            JSON.stringify({
                totalRenewals,
                renewalRevenue,
                totalNewSubscriptions,
                newSubscriptionRevenue
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching charge stats:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch charge stats' }), { status: 500 });
    }
}
