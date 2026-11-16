import React, { useState, useEffect, useMemo, useDeferredValue } from "react";
import { Form, Card, Button, Alert, ListGroup } from "react-bootstrap";
import SymptomsChart from "../components/SymptomsChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faPlusCircle,
	faCalendarDay,
	faNotesMedical,
	faTachometerAlt,
	faEdit,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
	doc,
	collection,
	addDoc,
	query,
	orderBy,
	updateDoc,
	deleteDoc,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = { symptom: "", date: "", severity: "", notes: "" };

const SymptomTracker = () => {
	const { currentUser } = useAuth();
	const [symptoms, setSymptoms] = useState([]);
	const [formInput, setFormInput] = useState(EMPTY_FORM);
	const [currentId, setCurrentId] = useState(null); // non-null while editing
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const deferredSearch = useDeferredValue(searchInput);
	const editing = currentId !== null;

	useEffect(() => {
		const symptomsRef = collection(db, "Users", currentUser.uid, "symptoms");
		const q = query(symptomsRef, orderBy("date", "asc"));
		return onSnapshot(
			q,
			(snapshot) => {
				setSymptoms(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
			},
			() => setErrorMessage("Could not load your symptoms. Please refresh the page.")
		);
	}, [currentUser.uid]);

	useEffect(() => {
		if (!successMessage) return;
		const timer = setTimeout(() => setSuccessMessage(""), 3000);
		return () => clearTimeout(timer);
	}, [successMessage]);

	const filteredSymptoms = useMemo(() => {
		const term = deferredSearch.trim().toLowerCase();
		if (!term) return symptoms;
		return symptoms.filter((s) => (s.symptom || "").toLowerCase().includes(term));
	}, [symptoms, deferredSearch]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormInput((prev) => ({ ...prev, [name]: value }));
	};

	const resetForm = () => {
		setFormInput(EMPTY_FORM);
		setCurrentId(null);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const symptom = formInput.symptom.trim();
		if (!symptom || !formInput.date) {
			setErrorMessage("Please enter a symptom and a date.");
			return;
		}
		const severity = formInput.severity === "" ? null : Number(formInput.severity);
		if (severity !== null && !(Number.isInteger(severity) && severity >= 1 && severity <= 10)) {
			setErrorMessage("Severity must be a whole number from 1 to 10.");
			return;
		}

		// Only persist known fields (never id/user from the edited record).
		const payload = {
			symptom,
			date: formInput.date,
			severity,
			notes: formInput.notes.trim(),
		};

		setSubmitting(true);
		setErrorMessage("");
		try {
			if (editing) {
				await updateDoc(doc(db, "Users", currentUser.uid, "symptoms", currentId), payload);
				setSuccessMessage("Symptom updated successfully!");
			} else {
				await addDoc(collection(db, "Users", currentUser.uid, "symptoms"), {
					...payload,
					user: currentUser.uid,
				});
				setSuccessMessage("Symptom added successfully!");
			}
			resetForm();
			setSearchInput("");
		} catch {
			setErrorMessage("Could not save the symptom. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleEdit = (record) => {
		setFormInput({
			symptom: record.symptom || "",
			date: record.date || "",
			severity: record.severity ?? "",
			notes: record.notes || "",
		});
		setCurrentId(record.id);
		setErrorMessage("");
	};

	const handleDelete = async (record) => {
		if (!window.confirm(`Delete "${record.symptom}" on ${record.date}?`)) return;
		try {
			await deleteDoc(doc(db, "Users", currentUser.uid, "symptoms", record.id));
			if (record.id === currentId) resetForm();
		} catch {
			setErrorMessage("Could not delete the symptom. Please try again.");
		}
	};

	return (
		<div className="my-4">
			<h2>
				<FontAwesomeIcon icon={faNotesMedical} className="me-2" />
				Symptom Tracker
			</h2>
			{errorMessage && (
				<Alert variant="danger" dismissible onClose={() => setErrorMessage("")}>
					{errorMessage}
				</Alert>
			)}
			{successMessage && <Alert variant="success">{successMessage}</Alert>}
			<Card className="mb-4">
				<Card.Body>
					<Form onSubmit={handleSubmit} noValidate>
						<Form.Group controlId="symptomInput" className="mb-3">
							<Form.Label>
								<FontAwesomeIcon icon={faNotesMedical} className="me-2" />
								Enter Symptom:
							</Form.Label>
							<Form.Control
								type="text"
								name="symptom"
								placeholder="Enter symptom"
								value={formInput.symptom}
								onChange={handleInputChange}
								maxLength={100}
								aria-label="Symptom input"
							/>
						</Form.Group>
						<Form.Group controlId="dateInput" className="mb-3">
							<Form.Label>
								<FontAwesomeIcon icon={faCalendarDay} className="me-2" />
								Enter Date:
							</Form.Label>
							<Form.Control
								type="date"
								name="date"
								value={formInput.date}
								onChange={handleInputChange}
								aria-label="Date input"
							/>
						</Form.Group>
						<Form.Group controlId="severityInput" className="mb-3">
							<Form.Label>
								<FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
								Severity (1-10):
							</Form.Label>
							<Form.Control
								type="number"
								name="severity"
								placeholder="Enter severity level"
								value={formInput.severity}
								onChange={handleInputChange}
								min="1"
								max="10"
								step="1"
								aria-label="Severity input"
							/>
						</Form.Group>
						<Form.Group controlId="notesInput" className="mb-3">
							<Form.Label>
								<FontAwesomeIcon icon={faNotesMedical} className="me-2" />
								Notes:
							</Form.Label>
							<Form.Control
								as="textarea"
								name="notes"
								placeholder="Additional notes"
								value={formInput.notes}
								onChange={handleInputChange}
								rows={3}
								maxLength={1000}
								aria-label="Notes input"
							/>
						</Form.Group>
						<Button
							variant="primary"
							type="submit"
							disabled={submitting}
							aria-label="Submit symptom"
						>
							<FontAwesomeIcon icon={faPlusCircle} className="me-2" />
							{editing ? "Update Symptom" : "Add Symptom"}
						</Button>
						{editing && (
							<Button variant="link" onClick={resetForm} className="ms-2">
								Cancel
							</Button>
						)}
					</Form>
				</Card.Body>
			</Card>
			{symptoms.length > 0 && <SymptomsChart symptoms={symptoms} />}
			<Form.Group controlId="searchInput" className="my-3">
				<Form.Label>
					<FontAwesomeIcon icon={faSearch} className="me-2" />
					Search Symptoms:
				</Form.Label>
				<Form.Control
					type="search"
					placeholder="Search symptoms"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					aria-label="Search symptoms"
				/>
			</Form.Group>
			{filteredSymptoms.length > 0 ? (
				<ListGroup>
					{filteredSymptoms.map((record) => (
						<ListGroup.Item
							key={record.id}
							className="d-flex justify-content-between align-items-start gap-2"
						>
							<div>
								{record.symptom} - {record.date}
								{record.severity != null && record.severity !== "" &&
									` - Severity: ${record.severity}`}
								{record.notes && ` - Notes: ${record.notes}`}
							</div>
							<div className="d-flex gap-2 flex-shrink-0">
								<Button
									variant="secondary"
									size="sm"
									onClick={() => handleEdit(record)}
									aria-label={`Edit symptom recorded on ${record.date}`}
								>
									<FontAwesomeIcon icon={faEdit} />
								</Button>
								<Button
									variant="danger"
									size="sm"
									onClick={() => handleDelete(record)}
									aria-label={`Delete symptom recorded on ${record.date}`}
								>
									<FontAwesomeIcon icon={faTrash} />
								</Button>
							</div>
						</ListGroup.Item>
					))}
				</ListGroup>
			) : (
				<Alert variant="info">
					{symptoms.length ? "No symptoms match your search." : "No symptoms logged."}
				</Alert>
			)}
		</div>
	);
};

export default SymptomTracker;
