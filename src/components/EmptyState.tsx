import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

type EmptyStateProps = {
    icon: ReactNode;
    title: string;
    text?: string;
    action?: ReactNode;
};

const EmptyState = ({ icon, title, text, action }: EmptyStateProps) => (
    <Stack
        spacing={1}
        sx={{
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 4,
            px: 2,
        }}
    >
        <Box sx={{ color: 'text.disabled', display: 'flex', mb: 0.5 }}>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
        {text && (
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                {text}
            </Typography>
        )}
        {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Stack>
);

export default EmptyState;
