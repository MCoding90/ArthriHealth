import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { useState } from "react";

const MedicationReminder = ({ events }) => {
	const [showModal, setShowModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const localizer = momentLocalizer(moment);

	const handleEventClick = (event) => {
		setSelectedEvent(event);
		setShowModal(true);
	};

	return (
		<div>
			<h2>Track your medication intake</h2>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 500 }}
				onSelectEvent={handleEventClick}
			/>
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>{selectedEvent?.title}</Modal.Title>{" "}
					{/* Medication Name */}
				</Modal.Header>
				<Modal.Body>
					<p>Dosage: {selectedEvent?.dosage}</p> {/* Dosage */}
					<p>Frequency: {selectedEvent?.frequency}</p> {/* Frequency */}
					<p>Day of the Week: {selectedEvent?.dayOfWeek}</p>{" "}
					{/* Day of the Week */}
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default MedicationReminder;
