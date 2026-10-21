import type { ReactElement } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

export type StatColor = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';

type StatCardProps = {
    number: number;
    label: string;
    icon: ReactElement;
    color?: StatColor;
};

const StatCard = ({ number, label, icon, color = 'primary' }: StatCardProps) => (
    <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center' }}>
        <Box
            sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1,
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
                color: `${color}.main`,
            }}
        >
            {icon}
        </Box>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>{number}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Paper>
);

export default StatCard;
