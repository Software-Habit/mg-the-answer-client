'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';
import CountUp from 'react-countup';

export default function RevenueTotalCard({ title, totals }) {
    const {
        isFuture,
        totalRenewals,
        renewalRevenue,
        totalNewSubscriptions,
        newSubscriptionRevenue,
        totalCancellations,
        lostCancellationRevenue
    } = totals;

    return (
        <Card sx={{ marginBottom: '20px' }}>
            {/* Card Header with black background and white text */}
            <CardHeader
                title={<Typography variant="h6" sx={{ color: 'white' }}>{title}</Typography>}
                sx={{ backgroundColor: 'black', padding: '8px 16px' }}
            />

            <CardContent sx={{ padding: '8px' }}>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ padding: '6px' }}><strong>Total Renewals</strong></TableCell>
                            <TableCell sx={{ padding: '6px' }} align="right">
                                <CountUp start={0} end={totalRenewals} duration={2} separator="," />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ padding: '6px' }}><strong>Renewal Revenue</strong></TableCell>
                            <TableCell sx={{ padding: '6px' }} align="right">
                                $<CountUp start={0} end={renewalRevenue} duration={2} separator="," />
                            </TableCell>
                        </TableRow>

                        {/* Only show these fields if the quarter is not in the future */}
                        {!isFuture && (
                            <>
                                <TableRow>
                                    <TableCell sx={{ padding: '6px' }}><strong>Total New Subscription Orders</strong></TableCell>
                                    <TableCell sx={{ padding: '6px' }} align="right">
                                        <CountUp start={0} end={totalNewSubscriptions} duration={2} separator="," />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ padding: '6px' }}><strong>New Subscription Revenue</strong></TableCell>
                                    <TableCell sx={{ padding: '6px' }} align="right">
                                        $<CountUp start={0} end={newSubscriptionRevenue} duration={2} separator="," />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ padding: '6px' }}><strong>Total Cancellations</strong></TableCell>
                                    <TableCell sx={{ padding: '6px' }} align="right">
                                        <CountUp start={0} end={totalCancellations} duration={2} separator="," />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ padding: '6px' }}><strong>Lost Cancellation Revenue</strong></TableCell>
                                    <TableCell sx={{ padding: '6px' }} align="right">
                                        $<CountUp start={0} end={lostCancellationRevenue} duration={2} separator="," /> <span>plus shipping</span>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
