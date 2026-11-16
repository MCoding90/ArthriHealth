import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	updateDoc,
} from "firebase/firestore";
import SymptomTracker from "./pages/SymptomTracker";

jest.mock("./firebase", () => ({ db: {} }));
jest.mock("./context/AuthContext", () => ({
	useAuth: () => ({ currentUser: { uid: "user-1", emailVerified: true } }),
}));
jest.mock("./components/SymptomsChart", () => ({ symptoms }) => (
	<div>Chart with {symptoms.length} entries</div>
));
jest.mock("firebase/firestore", () => ({
	collection: jest.fn(),
	doc: jest.fn(),
	query: jest.fn(),
	orderBy: jest.fn(),
	addDoc: jest.fn(),
	updateDoc: jest.fn(),
	deleteDoc: jest.fn(),
	onSnapshot: jest.fn(),
}));

const emit = (records) => {
	const onNext = onSnapshot.mock.calls.at(-1)[1];
	act(() => {
		onNext({ docs: records.map(({ id, ...data }) => ({ id, data: () => data })) });
	});
};

// CRA resets mock implementations before each test, so (re)define them here.
beforeEach(() => {
	collection.mockReturnValue("symptoms-ref");
	doc.mockImplementation((...path) => path.slice(1).join("/"));
	query.mockImplementation((ref) => ref);
	addDoc.mockResolvedValue();
	updateDoc.mockResolvedValue();
	deleteDoc.mockResolvedValue();
	onSnapshot.mockReturnValue(() => {});
	window.confirm = jest.fn(() => true);
});

it("validates required fields", async () => {
	render(<SymptomTracker />);
	userEvent.click(screen.getByLabelText("Submit symptom"));
	expect(await screen.findByText("Please enter a symptom and a date.")).toBeInTheDocument();
	expect(addDoc).not.toHaveBeenCalled();
});

it("rejects out-of-range severity", async () => {
	render(<SymptomTracker />);
	userEvent.type(screen.getByLabelText("Symptom input"), "Stiffness");
	userEvent.type(screen.getByLabelText("Date input"), "2025-01-01");
	userEvent.type(screen.getByLabelText("Severity input"), "11");
	userEvent.click(screen.getByLabelText("Submit symptom"));
	expect(
		await screen.findByText("Severity must be a whole number from 1 to 10.")
	).toBeInTheDocument();
});

it("adds a symptom with a numeric severity and clears the form", async () => {
	render(<SymptomTracker />);
	userEvent.type(screen.getByLabelText("Symptom input"), "Stiffness");
	userEvent.type(screen.getByLabelText("Date input"), "2025-01-01");
	userEvent.type(screen.getByLabelText("Severity input"), "6");
	userEvent.click(screen.getByLabelText("Submit symptom"));

	expect(await screen.findByText("Symptom added successfully!")).toBeInTheDocument();
	expect(addDoc).toHaveBeenCalledWith("symptoms-ref", {
		symptom: "Stiffness",
		date: "2025-01-01",
		severity: 6,
		notes: "",
		user: "user-1",
	});
	expect(screen.getByLabelText("Symptom input")).toHaveValue("");
});

it("shows an error when saving fails", async () => {
	addDoc.mockRejectedValueOnce(new Error("permission-denied"));
	render(<SymptomTracker />);
	userEvent.type(screen.getByLabelText("Symptom input"), "Stiffness");
	userEvent.type(screen.getByLabelText("Date input"), "2025-01-01");
	userEvent.click(screen.getByLabelText("Submit symptom"));
	expect(
		await screen.findByText("Could not save the symptom. Please try again.")
	).toBeInTheDocument();
});

it("updates only editable fields when editing", async () => {
	render(<SymptomTracker />);
	emit([{ id: "s1", symptom: "Pain", date: "2025-01-02", severity: 4, notes: "", user: "user-1" }]);

	userEvent.click(screen.getByLabelText("Edit symptom recorded on 2025-01-02"));
	userEvent.clear(screen.getByLabelText("Severity input"));
	userEvent.type(screen.getByLabelText("Severity input"), "7");
	userEvent.click(screen.getByText("Update Symptom"));

	await waitFor(() =>
		expect(updateDoc).toHaveBeenCalledWith("Users/user-1/symptoms/s1", {
			symptom: "Pain",
			date: "2025-01-02",
			severity: 7,
			notes: "",
		})
	);
});

it("filters the list while keeping edit/delete actions", async () => {
	render(<SymptomTracker />);
	emit([
		{ id: "s1", symptom: "Pain", date: "2025-01-02", severity: 4 },
		{ id: "s2", symptom: "Swelling", date: "2025-01-03", severity: 2 },
	]);
	userEvent.type(screen.getByLabelText("Search symptoms"), "swell");
	await waitFor(() => expect(screen.queryByText(/Pain - 2025-01-02/)).not.toBeInTheDocument());
	expect(screen.getByText(/Swelling - 2025-01-03/)).toBeInTheDocument();
	expect(screen.getByLabelText("Delete symptom recorded on 2025-01-03")).toBeInTheDocument();
});

it("deletes after confirmation", async () => {
	render(<SymptomTracker />);
	emit([{ id: "s1", symptom: "Pain", date: "2025-01-02", severity: 4 }]);
	userEvent.click(screen.getByLabelText("Delete symptom recorded on 2025-01-02"));
	await waitFor(() => expect(deleteDoc).toHaveBeenCalledWith("Users/user-1/symptoms/s1"));
});
