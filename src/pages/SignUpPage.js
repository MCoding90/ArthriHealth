import React, { useState } from "react";
import {
	Container,
	Card,
	Form,
	Button,
	Row,
	Col,
	Alert,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "../useAuth";

function SignupPage() {
	const { signup } = useAuth();
	const [error, setError] = useState(""); // State to handle errors
	const [loading, setLoading] = useState(false); // State to manage loading status

	// Yup validation schema
	const schema = Yup.object().shape({
		name: Yup.string().required("Name is required"),
		email: Yup.string()
			.email("Invalid email format")
			.required("Email is required"),
		password: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is required"),
	});

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ height: "100vh" }}
		>
			<Card style={{ width: "30rem" }}>
				<Card.Header as="h5">Sign Up</Card.Header>
				<Card.Body>
					{error && (
						<Alert variant="danger" onClose={() => setError("")} dismissible>
							{error}
						</Alert>
					)}
					<Formik
						validationSchema={schema}
						onSubmit={(values, { setSubmitting, resetForm }) => {
							setLoading(true);
							signup(values.email, values.password, values.name)
								.then(() => {
									alert("Signup successful!");
									resetForm();
								})
								.catch((error) => {
									setError(`Signup failed: ${error.message}`);
								})
								.finally(() => {
									setSubmitting(false);
									setLoading(false);
								});
						}}
						initialValues={{
							name: "",
							email: "",
							password: "",
						}}
					>
						{({
							handleSubmit,
							handleChange,
							handleBlur,
							values,
							touched,
							isValid,
							errors,
						}) => (
							<Form noValidate onSubmit={handleSubmit}>
								<Row className="mb-3">
									<Form.Group as={Col} md="12" controlId="validationFormik01">
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											name="name"
											value={values.name}
											onChange={handleChange}
											isValid={touched.name && !errors.name}
											isInvalid={!!errors.name}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.name}
										</Form.Control.Feedback>
									</Form.Group>
									<Form.Group as={Col} md="12" controlId="validationFormik02">
										<Form.Label>Email</Form.Label>
										<Form.Control
											type="email"
											name="email"
											value={values.email}
											onChange={handleChange}
											isValid={touched.email && !errors.email}
											isInvalid={!!errors.email}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.email}
										</Form.Control.Feedback>
									</Form.Group>
									<Form.Group as={Col} md="12" controlId="validationFormik03">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											name="password"
											value={values.password}
											onChange={handleChange}
											isValid={touched.password && !errors.password}
											isInvalid={!!errors.password}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.password}
										</Form.Control.Feedback>
									</Form.Group>
								</Row>
								<Button
									type="submit"
									disabled={loading}
									style={{ marginTop: "1rem" }}
								>
									{loading ? "Signing Up..." : "Sign Up"}
								</Button>
							</Form>
						)}
					</Formik>
				</Card.Body>
				<Card.Footer className="text-muted">
					Already have an account? <a href="/login">Log in!</a>
				</Card.Footer>
			</Card>
		</Container>
	);
}

export default SignupPage;
