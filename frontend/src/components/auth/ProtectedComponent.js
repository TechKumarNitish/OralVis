import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = Cookies.get("token");
    const { user, fetchUserProfile } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (token && !user) {
                await fetchUserProfile();
            }
            setLoading(false);
        };
        init();
    }, [token, user, fetchUserProfile]);

    if (!token) return <Navigate to="/login" />;

    if (loading) return <div className="animate-pulse">
        <div className="px-4 py-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="border-t border-gray-200">
            <div className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    </div>;

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("You are not authorized to access this page");
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
