import React, { useState } from 'react';
import { Button, CircularProgress, Typography, CardHeader, Card, CardContent } from '@mui/material';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

export default function SubscriptionsTotalCard({ status, total, collection }) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportLink, setExportLink] = useState('');

    const handleExport = async () => {
        setIsExporting(true);
        setExportLink('');

        try {
            const res = await fetch('/api/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collection, status }),
            });

            if (res.ok) {
                const { fileName } = await res.json(); // Get the filename from the response

                // Fetch the pre-signed URL for the created CSV file
                const urlRes = await fetch(`/api/exports/download?fileName=${fileName}`);
                const { url } = await urlRes.json();

                setExportLink(url); // Store the pre-signed URL for the download button
            } else {
                console.error('Export failed');
            }
        } catch (error) {
            console.error('Export error', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Card style={{ marginBottom: '10px', minHeight: '160px' }}>
            <CardHeader
                title={<Typography variant="h6" sx={{ color: 'white' }}>{status}</Typography>}
                sx={{ backgroundColor: 'black', padding: '8px 16px', textAlign: 'center' }}
            />
            <CardContent style={{ textAlign: 'center' }}>            
                <Typography variant="h3" component="div" style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                    {/* Animate the count-up */}
                    <CountUp start={0} end={total} duration={2} separator="," />
                </Typography>

                {isExporting ? (
                    <CircularProgress style={{ marginTop: '10px' }} />
                ) : exportLink ? (
                    <Button
                        size="small"
                        variant="contained"
                        href={exportLink}
                        target="_blank"
                        style={{ marginTop: '10px' }}
                    >
                        Download Export
                    </Button>
                ) : (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FontAwesomeIcon icon={faFileCsv} />}
                        onClick={handleExport}
                        style={{ marginTop: '10px', color: '#222' }}
                    >
                        Export
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
