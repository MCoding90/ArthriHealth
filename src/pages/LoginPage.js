import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../utils/authErrors";
import ForgotPasswordModal from "../components/ForgotPassword";
import ToastMessage from "../components/ToastMessage";

const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: Yup.string().required("Password is required"),
});

function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const redirectTo = location.state?.from?.pathname || "/userpage";

	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [toast, setToast] = useState({ show: false, message: "", type: "success" });

	const handleShowToast = (message, type) => {
		setToast({ show: true, message, type });
	};

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "75vh" }}
		>
			<ToastMessage
				show={toast.show}
				message={toast.message}
				type={toast.type}
				onClose={() => setToast((t) => ({ ...t, show: false }))}
			/>

			<Card className="w-100" style={{ maxWidth: "320px" }}>
				<Card.Header as="h5">Log In</Card.Header>
				<Card.Body>
					<Formik
						initialValues={{ email: "", password: "" }}
						validationSchema={loginSchema}
						onSubmit={async (values, { setStatus }) => {
							setStatus(undefined);
							try {
								const user = await login(values.email, values.password);
								navigate(user.emailVerified ? redirectTo : "/verify-email", {
									replace: true,
								});
							} catch (error) {
								setStatus(getAuthErrorMessage(error));
							}
						}}
					>
						{({ handleSubmit, errors, touched, isSubmitting, status }) => (
							<Form noValidate onSubmit={handleSubmit}>
								<Form.Group className="mb-3" controlId="loginEmail">
									<Form.Label>Email address</Form.Label>
									<Field
										name="email"
										type="email"
										autoComplete="email"
										as={Form.Control}
										placeholder="Enter email"
										isInvalid={!!(touched.email && errors.email)}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3" controlId="loginPassword">
									<Form.Label>Password</Form.Label>
									<Field
										name="password"
										type="password"
										autoComplete="current-password"
										as={Form.Control}
										placeholder="Password"
										isInvalid={!!(touched.password && errors.password)}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.password}
									</Form.Control.Feedback>
								</Form.Group>

								{status && <Alert variant="danger">{status}</Alert>}

								<Button variant="primary" type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<Spinner animation="border" size="sm" role="status" />
									) : (
										"Login"
									)}
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
				<Card.Footer className="text-muted">
					No account? <Link to="/signup">Sign up</Link>
				</Card.Footer>
			</Card>

			<ForgotPasswordModal
				show={showForgotPassword}
				onHide={() => setShowForgotPassword(false)}
				onShowToast={handleShowToast}
			/>
		</Container>
	);
}

export default LoginPage;
