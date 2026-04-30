import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase-Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
	Container,
	Form,
	Button,
	Spinner,
	Alert,
	Image,
} from "react-bootstrap";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserProfile = () => {
	const [userData, setUserData] = useState({
		email: "",
		displayName: "",
		bio: "",
		photoURL: "",
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [uploading, setUploading] = useState(false);

	// -----------------------------
	// Load User Profile
	// -----------------------------
	useEffect(() => {
		const loadProfile = async () => {
			const user = auth.currentUser;
			if (!user) return;

			try {
				const userRef = doc(db, "Users", user.uid);
				const snapshot = await getDoc(userRef);

				if (snapshot.exists()) {
					setUserData(snapshot.data());
				} else {
					const defaultData = {
						email: user.email,
						displayName: user.displayName || "",
						bio: "",
						photoURL: "",
					};
					await setDoc(userRef, defaultData);
					setUserData(defaultData);
				}
			} catch {
				setError("Error loading user profile.");
			}

			setLoading(false);
		};

		loadProfile();
	}, []);

	// -----------------------------
	// Handlers
	// -----------------------------
	const handleChange = (e) => {
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleFileChange = (e) => {
		setProfilePicture(e.target.files[0]);
	};

	// -----------------------------
	// Upload Profile Picture
	// -----------------------------
	const handleUpload = async () => {
		if (!profilePicture) {
			setError("Please select a picture before uploading.");
			return;
		}

		const user = auth.currentUser;
		if (!user) return;

		setUploading(true);

		try {
			const storageRef = ref(storage, `profile-pictures/${user.uid}`);
			await uploadBytes(storageRef, profilePicture);

			const downloadUrl = await getDownloadURL(storageRef);

			await setDoc(
				doc(db, "Users", user.uid),
				{ photoURL: downloadUrl },
				{ merge: true },
			);

			setUserData((prev) => ({ ...prev, photoURL: downloadUrl }));
		} catch {
			setError("Error uploading profile picture.");
		}

		setUploading(false);
	};

	// -----------------------------
	// Save Profile
	// -----------------------------
	const handleSave = async () => {
		const user = auth.currentUser;
		if (!user) return;

		try {
			await setDoc(doc(db, "Users", user.uid), userData, { merge: true });
			alert("Profile updated successfully!");
		} catch {
			setError("Error saving profile.");
		}
	};

	if (loading) return <Spinner animation="border" />;

	return (
		<Container>
			<h2>My Profile</h2>

			{error && <Alert variant="danger">{error}</Alert>}

			<Form>
				{/* Email */}
				<Form.Group controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" value={userData.email} readOnly />
				</Form.Group>

				{/* Display Name */}
				<Form.Group controlId="displayName">
					<Form.Label>Display Name</Form.Label>
					<Form.Control
						type="text"
						name="displayName"
						value={userData.displayName}
						onChange={handleChange}
					/>
				</Form.Group>

				{/* Bio */}
				<Form.Group controlId="bio">
					<Form.Label>Bio</Form.Label>
					<Form.Control
						as="textarea"
						rows={3}
						name="bio"
						value={userData.bio}
						onChange={handleChange}
					/>
				</Form.Group>

				{/* Profile Picture */}
				<Form.Group controlId="profilePicture">
					<Form.Label>Profile Picture</Form.Label>
					<Form.Control type="file" onChange={handleFileChange} />
				</Form.Group>

				<Button
					variant="secondary"
					onClick={handleUpload}
					disabled={uploading}
					className="mt-2"
				>
					{uploading ? (
						<Spinner animation="border" size="sm" />
					) : (
						"Upload Picture"
					)}
				</Button>

				{userData.photoURL && (
					<div className="mt-3">
						<Image
							src={userData.photoURL}
							alt="Profile"
							rounded
							width="150px"
						/>
					</div>
				)}

				<Button variant="primary" onClick={handleSave} className="mt-3">
					Save Changes
				</Button>
			</Form>
		</Container>
	);
};

export default UserProfile;
