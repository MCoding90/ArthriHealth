import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock("./context/AuthContext", () => ({
	useAuth: () => ({ login: mockLogin, resetPassword: jest.fn() }),
}));
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

const fillAndSubmit = async () => {
	userEvent.type(screen.getByLabelText("Email address"), "a@b.com");
	userEvent.type(screen.getByLabelText("Password"), "secret1");
	userEvent.click(screen.getByRole("button", { name: "Login" }));
};

beforeEach(() => {
	mockLogin.mockReset();
	mockNavigate.mockReset();
	render(
		<MemoryRouter>
			<LoginPage />
		</MemoryRouter>
	);
});

it("shows a friendly error and does not navigate when login fails", async () => {
	mockLogin.mockRejectedValue({ code: "auth/invalid-credential" });
	await fillAndSubmit();
	expect(await screen.findByText("Incorrect email or password.")).toBeInTheDocument();
	expect(mockNavigate).not.toHaveBeenCalled();
});

it("navigates to the dashboard for verified users", async () => {
	mockLogin.mockResolvedValue({ emailVerified: true });
	await fillAndSubmit();
	await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/userpage", { replace: true }));
});

it("navigates unverified users to verify-email", async () => {
	mockLogin.mockResolvedValue({ emailVerified: false });
	await fillAndSubmit();
	await waitFor(() =>
		expect(mockNavigate).toHaveBeenCalledWith("/verify-email", { replace: true })
	);
});
