import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import useAuth from "../useAuth";
import ForgotPasswordModal from "../components/ForgotPassword";
import ToastMessage from "../components/ToastMessage";

const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: Yup.string().required("Password is required"),
});

function LoginPage() {
	const { login } = useAuth(); // <-- cleaned
	const navigate = useNavigate();

	const [showForgotPassword, setShowForgotPassword] = useState(false);

	// Toast state
	const [toastShow, setToastShow] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success");

	// Toast handler
	const handleShowToast = (message, type) => {
		setToastMessage(message);
		setToastType(type);
		setToastShow(true);
	};

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "75vh" }}
		>
			{/* Toast */}
			<ToastMessage
				show={toastShow}
				message={toastMessage}
				type={toastType}
				onClose={() => setToastShow(false)}
			/>

			<Card className="w-100" style={{ maxWidth: "320px" }}>
				<Card.Body>
					<Formik
						initialValues={{ email: "", password: "" }}
						validationSchema={loginSchema}
						onSubmit={async (values, { setSubmitting, setErrors }) => {
							try {
								await login(values.email, values.password);
								navigate("/");
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
				onShowToast={handleShowToast}
			/>
		</Container>
	);
}

export default LoginPage;
