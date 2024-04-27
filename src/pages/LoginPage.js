import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import useAuth from "../useAuth";
import ForgotPasswordModal from "../components/ForgotPassword";

const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: Yup.string().required("Password is required"),
});

function LoginPage() {
	const { login, handleResetPassword } = useAuth();
	const navigate = useNavigate();
	const [showForgotPassword, setShowForgotPassword] = useState(false);

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "75vh" }}
		>
			<Card className="w-100" style={{ maxWidth: "320px" }}>
				<Card.Body>
					<Formik
						initialValues={{ email: "", password: "" }}
						validationSchema={loginSchema}
						onSubmit={async (values, { setSubmitting, setErrors }) => {
							try {
								await login(values.email, values.password);
								navigate("/"); // Redirect to homepage after successful login
							} catch (error) {
								setErrors({ submit: `Login Failed: ${error.message}` });
							}
							setSubmitting(false);
						}}
					>
						{({ handleSubmit, errors, touched, isSubmitting }) => (
							<Form noValidate onSubmit={handleSubmit}>
								<Form.Group className="mb-3">
									<Form.Label>Email address</Form.Label>
									<Field
										name="email"
										type="email"
										as={Form.Control}
										placeholder="Enter email"
										isInvalid={touched.email && errors.email}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Password</Form.Label>
									<Field
										name="password"
										type="password"
										as={Form.Control}
										placeholder="Password"
										isInvalid={touched.password && errors.password}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.password}
									</Form.Control.Feedback>
								</Form.Group>
								{errors.submit && (
									<Alert variant="danger">{errors.submit}</Alert>
								)}
								<Button variant="primary" type="submit" disabled={isSubmitting}>
									{isSubmitting ? <Spinner /> : "Login"}
								</Button>
								<Button
									variant="link"
									onClick={() => setShowForgotPassword(true)}
									className="mt-2"
								>
									Forgot Password?
								</Button>
							</Form>
						)}
					</Formik>
				</Card.Body>
			</Card>
			<ForgotPasswordModal
				show={showForgotPassword}
				onHide={() => setShowForgotPassword(false)}
				onResetPassword={handleResetPassword}
			/>
		</Container>
	);
}

export default LoginPage;
