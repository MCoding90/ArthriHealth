import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { collection, doc, onSnapshot, query, writeBatch } from "firebase/firestore";
import MedicationPage from "./pages/Medicationpage";

const mockBatch = { set: jest.fn(), commit: jest.fn() };

jest.mock("./firebase", () => ({ db: {} }));
jest.mock("./context/AuthContext", () => ({
	useAuth: () => ({ currentUser: { uid: "user-1", emailVerified: true } }),
}));
jest.mock("./pages/MedicationReminder", () => ({ events }) => (
	<div>{events.length} reminders</div>
));
jest.mock("firebase/firestore", () => ({
	collection: jest.fn(),
	doc: jest.fn(),
	query: jest.fn(),
	orderBy: jest.fn(),
	onSnapshot: jest.fn(),
	writeBatch: jest.fn(),
	deleteDoc: jest.fn(),
}));

const fillBase = (frequency, end) => {
	userEvent.type(screen.getByPlaceholderText("Enter Medication Name"), "Methotrexate");
	userEvent.type(screen.getByPlaceholderText("Enter Dosage"), "10mg");
	userEvent.selectOptions(screen.getByLabelText(/Frequency/), frequency);
	// userEvent can't type into datetime-local inputs in jsdom
	fireEvent.change(screen.getByLabelText("Start Time"), {
		target: { value: "2030-01-01T09:00" },
	});
	fireEvent.change(screen.getByLabelText("End Time"), { target: { value: end } });
};

// CRA resets mock implementations before each test, so (re)define them here.
beforeEach(() => {
	collection.mockReturnValue("meds-ref");
	doc.mockReturnValue("new-doc");
	query.mockImplementation((ref) => ref);
	onSnapshot.mockReturnValue(() => {});
	writeBatch.mockReturnValue(mockBatch);
	mockBatch.commit.mockResolvedValue();
	render(<MedicationPage />);
});

it("renders the form", () => {
	expect(screen.getByText("Medication Reminder")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Enter Medication Name")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Enter Dosage")).toBeInTheDocument();
});

it("saves daily reminders in a single batch", async () => {
	fillBase("daily", "2030-01-03T09:00");
	userEvent.click(screen.getByRole("button", { name: /Add Reminder/ }));

	expect(await screen.findByText("3 reminders added successfully!")).toBeInTheDocument();
	expect(writeBatch).toHaveBeenCalledTimes(1);
	expect(mockBatch.set).toHaveBeenCalledTimes(3);
	expect(mockBatch.commit).toHaveBeenCalledTimes(1);
});

it("rejects schedules that would create too many reminders", async () => {
	fillBase("daily", "2032-01-01T09:00");
	userEvent.click(screen.getByRole("button", { name: /Add Reminder/ }));
	expect(await screen.findByText(/max 500/)).toBeInTheDocument();
	expect(mockBatch.commit).not.toHaveBeenCalled();
});

it("shows an error when saving fails", async () => {
	mockBatch.commit.mockRejectedValueOnce(new Error("permission-denied"));
	fillBase("daily", "2030-01-02T09:00");
	userEvent.click(screen.getByRole("button", { name: /Add Reminder/ }));
	expect(
		await screen.findByText("Could not save the reminder. Please try again.")
	).toBeInTheDocument();
});
