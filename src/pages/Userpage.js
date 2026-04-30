import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import { db } from "../firebase-Config";
import {
	collection,
	query,
	where,
	onSnapshot,
	orderBy,
} from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPills, faHeart } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
	const { currentUser } = useAuth();

	const [symptoms, setSymptoms] = useState([]);
	const [medicationsToday, setMedicationsToday] = useState(0);

	// -----------------------------
	// Fetch Symptoms (Real-time)
	// -----------------------------
	useEffect(() => {
		if (!currentUser) return;

		const q = query(
			collection(db, "symptoms"),
			where("userId", "==", currentUser.uid),
			orderBy("date", "asc"),
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const data = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setSymptoms(data);
		});

		return unsubscribe;
	}, [currentUser]);

	// -----------------------------
	// Fetch Medications Today
	// -----------------------------
	useEffect(() => {
		if (!currentUser) return;

		const q = query(
			collection(db, "medications"),
			where("userId", "==", currentUser.uid),
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const meds = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			const today = new Date().toDateString();

			const medsToday = meds.filter((m) => {
				const startDate = m.start.toDate().toDateString();
				return startDate === today;
			});

			setMedicationsToday(medsToday.length);
		});

		return unsubscribe;
	}, [currentUser]);

	// -----------------------------
	// Stats
	// -----------------------------
	const avgSeverity =
		symptoms.length > 0
			? (
					symptoms.reduce((sum, s) => sum + (Number(s.severity) || 0), 0) /
					symptoms.length
				).toFixed(1)
			: 0;

	const lastUpdate =
		symptoms.length > 0
			? symptoms[symptoms.length - 1].date?.toDate()?.toLocaleDateString()
			: "No data";

	// -----------------------------
	// Sparkline Chart
	// -----------------------------
	const sparklineData = {
		labels: symptoms.map(() => ""),
		datasets: [
			{
				data: symptoms.map((s) => Number(s.severity) || 0),
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 2,
				tension: 0.4,
				pointRadius: 0,
			},
		],
	};

	const sparklineOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: { x: { display: false }, y: { display: false } },
	};

	return (
		<Container className="mt-4">
			{/* Header */}
			<div className="p-4 mb-4 rounded shadow-sm bg-light">
				<h2 className="mb-1">
					Welcome back, {currentUser?.displayName || "User"}!
				</h2>
				<p className="text-muted mb-0">
					Manage your health, track symptoms, and stay on top of your
					medication.
				</p>
			</div>

			{/* Quick Stats */}
			<Row className="mb-4 g-3">
				<Col md={3}>
					<Card className="shadow-sm border-0 text-center p-3">
						<h6 className="text-muted mb-1">Symptoms Logged</h6>
						<h3 className="fw-bold">{symptoms.length}</h3>
					</Card>
				</Col>

				<Col md={3}>
					<Card className="shadow-sm border-0 text-center p-3">
						<h6 className="text-muted mb-1">Medications Today</h6>
						<h3 className="fw-bold">{medicationsToday}</h3>
					</Card>
				</Col>

				<Col md={3}>
					<Card className="shadow-sm border-0 text-center p-3">
						<h6 className="text-muted mb-1">Avg Severity</h6>
						<h3 className="fw-bold">{avgSeverity}</h3>
					</Card>
				</Col>

				<Col md={3}>
					<Card className="shadow-sm border-0 text-center p-3">
						<h6 className="text-muted mb-1">Last Update</h6>
						<h3 className="fw-bold">{lastUpdate}</h3>
					</Card>
				</Col>
			</Row>

			{/* Main Cards */}
			<Row className="g-4">
				{/* Profile */}
				<Col md={4}>
					<Card className="h-100 shadow-sm border-0">
						<Card.Body>
							<div className="d-flex align-items-center mb-3">
								<FontAwesomeIcon
									icon={faUser}
									size="lg"
									className="text-primary me-2"
								/>
								<Card.Title className="mb-0">Profile</Card.Title>
							</div>
							<Card.Text className="text-muted">
								View and edit your personal details.
							</Card.Text>
							<Button variant="primary" href="/profile">
								Go to Profile
							</Button>
						</Card.Body>
					</Card>
				</Col>

				{/* Medication */}
				<Col md={4}>
					<Card className="h-100 shadow-sm border-0">
						<Card.Body>
							<div className="d-flex align-items-center mb-3">
								<FontAwesomeIcon
									icon={faPills}
									size="lg"
									className="text-success me-2"
								/>
								<Card.Title className="mb-0">Medication Tracker</Card.Title>
							</div>
							<Card.Text className="text-muted">
								Manage your medications and track your intake.
							</Card.Text>
							<Button variant="success" href="/medication-page">
								Manage Medications
							</Button>
						</Card.Body>
					</Card>
				</Col>

				{/* Symptoms */}
				<Col md={4}>
					<Card className="h-100 shadow-sm border-0">
						<Card.Body>
							<div className="d-flex align-items-center mb-3">
								<FontAwesomeIcon
									icon={faHeart}
									size="lg"
									className="text-danger me-2"
								/>
								<Card.Title className="mb-0">Symptom Tracker</Card.Title>
							</div>
							<Card.Text className="text-muted">
								Record and review your symptoms over time.
							</Card.Text>

							{symptoms.length > 1 && (
								<div style={{ height: "80px" }} className="mb-3">
									<Line data={sparklineData} options={sparklineOptions} />
								</div>
							)}

							<Button variant="danger" href="/symptom-tracker">
								Track Symptoms
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

console.log(db);
export default Dashboard;
