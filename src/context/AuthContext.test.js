import React from "react";
import { render } from "@testing-library/react";
import {
	createUserWithEmailAndPassword,
	updateProfile,
	sendEmailVerification,
} from "firebase/auth";
import { AuthProvider, useAuth } from "./AuthContext";

jest.mock("../firebase", () => ({ auth: {} }));
jest.mock("firebase/auth", () => ({
	onAuthStateChanged: (auth, callback) => {
		callback(null);
		return () => {};
	},
	createUserWithEmailAndPassword: jest.fn(),
	updateProfile: jest.fn(),
	sendEmailVerification: jest.fn(),
}));

it("signup still succeeds when the verification email fails to send", async () => {
	createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "1" } });
	updateProfile.mockResolvedValue();
	sendEmailVerification.mockRejectedValue(new Error("network"));
	jest.spyOn(console, "error").mockImplementation(() => {});
	let auth;
	const Grab = () => {
		auth = useAuth();
		return null;
	};
	render(
		<AuthProvider>
			<Grab />
		</AuthProvider>
	);

	await expect(auth.signup("a@b.co", "secret1", "Ann")).resolves.toEqual({ uid: "1" });
	expect(sendEmailVerification).toHaveBeenCalled();
});
