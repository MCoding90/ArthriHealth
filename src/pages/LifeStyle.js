import React from "react";
import { Alert, Container } from "react-bootstrap";

const LifestylePage = () => {
	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ height: "100vh" }}
		>
			<Alert variant="info">
				This feature is under construction and will be available soon. Stay
				tuned!
			</Alert>
		</Container>
	);
};

export default LifestylePage;
