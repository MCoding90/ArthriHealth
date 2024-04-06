import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import MedicationReminder from "./MedicationReminder";

const MedicationPage = () => {
	const [medicationName, setMedicationName] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [events, setEvents] = useState([
		{ start: new Date(), end: new Date(), title: "Test Medication" },
	]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newEvent = {
			start: new Date(startTime),
			end: new Date(endTime),
			title: medicationName,
		};

		setEvents((currentEvents) => [...currentEvents, newEvent]);
	};

	return (
		<Container>
			<h1 className="mt-3">Medication Reminder</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Medication Name</Form.Label>
					<Form.Control
						type="text"
						value={medicationName}
						onChange={(e) => setMedicationName(e.target.value)}
						placeholder="Enter Medication Name"
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Start Time</Form.Label>
					<Form.Control
						type="datetime-local"
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>End Time</Form.Label>
					<Form.Control
						type="datetime-local"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
						required
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Add Reminder
				</Button>
			</Form>
			<MedicationReminder events={events} />
		</Container>
	);
};

export default MedicationPage;
