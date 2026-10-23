import { Link } from 'react-router-dom';
import { Box, Stack, Typography, Button, Chip, Avatar } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import BuildIcon from '@mui/icons-material/Build';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const steps = [
  {
    icon: <Inventory2OutlinedIcon sx={{ color: 'primary.main' }} />,
    title: 'מפרסמות',
    text: 'משתפות פריט בדקה',
  },
  {
    icon: <SendOutlinedIcon sx={{ color: 'primary.main' }} />,
    title: 'מבקשות',
    text: 'שולחות בקשה עם תאריכים',
  },
  {
    icon: <FavoriteBorderIcon sx={{ color: 'primary.main' }} />,
    title: 'עוזרות',
    text: 'מתאמות איסוף ומחזירות',
  },
];

const Landing = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e6e4f0', py: '14px' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VolunteerActivismIcon fontSize="small" />
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#312e81' }}>
                גמ"ח שכונתי
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ borderRadius: '12px', borderColor: '#d9d6ee', color: '#312e81' }}
              >
                התחברות
              </Button>
              <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: '12px' }}>
                הרשמה
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, mt: '28px' }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#1e1b4b',
            borderRadius: '32px',
            p: { xs: 4, md: '64px 56px' },
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: -120,
              insetInlineStart: -80,
              width: 420,
              height: 420,
              borderRadius: '50%',
              border: '64px solid #2b2775',
              boxSizing: 'border-box',
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              bottom: -90,
              insetInlineEnd: '40%',
              width: 180,
              height: 180,
              borderRadius: '50%',
              bgcolor: '#2b2775',
            }}
          />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 4, md: 6 }}
            sx={{ position: 'relative' }}
          >
            <Box sx={{ flex: 1 }}>
              <Chip
                icon={<PlaceOutlinedIcon sx={{ color: 'secondary.main !important' }} />}
                label="בכל שכונות בני ברק"
                sx={{ bgcolor: '#2e2a7a', color: '#e8e6ff', fontSize: 14, mb: 2 }}
              />

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 36, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#ffffff',
                }}
              >
                מה שעומד אצלך בארון
              </Typography>
              <Typography
                component="span"
                sx={{
                  display: 'block',
                  fontSize: { xs: 36, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: 'secondary.main',
                }}
              >
                יכול לעזור לשכנה
              </Typography>

              <Typography sx={{ fontSize: 19, color: '#c9c6ea', maxWidth: 460, mt: 2.5 }}>
                משאילות, שואלות ועוזרות אחת לשנייה – הכול במקום אחד.
              </Typography>

              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', mt: 3 }}>
                <Button
                  component={Link}
                  to="/register"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    bgcolor: 'secondary.main',
                    color: '#1e1b4b',
                    px: '28px',
                    py: '16px',
                    fontSize: 17,
                    fontWeight: 700,
                    borderRadius: '14px',
                    '&:hover': { bgcolor: 'secondary.main' },
                  }}
                >
                  הצטרפות לגמ"ח
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderColor: '#4b46a8',
                    color: '#ffffff',
                    px: '28px',
                    py: '16px',
                    fontSize: 17,
                    fontWeight: 700,
                    borderRadius: '14px',
                  }}
                >
                  כבר יש לי חשבון
                </Button>
              </Stack>
            </Box>

            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2 }}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  width: '80%',
                  bgcolor: '#ffffff',
                  borderRadius: '20px',
                  p: '18px',
                  boxShadow: '0 20px 40px rgba(8,6,40,0.35)',
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '14px',
                    bgcolor: '#eef0ff',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BuildIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontSize: 17, fontWeight: 700 }}>מברגה ג'קסון</Typography>
                  <Typography sx={{ fontSize: 13, color: '#5b5873' }}>שיכון ג' · כלי עבודה</Typography>
                </Box>
                <Chip label="זמין" size="small" sx={{ bgcolor: '#e3f6ea', color: '#166534' }} />
              </Stack>

              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  width: '80%',
                  bgcolor: '#ffffff',
                  borderRadius: '20px',
                  p: '18px',
                  boxShadow: '0 20px 40px rgba(8,6,40,0.35)',
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>ד</Avatar>
                <Typography sx={{ fontSize: 14, flexGrow: 1 }}>
                  <Box component="b">דבורה כהן</Box> ביקשה לשאול את <Box component="b">המשאף</Box>
                </Typography>
                <Chip label="לאשר" size="small" sx={{ bgcolor: '#eef0ff', color: '#312e81' }} />
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, mt: '20px', pb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {steps.map(({ icon, title, text }) => (
            <Stack
              key={title}
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                bgcolor: '#ffffff',
                border: '1px solid #e6e4f0',
                borderRadius: '20px',
                p: '20px 22px',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  bgcolor: '#eef0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 17, fontWeight: 700 }}>{title}</Typography>
                <Typography sx={{ fontSize: 14, color: '#5b5873' }}>{text}</Typography>
              </Box>
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
