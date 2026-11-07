import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const NotFoundPage = () => (
	<div className="text-center my-5">
		<h1>Page not found</h1>
		<p className="text-muted">The page you're looking for doesn't exist.</p>
		<Button as={Link} to="/">
			Back to home
		</Button>
	</div>
);

export default NotFoundPage;
