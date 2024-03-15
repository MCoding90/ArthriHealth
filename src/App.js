import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import UserPage from "./pages/Userpage";
import SymptomTracker from "./pages/SymptomTracker";
import HealthTips from "./pages/HealthTips";
import MedicationPage from "./pages/Medicationpage";
export default function App() {
	return (
		<Routes>
			<Route exact path="/" element={<HomePage />} />
			<Route path="/:id" element={<UserPage />} />
			<Route exact path="symptom-tracker" element={<SymptomTracker />} />
			<Route exact path="medication-page" element={<MedicationPage />} />
			<Route exact path="health-tips" element={<HealthTips />} />
		</Routes>
	);
}
