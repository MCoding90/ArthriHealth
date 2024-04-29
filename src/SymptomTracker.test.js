import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SymptomTracker from "./pages/SymptomTracker";
import SymptomsChart from "./components/SymptomsChart";

jest.mock("./components/SymptomsChart", () => ({
	__esModule: true,
	default: ({ symptoms }) => (
		<div>Mocked Chart with {symptoms.length} entries</div>
	),
}));

describe("SymptomTracker Component", () => {
	it("renders correctly", () => {
		render(<SymptomTracker />);
		expect(screen.getByText("Symptom Tracker")).toBeInTheDocument();
		expect(screen.getByLabelText("Symptom input")).toBeInTheDocument();
		expect(screen.getByLabelText("Date input")).toBeInTheDocument();
		expect(screen.getByLabelText("Severity input")).toBeInTheDocument();
		expect(screen.getByLabelText("Notes input")).toBeInTheDocument();
		expect(screen.getByLabelText("Submit symptom")).toBeInTheDocument();
		expect(screen.getByLabelText("Search symptoms")).toBeInTheDocument();
	});
});

it("handles input changes correctly", () => {
	render(<SymptomTracker />);
	const symptomInput = screen.getByLabelText("Symptom input");
	userEvent.type(symptomInput, "Headache");
	expect(symptomInput.value).toBe("Headache");
});

it("displays an error when required fields are missing upon submission", async () => {
	render(<SymptomTracker />);
	userEvent.click(screen.getByText("Add Symptom"));
	const alertMessage = await screen.findByText("Please fill in all fields.");
	expect(alertMessage).toBeInTheDocument();
});

it("submits form with valid input and clears inputs afterwards", async () => {
	render(<SymptomTracker />);
	userEvent.type(screen.getByLabelText("Symptom input"), "Headache");
	userEvent.type(screen.getByLabelText("Date input"), "2022-01-01");
	userEvent.click(screen.getByText("Add Symptom"));

	await waitFor(() => {
		expect(screen.getByText("Symptom added successfully!")).toBeInTheDocument();
	});
	expect(screen.getByLabelText("Symptom input").value).toBe("");
});

it("filters symptoms based on search input", async () => {
	render(<SymptomTracker />);
	userEvent.type(screen.getByLabelText("Symptom input"), "Headache");
	userEvent.type(screen.getByLabelText("Date input"), "2022-01-01");
	userEvent.click(screen.getByText("Add Symptom"));
	userEvent.type(screen.getByLabelText("Search symptoms"), "Headache");

	// Using findByText with await to handle asynchronous updates
	const filteredText = await screen.findByText(/Headache - 2022-01-01/);
	expect(filteredText).toBeInTheDocument();
});

it("deletes a symptom from the list", async () => {
	render(<SymptomTracker />);
	// Add a symptom and delete it
	userEvent.type(screen.getByLabelText("Symptom input"), "Headache");
	userEvent.type(screen.getByLabelText("Date input"), "2022-01-01");
	userEvent.click(screen.getByText("Add Symptom"));

	await waitFor(() => {
		userEvent.click(
			screen.getByLabelText("Delete symptom recorded on 2022-01-01")
		);
	});

	expect(screen.queryByText("Headache - 2022-01-01")).not.toBeInTheDocument();
});

it("clears success message after 3 seconds", async () => {
	jest.useFakeTimers();
	render(<SymptomTracker />);
	userEvent.type(screen.getByLabelText("Symptom input"), "Headache");
	userEvent.type(screen.getByLabelText("Date input"), "2022-01-01");
	userEvent.click(screen.getByText("Add Symptom"));

	expect(
		await screen.findByText("Symptom added successfully!")
	).toBeInTheDocument();
	jest.advanceTimersByTime(3000);

	await waitFor(() => {
		expect(
			screen.queryByText("Symptom added successfully!")
		).not.toBeInTheDocument();
	});

	jest.useRealTimers();
});

it("renders mocked SymptomsChart", () => {
	render(
		<SymptomsChart
			symptoms={[{ symptom: "Headache", date: "2022-01-01", severity: "5" }]}
		/>
	);
	expect(screen.getByText(/Mocked Chart with 1 entries/)).toBeInTheDocument();
});
