import { Navigate } from 'react-router-dom';
import { getUserData, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = getUserData();
    const role = getUserRole();

    if (!user || !role) {
        return <Navigate to="/" replace />;
    }

    if (!Array.isArray(allowedRoles)) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
