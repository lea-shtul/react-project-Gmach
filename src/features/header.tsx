import { useState } from 'react';
import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, Badge,
    IconButton, Drawer, List, ListItemButton, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { userContext } from '../context/userContext';
import { useMyStats } from '../hooks/useMyStats'


const navStyle = {
    color: 'text.secondary',
    '&.active': {
        color: 'primary.main',
        fontWeight: 'bold',
        borderBottom: '2px solid',
        borderRadius: 0,
    },
};

const drawerNavStyle = {
    color: 'text.secondary',
    '&.active': {
        color: 'primary.main',
        fontWeight: 'bold',
    },
};

const Header = () => {
    const { logout, user } = useContext(userContext);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data: myStats } = useMyStats();

    const navItems = [
        { to: '/', end: true, label: 'פריטים להשאלה' },
        { to: '/my-items', label: 'הפריטים שלי' },
        { to: '/myRequests', label: 'הבקשות שלי' },
        { to: '/received', label: 'בקשות שקיבלתי', badge: myStats?.totals.pendingReceived },
        { to: '/stats', label: 'ההשפעה שלי' },
        ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: 'לוח הבקרה' }] : []),
    ];

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
        >
            <Toolbar sx={{ gap: 1 }}>
                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        color: 'primary.main', textDecoration: 'none', fontWeight: 'bold', ml: { xs: 0, md: 3 },
                    }}
                >
                    <HandshakeIcon fontSize="small" />
                    גמ"ח שכונתי
                </Typography>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    {navItems.map(({ to, end, label, badge }) => (
                        <Button key={to} component={NavLink} to={to} end={end} sx={navStyle}>
                            {badge ? (
                                <Badge badgeContent={badge} color="error">
                                    {label}
                                </Badge>
                            ) : label}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                {/* avater גורם לזה להיות עגול */}
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {user?.fullName[0]}
                </Avatar>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'flex' }, color: 'text.primary' }}>
                    שלום, {user?.fullName}
                </Typography>
                <Button variant="outlined" size="small" onClick={logout}>
                    יציאה
                </Button>
            </Toolbar>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 260 }} role="presentation">
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {user?.fullName[0]}
                        </Avatar>
                        <Typography variant="body2">שלום, {user?.fullName}</Typography>
                    </Box>
                    <Divider />
                    <List>
                        {navItems.map(({ to, end, label, badge }) => (
                            <ListItemButton
                                key={to}
                                component={NavLink}
                                to={to}
                                end={end}
                                onClick={() => setDrawerOpen(false)}
                                sx={drawerNavStyle}
                            >
                                {badge ? (
                                    <Badge badgeContent={badge} color="error">
                                        {label}
                                    </Badge>
                                ) : label}
                            </ListItemButton>
                        ))}
                    </List>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Button fullWidth variant="outlined" size="small" onClick={logout}>
                            יציאה
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default Header;
