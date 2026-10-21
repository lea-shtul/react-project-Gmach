import { Link } from 'react-router-dom';
import { Box, Stack, Typography, Button, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import HandshakeIcon from '@mui/icons-material/Handshake';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';

const features = [
  {
    icon: <Inventory2Icon fontSize="large" color="primary" />,
    title: 'מפרסמות',
    text: 'עגלה, כלי אירוח, ספרים או כלי עבודה שמחכים בבית? שתפי אותם עם השכנות.',
  },
  {
    icon: <VolunteerActivismIcon fontSize="large" color="primary" />,
    title: 'מבקשות',
    text: 'מצאת משהו שאת צריכה? שלחי בקשה לתאריכים שמתאימים לך.',
  },
  {
    icon: <FavoriteIcon fontSize="large" color="primary" />,
    title: 'עוזרות',
    text: 'אחרי אישור, מתאמות איסוף, משתמשות ומחזירות. פשוט ככה.',
  },
];

const Landing = () => {
  return (
    <Box>
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2, py: { xs: 4, sm: 6 }, textAlign: 'center' }}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h3" color="primary">גמ"ח שכונתי</Typography>
            <HandshakeIcon color="primary" sx={{ fontSize: 40 }} />
          </Stack>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mx: 'auto', mt: 1.5, mb: 4, maxWidth: 480, fontWeight: 400 }}
          >
            משאילות, שואלות ועוזרות אחת לשנייה, בכל שכונות בני ברק
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} to="/register" variant="contained" size="large">
              הרשמה
            </Button>
            <Button component={Link} to="/login" variant="outlined" size="large">
              כבר יש לי חשבון
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          px: 2,
          pb: { xs: 4, sm: 6 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mt: 4,
        }}
      >
        {features.map(({ icon, title, text }) => (
          <Paper key={title} variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            {icon}
            <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">{text}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Landing;
