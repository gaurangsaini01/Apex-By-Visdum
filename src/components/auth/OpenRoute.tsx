// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }: { children: React.ReactNode }) {
    const { token } = useSelector((state: any) => state.auth)

    if (token === null) {
        return children
    } else {
        return <Navigate to="/dashboard/monitors" />
    }
}

export default OpenRoute