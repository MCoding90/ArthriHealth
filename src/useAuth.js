import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	updateProfile,
	sendPasswordResetEmail,
	sendEmailVerification,
} from "firebase/auth";

import { useState, useEffect } from "react";

function useAuth() {
	const [user, setUser] = useState(null);
	const auth = getAuth();

	useEffect(() => {
		function handleAuthChange(newUser) {
			setUser(newUser);
		}
		const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
		return unsubscribe;
	}, [auth]);

	async function signup(email, password, name) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const newUser = userCredential.user;
			// Update profile with the display name
			if (name) {
				await updateProfile(newUser, { displayName: name });
			}

			// Send email verification
			await sendEmailVerification(newUser);

			setUser(newUser); // Update user state after signup
			alert("Signed up successfully! Please verify your email.");
		} catch (error) {
			alert(`Error: ${error.message}`);
		}
	}

	async function login(email, password) {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			setUser(userCredential.user); // Update user state after login
		} catch (error) {
			alert(`Login Failed: ${error.message}`);
		}
	}

	async function resetPassword(email) {
		try {
			await sendPasswordResetEmail(auth, email);
			return { success: true, message: "Password reset email sent!" };
		} catch (error) {
			return { success: false, message: error.message };
		}
	}

	async function logout() {
		try {
			await auth.signOut();
			setUser(null); // Clear user state after logout
		} catch (error) {
			alert(`Logout Failed: ${error.message}`);
		}
	}

	return { signup, login, resetPassword, logout, user };
}

export default useAuth;
