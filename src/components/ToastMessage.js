import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastMessage = ({ show, message, onClose, type = "success" }) => {
	const [showToast, setShowToast] = useState(show);

	useEffect(() => {
		setShowToast(show);
	}, [show]);

	const getBgColor = () => {
		switch (type) {
			case "success":
				return "bg-success text-white";
			case "error":
				return "bg-danger text-white";
			case "warning":
				return "bg-warning text-white";
			case "info":
				return "bg-info text-white";
			default:
				return "bg-secondary text-white";
		}
	};

	return (
		<ToastContainer position="top-end" className="p-3">
			<Toast onClose={onClose} show={showToast} delay={3000} autohide bg="">
				<Toast.Header closeButton={false} className={getBgColor()}>
					<strong className="me-auto">Notification</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</ToastContainer>
	);
};

export default ToastMessage;
