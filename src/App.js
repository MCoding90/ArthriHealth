import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";
import Layout from "./pages/Layout";
import LoadingSpinner from "./components/LoadingSpinner";

const HomePage = lazy(() => import("./pages/Homepage"));
const UserPage = lazy(() => import("./pages/Userpage"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SymptomTracker = lazy(() => import("./pages/SymptomTracker"));
const MedicationPage = lazy(() => import("./pages/Medicationpage"));
const LifeStylePage = lazy(() => import("./pages/LifeStyle"));
const HealthTips = lazy(() => import("./pages/HealthTips"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const LogoutPage = lazy(() => import("./pages/LogoutPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<Suspense fallback={<LoadingSpinner />}>
					<Routes>
						<Route element={<Layout />}>
							<Route path="/" element={<HomePage />} />
							<Route path="/lifestyle-management" element={<LifeStylePage />} />
							<Route path="/logout" element={<LogoutPage />} />
							<Route path="/verify-email" element={<VerifyEmailPage />} />
							<Route element={<GuestRoute />}>
								<Route path="/login" element={<LoginPage />} />
								<Route path="/signup" element={<SignUpPage />} />
							</Route>
							<Route element={<ProtectedRoute />}>
								<Route path="/health-tips" element={<HealthTips />} />
								<Route path="/symptom-tracker" element={<SymptomTracker />} />
								<Route path="/medication-page" element={<MedicationPage />} />
								<Route path="/userpage" element={<UserPage />} />
								<Route path="/profile" element={<UserProfile />} />
							</Route>
							<Route path="*" element={<NotFoundPage />} />
						</Route>
					</Routes>
				</Suspense>
			</AuthProvider>
		</Router>
	);
}
