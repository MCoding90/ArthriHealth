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
		const unsubscribe = onAuthStateChanged(auth, (newUser) => {
			setUser(newUser); // Update user state when auth state changes
		});
		return unsubscribe; // cleanup on component unmount
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
