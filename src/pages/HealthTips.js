import React from "react";
import { Container, Card } from "react-bootstrap";

const HealthTips = () => {
	const tips = [
		"Stay active with low-impact exercises like swimming or walking.",
		"Eat a balanced diet rich in fruits, vegetables, and omega-3 fatty acids.",
		"Take regular breaks to rest and relax throughout the day.",
		"Stay hydrated by drinking plenty of water.",
		"Get plenty of sleep to support overall health and wellbeing.",
	];

	return (
		<Container>
			<h1 className="mt-5 mb-4">Tips</h1>
			{tips.map((tip, index) => (
				<Card key={index} className="mb-3">
					<Card.Body>{tip}</Card.Body>
				</Card>
			))}
		</Container>
	);
};

export default HealthTips;
