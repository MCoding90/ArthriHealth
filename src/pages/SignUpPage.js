import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import useAuth from "../useAuth";

function SignupPage() {
	const { signup } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const handleSignup = async (e) => {
		e.preventDefault();
		await signup(email, password, name);
	};

	return (
		<Container>
			<Form onSubmit={handleSignup}>
				<Form.Group>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter name"
						onChange={(e) => setName(e.target.value)}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Sign Up
				</Button>
			</Form>
		</Container>
	);
}

export default SignupPage;
