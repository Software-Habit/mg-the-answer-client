// /src/app/(dashboard)/components/RevenueChart.js
'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to format numbers into thousands (e.g., 456669 -> 456.7k)
const formatToThousands = (num) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toLocaleString();
};

export default function RevenueChart({ chartData }) {
    // Find the maximum value from the datasets and add a buffer for extra space
    const allData = [...chartData.datasets[1].data, ...chartData.datasets[2].data];
    const maxValue = Math.max(...allData);
    const yAxisMax = Math.ceil(maxValue / 100000) * 100000 + 100000; // Round up to the nearest 100k and add an extra 100k for padding

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Revenue Summary by Quarter',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: $${tooltipItem.raw.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,  // Enable stacking for X axis (quarters)
            },
            y: {
                stacked: true,  // Enable stacking for Y axis (revenue)
                beginAtZero: true,  // Start Y axis at 0
                max: yAxisMax  // Set dynamic max value for Y axis
            }
        }
    };

    // Prepare data for stacked bar chart
    const data = {
        labels: chartData.labels,  // Quarters (e.g., Q1, Q2, etc.)
        datasets: [
            {
                label: 'Renewal Revenue',
                data: chartData.datasets[1].data,  // Renewal Revenue values
                backgroundColor: 'rgba(54, 162, 235, 0.7)', 
            },
            {
                label: 'New Subscription Revenue',
                data: chartData.datasets[2].data,  // New Subscription Revenue values
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
            }
        ]
    };

    return (
        <div class="chart-wrapper revenue-chart-wrapper">
            <Bar
                data={data}
                options={options}
                className="revenue-chart"
                plugins={[
                    {
                        id: 'totalRevenuePlugin',
                        afterDatasetsDraw(chart) {
                            const { ctx, chartArea: { top }, scales: { x, y } } = chart;

                            ctx.save();

                            chartData.datasets[0].data.forEach((total, i) => {
                                const xPos = x.getPixelForValue(i);  // X position of the bar
                                const yPos = y.getPixelForValue(total) - 10;  // Y position slightly above the stacked bar
                                ctx.font = 'bold 12px Arial';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = 'black';
                                // Display the total revenue as rounded thousands (e.g., 456.7k)
                                ctx.fillText(`$${formatToThousands(total)}`, xPos, yPos);
                            });

                            ctx.restore();
                        }
                    }
                ]}
            />
        </div>
    );
}
