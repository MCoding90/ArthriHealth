import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
	<Container fluid as="footer" className="bg-light">
		<Row>
			<Col className="text-center py-3">© 2024 ArthriHealth</Col>
		</Row>
	</Container>
);

export default Footer;
