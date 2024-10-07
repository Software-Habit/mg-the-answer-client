// /src/app/(dashboard)/page.js
import React from 'react';
import SubscriptionsSummary from './components/SubscriptionsSummary';
import RevenueSummary from './components/RevenueSummary';
import Header from '../(shared)/components/Header';
import { Box } from '@mui/material';

export default function DashboardPage() {
    return (
        <>
            <Header />
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <SubscriptionsSummary />
                <RevenueSummary />
            </Box>
        </>
    );
}
