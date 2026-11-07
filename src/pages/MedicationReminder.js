import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Modal, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import {
	faPrescriptionBottleMedical,
	faPills,
	faCalendarAlt,
	faRepeat,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";

const localizer = momentLocalizer(moment);

const MedicationReminder = ({ events, onDelete }) => {
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState("");

	const closeModal = () => {
		setSelectedEvent(null);
		setError("");
	};

	const handleDelete = async () => {
		setDeleting(true);
		setError("");
		try {
			await onDelete(selectedEvent);
			closeModal();
		} catch {
			setError("Could not delete this reminder. Please try again.");
		} finally {
			setDeleting(false);
		}
	};

	if (!events.length) {
		return <Alert variant="info">No medication reminders to display.</Alert>;
	}

	return (
		<div>
			<h2>Track your medication intake</h2>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 500 }}
				onSelectEvent={setSelectedEvent}
			/>
			<Modal show={!!selectedEvent} onHide={closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>
						<FontAwesomeIcon
							icon={faPrescriptionBottleMedical}
							className="me-2"
							aria-hidden="true"
						/>
						{selectedEvent?.title}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <Alert variant="danger">{error}</Alert>}
					<p>
						<FontAwesomeIcon icon={faPills} className="me-2" aria-hidden="true" />
						Dosage: {selectedEvent?.dosage}
					</p>
					<p>
						<FontAwesomeIcon icon={faRepeat} className="me-2" aria-hidden="true" />
						Frequency: {selectedEvent?.frequency}
					</p>
					<p>
						<FontAwesomeIcon icon={faCalendarAlt} className="me-2" aria-hidden="true" />
						Day of the Week: {selectedEvent?.dayOfWeek}
					</p>
				</Modal.Body>
				{onDelete && (
					<Modal.Footer>
						<Button variant="outline-danger" onClick={handleDelete} disabled={deleting}>
							<FontAwesomeIcon icon={faTrash} className="me-2" aria-hidden="true" />
							{deleting ? "Deleting..." : "Delete this reminder"}
						</Button>
					</Modal.Footer>
				)}
			</Modal>
		</div>
	);
};

MedicationReminder.propTypes = {
	events: PropTypes.array.isRequired,
	onDelete: PropTypes.func,
};

export default MedicationReminder;
