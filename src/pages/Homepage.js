import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
const HomePage = () => {
	return (
		<Container>
			<Row className="mt-5">
				<Col>
					<h1>Rheumatoid Arthritis Web App</h1>
				</Col>
			</Row>
			<Row className="mt-5">
				<Col>
					<h3>Features:</h3>
					<ul>
						<li>
							Track Symptoms: Monitor your symptoms and record them for your
							healthcare provider.
						</li>
						<li>
							Medication Reminders: Set reminders for your medications to ensure
							timely doses.
						</li>
						<li>
							Educational Resources: Access educational content to learn more
							about rheumatoid arthritis and how to manage it.
						</li>
						<li>
							Lifestyle Management Tools: Get personalized tips and advice for
							managing your lifestyle to improve your well-being.
						</li>
					</ul>
				</Col>
			</Row>
			{/* <Row className="mt-5">
				<Col>
					<Link to="/symptom-tracker" className="mr-3">
						<Button variant="primary">Symptom Tracker</Button>
					</Link>
					<Link to="/medication-page" className="mr-3">
						<Button variant="primary">Medication Reminder</Button>
					</Link>
					<Link to="/health-tips">
						<Button variant="primary">Tips</Button>
					</Link>
				</Col>
			</Row> */}
		</Container>
	);
};

export default HomePage;
