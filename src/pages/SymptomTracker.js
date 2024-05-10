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
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

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

	useEffect(() => {
		if (currentUser) {
			const symptomsRef = collection(db, "Users", currentUser.uid, "symptoms");
			const q = query(symptomsRef, where("user", "==", currentUser.uid));
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const symptomsData = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setSymptoms(symptomsData);
			});

			return () => unsubscribe();
		}
	}, [currentUser, db]);

	useEffect(() => {
		const handleSearch = debounce(() => {
			if (searchInput.trim()) {
				const filteredSuggestions = symptoms.filter((symptom) =>
					symptom.symptom.toLowerCase().includes(searchInput.toLowerCase())
				);
				setSuggestions(filteredSuggestions);
			} else {
				setSuggestions([]);
			}
		}, 300);
		handleSearch();
		return () => handleSearch.cancel();
	}, [searchInput, symptoms]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormInput((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!formInput.symptom || !formInput.date) {
			setShowAlert(true);
			return;
		}

		if (editing) {
			const symptomRef = doc(
				db,
				"Users",
				currentUser.uid,
				"symptoms",
				currentId
			);
			await updateDoc(symptomRef, formInput);
			setSuccessMessage("Symptom updated successfully!");
			setEditing(false);
			setCurrentId(null);
		} else {
			const newSymptom = {
				...formInput,
				user: currentUser.uid,
			};
			await addDoc(
				collection(db, "Users", currentUser.uid, "symptoms"),
				newSymptom
			);
			setSuccessMessage("Symptom added successfully!");
		}

		setFormInput({ symptom: "", date: "", severity: "", notes: "" });
		setShowAlert(false);
		setTimeout(() => setSuccessMessage(""), 3000);
		setSearchInput("");
	};

	const handleEdit = (symptom) => {
		setFormInput(symptom);
		setEditing(true);
		setCurrentId(symptom.id);
	};

	const handleDelete = async (id) => {
		await deleteDoc(doc(db, "Users", currentUser.uid, "symptoms", id));
	};

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
								aria-label="Symptom input"
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
								aria-label="Date input"
							/>
						</Form.Group>
						<Form.Group controlId="severityInput">
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
								aria-label="Severity input"
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
								placeholder="Additional notes"
								value={formInput.notes}
								onChange={handleInputChange}
								rows={3}
								aria-label="Notes input"
							/>
						</Form.Group>
						<Button variant="primary" type="submit" aria-label="Submit symptom">
							<FontAwesomeIcon icon={faPlusCircle} className="me-2" />
							{editing ? "Update Symptom" : "Add Symptom"}
						</Button>
					</Form>
					<Form.Group controlId="searchInput">
						<Form.Label>
							<FontAwesomeIcon icon={faSearch} className="me-2" />
							Search Symptoms:
						</Form.Label>
						<Form.Control
							type="text"
							placeholder="Search symptoms"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							aria-label="Search symptoms"
						/>
					</Form.Group>
				</Card.Body>
			</Card>
			{symptoms.length > 0 && <SymptomsChart symptoms={symptoms} />}
			<ListGroup>
				{suggestions.length > 0 ? (
					suggestions.map((suggestion) => (
						<ListGroup.Item
							key={suggestion.id}
							onClick={() => setSearchInput(suggestion.symptom)}
							aria-label={`Select suggestion: ${suggestion.symptom} recorded on ${suggestion.date}`}
						>
							{suggestion.symptom} - {suggestion.date}
						</ListGroup.Item>
					))
				) : symptoms.length > 0 ? (
					symptoms.map((record) => (
						<ListGroup.Item
							key={record.id}
							aria-label={`Symptom: ${record.symptom}, Date: ${record.date}, Severity: ${record.severity}, Notes: ${record.notes}`}
						>
							{record.symptom} - {record.date} - Severity: {record.severity}
							{record.notes && ` - Notes: ${record.notes}`}
							<Button
								variant="danger"
								onClick={() => handleDelete(record.id)}
								style={{ float: "right" }}
								aria-label={`Delete symptom recorded on ${record.date}`}
							>
								<FontAwesomeIcon icon={faTrash} />
							</Button>
							<Button
								variant="secondary"
								onClick={() => handleEdit(record)}
								style={{ float: "right", marginRight: "10px" }}
								aria-label={`Edit symptom recorded on ${record.date}`}
							>
								<FontAwesomeIcon icon={faEdit} />
							</Button>
						</ListGroup.Item>
					))
				) : (
					<Alert variant="info">No symptoms logged.</Alert>
				)}
			</ListGroup>
		</div>
	);
};

export default SymptomTracker;
