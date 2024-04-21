import React, { useState, useEffect } from "react";
import { Form, Card, Button, Alert, ListGroup } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import SymptomsChart from "../components/SymptomsChart";

const SymptomTracker = () => {
	const [symptoms, setSymptoms] = useState(testData);
	const [formInput, setFormInput] = useState({
		symptom: "",
		date: "",
		severity: "",
		notes: "",
	});
	const [showAlert, setShowAlert] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormInput((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!formInput.symptom || !formInput.date) {
			setShowAlert(true);
			return;
		}
		setSymptoms((prevSymptoms) => [
			...prevSymptoms,
			{ id: uuidv4(), ...formInput },
		]);
		setFormInput({ symptom: "", date: "", severity: "", notes: "" });
		setShowAlert(false);
		setSuccessMessage("Symptom added successfully!");
		setTimeout(() => setSuccessMessage(""), 3000);
		setSearchInput("");
	};

	useEffect(() => {
		const handleSearch = debounce(() => {
			if (searchInput) {
				const filteredSuggestions = symptoms.filter((symptom) =>
					symptom.symptom.toLowerCase().includes(searchInput.toLowerCase())
				);
				setSuggestions(filteredSuggestions);
			} else {
				setSuggestions([]);
			}
		}, 300);
		handleSearch();
		return () => handleSearch.cancel(); // Cleanup debounce
	}, [searchInput, symptoms]);

	const handleDelete = (id) => {
		setSymptoms(symptoms.filter((symptom) => symptom.id !== id));
	};

	return (
		<div>
			<h2>Symptom Tracker</h2>
			{showAlert && <Alert variant="danger">Please fill in all fields.</Alert>}
			{successMessage && <Alert variant="success">{successMessage}</Alert>}
			<Card>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="symptomInput">
							<Form.Label>Enter Symptom:</Form.Label>
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
							<Form.Label>Enter Date:</Form.Label>
							<Form.Control
								type="date"
								name="date"
								value={formInput.date}
								onChange={handleInputChange}
								aria-label="Date input"
							/>
						</Form.Group>
						<Form.Group controlId="severityInput">
							<Form.Label>Severity (1-10):</Form.Label>
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
							<Form.Label>Notes:</Form.Label>
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
						<Button variant="info" type="submit" aria-label="Submit symptom">
							Add Symptom
						</Button>
					</Form>
					<Form.Group controlId="searchInput">
						<Form.Label>Search Symptoms:</Form.Label>
						<Form.Control
							type="text"
							placeholder="Search symptoms"
							onChange={(e) => setSearchInput(e.target.value)}
							aria-label="Search symptoms"
						/>
					</Form.Group>
				</Card.Body>
			</Card>
			{/* Render the SymptomsChart if they exist*/}
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
								Delete
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
