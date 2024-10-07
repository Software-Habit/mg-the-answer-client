'use client';

import React, { useEffect, useState } from 'react';
import SubscriptionsTotalCard from './SubscriptionsTotalCard';
import SubscriptionsChart from './SubscriptionsChart';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import dayjs from 'dayjs';

const SubscriptionsSummary = () => {
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        active: 0,
        cancelled: 0,
        expired: 0
    });
    const [chartData, setChartData] = useState(null);

    // Helper function to fetch stats for a specific date range
    const fetchStatsForMonth = async (endDate) => {
        const response = await fetch(`/api/subscriptions/stats?endDate=${endDate}`);
        return await response.json();
    };

    // Fetch totals and chart data
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch current totals (no date range)
                const currentTotalsResponse = await fetch('/api/subscriptions/stats');
                const currentTotals = await currentTotalsResponse.json();

                setTotals({
                    active: currentTotals.active?.count || 0,
                    cancelled: currentTotals.cancelled?.count || 0,
                    expired: currentTotals.expired?.count || 0
                });

                const promises = [];
                const today = dayjs();
                const months = [];

                months.push('Today');
                promises.push(fetchStatsForMonth(today.format('YYYY-MM-DDT23:59')));

                // Generate the months and endDates for the last 12 months
                for (let i = 0; i < 12; i++) {
                    const startDateOfMonth = today.subtract(i, 'month').startOf('month').format('YYYY-MM-DD');
                    months.push(today.subtract(i, 'month').format('MMM YYYY'));
                    promises.push(fetchStatsForMonth(startDateOfMonth));  
                }

                const results = (await Promise.all(promises)).reverse();

                const activeTotals = [];
                const cancelledTotals = [];
                const expiredTotals = [];

                results.reverse().forEach((result) => {
                    activeTotals.push(result.active?.count || 0);
                    cancelledTotals.push(result.cancelled?.count || 0);
                    expiredTotals.push(result.expired?.count || 0);
                });

                setChartData({
                    labels: months.reverse(),
                    active: activeTotals.reverse(),
                    cancelled: cancelledTotals.reverse(),
                    expired: expiredTotals.reverse()
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching subscription stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Subscription Stats
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={4} container direction="column" spacing={2} className="summary-totals">
                    {loading
                        ? Array.from(new Array(3)).map((_, index) => (
                            <Grid item key={index}>
                                <Skeleton variant="rectangular" width="100%" height={118} />
                            </Grid>
                          ))
                        : <>
                            <Grid item>
                                <SubscriptionsTotalCard
                                    status="Active"
                                    total={totals.active}
                                    collection="subscriptions"
                                />
                            </Grid>
                            <Grid item>
                                <SubscriptionsTotalCard
                                    status="Cancelled"
                                    total={totals.cancelled}
                                    collection="subscriptions"
                                />
                            </Grid>
                            <Grid item>
                                <SubscriptionsTotalCard
                                    status="Expired"
                                    total={totals.expired}
                                    collection="subscriptions"
                                />
                            </Grid>
                        </>
                    }
                </Grid>

                <Grid item xs={12} sm={8}>
                    {loading
                        ? <Skeleton variant="rectangular" width="100%" height={400} />
                        : <SubscriptionsChart chartData={chartData} />
                    }
                </Grid>
            </Grid>
        </Box>
    );
};

export default SubscriptionsSummary;
