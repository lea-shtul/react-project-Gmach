import { Outlet } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import Header from "../features/header"


export const HomePage = () => {
    return <>
        <Header></Header>
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', p: { xs: 2, sm: 3 } }}>
            <Outlet></Outlet>
        </Box>
        <Box component="footer" sx={{ py: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
                גמ"ח שכונתי © {new Date().getFullYear()}
            </Typography>
        </Box>
    </>
}
export default HomePage