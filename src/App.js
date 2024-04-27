import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./pages/Layout";
import LoadingSpinner from "./components/LoadingSpinner";

const HomePage = lazy(() => import("./pages/Homepage"));
const UserPage = lazy(() => import("./pages/Userpage"));
const SymptomTracker = lazy(() => import("./pages/SymptomTracker"));
const MedicationPage = lazy(() => import("./pages/Medicationpage"));
const HealthTips = lazy(() => import("./pages/HealthTips"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const LogoutPage = lazy(() => import("./pages/LogoutPage"));

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<Suspense fallback={<LoadingSpinner />}>
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
							path="/login"
							element={
								<Layout>
									<LoginPage />
								</Layout>
							}
						/>
						<Route
							path="/signup"
							element={
								<Layout>
									<SignUpPage />
								</Layout>
							}
						/>
						<Route
							path="/logout"
							element={
								<Layout>
									<LogoutPage />
								</Layout>
							}
						/>
						<Route element={<ProtectedRoute />}>
							<Route
								path="/health-tips"
								element={
									<Layout>
										<HealthTips />
									</Layout>
								}
							/>
							<Route
								path="/symptom-tracker"
								element={
									<Layout>
										<SymptomTracker />
									</Layout>
								}
							/>
							<Route
								path="/medication-page"
								element={
									<Layout>
										<MedicationPage />
									</Layout>
								}
							/>
							<Route
								path="/userpage"
								element={
									<Layout>
										<UserPage />
									</Layout>
								}
							/>
						</Route>
					</Routes>
				</Suspense>
			</AuthProvider>
		</Router>
	);
}
