import React, { useState } from "react";
import { Card, Form, Button, Container } from "react-bootstrap";
import useAuth from "../useAuth";

function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(""); // State to hold error message

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(""); // Clear previous errors
		try {
			await login(email, password);
			// Redirect or show success
		} catch (error) {
			setError(`Login Failed: ${error.message}`); // Set error message
			console.error("Login error:", error);
		}
	};

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "100vh" }}
		>
			<Card className="w-100" style={{ maxWidth: "320px" }}>
				<Card.Body>
					<Form onSubmit={handleLogin}>
						<Form.Group className="mb-3">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter email"
								onChange={(e) => setEmail(e.target.value)}
								aria-label="Email Address"
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)}
								aria-label="Password"
							/>
						</Form.Group>
						{error && <div style={{ color: "red" }}>{error}</div>}
						<Button variant="primary" type="submit" className="w-100">
							Login
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default LoginPage;
