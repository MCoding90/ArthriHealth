import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<Container fluid as="footer" className="bg-light">
			<Row>
				<Col className="text-center py-3">© {currentYear} ArthriHealth.</Col>
			</Row>
		</Container>
	);
};

export default Footer;
