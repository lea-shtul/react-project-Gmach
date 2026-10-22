import { createBrowserRouter } from "react-router-dom";
import UserProvider from "../context/userContext";
import App from "../App";
import { Login } from "../pages/login";
import Register from "../pages/register";
import HomePage from "../pages/HomePage";
// import ItemsList from "../features/ItemsList";
import ItemDetails from "../pages/ItemDetails";
import NotFound from "../features/NotFound";
import ItemsList from "../features/ItemsList";
import MyRequests from "../pages/MyRequests";
import ReceivedRequests from "../pages/ReceivedRequests";
import MyItems from "../pages/myItems";
import ItemForm from "../components/itemForm";
import MyStats from "../pages/myStats";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "./AdminRoute";
import Landing from "../pages/Landing";



export const route = createBrowserRouter([
    {
        path: '/',
        element: <UserProvider><App /></UserProvider>,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <HomePage />,
                        children: [
                            { path: '/', element: <ItemsList /> },
                            {
                                path: 'my-items',
                                element: <MyItems />,
                                children: [
                                    { path: 'new', element: <ItemForm /> },
                                    { path: ':id/edit', element: <ItemForm /> },
                                ],
                            },
                            { path: 'myRequests', element: <MyRequests /> },
                            { path: 'received', element: <ReceivedRequests /> },
                            { path: 'stats', element: <MyStats /> },
                        ],
                    },
                    { path: 'items/:id', element: <ItemDetails /> },
                    {
                        element: <AdminRoute />,
                        children: [
                            { path: 'admin', element: <AdminDashboard /> },
                        ],
                    }
                ],
            },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: '*', element: <NotFound /> },
            {path:'landing',element:<Landing/>}
        ],
    },
]);


