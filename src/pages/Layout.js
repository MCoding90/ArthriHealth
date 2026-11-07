import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
	return (
		<>
			<Header />
			<Container as="main">
				<Outlet />
			</Container>
			<Footer />
		</>
	);
};

export default Layout;
