import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import Header from "../features/header"


export const HomePage = () => {
    return <>
        <Header></Header>
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', p: { xs: 2, sm: 3 } }}>
            <Outlet></Outlet>
        </Box>
    </>
}
export default HomePage