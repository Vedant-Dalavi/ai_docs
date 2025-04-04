// This will prevent authenticated users from accessing this route
// import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
    // const { token } = useSelector((state) => state.auth)

    const user = localStorage.getItem("user")


    if (user === null) {
        return children
    } else {
        return <Navigate to="/dashboard" />
    }
}

export default OpenRoute