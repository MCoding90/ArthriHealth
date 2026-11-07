import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCapsules,
	faPills,
	faCalendarPlus,
	faSyringe,
	faCalendarDay,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import MedicationReminder from "./MedicationReminder";
import {
	collection,
	doc,
	query,
	orderBy,
	onSnapshot,
	writeBatch,
	deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
	MAX_REMINDERS,
	buildReminders,
	getReminderDates,
	toLocalDateTimeInput,
} from "../utils/reminders";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MedicationPage = () => {
	const { currentUser } = useAuth();
	const [now] = useState(() => toLocalDateTimeInput());

	const [medicationName, setMedicationName] = useState("");
	const [dosage, setDosage] = useState("");
	const [frequency, setFrequency] = useState("");
	const [selectedDays, setSelectedDays] = useState([]);
	const [startTime, setStartTime] = useState(now);
	const [endTime, setEndTime] = useState("");
	const [events, setEvents] = useState([]);
	const [status, setStatus] = useState(null); // { variant, message }
	const [saving, setSaving] = useState(false);

	const isWeekly = frequency === "weekly" || frequency === "fortnightly";

	useEffect(() => {
		const medsRef = collection(db, "Users", currentUser.uid, "medications");
		const q = query(medsRef, orderBy("start", "asc"));
		return onSnapshot(
			q,
			(snapshot) => {
				setEvents(
					snapshot.docs.map((d) => {
						const data = d.data();
						return { ...data, id: d.id, start: data.start.toDate(), end: data.end.toDate() };
					})
				);
			},
			() =>
				setStatus({
					variant: "danger",
					message: "Could not load your reminders. Please refresh the page.",
				})
		);
	}, [currentUser.uid]);

	useEffect(() => {
		if (status?.variant !== "success") return;
		const timer = setTimeout(() => setStatus(null), 3000);
		return () => clearTimeout(timer);
	}, [status]);

	const resetForm = () => {
		setMedicationName("");
		setDosage("");
		setFrequency("");
		setSelectedDays([]);
		setStartTime(toLocalDateTimeInput());
		setEndTime("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus(null);

		if (isWeekly && selectedDays.length === 0) {
			setStatus({ variant: "danger", message: "Select at least one day of the week." });
			return;
		}
		const dates = getReminderDates({
			start: startTime,
			end: endTime,
			frequency,
			daysOfWeek: selectedDays,
		});
		if (dates.length === 0) {
			setStatus({ variant: "danger", message: "No reminders fall within that date range." });
			return;
		}
		if (dates.length > MAX_REMINDERS) {
			setStatus({
				variant: "danger",
				message: `That schedule creates ${dates.length} reminders (max ${MAX_REMINDERS}). Please shorten the date range.`,
			});
			return;
		}

		const reminders = buildReminders({
			name: medicationName.trim(),
			dosage: dosage.trim(),
			frequency,
			dates,
		});

		setSaving(true);
		try {
			const medsRef = collection(db, "Users", currentUser.uid, "medications");
			const batch = writeBatch(db);
			reminders.forEach((reminder) => batch.set(doc(medsRef), reminder));
			await batch.commit();
			setStatus({
				variant: "success",
				message: `${reminders.length} reminder${reminders.length === 1 ? "" : "s"} added successfully!`,
			});
			resetForm();
		} catch {
			setStatus({ variant: "danger", message: "Could not save the reminder. Please try again." });
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (event) => {
		await deleteDoc(doc(db, "Users", currentUser.uid, "medications", event.id));
	};

	return (
		<Container className="my-4">
			<h1>
				<FontAwesomeIcon icon={faCapsules} className="me-2" />
				Medication Reminder
			</h1>
			{status && (
				<Alert variant={status.variant} dismissible onClose={() => setStatus(null)}>
					{status.message}
				</Alert>
			)}
			<Form onSubmit={handleSubmit} className="mb-4">
				<Form.Group className="mb-3" controlId="medicationName">
					<Form.Label>
						<FontAwesomeIcon icon={faPills} className="me-2" />
						Medication Name
					</Form.Label>
					<Form.Control
						type="text"
						value={medicationName}
						onChange={(e) => setMedicationName(e.target.value)}
						placeholder="Enter Medication Name"
						maxLength={100}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="dosage">
					<Form.Label>
						<FontAwesomeIcon icon={faSyringe} className="me-2" />
						Dosage
					</Form.Label>
					<Form.Control
						type="text"
						value={dosage}
						onChange={(e) => setDosage(e.target.value)}
						placeholder="Enter Dosage"
						maxLength={100}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="frequency">
					<Form.Label>
						<FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
						Frequency
					</Form.Label>
					<Form.Select
						value={frequency}
						onChange={(e) => setFrequency(e.target.value)}
						required
					>
						<option value="">Select Frequency</option>
						<option value="daily">Daily</option>
						<option value="weekly">Once a Week</option>
						<option value="fortnightly">Every Two Weeks</option>
						<option value="monthly">Once a Month</option>
					</Form.Select>
				</Form.Group>
				{isWeekly && (
					<Form.Group className="mb-3" controlId="daysOfWeek">
						<Form.Label>
							<FontAwesomeIcon icon={faCalendarDay} className="me-2" />
							Day(s) of the Week
						</Form.Label>
						<Form.Select
							multiple
							value={selectedDays}
							onChange={(e) =>
								setSelectedDays([...e.target.selectedOptions].map((o) => o.value))
							}
							required
						>
							{DAYS.map((day, i) => (
								<option key={day} value={String(i)}>
									{day}
								</option>
							))}
						</Form.Select>
						<Form.Text>Hold Ctrl / Cmd to select several days.</Form.Text>
					</Form.Group>
				)}
				<Form.Group className="mb-3" controlId="startTime">
					<Form.Label>Start Time</Form.Label>
					<Form.Control
						type="datetime-local"
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
						required
						min={now}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="endTime">
					<Form.Label>End Time</Form.Label>
					<Form.Control
						type="datetime-local"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
						required
						min={startTime || now}
					/>
				</Form.Group>
				<Button variant="primary" type="submit" disabled={saving}>
					<FontAwesomeIcon icon={faPlus} className="me-2" />
					{saving ? "Saving..." : "Add Reminder"}
				</Button>
			</Form>
			<MedicationReminder events={events} onDelete={handleDelete} />
		</Container>
	);
};

export default MedicationPage;
