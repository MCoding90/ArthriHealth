import React from "react";
import { Container } from "react-bootstrap";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
	return (
		<>
			<Header />
			<Container>{children}</Container>
			<Footer />
		</>
	);
};

export default Layout;
