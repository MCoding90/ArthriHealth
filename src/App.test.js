import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";

let mockUser = null;
jest.mock("./context/AuthContext", () => ({
	useAuth: () => ({ currentUser: mockUser }),
}));

const renderAt = (path) =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route path="/login" element={<div>Login Page</div>} />
				<Route path="/verify-email" element={<div>Verify Email Page</div>} />
				<Route path="/userpage" element={<div>Dashboard</div>} />
				<Route element={<GuestRoute />}>
					<Route path="/signup" element={<div>Sign Up Page</div>} />
				</Route>
				<Route element={<ProtectedRoute />}>
					<Route path="/symptom-tracker" element={<div>Symptom Tracker</div>} />
				</Route>
			</Routes>
		</MemoryRouter>
	);

describe("ProtectedRoute", () => {
	it("redirects signed-out users to login", () => {
		mockUser = null;
		renderAt("/symptom-tracker");
		expect(screen.getByText("Login Page")).toBeInTheDocument();
	});

	it("redirects unverified users to verify-email", () => {
		mockUser = { uid: "1", emailVerified: false };
		renderAt("/symptom-tracker");
		expect(screen.getByText("Verify Email Page")).toBeInTheDocument();
	});

	it("renders the page for verified users", () => {
		mockUser = { uid: "1", emailVerified: true };
		renderAt("/symptom-tracker");
		expect(screen.getByText("Symptom Tracker")).toBeInTheDocument();
	});
});

describe("GuestRoute", () => {
	it("renders for signed-out users", () => {
		mockUser = null;
		renderAt("/signup");
		expect(screen.getByText("Sign Up Page")).toBeInTheDocument();
	});

	it("sends verified users to the dashboard", () => {
		mockUser = { uid: "1", emailVerified: true };
		renderAt("/signup");
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
	});
});
