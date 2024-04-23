import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../useAuth";
import "../Header.css";

const Header = () => {
	const location = useLocation();
	const { logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			// Optionally, redirect to a specific page after logging out
		} catch (error) {
			console.error("Logout Error:", error);
			// Handle errors, possibly display a notification
		}
	};

	return (
		<Navbar expand="md" className="custom-navbar">
			<Container>
				<Navbar.Brand as={Link} to="/" className="navbar-brand">
					ArthriHealth
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ms-auto">
						{[
							{ path: "/symptom-tracker", label: "Symptom Tracker" },
							{ path: "/medication-page", label: "Medication Reminder" },
							{ path: "/health-tips", label: "Tips" },
						].map((link) => (
							<Nav.Link
								key={link.path}
								as={Link}
								to={link.path}
								className={location.pathname === link.path ? "active" : ""}
							>
								{link.label}
							</Nav.Link>
						))}
						<NavDropdown
							title="Account"
							id="collasible-nav-dropdown"
							className={
								location.pathname.match(/\/login|\/signup/) ? "active" : ""
							}
						>
							<NavDropdown.Item
								as={Link}
								to="/login"
								className={location.pathname === "/login" ? "active" : ""}
							>
								Login
							</NavDropdown.Item>
							<NavDropdown.Item
								as={Link}
								to="/signup"
								className={location.pathname === "/signup" ? "active" : ""}
							>
								Signup
							</NavDropdown.Item>
							<NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
