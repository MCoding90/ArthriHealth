import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Requires a signed-in user with a verified email.
const ProtectedRoute = () => {
	const { currentUser } = useAuth();
	const location = useLocation();

	if (!currentUser) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}
	if (!currentUser.emailVerified) {
		return <Navigate to="/verify-email" replace />;
	}
	return <Outlet />;
};

// Only for signed-out users (login / signup); verified users go to their dashboard.
export const GuestRoute = () => {
	const { currentUser } = useAuth();
	if (currentUser?.emailVerified) {
		return <Navigate to="/userpage" replace />;
	}
	return <Outlet />;
};

export default ProtectedRoute;
