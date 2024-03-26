import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/Homepage";
import UserPage from "./pages/Userpage";
import SymptomTracker from "./pages/SymptomTracker";
import HealthTips from "./pages/HealthTips";
import MedicationPage from "./pages/Medicationpage";

export default function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Layout>
						<HomePage />
					</Layout>
				}
			/>
			<Route
				path="/:id"
				element={
					<Layout>
						<UserPage />
					</Layout>
				}
			/>
			<Route
				path="symptom-tracker"
				element={
					<Layout>
						<SymptomTracker />
					</Layout>
				}
			/>
			<Route
				path="medication-page"
				element={
					<Layout>
						<MedicationPage />
					</Layout>
				}
			/>
			<Route
				path="health-tips"
				element={
					<Layout>
						<HealthTips />
					</Layout>
				}
			/>
		</Routes>
	);
}
