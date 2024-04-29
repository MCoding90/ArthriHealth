import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import App from "./App";

// Mocking the AuthProvider and useAuth hook directly
jest.mock("./context/AuthContext", () => ({
	AuthProvider: ({ children }) => <div>{children}</div>, // Simplify the provider
	useAuth: () => ({
		currentUser: { uid: "123", emailVerified: true }, // Simulate an authenticated and verified user
	}),
}));

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"), // Import and spread the actual module
	BrowserRouter: ({ children }) => <div>{children}</div>, // Mock BrowserRouter
}));

jest.mock("./pages/Homepage", () => () => <div>Homepage</div>);
jest.mock("./pages/LoginPage", () => () => <div>Login Page</div>);
// Add other component mocks similarly

// Mocking components
jest.mock("./pages/Homepage", () => () => <div>Homepage</div>);
jest.mock("./pages/LoginPage", () => () => <div>Login Page</div>);
jest.mock("./pages/SignUpPage", () => () => <div>Sign Up Page</div>);
jest.mock("./pages/LogoutPage", () => () => <div>Logout Page</div>);
jest.mock("./components/ProtectedRoute", () => ({ children }) => (
	<div>{children}</div>
));
jest.mock("./pages/Userpage", () => () => <div>User Page</div>);

jest.mock("./pages/HealthTips", () => () => <div>Health Tips</div>);
// Add more mocks as necessary for other components

test("ProtectedRoute renders children when authenticated", () => {
	const { getByText } = render(
		<MemoryRouter>
			<ProtectedRoute>
				<div>User Page</div>
			</ProtectedRoute>
		</MemoryRouter>
	);
	expect(getByText("User Page")).toBeInTheDocument();
});

describe("App Component Routing", () => {
	it('renders the Homepage on the "/" route', async () => {
		const { getByText } = render(
			<MemoryRouter initialEntries={["/"]}>
				<App />
			</MemoryRouter>
		);
		await waitFor(() => expect(getByText("Homepage")).toBeInTheDocument());
	});

	it('renders the Login Page on the "/login" route', async () => {
		const { getByText } = render(
			<MemoryRouter initialEntries={["/login"]}>
				<App />
			</MemoryRouter>
		);
		await waitFor(() => expect(getByText("Login Page")).toBeInTheDocument());
	});

	it('renders the Sign Up Page on the "/signup" route', async () => {
		const { getByText } = render(
			<MemoryRouter initialEntries={["/signup"]}>
				<App />
			</MemoryRouter>
		);
		await waitFor(() => expect(getByText("Sign Up Page")).toBeInTheDocument());
	});

	it('renders the Logout Page on the "/logout" route', async () => {
		const { getByText } = render(
			<MemoryRouter initialEntries={["/logout"]}>
				<App />
			</MemoryRouter>
		);
		await waitFor(() => expect(getByText("Logout Page")).toBeInTheDocument());
	});

	// More tests for other routes and components
});
