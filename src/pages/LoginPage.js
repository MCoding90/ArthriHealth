import React from "react";
import {
	Container,
	Card,
	Button,
	Form as BootstrapForm,
} from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import useAuth from "../useAuth";

const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: Yup.string().required("Password is required"),
});

function LoginPage() {
	const { login } = useAuth();

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
								// Redirect or show success
							} catch (error) {
								setErrors({ submit: `Login Failed: ${error.message}` });
								console.error("Login error:", error);
							}
							setSubmitting(false);
						}}
					>
						{({ errors, touched, isSubmitting }) => (
							<Form>
								<BootstrapForm.Group className="mb-2">
									<BootstrapForm.Label>Email address</BootstrapForm.Label>
									<Field
										name="email"
										type="email"
										placeholder="Enter email"
										className={`form-control ${
											touched.email && !errors.email
												? "is-valid"
												: touched.email && errors.email
												? "is-invalid"
												: ""
										}`}
									/>
									{touched.email && errors.email ? (
										<div className="invalid-feedback">{errors.email}</div>
									) : null}
								</BootstrapForm.Group>
								<BootstrapForm.Group className="mb-2">
									<BootstrapForm.Label>Password</BootstrapForm.Label>
									<Field
										name="password"
										type="password"
										placeholder="Password"
										className={`form-control ${
											touched.password && !errors.password
												? "is-valid"
												: touched.password && errors.password
												? "is-invalid"
												: ""
										}`}
									/>
									{touched.password && errors.password ? (
										<div className="invalid-feedback">{errors.password}</div>
									) : null}
								</BootstrapForm.Group>
								{errors.submit && (
									<div style={{ color: "red" }}>{errors.submit}</div>
								)}
								<Button
									variant="primary"
									type="submit"
									className="w-75"
									disabled={isSubmitting}
								>
									Login
								</Button>
							</Form>
						)}
					</Formik>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default LoginPage;
