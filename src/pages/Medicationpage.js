import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import MedicationReminder from "./MedicationReminder";

const MedicationPage = () => {
	const [medicationName, setMedicationName] = useState("");
	const [dosageNumber, setDosage] = useState("");
	const [frequencyNumber, setFrequency] = useState("");
	const [selectedDays, setSelectedDays] = useState([]);
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [events, setEvents] = useState([
		{ start: new Date(), end: new Date(), title: "Test Medication" },
	]);

	const today = new Date().toISOString().slice(0, 16);

	const calculateNextReminders = (
		startTime,
		frequency,
		endTime = new Date(startTime).setFullYear(
			new Date(startTime).getFullYear() + 1
		)
	) => {
		let reminders = [];
		let currentDate = new Date(startTime);
		const endDate = new Date(endTime);

		while (currentDate <= endDate) {
			let dayOfWeek = currentDate.getDay(); // Get the day of the week
			if (frequency === "daily") {
				reminders.push({ date: new Date(currentDate), dayOfWeek });
				currentDate.setDate(currentDate.getDate() + 1);
			} else if (["weekly", "biweekly", "fortnightly"].includes(frequency)) {
				if (selectedDays.includes(dayOfWeek.toString())) {
					reminders.push({ date: new Date(currentDate), dayOfWeek });
				}
				currentDate.setDate(currentDate.getDate() + 1);
				if (
					frequency === "biweekly" &&
					selectedDays.includes(dayOfWeek.toString())
				) {
					currentDate.setDate(currentDate.getDate() + 7);
				}
				if (
					frequency === "fortnightly" &&
					selectedDays.includes(dayOfWeek.toString())
				) {
					currentDate.setDate(currentDate.getDate() + 14);
				}
			} else if (frequency === "monthly") {
				reminders.push({ date: new Date(currentDate), dayOfWeek });
				currentDate.setMonth(currentDate.getMonth() + 1);
			}
		}
		return reminders.map((reminder) => ({
			start: reminder.date,
			end: new Date(endTime),
			title: medicationName,
			dosage: dosageNumber,
			frequency: frequencyNumber,
			dayOfWeek: reminder.dayOfWeek,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const reminderDates = calculateNextReminders(
			startTime,
			frequencyNumber,
			endTime
		);

		const newEvents = reminderDates.map((date) => ({
			start: date,
			end: new Date(endTime),
			title: medicationName,
			dosage: dosageNumber,
			frequency: frequencyNumber,
		}));

		setEvents((currentEvents) => [...currentEvents, ...newEvents]);
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
						<option value="biweekly">Twice a Week</option>
						<option value="fortnightly">Every Two Weeks</option>
						<option value="monthly">Once a Month</option>
					</Form.Control>
				</Form.Group>

				{["weekly", "biweekly"].includes(frequencyNumber) && (
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
		</Container>
	);
};

export default MedicationPage;
