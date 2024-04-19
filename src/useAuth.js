import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	updateProfile,
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
			await updateProfile(newUser, { displayName: name });
			setUser(newUser); // Update user state after signup
			alert(`Signed up successfully: ID=${newUser.uid}`);
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

	async function logout() {
		try {
			await auth.signOut();
			setUser(null); // Clear user state after logout
		} catch (error) {
			alert(`Logout Failed: ${error.message}`);
		}
	}

	return { signup, login, logout, user };
}

export default useAuth;
