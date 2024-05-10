import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Modal, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import {
	faPrescriptionBottleMedical,
	faPills,
	faCalendarAlt,
	faRepeat,
} from "@fortawesome/free-solid-svg-icons";

const MedicationReminder = ({ events }) => {
	const [showModal, setShowModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const localizer = momentLocalizer(moment);

	const handleEventClick = (event) => {
		setSelectedEvent(event);
		setShowModal(true);
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
				onSelectEvent={handleEventClick}
			/>
			<Modal show={showModal} onHide={() => setShowModal(false)}>
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
					<p>
						<FontAwesomeIcon
							icon={faPills}
							className="me-2"
							aria-hidden="true"
						/>
						Dosage: {selectedEvent?.dosage}
					</p>
					<p>
						<FontAwesomeIcon
							icon={faRepeat}
							className="me-2"
							aria-hidden="true"
						/>
						Frequency: {selectedEvent?.frequency}
					</p>
					<p>
						<FontAwesomeIcon
							icon={faCalendarAlt}
							className="me-2"
							aria-hidden="true"
						/>
						Day of the Week: {selectedEvent?.dayOfWeek}
					</p>
				</Modal.Body>
			</Modal>
		</div>
	);
};

MedicationReminder.propTypes = {
	events: PropTypes.array.isRequired,
};

export default MedicationReminder;
