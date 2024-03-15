import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const SymptomTracker = () => {
	const handleSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<Container>
			<h1 className="mt-5 mb-4">Symptom Tracker</h1>
			<Card>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="formSymptom">
								<Form.Label>Symptom</Form.Label>
								<Form.Control type="text" placeholder="Enter symptom" />
							</Form.Group>
							<Form.Group as={Col} controlId="formSeverity">
								<Form.Label>Severity</Form.Label>
								<Form.Control type="text" placeholder="Enter severity" />
							</Form.Group>
						</Row>
						<Button variant="primary" type="submit">
							Add Symptom
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default SymptomTracker;
