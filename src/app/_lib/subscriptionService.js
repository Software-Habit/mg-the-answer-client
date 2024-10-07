// /app/_lib/subscriptionService.js
import dbConnect from './dbConnect'; // Make sure to import dbConnect
import Subscription from '@/models/subscription';
import dayjs from 'dayjs';

export async function getSubscriptionTotals(status) {
    await dbConnect(); // Ensure MongoDB connection
    const total = await Subscription.countDocuments({ status });
    return total;
}

export async function getSubscriptionTotalsOverTime() {
    const oneYearAgo = dayjs().subtract(1, 'year').startOf('month').toDate();
    const currentMonth = dayjs().endOf('month').toDate();

    // Fetch all subscriptions within the last year
    const subscriptions = await Subscription.find({
        created_at: { $lte: currentMonth } // Get subscriptions created up to the current month
    });

    // Initialize data arrays for each month
    const months = [];
    const activeData = [];
    const cancelledData = [];
    const expiredData = [];

    // Process each month
    for (let i = 0; i < 12; i++) {
        const monthStart = dayjs(oneYearAgo).add(i, 'month').startOf('month').toDate();
        const monthEnd = dayjs(oneYearAgo).add(i, 'month').endOf('month').toDate();

        // Calculate active subscriptions up to the end of this month
        const activeTotal = subscriptions.filter(sub => 
            new Date(sub.created_at) <= monthEnd && // Created before or during this month
            (!sub.cancelled_at || new Date(sub.cancelled_at) > monthEnd) // Not cancelled before or during this month
        ).length;

        // Calculate cancelled subscriptions up to the end of this month
        const cancelledTotal = subscriptions.filter(sub => 
            sub.cancelled_at && new Date(sub.cancelled_at) <= monthEnd // Cancelled before or during this month
        ).length;

        // Calculate expired subscriptions up to the end of this month
        const expiredTotal = subscriptions.filter(sub => 
            sub.status === 'expired' && new Date(sub.created_at) <= monthEnd // Expired before or during this month
        ).length;

        // Push month and totals for chart data
        months.push(dayjs(monthStart).format('MMM YYYY'));
        activeData.push(activeTotal);
        cancelledData.push(cancelledTotal);
        expiredData.push(expiredTotal);
    }

    return {
        labels: months,
        active: activeData,
        cancelled: cancelledData,
        expired: expiredData
    };
}
