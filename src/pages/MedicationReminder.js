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

// react-big-calendar draws events as plain divs Tab can't reach; a button's click bubbles to onSelectEvent.
const EventButton = ({ title }) => (
	<button
		type="button"
		className="btn btn-link p-0 border-0 w-100 text-start text-truncate text-reset text-decoration-none"
	>
		{title}
	</button>
);

const MedicationReminder = ({ events, onDelete }) => {
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState("");

	const closeModal = () => {
		setSelectedEvent(null);
		setError("");
	};

	const handleDelete = async (wholeSeries) => {
		setDeleting(true);
		setError("");
		try {
			await onDelete(selectedEvent, wholeSeries);
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
				components={{ event: EventButton }}
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
						<Button
							variant="outline-danger"
							onClick={() => handleDelete(false)}
							disabled={deleting}
						>
							<FontAwesomeIcon icon={faTrash} className="me-2" aria-hidden="true" />
							{deleting ? "Deleting..." : "Delete this reminder"}
						</Button>
						{/* Reminders saved before series existed have no seriesId. */}
						{selectedEvent?.seriesId && (
							<Button variant="danger" onClick={() => handleDelete(true)} disabled={deleting}>
								Delete whole series
							</Button>
						)}
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
