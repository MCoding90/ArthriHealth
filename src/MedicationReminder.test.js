import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MedicationReminder from "./pages/MedicationReminder";

it("opens a reminder with the keyboard", async () => {
	const start = new Date(); // current month, so the default month view shows it
	const event = {
		id: "r1",
		title: "Methotrexate",
		dosage: "10mg",
		frequency: "weekly",
		dayOfWeek: "Monday",
		start,
		end: new Date(start.getTime() + 60 * 60 * 1000),
	};
	render(<MedicationReminder events={[event]} onDelete={jest.fn()} />);

	const button = screen.getByRole("button", { name: "Methotrexate" });
	button.focus();
	expect(button).toHaveFocus();
	userEvent.keyboard("{Enter}");

	expect(await screen.findByText("Dosage: 10mg")).toBeInTheDocument();
});
