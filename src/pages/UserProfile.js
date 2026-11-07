import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { Container, Form, Button, Spinner, Alert, Image } from "react-bootstrap";
import { db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // keep in sync with storage.rules
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const UserProfile = () => {
	const { currentUser } = useAuth();
	const [userData, setUserData] = useState({
		email: currentUser.email || "",
		displayName: currentUser.displayName || "",
		bio: "",
		photoURL: "",
	});
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState(null); // { variant, message }
	const [profilePicture, setProfilePicture] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);

	const userRef = doc(db, "Users", currentUser.uid);

	useEffect(() => {
		let cancelled = false;
		const fetchUserProfile = async () => {
			try {
				const snap = await getDoc(doc(db, "Users", currentUser.uid));
				if (cancelled) return;
				if (snap.exists()) {
					setUserData((prev) => ({ ...prev, ...snap.data() }));
				} else {
					const defaultData = {
						email: currentUser.email,
						displayName: currentUser.displayName || "",
						bio: "",
						photoURL: "",
					};
					await setDoc(doc(db, "Users", currentUser.uid), defaultData);
					if (!cancelled) setUserData(defaultData);
				}
			} catch {
				if (!cancelled) {
					setStatus({ variant: "danger", message: "Error loading user profile." });
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		fetchUserProfile();
		return () => {
			cancelled = true;
		};
	}, [currentUser]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0] || null;
		setStatus(null);
		if (file && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
			setStatus({ variant: "danger", message: "Please choose a JPEG, PNG, WebP or GIF image." });
			e.target.value = "";
			setProfilePicture(null);
			return;
		}
		if (file && file.size > MAX_IMAGE_BYTES) {
			setStatus({ variant: "danger", message: "Image must be 2 MB or smaller." });
			e.target.value = "";
			setProfilePicture(null);
			return;
		}
		setProfilePicture(file);
	};

	const handleUpload = async () => {
		if (!profilePicture) return;
		setUploading(true);
		setStatus(null);
		try {
			const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
			await uploadBytes(storageRef, profilePicture, { contentType: profilePicture.type });
			const downloadUrl = await getDownloadURL(storageRef);
			await setDoc(userRef, { photoURL: downloadUrl }, { merge: true });
			setUserData((prev) => ({ ...prev, photoURL: downloadUrl }));
			setProfilePicture(null);
			setStatus({ variant: "success", message: "Profile picture updated." });
		} catch {
			setStatus({ variant: "danger", message: "Error uploading profile picture." });
		} finally {
			setUploading(false);
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		setStatus(null);
		const displayName = (userData.displayName || "").trim();
		try {
			// Only user-editable fields; email and photoURL are managed elsewhere.
			await setDoc(userRef, { displayName, bio: userData.bio || "" }, { merge: true });
			if (displayName !== (currentUser.displayName || "")) {
				await updateProfile(currentUser, { displayName });
			}
			setStatus({ variant: "success", message: "Profile updated successfully!" });
		} catch {
			setStatus({ variant: "danger", message: "Error saving profile." });
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <Spinner animation="border" role="status" className="m-4" />;

	return (
		<Container className="my-4" style={{ maxWidth: "40rem" }}>
			<h2>My Profile</h2>
			{status && <Alert variant={status.variant}>{status.message}</Alert>}
			{userData.photoURL && (
				<Image
					src={userData.photoURL}
					alt="Profile"
					roundedCircle
					width={120}
					height={120}
					className="mb-3"
					style={{ objectFit: "cover" }}
				/>
			)}
			<Form onSubmit={handleSave}>
				<Form.Group controlId="email" className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" value={userData.email || ""} readOnly plaintext />
				</Form.Group>
				<Form.Group controlId="displayName" className="mb-3">
					<Form.Label>Display Name</Form.Label>
					<Form.Control
						type="text"
						name="displayName"
						maxLength={100}
						value={userData.displayName || ""}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group controlId="bio" className="mb-3">
					<Form.Label>Bio</Form.Label>
					<Form.Control
						as="textarea"
						rows={3}
						name="bio"
						maxLength={1000}
						value={userData.bio || ""}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group controlId="profilePicture" className="mb-2">
					<Form.Label>Profile Picture</Form.Label>
					<Form.Control
						type="file"
						accept={ALLOWED_IMAGE_TYPES.join(",")}
						onChange={handleFileChange}
					/>
				</Form.Group>
				<Button
					variant="secondary"
					onClick={handleUpload}
					disabled={uploading || !profilePicture}
					className="mb-4"
				>
					{uploading ? <Spinner animation="border" size="sm" /> : "Upload Picture"}
				</Button>
				<div>
					<Button variant="primary" type="submit" disabled={saving}>
						{saving ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</Form>
		</Container>
	);
};

export default UserProfile;
