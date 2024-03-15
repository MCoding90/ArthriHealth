import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const MedicationReminder = ({ events }) => {
	return (
		<div>
			<h2>Medication Reminder</h2>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 500 }}
			/>
		</div>
	);
};

export default MedicationReminder;
