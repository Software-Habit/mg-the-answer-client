'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import Header from '../(shared)/components/Header'; 

export default function ExportsPage() {
    const [exportsList, setExportsList] = useState([]);

    useEffect(() => {
        async function fetchExports() {
            const res = await fetch('/api/exports/list');
            const data = await res.json();
            setExportsList(data);
        }

        fetchExports();
    }, []);

    const handleDownload = async (fileName) => {
        console.log("FileName:", fileName);
        
        // Update fetch request to include filename as a query parameter
        const res = await fetch(`/api/exports/download?fileName=${fileName}`);
        
        if (!res.ok) {
            console.error("Failed to download file:", await res.json());
            return;
        }
    
        const { url } = await res.json();  // Fetch the pre-signed URL from the server
        window.open(url, '_blank');  // Open the pre-signed URL in a new tab to trigger the download
    };        

    return (
        <>
            <Header /> {/* Reuse the header with navigation */}
            <Box sx={{ padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Exported Files
                </Typography>
                <Typography variant="body" gutterBottom>
                    Files are deleted periodically. Please download them before they expire.
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>File Name</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exportsList.map((file, index) => (
                            <TableRow key={index}>
                                <TableCell>{file.fileName}</TableCell>
                                <TableCell>{new Date(file.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDownload(file.fileName)}
                                        startIcon={<FontAwesomeIcon icon={faFileCsv} />}
                                    >
                                        Download
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}
