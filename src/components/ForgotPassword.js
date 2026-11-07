import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const ForgotPasswordModal = ({ show, onHide, onShowToast }) => {
	const { resetPassword } = useAuth();
	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: Yup.object({
			email: Yup.string().email("Invalid email address").required("Required"),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				await resetPassword(values.email);
				// Same message whether or not the account exists (avoids account enumeration).
				onShowToast("If an account exists, a reset link has been sent.", "success");
				resetForm();
				onHide();
			} catch {
				onShowToast("Failed to send password reset email.", "error");
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
					<Form.Group controlId="resetEmail">
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type="email"
							name="email"
							autoComplete="email"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
							isInvalid={formik.touched.email && !!formik.errors.email}
						/>
						<Form.Control.Feedback type="invalid">
							{formik.errors.email}
						</Form.Control.Feedback>
					</Form.Group>
					<Button type="submit" className="mt-3" disabled={formik.isSubmitting}>
						Send Reset Link
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ForgotPasswordModal;
