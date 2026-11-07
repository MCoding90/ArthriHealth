import React, { useState } from "react";
import { Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LogoutPage() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [error, setError] = useState("");

	const handleLogout = async () => {
		setIsLoggingOut(true);
		setError("");
		try {
			await logout();
			navigate("/login", { replace: true });
		} catch {
			setError("Failed to log out. Please try again.");
			setIsLoggingOut(false);
		}
	};

	return (
		<Container className="mt-5">
			{error && <Alert variant="danger">{error}</Alert>}
			<Button variant="danger" onClick={handleLogout} disabled={isLoggingOut}>
				{isLoggingOut ? "Logging Out..." : "Logout"}
			</Button>
		</Container>
	);
}

export default LogoutPage;
