import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Simple check for token presence
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
