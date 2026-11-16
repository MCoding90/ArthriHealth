import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../HomePage.css";

const customButtonStyle = {
	backgroundColor: "rgba(0, 128, 128, 0.7)",
	color: "white",
	border: "none",
};

const HomePage = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const handleButtonClick = () => {
		//console.log("Button clicked. Current user:", currentUser);
		if (currentUser) {
			//console.log("Navigating to dashboard.");
			navigate("/userpage");
		} else {
			//console.log("Navigating to signup.");
			navigate("/signup");
		}
	};

	return (
		<Container fluid className="p-0">
			<div className="hero-section">
				<img
					src="/images/hero.jpg"
					alt="Manage arthritis"
					className="hero-image"
				/>
				<div className="hero-content">
					<h1>ArthriHealth</h1>
					<p>Empower Your Daily Health Journey</p>
					<Button variant="primary" onClick={handleButtonClick}>
						{currentUser ? "Go to Dashboard" : "Get Started"}
					</Button>
				</div>
			</div>
			<Row className="mt-5">
				<Col>
					<h3>Features:</h3>
					<Row>
						<Col md={6} lg={3} className="mb-4">
							<Card>
								<Card.Img variant="top" src="/images/symptom.jpg" />
								<Card.Body>
									<Card.Title>Track Symptoms</Card.Title>
									<Card.Text>
										Monitor your symptoms and record them for your healthcare
										provider.
									</Card.Text>
									<Link to="/symptom-tracker">
										<Button style={customButtonStyle}>Learn More</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} lg={3} className="mb-4">
							<Card>
								<Card.Img variant="top" src="/images/medication.jpg" />
								<Card.Body>
									<Card.Title>Medication Reminders</Card.Title>
									<Card.Text>
										Set reminders for your medications to ensure timely doses.
									</Card.Text>
									<Link to="/medication-page">
										<Button style={customButtonStyle}>Learn More</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} lg={3} className="mb-4">
							<Card>
								<Card.Img variant="top" src="/images/education.jpg" />
								<Card.Body>
									<Card.Title>Educational Resources</Card.Title>
									<Card.Text>
										Access educational content to learn more about rheumatoid
										arthritis and how to manage it.
									</Card.Text>
									<Link to="/health-tips">
										<Button style={customButtonStyle}>Learn More</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} lg={3} className="mb-4">
							<Card>
								<Card.Img variant="top" src="/images/lifestyle.jpg" />
								<Card.Body>
									<Card.Title>Lifestyle Management Tools</Card.Title>
									<Card.Text>
										Get personalized tips and advice for managing your lifestyle
										to improve your well-being.
									</Card.Text>
									<Link to="/lifestyle-management">
										<Button style={customButtonStyle}>Learn More</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default HomePage;
