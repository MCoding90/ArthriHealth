import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
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
			<Route
				path="sign-up"
				element={
					<Layout>
						<SignUpPage />
					</Layout>
				}
			/>
			<Route
				path="login"
				element={
					<Layout>
						<LoginPage />
					</Layout>
				}
			/>
			<Route
				path="logout"
				element={
					<Layout>
						<LogoutPage />
					</Layout>
				}
			/>
		</Routes>
	);
}
