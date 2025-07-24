import { useSelector } from "react-redux"
import { Navigate } from "react-router";

function ProtectedRoute({ children, requiredRoles = [], redirectTo = '/' }:
    { children: React.ReactNode, requiredRoles?: number[], redirectTo?: string }) {

    const { token, user } = useSelector((state: any) => state.auth)
    const userRole = user?.role_id
    if (!token) {
        return <Navigate to={redirectTo} replace />
    }
    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        return <Navigate to={"/error-page"} replace />
    }
    return children;
}

export default ProtectedRoute



