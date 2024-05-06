import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import {
	Container,
	Form,
	Button,
	Spinner,
	Alert,
	Image,
} from "react-bootstrap";

const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

const UserProfile = () => {
	const [userData, setUserData] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		const fetchUserProfile = async () => {
			const user = auth.currentUser;
			if (user) {
				try {
					const userDoc = await getDoc(doc(db, "Users", user.uid));
					if (userDoc.exists()) {
						setUserData(userDoc.data());
					} else {
						const defaultData = {
							email: user.email,
							displayName: user.displayName || "",
							bio: "",
							photoURL: "",
						};
						await setDoc(doc(db, "Users", user.uid), defaultData);
						setUserData(defaultData);
					}
				} catch (err) {
					setError("Error loading user profile.");
				}
			}
			setLoading(false);
		};

		fetchUserProfile();
	}, []);

	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		setProfilePicture(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!profilePicture) return;
		const user = auth.currentUser;

		setUploading(true);

		try {
			const storageRef = ref(storage, `profile-pictures/${user.uid}`);
			await uploadBytes(storageRef, profilePicture);

			const downloadUrl = await getDownloadURL(storageRef);
			await setDoc(
				doc(db, "Users", user.uid),
				{ photoURL: downloadUrl },
				{ merge: true }
			);

			setUserData((prev) => ({ ...prev, photoURL: downloadUrl }));
			setUploading(false);
		} catch (err) {
			setError("Error uploading profile picture.");
			setUploading(false);
		}
	};

	const handleSave = async () => {
		const user = auth.currentUser;
		if (user) {
			try {
				await setDoc(doc(db, "Users", user.uid), userData, { merge: true });
				alert("Profile updated successfully!");
			} catch (err) {
				setError("Error saving profile.");
			}
		}
	};

	if (loading) return <Spinner animation="border" />;

	return (
		<Container>
			<h2>My Profile</h2>
			{error && <Alert variant="danger">{error}</Alert>}
			<Form>
				<Form.Group controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						value={userData.email}
						readOnly
						aria-label="User email address"
					/>
				</Form.Group>
				<Form.Group controlId="displayName">
					<Form.Label>Display Name</Form.Label>
					<Form.Control
						type="text"
						name="displayName"
						value={userData.displayName || ""}
						onChange={handleChange}
						aria-label="User display name"
					/>
				</Form.Group>
				<Form.Group controlId="bio">
					<Form.Label>Bio</Form.Label>
					<Form.Control
						as="textarea"
						rows={3}
						name="bio"
						value={userData.bio || ""}
						onChange={handleChange}
						aria-label="User bio"
					/>
				</Form.Group>
				<Form.Group controlId="profilePicture">
					<Form.Label>Profile Picture</Form.Label>
					<Form.Control
						type="file"
						name="profilePicture"
						onChange={handleFileChange}
						aria-label="Upload profile picture"
					/>
				</Form.Group>
				<Button variant="secondary" onClick={handleUpload} disabled={uploading}>
					{uploading ? (
						<Spinner animation="border" size="sm" />
					) : (
						"Upload Picture"
					)}
				</Button>
				{userData.photoURL && (
					<Image src={userData.photoURL} alt="Profile" rounded width="150px" />
				)}
				<br />
				<Button variant="primary" onClick={handleSave}>
					Save Changes
				</Button>
			</Form>
		</Container>
	);
};

export default UserProfile;
