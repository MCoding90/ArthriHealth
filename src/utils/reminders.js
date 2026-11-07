export const MAX_REMINDERS = 500; // Firestore batch limit; also guards against huge date ranges

const ONE_HOUR_MS = 60 * 60 * 1000;

// Current local time in the format <input type="datetime-local"> expects.
export const toLocalDateTimeInput = (date = new Date()) => {
	const pad = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
		date.getHours()
	)}:${pad(date.getMinutes())}`;
};

const addMonthsClamped = (base, months) => {
	const target = new Date(base);
	target.setDate(1);
	target.setMonth(base.getMonth() + months);
	const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
	target.setDate(Math.min(base.getDate(), lastDay));
	return target;
};

/**
 * Returns the reminder dates between start and end (inclusive) for a frequency.
 * daysOfWeek (0 = Sunday) is used for weekly / fortnightly schedules.
 */
export const getReminderDates = ({ start, end, frequency, daysOfWeek = [] }) => {
	const startDate = new Date(start);
	const endDate = new Date(end);
	if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
		return [];
	}

	const dates = [];
	if (frequency === "daily") {
		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			dates.push(new Date(d));
		}
	} else if (frequency === "weekly" || frequency === "fortnightly") {
		const step = frequency === "fortnightly" ? 14 : 7;
		daysOfWeek.map(Number).forEach((day) => {
			const d = new Date(startDate);
			d.setDate(d.getDate() + ((day - d.getDay() + 7) % 7));
			for (; d <= endDate; d.setDate(d.getDate() + step)) {
				dates.push(new Date(d));
			}
		});
		dates.sort((a, b) => a - b);
	} else if (frequency === "monthly") {
		for (let i = 0, d = startDate; d <= endDate; i += 1, d = addMonthsClamped(startDate, i)) {
			dates.push(d);
		}
	}
	return dates;
};

export const buildReminders = ({ name, dosage, frequency, dates }) =>
	dates.map((date) => ({
		start: date,
		end: new Date(date.getTime() + ONE_HOUR_MS),
		title: name,
		dosage,
		frequency,
		dayOfWeek: date.toLocaleString("default", { weekday: "long" }),
	}));
