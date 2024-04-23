import React, { useState } from "react";
import { Button, Container, Alert } from "react-bootstrap";
import useAuth from "../useAuth";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [isLoggingOut, setIsLoggingOut] = useState(false); // State to handle button loading behavior
	const [error, setError] = useState(""); // State to handle any logout errors

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await logout();
			navigate("/login"); // Redirect to login page after successful logout
		} catch (error) {
			console.error("Logout failed:", error);
			setError("Failed to log out. Please try again."); // Set error message
			setIsLoggingOut(false);
		}
	};

	return (
		<Container className="mt-5">
			{error && <Alert variant="danger">{error}</Alert>}
			messages
			<Button variant="danger" onClick={handleLogout} disabled={isLoggingOut}>
				{isLoggingOut ? "Logging Out..." : "Logout"}
			</Button>
		</Container>
	);
}

export default LogoutPage;
