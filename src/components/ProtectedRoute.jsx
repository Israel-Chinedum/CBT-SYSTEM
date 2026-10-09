import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "/src/context/AuthContext";

// Wrap any routes that need a logged-in student inside this.
// Visitors without a session are sent to /login.
export function ProtectedRoute() {

    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
