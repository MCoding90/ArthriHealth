import React, { useState, useEffect } from "react";
import { Form, Card, Button, Alert, ListGroup } from "react-bootstrap";
import { debounce } from "lodash";
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
	getFirestore,
	doc,
	collection,
	addDoc,
	query,
	where,
	updateDoc,
	deleteDoc,
	onSnapshot,
	Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const severityBadge = (value) => {
	const num = Number(value);

	let bg = "secondary";

	if (num <= 3)
		bg = "success"; // green
	else if (num <= 6)
		bg = "warning"; // orange
	else bg = "danger"; // red

	return (
		<span
			className={`badge bg-${bg}`}
			style={{ fontSize: "0.85rem", marginLeft: "6px" }}
		>
			{num}
		</span>
	);
};

// Safe timestamp → JS Date
const toDateSafe = (ts) => {
	if (!ts) return null;
	if (ts.toDate) return ts.toDate();
	return new Date(ts);
};

const SymptomTracker = () => {
	const { currentUser } = useAuth();
	const db = getFirestore();

	const [symptoms, setSymptoms] = useState([]);
	const [formInput, setFormInput] = useState({
		symptom: "",
		date: "",
		severity: "",
		notes: "",
	});
	const [editing, setEditing] = useState(false);
	const [currentId, setCurrentId] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// -----------------------------
	// REAL-TIME FIRESTORE LISTENER
	// -----------------------------
	useEffect(() => {
		if (!currentUser) return;

		const symptomsRef = collection(db, "symptoms");
		const q = query(symptomsRef, where("userId", "==", currentUser.uid));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const symptomsData = querySnapshot.docs.map((docSnap) => {
				const data = docSnap.data();

				return {
					id: docSnap.id,
					symptom: data.symptom || data.type || "Unknown symptom",
					severity: Number(data.severity) || 0,
					notes: data.notes || "",
					date: data.date || data.timestamp || null,
				};
			});

			setSymptoms(symptomsData);
		});

		return () => unsubscribe();
	}, [currentUser, db]);

	// -----------------------------
	// SEARCH (SAFE)
	// -----------------------------
	useEffect(() => {
		const handleSearch = debounce(() => {
			if (searchInput.trim()) {
				const filtered = symptoms.filter((s) =>
					(s.symptom || "").toLowerCase().includes(searchInput.toLowerCase()),
				);
				setSuggestions(filtered);
			} else {
				setSuggestions([]);
			}

			setCurrentPage(1); // reset pagination on search
		}, 300);

		handleSearch();
		return () => handleSearch.cancel();
	}, [searchInput, symptoms]);

	// -----------------------------
	// FORM HANDLERS
	// -----------------------------
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormInput((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!formInput.symptom || !formInput.date) {
			setShowAlert(true);
			return;
		}

		const dateObj = Timestamp.fromDate(new Date(formInput.date));

		if (editing) {
			const symptomRef = doc(db, "symptoms", currentId);
			await updateDoc(symptomRef, {
				symptom: formInput.symptom,
				severity: Number(formInput.severity),
				notes: formInput.notes || "",
				date: dateObj,
			});
		} else {
			await addDoc(collection(db, "symptoms"), {
				userId: currentUser.uid,
				symptom: formInput.symptom,
				severity: Number(formInput.severity),
				notes: formInput.notes || "",
				date: dateObj,
			});

			setSuccessMessage("Symptom added successfully!");
		}

		setFormInput({ symptom: "", date: "", severity: "", notes: "" });
		setShowAlert(false);
		setTimeout(() => setSuccessMessage(""), 3000);
		setSearchInput("");
		setEditing(false);
	};

	const handleEdit = (symptom) => {
		setFormInput({
			symptom: symptom.symptom,
			date: toDateSafe(symptom.date)?.toISOString().split("T")[0] || "",
			severity: symptom.severity?.toString() || "1",
			notes: symptom.notes || "",
		});
		setEditing(true);
		setCurrentId(symptom.id);
	};

	const handleDelete = async (id) => {
		await deleteDoc(doc(db, "symptoms", id));
	};

	// -----------------------------
	// PAGINATION LOGIC
	// -----------------------------
	const listToShow = searchInput.trim() ? suggestions : symptoms;

	const indexOfLast = currentPage * itemsPerPage;
	const indexOfFirst = indexOfLast - itemsPerPage;
	const paginatedSymptoms = listToShow.slice(indexOfFirst, indexOfLast);

	const totalPages = Math.ceil(listToShow.length / itemsPerPage);

	// -----------------------------
	// RENDER
	// -----------------------------
	return (
		<div>
			<h2>
				<FontAwesomeIcon icon={faNotesMedical} className="me-2" />
				Symptom Tracker
			</h2>

			{showAlert && <Alert variant="danger">Please fill in all fields.</Alert>}
			{successMessage && <Alert variant="success">{successMessage}</Alert>}

			<Card>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="symptomInput">
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
							/>
						</Form.Group>

						<Form.Group controlId="dateInput">
							<Form.Label>
								<FontAwesomeIcon icon={faCalendarDay} className="me-2" />
								Enter Date:
							</Form.Label>
							<Form.Control
								type="date"
								name="date"
								value={formInput.date}
								onChange={handleInputChange}
							/>
						</Form.Group>

						<Form.Group controlId="severityInput">
							<Form.Label>
								<FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
								Severity (1–10):
							</Form.Label>
							<Form.Control
								type="number"
								name="severity"
								min="1"
								max="10"
								value={formInput.severity}
								onChange={handleInputChange}
							/>
						</Form.Group>

						<Form.Group controlId="notesInput">
							<Form.Label>
								<FontAwesomeIcon icon={faNotesMedical} className="me-2" />
								Notes:
							</Form.Label>
							<Form.Control
								as="textarea"
								name="notes"
								rows={3}
								value={formInput.notes}
								onChange={handleInputChange}
							/>
						</Form.Group>

						<Button variant="primary" type="submit">
							<FontAwesomeIcon icon={faPlusCircle} className="me-2" />
							{editing ? "Update Symptom" : "Add Symptom"}
						</Button>
					</Form>

					<Form.Group controlId="searchInput" className="mt-3">
						<Form.Label>
							<FontAwesomeIcon icon={faSearch} className="me-2" />
							Search Symptoms:
						</Form.Label>
						<Form.Control
							type="text"
							placeholder="Search symptoms"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</Form.Group>
				</Card.Body>
			</Card>

			{symptoms.length > 0 && <SymptomsChart symptoms={symptoms} />}

			<ListGroup className="mt-3">
				{paginatedSymptoms.map((record) => (
					<ListGroup.Item key={record.id}>
						<strong>{record.symptom}</strong> —{" "}
						{toDateSafe(record.date)?.toLocaleDateString() || "No date"} —{" "}
						Severity: {severityBadge(record.severity)}
						{record.notes && ` — Notes: ${record.notes}`}
						<Button
							variant="danger"
							onClick={() => handleDelete(record.id)}
							style={{ float: "right" }}
						>
							<FontAwesomeIcon icon={faTrash} />
						</Button>
						<Button
							variant="secondary"
							onClick={() => handleEdit(record)}
							style={{ float: "right", marginRight: "10px" }}
						>
							<FontAwesomeIcon icon={faEdit} />
						</Button>
					</ListGroup.Item>
				))}

				{symptoms.length === 0 && (
					<Alert variant="info">No symptoms logged.</Alert>
				)}
			</ListGroup>

			{/* PAGINATION CONTROLS */}
			{totalPages > 1 && (
				<div className="d-flex justify-content-center mt-3">
					<Button
						variant="secondary"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage((p) => p - 1)}
						className="me-2"
					>
						Previous
					</Button>

					<span style={{ paddingTop: "6px" }}>
						Page {currentPage} of {totalPages}
					</span>

					<Button
						variant="secondary"
						disabled={currentPage === totalPages}
						onClick={() => setCurrentPage((p) => p + 1)}
						className="ms-2"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};

export default SymptomTracker;
