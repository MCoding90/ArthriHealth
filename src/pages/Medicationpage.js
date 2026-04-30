import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
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
	getFirestore,
	collection,
	addDoc,
	query,
	where,
	orderBy,
	onSnapshot,
	Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const toDateSafe = (ts) => {
	if (!ts) return null;
	if (ts.toDate) return ts.toDate();
	return new Date(ts);
};

const MedicationPage = () => {
	const { currentUser } = useAuth();
	const db = getFirestore();

	const today = new Date().toISOString().slice(0, 16);

	const [medicationName, setMedicationName] = useState("");
	const [dosageNumber, setDosage] = useState("");
	const [frequencyNumber, setFrequency] = useState("");
	const [selectedDays, setSelectedDays] = useState([]);
	const [startTime, setStartTime] = useState(today);
	const [endTime, setEndTime] = useState("");
	const [events, setEvents] = useState([]);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	// -----------------------------
	// LISTENER (Firestore)
	// -----------------------------
	useEffect(() => {
		if (!currentUser) return;

		const medsRef = collection(db, "medications");
		const q = query(
			medsRef,
			where("userId", "==", currentUser.uid),
			orderBy("start", "asc"),
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const fetchedEvents = querySnapshot.docs.map((docSnap) => {
				const data = docSnap.data();

				return {
					id: docSnap.id,
					title: data.title || data.name || "Medication",
					dosage: data.dosage || data.dose || "",
					frequency: data.frequency || "",
					dayOfWeek: data.dayOfWeek || "",
					start: toDateSafe(data.start),
					end: toDateSafe(data.end),
				};
			});

			// Only keep valid events (React-Big-Calendar requires real Dates)
			setEvents(fetchedEvents.filter((e) => e.start && e.end));
		});

		return () => unsubscribe();
	}, [currentUser, db]);

	// -----------------------------
	// REMINDER GENERATION
	// -----------------------------
	const calculateNextReminders = (start, frequency, end) => {
		const reminders = [];
		let currentDate = new Date(start);
		const endDate = new Date(end);

		while (currentDate <= endDate) {
			if (frequency === "daily") {
				reminders.push(new Date(currentDate));
			} else if (["weekly", "fortnightly"].includes(frequency)) {
				const increment = frequency === "fortnightly" ? 14 : 7;

				selectedDays.forEach((day) => {
					const dayNum = parseInt(day, 10);
					let nextDate = new Date(currentDate);
					nextDate.setDate(
						nextDate.getDate() + ((dayNum - nextDate.getDay() + 7) % 7),
					);

					while (nextDate <= endDate) {
						reminders.push(new Date(nextDate));
						nextDate.setDate(nextDate.getDate() + increment);
					}
				});

				break;
			} else if (frequency === "monthly") {
				while (currentDate <= endDate) {
					reminders.push(new Date(currentDate));
					currentDate.setMonth(currentDate.getMonth() + 1);
				}
				break;
			}

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return reminders.map((date) => ({
			start: Timestamp.fromDate(date),
			end: Timestamp.fromDate(new Date(date.getTime() + 3600000)),
			title: medicationName,
			dosage: dosageNumber,
			frequency: frequencyNumber,
			dayOfWeek: date.toLocaleString("default", { weekday: "long" }),
		}));
	};

	// -----------------------------
	// SUBMIT HANDLER
	// -----------------------------
	const handleSubmit = async (e) => {
		e.preventDefault();

		const newReminders = calculateNextReminders(
			startTime,
			frequencyNumber,
			endTime,
		);

		try {
			await Promise.all(
				newReminders.map((reminder) =>
					addDoc(collection(db, "medications"), {
						userId: currentUser.uid,
						...reminder,
					}),
				),
			);

			setShowSuccessModal(true);
			setTimeout(() => setShowSuccessModal(false), 3000);
			resetForm();
		} catch (error) {
			console.error("Error adding medication reminder:", error);
		}
	};

	const resetForm = () => {
		setMedicationName("");
		setDosage("");
		setFrequency("");
		setSelectedDays([]);
		setStartTime(today);
		setEndTime("");
	};

	return (
		<Container>
			<h1 className="mt-3">
				<FontAwesomeIcon icon={faCapsules} className="me-2" />
				Medication Reminder
			</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>
						<FontAwesomeIcon icon={faPills} className="me-2" />
						Medication Name
					</Form.Label>
					<Form.Control
						type="text"
						value={medicationName}
						onChange={(e) => setMedicationName(e.target.value)}
						placeholder="Enter Medication Name"
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>
						<FontAwesomeIcon icon={faSyringe} className="me-2" />
						Dosage
					</Form.Label>
					<Form.Control
						type="text"
						value={dosageNumber}
						onChange={(e) => setDosage(e.target.value)}
						placeholder="Enter Dosage"
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>
						<FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
						Frequency
					</Form.Label>
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
						<Form.Label>
							<FontAwesomeIcon icon={faCalendarDay} className="me-2" />
							Day(s) of the Week
						</Form.Label>
						<Form.Control
							as="select"
							multiple
							value={selectedDays}
							onChange={(e) =>
								setSelectedDays(
									[...e.target.selectedOptions].map((option) => option.value),
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
						min={today}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>End Time</Form.Label>
					<Form.Control
						type="datetime-local"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
						required
						min={startTime || today}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					<FontAwesomeIcon icon={faPlus} className="me-2" />
					Add Reminder
				</Button>
			</Form>

			<MedicationReminder events={events} />

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
