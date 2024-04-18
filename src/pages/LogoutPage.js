import React from "react";
import { Button, Container } from "react-bootstrap";
import useAuth from "../useAuth";

function LogoutPage() {
	const { logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<Container>
			<Button variant="danger" onClick={handleLogout}>
				Logout
			</Button>
		</Container>
	);
}

export default LogoutPage;
