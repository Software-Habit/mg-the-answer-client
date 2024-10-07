'use client';

// /src/app/(dashboard)/components/Header.js

import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { Yeseva_One } from 'next/font/google';

const yesevaOne = Yeseva_One({ weight: "400", subsets: ["latin"] }); 

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST' });
            if (res.ok) {
                router.push('/login');
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Apply Yeseva One font to the logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className={yesevaOne.className}>
                    theAnswer<sup style={{ fontSize: "0.6em" }}>2.0</sup>
                </Typography>

                <Box className="main-navigation">
                    <Button color="inherit" href="/">
                        Dashboard
                    </Button>
                    <Button color="inherit" href="/exports">
                        Exports
                    </Button>
                    <IconButton onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "rgba(255,255,255,1)", width: "20px" }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
