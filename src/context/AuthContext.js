import React, { createContext, useContext, useState, useEffect } from "react";
import {
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendPasswordResetEmail,
	sendEmailVerification,
	reload,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [, setUserVersion] = useState(0);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	// All actions throw on failure so callers can show the error.
	const signup = async (email, password, name) => {
		const { user } = await createUserWithEmailAndPassword(auth, email, password);
		if (name) await updateProfile(user, { displayName: name });
		await sendEmailVerification(user);
		return user;
	};

	const login = async (email, password) => {
		const { user } = await signInWithEmailAndPassword(auth, email, password);
		return user;
	};

	const logout = () => signOut(auth);

	const resetPassword = (email) => sendPasswordResetEmail(auth, email);

	const resendVerification = () => sendEmailVerification(auth.currentUser);

	// emailVerified is cached on the user object; reload + force token refresh so
	// both the UI and Firestore rules (email_verified claim) see the new state.
	const refreshUser = async () => {
		if (!auth.currentUser) return null;
		await reload(auth.currentUser);
		await auth.currentUser.getIdToken(true);
		// Same User instance (mutated by reload), so bump a counter to re-render consumers.
		setUserVersion((v) => v + 1);
		return auth.currentUser;
	};

	const value = {
		currentUser,
		signup,
		login,
		logout,
		resetPassword,
		resendVerification,
		refreshUser,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
