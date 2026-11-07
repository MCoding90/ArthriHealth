import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../utils/authErrors";

const schema = Yup.object().shape({
	name: Yup.string().trim().required("Name is required"),
	email: Yup.string()
		.email("Invalid email format")
		.required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

const fields = [
	{ name: "name", label: "Name", type: "text", autoComplete: "name" },
	{ name: "email", label: "Email", type: "email", autoComplete: "email" },
	{ name: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

function SignupPage() {
	const { signup } = useAuth();
	const navigate = useNavigate();

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "75vh" }}
		>
			<Card className="w-100" style={{ maxWidth: "30rem" }}>
				<Card.Header as="h5">Sign Up</Card.Header>
				<Card.Body>
					<Formik
						validationSchema={schema}
						initialValues={{ name: "", email: "", password: "" }}
						onSubmit={async (values, { setStatus }) => {
							setStatus(undefined);
							try {
								await signup(values.email, values.password, values.name.trim());
								navigate("/verify-email", { replace: true });
							} catch (error) {
								setStatus(getAuthErrorMessage(error));
							}
						}}
					>
						{({
							handleSubmit,
							handleChange,
							handleBlur,
							values,
							touched,
							errors,
							isSubmitting,
							status,
							setStatus,
						}) => (
							<Form noValidate onSubmit={handleSubmit}>
								{status && (
									<Alert variant="danger" onClose={() => setStatus(undefined)} dismissible>
										{status}
									</Alert>
								)}
								<Row className="mb-3">
									{fields.map((field) => (
										<Form.Group
											key={field.name}
											as={Col}
											md="12"
											className="mb-2"
											controlId={`signup-${field.name}`}
										>
											<Form.Label>{field.label}</Form.Label>
											<Form.Control
												type={field.type}
												name={field.name}
												autoComplete={field.autoComplete}
												value={values[field.name]}
												onChange={handleChange}
												onBlur={handleBlur}
												isValid={touched[field.name] && !errors[field.name]}
												isInvalid={touched[field.name] && !!errors[field.name]}
											/>
											<Form.Control.Feedback type="invalid">
												{errors[field.name]}
											</Form.Control.Feedback>
										</Form.Group>
									))}
								</Row>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "Signing Up..." : "Sign Up"}
								</Button>
							</Form>
						)}
					</Formik>
				</Card.Body>
				<Card.Footer className="text-muted">
					Already have an account? <Link to="/login">Log in!</Link>
				</Card.Footer>
			</Card>
		</Container>
	);
}

export default SignupPage;
