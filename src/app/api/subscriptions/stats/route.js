import Subscription from '@/models/subscription';
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
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : null;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : new Date();
    const statusParam = searchParams.get('status');

    // Define possible statuses to loop through
    const statuses = statusParam ? [statusParam] : ['active', 'cancelled', 'expired'];

    try {
        const results = await Promise.all(
            statuses.map(async (status) => {
                let baseQuery = { status };

                // Apply the date range conditionally based on status
                if (status === 'cancelled') {
                    // For 'cancelled', use `cancelled_at` for the date range
                    if (startDate) {
                        baseQuery.cancelled_at = { $gte: startDate };
                    }
                    if (endDate) {
                        baseQuery.cancelled_at = { ...baseQuery.cancelled_at, $lte: endDate };
                    }
                } else {
                    // For 'active' and 'expired', use `created_at` for the date range
                    if (startDate) {
                        baseQuery.created_at = { $gte: startDate };
                    }
                    if (endDate) {
                        baseQuery.created_at = { ...baseQuery.created_at, $lte: endDate };
                    }
                }

                // Use MongoDB aggregate to get the count and total price for the status.
                const [result] = await Subscription.aggregate([
                    { $match: baseQuery },
                    {
                        $group: {
                            _id: null,
                            totalCount: { $sum: 1 },
                            totalValue: { $sum: { $toDouble: "$price" } }
                        }
                    }
                ]);

                // Return result object with both count and total value
                return {
                    [status]: {
                        count: result?.totalCount || 0,
                        totalValue: result?.totalValue || 0
                    }
                };
            })
        );

        // Combine all results into a single object for the response
        const combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {});

        return new Response(JSON.stringify(combinedResults), { status: 200 });
    } catch (error) {
        console.error("Error fetching subscription stats:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch subscription stats' }), { status: 500 });
    }
}
