import React, { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Modal, Alert, Badge, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPills,
	faClock,
	faExclamationTriangle,
	faCalendarAlt,
	faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase-Config";

const localizer = momentLocalizer(moment);

const MedicationReminder = ({ events }) => {
	const [showModal, setShowModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	// Track calendar view + range
	const [view, setView] = useState("month");
	const [currentRange, setCurrentRange] = useState({
		start: moment().startOf("month"),
		end: moment().endOf("month"),
	});

	const now = moment();

	// -----------------------------
	// Custom Event Renderer
	// -----------------------------
	const MedicationEvent = ({ event }) => {
		const status = event.taken
			? "taken"
			: event.skipped
				? "skipped"
				: moment(event.start).isBefore(moment())
					? "missed"
					: "scheduled";

		const statusColors = {
			taken: "#198754",
			skipped: "#dc3545",
			missed: "#dc3545",
			scheduled: "#0d6efd",
		};

		const dotColor = statusColors[status];

		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "6px",
					padding: "2px 6px",
					borderRadius: "6px",
					background: "rgba(255,255,255,0.15)",
					backdropFilter: "blur(4px)",
					fontSize: "0.75rem",
					fontWeight: 500,
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
				}}
			>
				<span
					style={{
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						backgroundColor: dotColor,
						flexShrink: 0,
					}}
				/>
				<span
					style={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }}
				>
					{event.title}
				</span>
				{event.taken && <span style={{ color: "#198754" }}>✓</span>}
				{event.skipped && <span style={{ color: "#dc3545" }}>✕</span>}
			</div>
		);
	};

	// -----------------------------
	// Next Dose
	// -----------------------------
	const nextDose = useMemo(() => {
		return (
			events
				.filter((e) => e.taken === null && moment(e.start).isAfter(now))
				.sort((a, b) => moment(a.start) - moment(b.start))[0] || null
		);
	}, [events, now]);

	// -----------------------------
	// Overdue
	// -----------------------------
	const overdue = useMemo(() => {
		return events.filter(
			(e) => e.taken === null && !e.skipped && moment(e.start).isBefore(now),
		);
	}, [events, now]);

	// -----------------------------
	// Dynamic Summary Logic
	// -----------------------------
	const summary = useMemo(() => {
		let filtered = [];

		if (view === "month") {
			filtered = events.filter((e) =>
				moment(e.start).isBetween(
					currentRange.start.startOf("month"),
					currentRange.end.endOf("month"),
					null,
					"[]",
				),
			);
		}

		if (view === "week" || view === "agenda") {
			filtered = events.filter((e) =>
				moment(e.start).isBetween(
					currentRange.start.startOf("week"),
					currentRange.end.endOf("week"),
					null,
					"[]",
				),
			);
		}

		if (view === "day") {
			filtered = events.filter((e) =>
				moment(e.start).isSame(currentRange.start, "day"),
			);
		}

		const taken = filtered.filter((e) => e.taken === true).length;

		const missed = filtered.filter(
			(e) =>
				moment(e.start).isBefore(now) &&
				e.taken === null &&
				e.skipped === false,
		).length;

		const skipped = filtered.filter((e) => e.skipped === true).length;

		const total = filtered.length;

		const adherence = total > 0 ? Math.round((taken / total) * 100) : 0;

		const byMedication = filtered.reduce((acc, e) => {
			acc[e.title] = (acc[e.title] || 0) + 1;
			return acc;
		}, {});

		return { total, taken, missed, skipped, adherence, byMedication };
	}, [events, view, currentRange, now]);

	// -----------------------------
	// Event Styling
	// -----------------------------
	const eventStyleGetter = () => ({
		style: {
			backgroundColor: "transparent",
			border: "none",
			padding: 0,
		},
	});

	// -----------------------------
	// Modal Handlers
	// -----------------------------
	const handleEventClick = (event) => {
		setSelectedEvent(event);
		setShowModal(true);
	};

	const closeModal = () => {
		setSelectedEvent(null);
		setShowModal(false);
	};

	const handleMarkTaken = async (event) => {
		await updateDoc(doc(db, "medications", event.id), {
			taken: true,
			skipped: false,
			takenAt: serverTimestamp(),
		});
		closeModal();
	};

	const handleSkipDose = async (event) => {
		await updateDoc(doc(db, "medications", event.id), {
			taken: false,
			skipped: true,
			takenAt: null,
		});
		closeModal();
	};

	// -----------------------------
	// Summary Title
	// -----------------------------
	const summaryTitle =
		view === "month"
			? `${currentRange.start.format("MMMM YYYY")} Summary`
			: view === "week" || view === "agenda"
				? `Week of ${currentRange.start.format("DD MMM")} – ${currentRange.end.format("DD MMM")}`
				: `Day: ${currentRange.start.format("DD MMM YYYY")}`;

	// -----------------------------
	// No Events
	// -----------------------------
	if (!events.length) {
		return <Alert variant="info">No medication reminders to display.</Alert>;
	}

	return (
		<div>
			<h2 className="mb-3">
				<FontAwesomeIcon icon={faLayerGroup} className="me-2" />
				Medication Overview
			</h2>

			{/* Next Dose */}
			{nextDose && (
				<Alert variant="success">
					<FontAwesomeIcon icon={faClock} className="me-2" />
					<strong>Next dose:</strong> {nextDose.title} at{" "}
					{moment(nextDose.start).format("HH:mm, DD MMM")}
				</Alert>
			)}

			{/* Overdue */}
			{overdue.length > 0 && (
				<Alert variant="danger">
					<FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
					<strong>Overdue:</strong> {overdue.length} reminder(s) missed
				</Alert>
			)}

			{/* Dynamic Summary */}
			<Alert variant="secondary">
				<FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
				<strong>{summaryTitle}</strong>

				<div className="mt-2">
					<span className="me-3">
						Taken: <Badge bg="success">{summary.taken}</Badge>
					</span>
					<span className="me-3">
						Missed: <Badge bg="danger">{summary.missed}</Badge>
					</span>
					<span className="me-3">
						Skipped: <Badge bg="warning">{summary.skipped}</Badge>
					</span>
					<span>
						Adherence: <Badge bg="primary">{summary.adherence}%</Badge>
					</span>
				</div>

				<ul className="mt-2 mb-0">
					{Object.entries(summary.byMedication).map(([name, count]) => (
						<li key={name}>
							{name}: <Badge bg="dark">{count}</Badge>
						</li>
					))}
				</ul>
			</Alert>

			{/* Calendar */}
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 500 }}
				onSelectEvent={handleEventClick}
				eventPropGetter={eventStyleGetter}
				components={{
					event: MedicationEvent,
				}}
				onView={(v) => setView(v)}
				onRangeChange={(range) => {
					const start = moment(range.start || range[0]);
					const end = moment(range.end || range[range.length - 1]);
					setCurrentRange({ start, end });
				}}
			/>

			{/* Modal */}
			<Modal show={showModal} onHide={closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>
						<FontAwesomeIcon icon={faPills} className="me-2" />
						{selectedEvent?.title}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						<strong>Dosage:</strong> {selectedEvent?.dosage}
					</p>
					<p>
						<strong>Frequency:</strong> {selectedEvent?.frequency}
					</p>
					{selectedEvent?.dayOfWeek && (
						<p>
							<strong>Day:</strong> {selectedEvent.dayOfWeek}
						</p>
					)}
					<p>
						<strong>Time:</strong>{" "}
						{selectedEvent &&
							moment(selectedEvent.start).format("HH:mm, DD MMM")}
					</p>

					{selectedEvent?.taken && (
						<p>
							<strong>Status:</strong> <Badge bg="success">Taken</Badge>
						</p>
					)}
					{selectedEvent?.skipped && (
						<p>
							<strong>Status:</strong> <Badge bg="danger">Skipped</Badge>
						</p>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="success"
						onClick={() => handleMarkTaken(selectedEvent)}
					>
						Mark as Taken
					</Button>
					<Button
						variant="outline-danger"
						onClick={() => handleSkipDose(selectedEvent)}
					>
						Skip Dose
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

MedicationReminder.propTypes = {
	events: PropTypes.array.isRequired,
};

export default MedicationReminder;
