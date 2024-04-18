import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const customNavbarStyle = {
	backgroundColor: "rgba(0, 128, 128, 0.7)",
	color: "white",
};

const Header = () => {
	return (
		<Navbar style={customNavbarStyle} expand="md">
			<Container>
				<Navbar.Brand as={Link} to="/" style={{ color: "white" }}>
					RA Web App
				</Navbar.Brand>
				<Navbar.Toggle
					aria-controls="responsive-navbar-nav"
					style={{ color: "white" }}
				/>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto">
						<Nav.Link
							as={Link}
							to="/symptom-tracker"
							style={{ color: "white" }}
						>
							Symptom Tracker
						</Nav.Link>
						<Nav.Link
							as={Link}
							to="/medication-page"
							style={{ color: "white" }}
						>
							Medication Reminder
						</Nav.Link>
						<Nav.Link as={Link} to="/health-tips" style={{ color: "white" }}>
							Tips
						</Nav.Link>
						<Nav.Link as={Link} to="/social-media" style={{ color: "white" }}>
							Social Media
						</Nav.Link>
						<Nav.Link as={Link} to="/login" style={{ color: "white" }}>
							Login
						</Nav.Link>
						<Nav.Link as={Link} to="/signup" style={{ color: "white" }}>
							Signup
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
