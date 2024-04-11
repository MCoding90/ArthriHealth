import React, { useState } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import MedicationReminder from "./MedicationReminder";

const MedicationPage = () => {
	// Define 'today' to use as the minimum start date
	const today = new Date().toISOString().slice(0, 16);

	// State hooks to manage form inputs and events
	const [medicationName, setMedicationName] = useState("");
	const [dosageNumber, setDosage] = useState("");
	const [frequencyNumber, setFrequency] = useState("");
	const [selectedDays, setSelectedDays] = useState([]);
	const [startTime, setStartTime] = useState(today);
	const [endTime, setEndTime] = useState("");
	const [events, setEvents] = useState([]);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	console.log("Initial events state:", events);

	// Function to calculate reminders based on user inputs like start time, frequency, and end time.
	const calculateNextReminders = (start, frequency, end) => {
		let reminders = [];
		let currentDate = new Date(start);
		const endDate = new Date(end);

		// Loop through the date range to create reminders based on the selected frequency
		while (currentDate <= endDate) {
			// Daily frequency: Add a reminder for each day
			if (frequency === "daily") {
				reminders.push(new Date(currentDate));
			}
			// Weekly frequency: Add a reminder for the selected days of the week
			else if (frequency === "weekly") {
				if (selectedDays.includes(currentDate.getDay().toString())) {
					reminders.push(new Date(currentDate));
				}
			}
			// Fortnightly frequency (every two weeks)
			else if (frequency === "fortnightly") {
				let dayIncrement = 1; // Start by checking the next day
				while (currentDate <= endDate) {
					if (selectedDays.includes(currentDate.getDay().toString())) {
						reminders.push(new Date(currentDate));
						dayIncrement = 14; // Once a match is found, skip 14 days after adding a reminder
					}
					currentDate.setDate(currentDate.getDate() + dayIncrement);
				}
			}

			// Monthly frequency: Add a reminder once a month
			else if (frequency === "monthly") {
				reminders.push(new Date(currentDate));
				currentDate.setMonth(currentDate.getMonth() + 1);
			}

			// Move to the next day for daily, weekly, and monthly frequencies
			// For fortnightly, the date has already been adjusted in the loop
			if (["daily", "weekly", "monthly"].includes(frequency)) {
				currentDate.setDate(currentDate.getDate() + 1);
			}
		}

		console.log("Calculated reminders:", reminders);

		return reminders.map((date) => ({
			start: date,
			end: new Date(date.getTime() + 3600000), // Assuming end is 1 hour after start
			title: medicationName,
			dosage: dosageNumber,
			frequency: frequency,
			dayOfWeek: date.toLocaleString("default", { weekday: "long" }),
		}));
	};

	// Handler for form submission. Adds the new reminders to the state, clears the form, and shows the success modal
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted");

		const newReminders = calculateNextReminders(
			startTime,
			frequencyNumber,
			endTime
		);
		console.log("New reminders to add:", newReminders);

		setEvents((currentEvents) => {
			const updatedEvents = [...currentEvents, ...newReminders];
			console.log("Updated events after adding new reminders:", updatedEvents);
			return updatedEvents;
		});

		// Clear the form by resetting state values to their initial states
		setMedicationName("");
		setDosage("");
		setFrequency("");
		setSelectedDays([]);
		setStartTime(today); // Reset to 'today' or another initial value as needed
		setEndTime("");

		// Show the success modal
		setShowSuccessModal(true);

		// Hide the modal after 5 seconds
		setTimeout(() => setShowSuccessModal(false), 5000);
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
					<Form.Label>Dosage</Form.Label>
					<Form.Control
						type="text"
						value={dosageNumber}
						onChange={(e) => setDosage(e.target.value)}
						placeholder="Enter Dosage"
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Frequency</Form.Label>
					<Form.Control
						as="select"
						value={frequencyNumber}
						onChange={(e) => setFrequency(e.target.value)}
						required
					>
						<option value="">Select Frequency</option>
						<option value="daily">Daily</option>
						<option value="weekly">Once a Week</option>
						<option value="fortnightly">Every Two Weeks</option>
						<option value="monthly">Once a Month</option>
					</Form.Control>
				</Form.Group>

				{["weekly", "fortnightly"].includes(frequencyNumber) && (
					<Form.Group className="mb-3">
						<Form.Label>Day(s) of the Week</Form.Label>
						<Form.Control
							as="select"
							multiple
							value={selectedDays}
							onChange={(e) =>
								setSelectedDays(
									[...e.target.selectedOptions].map((option) => option.value)
								)
							}
							required
						>
							<option value="0">Sunday</option>
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="5">Friday</option>
							<option value="6">Saturday</option>
						</Form.Control>
					</Form.Group>
				)}
				<Form.Group className="mb-3">
					<Form.Label>Start Time</Form.Label>
					<Form.Control
						type="datetime-local"
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
						required
						min={today} // Sets the min attribute
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>End Time</Form.Label>
					<Form.Control
						type="datetime-local"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
						required
						min={startTime || today} // Sets the min attribute to startTime or today if startTime is not set
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Add Reminder
				</Button>
			</Form>
			<MedicationReminder events={events} />
			{/* Success Message Modal */}
			<Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Success</Modal.Title>
				</Modal.Header>
				<Modal.Body>Reminder added successfully!</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowSuccessModal(false)}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default MedicationPage;
