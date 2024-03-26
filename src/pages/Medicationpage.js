import React from "react";
import { Container } from "react-bootstrap";
import MedicationReminder from "./MedicationReminder";

const medicationReminders = [
	{
		start: new Date(2024, 3, 15, 10, 0),
		end: new Date(2024, 3, 15, 10, 30),
		title: "Take medication",
	},
];

const MedicationPage = () => {
	return (
		<Container>
			<h1 className="mt-3">Medication Reminder</h1>
			<MedicationReminder events={medicationReminders} />
		</Container>
	);
};

export default MedicationPage;
