import { Outlet } from "react-router-dom"
import Header from "../features/header"


export const HomePage=()=>{
    return <>
    <Header></Header>
  <Outlet></Outlet>
    </>
}
export default HomePage