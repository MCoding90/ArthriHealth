import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
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
			<Row className="g-3 mt-1">
				<Col md={4}>
					<Card className="h-100">
						<Card.Body>
							<Card.Title>Profile</Card.Title>
							<Card.Text>View and edit your profile details.</Card.Text>
							<Button variant="primary" as={Link} to="/profile">
								Go to Profile
							</Button>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className="h-100">
						<Card.Body>
							<Card.Title>Medication Tracker</Card.Title>
							<Card.Text>
								Manage your medications and track your intake.
							</Card.Text>
							<Button variant="primary" as={Link} to="/medication-page">
								Manage Medications
							</Button>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className="h-100">
						<Card.Body>
							<Card.Title>Symptom Tracker</Card.Title>
							<Card.Text>Record and review your symptoms over time.</Card.Text>
							<Button variant="primary" as={Link} to="/symptom-tracker">
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
