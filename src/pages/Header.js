import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChartLine,
	faCapsules,
	faLightbulb,
	faHouseMedical,
	faSignInAlt,
	faSignOutAlt,
	faUserPlus,
	faUserCircle,
	faGaugeHigh,
	faIdCard,
} from "@fortawesome/free-solid-svg-icons";

const links = [
	{ path: "/symptom-tracker", label: "Symptom Tracker", icon: faChartLine },
	{ path: "/medication-page", label: "Medication Reminder", icon: faCapsules },
	{ path: "/health-tips", label: "Tips", icon: faLightbulb },
];

const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/", { replace: true });
		} catch {
			navigate("/logout"); // Logout page shows the error and lets the user retry.
		}
	};

	return (
		<Navbar expand="md" className="custom-navbar">
			<Container>
				<Navbar.Brand as={Link} to="/" className="navbar-brand">
					<FontAwesomeIcon icon={faHouseMedical} className="icon-style" />
					<span className="title-style">ArthriHealth</span>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ms-auto">
						{links.map((link) => (
							<Nav.Link
								key={link.path}
								as={Link}
								to={link.path}
								className={location.pathname === link.path ? "active" : ""}
							>
								<FontAwesomeIcon icon={link.icon} className="fa-icon" />
								{link.label}
							</Nav.Link>
						))}
						<NavDropdown
							title={
								<span>
									<FontAwesomeIcon icon={faUserCircle} className="fa-icon" />{" "}
									Account
								</span>
							}
							id="collasible-nav-dropdown"
						>
							{!currentUser && (
								<>
									<NavDropdown.Item
										as={Link}
										to="/login"
										className={location.pathname === "/login" ? "active" : ""}
									>
										<FontAwesomeIcon
											icon={faSignInAlt}
											className="dropdown-icon"
										/>
										Login
									</NavDropdown.Item>
									<NavDropdown.Item
										as={Link}
										to="/signup"
										className={location.pathname === "/signup" ? "active" : ""}
									>
										<FontAwesomeIcon
											icon={faUserPlus}
											className="dropdown-icon"
										/>
										Signup
									</NavDropdown.Item>
								</>
							)}
							{currentUser && (
								<>
									<NavDropdown.Item
										as={Link}
										to="/userpage"
										active={location.pathname === "/userpage"}
									>
										<FontAwesomeIcon icon={faGaugeHigh} className="dropdown-icon" />
										Dashboard
									</NavDropdown.Item>
									<NavDropdown.Item
										as={Link}
										to="/profile"
										active={location.pathname === "/profile"}
									>
										<FontAwesomeIcon icon={faIdCard} className="dropdown-icon" />
										Profile
									</NavDropdown.Item>
									<NavDropdown.Divider />
								<NavDropdown.Item onClick={handleLogout}>
									<FontAwesomeIcon
										icon={faSignOutAlt}
										className="dropdown-icon"
									/>
									Logout
								</NavDropdown.Item>
								</>
							)}
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
