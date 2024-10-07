// /src/app/(dashboard)/components/SubscriptionsChart.js
'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SubscriptionsChart({ chartData }) {

    console.log(chartData)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Subscription Stats Over Time',
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        elements: {
            line: {
                tension: 0.4, // Add curve to the lines for smooth interpolation
            }
        }
    };

    const data = {
        labels: chartData.labels, // Months
        datasets: [
            {
                label: 'Active',
                data: chartData.active,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: 'Cancelled',
                data: chartData.cancelled,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: 'Expired',
                data: chartData.expired,
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
            }
        ]
    };

    return (
        <div class="chart-wrapper subscriptions-chart-wrapper">
            <Line options={options} data={data} />
        </div>
    );
}
