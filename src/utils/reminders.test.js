import { getReminderDates, buildReminders, toLocalDateTimeInput } from "./reminders";

const fmt = (dates) => dates.map((d) => toLocalDateTimeInput(d));

describe("getReminderDates", () => {
	it("creates one reminder per day for daily schedules (inclusive)", () => {
		const dates = getReminderDates({
			start: "2025-01-01T09:00",
			end: "2025-01-03T09:00",
			frequency: "daily",
		});
		expect(fmt(dates)).toEqual(["2025-01-01T09:00", "2025-01-02T09:00", "2025-01-03T09:00"]);
	});

	it("uses the selected weekdays for weekly schedules, sorted", () => {
		// 2025-01-01 is a Wednesday
		const dates = getReminderDates({
			start: "2025-01-01T08:00",
			end: "2025-01-14T08:00",
			frequency: "weekly",
			daysOfWeek: ["5", "1"], // Friday, Monday
		});
		expect(fmt(dates)).toEqual([
			"2025-01-03T08:00",
			"2025-01-06T08:00",
			"2025-01-10T08:00",
			"2025-01-13T08:00",
		]);
	});

	it("steps 14 days for fortnightly schedules", () => {
		const dates = getReminderDates({
			start: "2025-01-01T08:00",
			end: "2025-01-31T08:00",
			frequency: "fortnightly",
			daysOfWeek: ["3"], // Wednesday
		});
		expect(fmt(dates)).toEqual(["2025-01-01T08:00", "2025-01-15T08:00", "2025-01-29T08:00"]);
	});

	it("clamps monthly reminders to the last day of shorter months", () => {
		const dates = getReminderDates({
			start: "2025-01-31T10:00",
			end: "2025-04-30T10:00",
			frequency: "monthly",
		});
		expect(fmt(dates)).toEqual([
			"2025-01-31T10:00",
			"2025-02-28T10:00",
			"2025-03-31T10:00",
			"2025-04-30T10:00",
		]);
	});

	it("returns nothing for an invalid or reversed range", () => {
		expect(getReminderDates({ start: "2025-02-01T00:00", end: "2025-01-01T00:00", frequency: "daily" })).toEqual([]);
		expect(getReminderDates({ start: "", end: "", frequency: "daily" })).toEqual([]);
	});
});

describe("buildReminders", () => {
	it("maps dates to one-hour reminder events", () => {
		const [reminder] = buildReminders({
			name: "Methotrexate",
			dosage: "10mg",
			frequency: "weekly",
			dates: [new Date(2025, 0, 6, 9, 0)],
		});
		expect(reminder).toMatchObject({ title: "Methotrexate", dosage: "10mg", frequency: "weekly" });
		expect(reminder.end - reminder.start).toBe(60 * 60 * 1000);
		expect(reminder.dayOfWeek).toBe(new Date(2025, 0, 6).toLocaleString("default", { weekday: "long" }));
	});
});
