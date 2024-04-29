import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MedicationPage from "./pages/Medicationpage";
import "@testing-library/jest-dom";

describe("MedicationPage", () => {
	beforeEach(() => {
		jest.useFakeTimers(); // Use fake timers
		render(<MedicationPage />);
	});

	afterEach(() => {
		jest.runOnlyPendingTimers(); // Clear any timers after each test
		jest.useRealTimers(); // Switch back to real timers
	});

	it("renders correctly", () => {
		expect(screen.getByText("Medication Reminder")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Enter Medication Name")
		).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter Dosage")).toBeInTheDocument();
	});

	it("updates medication name input field and state", () => {
		const medicationNameInput = screen.getByPlaceholderText(
			"Enter Medication Name"
		);
		fireEvent.change(medicationNameInput, { target: { value: "Aspirin" } });
		expect(medicationNameInput.value).toBe("Aspirin");
	});

	it("updates dosage input field and state", () => {
		const dosageInput = screen.getByPlaceholderText("Enter Dosage");
		fireEvent.change(dosageInput, { target: { value: "100mg" } });
		expect(dosageInput.value).toBe("100mg");
	});
});
