// Maps Firebase error codes to user-friendly messages.
export function getAuthErrorMessage(error) {
	switch (error?.code) {
		case "auth/invalid-credential":
		case "auth/wrong-password":
		case "auth/user-not-found":
			return "Incorrect email or password.";
		case "auth/email-already-in-use":
			return "An account with this email already exists.";
		case "auth/weak-password":
			return "Password must be at least 6 characters.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later.";
		case "auth/network-request-failed":
			return "Network error. Check your connection and try again.";
		default:
			return error?.message || "Something went wrong. Please try again.";
	}
}
