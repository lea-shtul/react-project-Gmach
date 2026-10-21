import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { userContext } from '../context/userContext';

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

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb' }}
        >
            <Toolbar sx={{ gap: 1 }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 'bold', ml: 3 }}
                >
                    🤝 גמ"ח שכונתי
                </Typography>

                <Button component={NavLink} to="/" end sx={navStyle}>פריטים להשאלה</Button>
                <Button component={NavLink} to="/my-items" sx={navStyle}>הפריטים שלי</Button>
                <Button component={NavLink} to="/myRequests" sx={navStyle}>הבקשות שלי</Button>
                <Button component={NavLink} to="/received" sx={navStyle}>בקשות שקיבלתי</Button>
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