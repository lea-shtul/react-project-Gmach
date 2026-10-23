import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BuildIcon from '@mui/icons-material/Build';

type AuthLayoutProps = {
    children: ReactNode;
    brandHeadingLine1: string;
    brandHeadingLine2: string;
    brandSubtitle: string;
};

const AuthLayout = ({ children, brandHeadingLine1, brandHeadingLine2, brandSubtitle }: AuthLayoutProps) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: { xs: 'center', md: 'stretch' },
                justifyContent: 'center',
                gap: 3,
                p: 3,
                flexDirection: { xs: 'column', md: 'row' },
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
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
                            flexShrink: 0,
                        }}
                    >
                        <HandshakeIcon fontSize="small" />
                    </Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'primary.dark' }}>
                        גמ"ח שכונתי
                    </Typography>
                </Stack>

                {children}
            </Box>

            <Box
                sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'relative',
                    flex: '1 1 560px',
                    maxWidth: 820,
                    minHeight: { md: 560 },
                    bgcolor: '#1e1b4b',
                    borderRadius: '28px',
                    p: 7,
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -80,
                        insetInlineEnd: -80,
                        width: 320,
                        height: 320,
                        borderRadius: '50%',
                        border: '32px solid #2b2775',
                        boxSizing: 'border-box',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 160,
                        insetInlineStart: 40,
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: '#2b2775',
                    }}
                />

                <Box
                    sx={{
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box />

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems: 'center',
                            bgcolor: '#fff',
                            borderRadius: '16px',
                            p: 2,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                            maxWidth: 320,
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                bgcolor: '#eef0ff',
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <BuildIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary' }}>
                                הבקשה שלך אושרה
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                מברגה ג'קסון · איסוף מחר
                            </Typography>
                        </Box>
                    </Stack>

                    <Box>
                        <Typography sx={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                            {brandHeadingLine1}
                        </Typography>
                        <Typography sx={{ fontSize: 40, fontWeight: 800, color: 'secondary.main', lineHeight: 1.2 }}>
                            {brandHeadingLine2}
                        </Typography>
                        <Typography sx={{ mt: 2, fontSize: 15, color: '#c9c6ea' }}>
                            {brandSubtitle}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AuthLayout;
