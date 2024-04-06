import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const SymptomTracker = () => {
	const [symptoms, setSymptoms] = useState([]);
	const [symptomInput, setSymptomInput] = useState("");
	const [dateInput, setDateInput] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		if (name === "symptom") {
			setSymptomInput(value);
		} else if (name === "date") {
			setDateInput(value);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!symptomInput || !dateInput) {
			setShowAlert(true);
			return;
		}
		setSymptoms((prevSymptoms) => [
			...prevSymptoms,
			{ id: uuidv4(), symptom: symptomInput, date: dateInput },
		]);
		setSymptomInput("");
		setDateInput("");
		setShowAlert(false);
		setSearchInput("");
	};

	const handleSearchInputChange = (event) => {
		const value = event.target.value;
		setSearchInput(value);
		if (value) {
			const filteredSuggestions = symptoms.filter((symptom) =>
				symptom.symptom.toLowerCase().includes(value.toLowerCase())
			);
			setSuggestions(filteredSuggestions);
		} else {
			setSuggestions([]);
		}
	};

	const selectSuggestion = (suggestion) => {
		setSearchInput(suggestion.symptom);
		setSuggestions([]);
	};

	return (
		<div>
			<h2>Symptom Tracker</h2>
			{showAlert && <Alert variant="danger">Please fill in all fields.</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="symptomInput">
					<Form.Label>Enter Symptom:</Form.Label>
					<Form.Control
						type="text"
						name="symptom"
						placeholder="Enter symptom"
						value={symptomInput}
						onChange={handleInputChange}
						aria-label="Symptom"
					/>
				</Form.Group>
				<Form.Group controlId="dateInput">
					<Form.Label>Enter Date:</Form.Label>
					<Form.Control
						type="date"
						name="date"
						value={dateInput}
						onChange={handleInputChange}
						aria-label="Date"
					/>
				</Form.Group>
				<Button variant="info" type="submit">
					Track Symptom
				</Button>
			</Form>
			<Form.Group controlId="searchInput">
				<Form.Label>Search Symptom:</Form.Label>
				<Form.Control
					type="text"
					placeholder="Search symptom"
					value={searchInput}
					onChange={handleSearchInputChange}
					aria-label="Search Symptom"
				/>
			</Form.Group>
			<ul>
				{suggestions.map((suggestion) => (
					<li key={suggestion.id} onClick={() => selectSuggestion(suggestion)}>
						{suggestion.symptom} - {suggestion.date}
					</li>
				))}
			</ul>
			<h3>Recorded Symptoms:</h3>
			<ul>
				{symptoms.map((record) => (
					<React.Fragment key={record.id}>
						<li>
							{record.symptom} - {record.date}
						</li>
					</React.Fragment>
				))}
			</ul>
		</div>
	);
};

export default SymptomTracker;
