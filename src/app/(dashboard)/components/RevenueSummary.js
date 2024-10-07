'use client';

import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import RevenueTotalCard from './RevenueTotalCard';
import RevenueChart from './RevenueChart';
import dayjs from 'dayjs';

const quarters = [
    { name: 'Q1', start: '01-01', end: '03-31' },
    { name: 'Q2', start: '04-01', end: '06-30' },
    { name: 'Q3', start: '07-01', end: '09-30' },
    { name: 'Q4', start: '10-01', end: '12-31' }
];

const getQuarters = (currentQuarter, currentYear) => {
    const results = [];
    for (let i = -1; i <= 4; i++) {
        const quarterIndex = (currentQuarter + i + 4) % 4;
        const year = currentYear + Math.floor((currentQuarter + i) / 4);
        const { start, end, name } = quarters[quarterIndex];
        results.push({
            name: `${name} ${year}`,
            startDate: `${year}-${start}`,
            endDate: `${year}-${end}`,
            isFuture: dayjs(`${year}-${start}`).isAfter(dayjs())  // Determine if this quarter is in the future
        });
    }
    return results;
};

const RevenueSummary = () => {
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState([]);
    const [chartData, setChartData] = useState(null);

    const fetchStatsForQuarter = async (startDate, endDate, isFuture) => {
        const chargeResponse = await fetch(`/api/charges/stats?startDate=${startDate}&endDate=${endDate}`);
        const chargeStats = await chargeResponse.json();

        // Skip subscription stats (cancellations) if the quarter is in the future
        let subscriptionStats = {};
        if (!isFuture) {
            const subscriptionResponse = await fetch(`/api/subscriptions/stats?startDate=${startDate}&endDate=${endDate}&status=cancelled`);
            subscriptionStats = await subscriptionResponse.json();
        }

        return { 
            ...chargeStats, 
            totalCancellations: subscriptionStats.cancelled?.count || 0,  // Extract count of cancellations
            lostCancellationRevenue: subscriptionStats.cancelled?.totalValue || 0  // Extract total value for cancellations
        };
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const today = dayjs();
                const currentQuarter = Math.floor(today.month() / 3); // Current quarter index
                const currentYear = today.year();

                const quartersToFetch = getQuarters(currentQuarter, currentYear).slice(0, 7);
                const promises = quartersToFetch.map(quarter =>
                    fetchStatsForQuarter(quarter.startDate, quarter.endDate, quarter.isFuture)
                );

                const results = await Promise.all(promises);

                const quarterData = results.map((result, index) => ({
                    quarter: quartersToFetch[index].name,
                    isFuture: quartersToFetch[index].isFuture,  // Pass whether it's a future quarter
                    totalRenewals: result.totalRenewals || 0,
                    renewalRevenue: result.renewalRevenue || 0,
                    totalNewSubscriptions: result.totalNewSubscriptions || 0,
                    newSubscriptionRevenue: result.newSubscriptionRevenue || 0,
                    totalCancellations: result.totalCancellations || 0,
                    lostCancellationRevenue: result.lostCancellationRevenue || 0,
                    totalRevenue: result.renewalRevenue + result.newSubscriptionRevenue || 0
                }));

                setTotals(quarterData);

                setChartData({
                    labels: quarterData.map(data => data.quarter),
                    datasets: [
                        { label: 'Total Revenue', data: quarterData.map(data => data.totalRevenue), borderColor: 'blue', fill: false },
                        { label: 'Renewal Revenue', data: quarterData.map(data => data.renewalRevenue), borderColor: 'green', fill: false },
                        { label: 'New Subscription Revenue', data: quarterData.map(data => data.newSubscriptionRevenue), borderColor: 'red', fill: false }
                    ]
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching revenue stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Revenue Stats
            </Typography>
            <Grid container spacing={3}>
                {/* Left Column: Revenue Cards */}
                <Grid item xs={12} sm={4} container direction="column" spacing={2} className="summary-totals">
                    {loading
                        ? Array.from(new Array(6)).map((_, index) => (
                            <Grid item key={index}>
                                <Skeleton variant="rectangular" width="100%" height={118} />
                            </Grid>
                          ))
                        : totals.map((totalData, index) => (
                            <Grid item key={index}>
                                <RevenueTotalCard title={totalData.quarter} totals={totalData} />
                            </Grid>
                        ))
                    }
                </Grid>

                {/* Right Column: Revenue Chart */}
                <Grid item xs={12} sm={8}>
                    {loading
                        ? <Skeleton variant="rectangular" width="100%" height={400} />
                        : <RevenueChart chartData={chartData} />
                    }
                </Grid>
            </Grid>
        </Box>
    );
};

export default RevenueSummary;
