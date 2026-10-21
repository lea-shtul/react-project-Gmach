import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    action?: ReactNode;
};

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
    <Stack
        direction="row"
        spacing={2}
        sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexWrap: 'wrap',
            mb: 3,
        }}
    >
        <Box>
            <Typography variant="h5">{title}</Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
        {action && <Box>{action}</Box>}
    </Stack>
);

export default PageHeader;
