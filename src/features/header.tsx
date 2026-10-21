import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Badge } from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { userContext } from '../context/userContext';
import { useQuery } from '@tanstack/react-query';
import { getMyStats } from '../server/statsApi'


const navStyle = {
    color: 'text.secondary',
    '&.active': {
        color: 'primary.main',
        fontWeight: 'bold',
        borderBottom: '2px solid',
        borderRadius: 0,
    },
};

const Header = () => {
    const { logout, user } = useContext(userContext);

    const { data: myStats } = useQuery({
        queryKey: ['stats', 'me', user?.id],
        queryFn: getMyStats,
    });


    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
        >
            <Toolbar sx={{ gap: 1 }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        color: 'primary.main', textDecoration: 'none', fontWeight: 'bold', ml: 3,
                    }}
                >
                    <HandshakeIcon fontSize="small" />
                    גמ"ח שכונתי
                </Typography>

                <Button component={NavLink} to="/" end sx={navStyle}>פריטים להשאלה</Button>
                <Button component={NavLink} to="/my-items" sx={navStyle}>הפריטים שלי</Button>
                <Button component={NavLink} to="/myRequests" sx={navStyle}>הבקשות שלי</Button>
                <Button component={NavLink} to="/received" sx={navStyle}>
                    <Badge badgeContent={myStats?.totals.pendingReceived} color="error">
                        בקשות שקיבלתי
                    </Badge>
                </Button>
                <Button component={NavLink} to="/stats" sx={navStyle}>ההשפעה שלי</Button>
                {user?.role === 'ADMIN' && (
                    <Button component={NavLink} to="/admin" sx={navStyle}>לוח הבקרה</Button>
                )}

                <Box sx={{ flexGrow: 1 }} />
                {/* avater גורם לזה להיות עגול */}
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {user?.fullName[0]}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    שלום, {user?.fullName}
                </Typography>
                <Button variant="outlined" size="small" onClick={logout}>
                    יציאה
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;