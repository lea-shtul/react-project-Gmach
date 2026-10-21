import { Link } from "react-router-dom";
import { Box, Stack, Typography, Button } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const NotFound = () => {
    return (
        <Stack
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', p: 3 }}
        >
            <SentimentDissatisfiedIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography variant="h4">404</Typography>
            <Typography color="text.secondary">העמוד שחיפשת לא נמצא</Typography>
            <Box>
                <Button component={Link} to="/" variant="contained">
                    חזרה לדף הבית
                </Button>
            </Box>
        </Stack>
    )
}

export default NotFound
