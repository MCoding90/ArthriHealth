import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../utils/authErrors";

const VerifyEmailPage = () => {
	const { currentUser, resendVerification, refreshUser, logout } = useAuth();
	const navigate = useNavigate();
	const [status, setStatus] = useState(null); // { variant, message }
	const [busy, setBusy] = useState(false);

	if (!currentUser) return <Navigate to="/login" replace />;
	if (currentUser.emailVerified) return <Navigate to="/userpage" replace />;

	const run = async (fn) => {
		setBusy(true);
		setStatus(null);
		try {
			await fn();
		} catch (error) {
			setStatus({ variant: "danger", message: getAuthErrorMessage(error) });
		} finally {
			setBusy(false);
		}
	};

	const handleResend = () =>
		run(async () => {
			await resendVerification();
			setStatus({ variant: "success", message: "Verification email sent." });
		});

	const handleContinue = () =>
		run(async () => {
			const user = await refreshUser();
			if (user?.emailVerified) {
				navigate("/userpage", { replace: true });
			} else {
				setStatus({
					variant: "warning",
					message: "Your email isn't verified yet. Check your inbox (and spam folder).",
				});
			}
		});

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "75vh" }}
		>
			<Card className="w-100" style={{ maxWidth: "28rem" }}>
				<Card.Header as="h5">Verify your email</Card.Header>
				<Card.Body>
					<p>
						We sent a verification link to <strong>{currentUser.email}</strong>.
						Click the link, then continue below.
					</p>
					{status && <Alert variant={status.variant}>{status.message}</Alert>}
					<div className="d-flex flex-wrap gap-2">
						<Button onClick={handleContinue} disabled={busy}>
							I've verified my email
						</Button>
						<Button variant="outline-secondary" onClick={handleResend} disabled={busy}>
							Resend email
						</Button>
						<Button variant="link" onClick={() => run(logout)} disabled={busy}>
							Sign out
						</Button>
					</div>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default VerifyEmailPage;
