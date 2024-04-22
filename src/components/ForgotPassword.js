import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordModal = ({ show, onHide, onShowToast }) => {
	const auth = getAuth();
	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: Yup.object({
			email: Yup.string().email("Invalid email address").required("Required"),
		}),
		onSubmit: async (values) => {
			try {
				await sendPasswordResetEmail(auth, values.email);
				onShowToast("Password reset email sent!", "success");
				onHide(); // Close the modal on successful email submission
			} catch (error) {
				onShowToast("Failed to send password reset email.", "error");
				console.error("Password reset error:", error);
			}
		},
	});

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Reset Password</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={formik.handleSubmit}>
					<Form.Group>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type="email"
							name="email"
							onChange={formik.handleChange}
							value={formik.values.email}
							isInvalid={!!formik.errors.email}
						/>
						<Form.Control.Feedback type="invalid">
							{formik.errors.email}
						</Form.Control.Feedback>
					</Form.Group>
					<Button type="submit" className="mt-3">
						Send Reset Link
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ForgotPasswordModal;
