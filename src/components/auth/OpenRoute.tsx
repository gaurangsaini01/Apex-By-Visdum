// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }: { children: React.ReactNode }) {
    const { token, user } = useSelector((state: any) => state.auth)

    if (token === null) {
        return children
    } else {
        if (user?.role_id == 1) {
            return <Navigate to="/dashboard/logs" />
        }
        else return <Navigate to="/dashboard/monitors" />
    }
}

export default OpenRoute