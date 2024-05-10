import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
	const { currentUser } = useAuth(); // this hook is fetching the current user's authentication status
	const isAuthenticated = currentUser && currentUser.emailVerified;

	//console.log("Checking authentication: ", isAuthenticated);
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
