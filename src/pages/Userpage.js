import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
	const { currentUser } = useAuth();

	return (
		<Container>
			<Row className="mt-4">
				<Col>
					<h1>Welcome back, {currentUser.displayName || "User"}!</h1>
				</Col>
			</Row>
			<Row>
				<Col md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Profile</Card.Title>
							<Card.Text>View and edit your profile details.</Card.Text>
							<Button variant="primary" href="/profile">
								Go to Profile
							</Button>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Medication Tracker</Card.Title>
							<Card.Text>
								Manage your medications and track your intake.
							</Card.Text>
							<Button variant="primary" href="/medication-page">
								Manage Medications
							</Button>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Symptom Tracker</Card.Title>
							<Card.Text>Record and review your symptoms over time.</Card.Text>
							<Button variant="primary" href="/symptom-tracker">
								Track Symptoms
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Dashboard;
