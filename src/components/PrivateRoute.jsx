import { Navigate } from "react-router-dom"

const PrivateRoute = (props) => {
    const { children } = props
    const token = localStorage.getItem('token')
    if(!token) {
        return <Navigate to={'/login'} />
    }
    return children
}

export default PrivateRoute