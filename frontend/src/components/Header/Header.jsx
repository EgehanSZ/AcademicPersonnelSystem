import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react'
import './header.css'
import logo from '../../assets/images/logorgb.png'
import '../../assets/styles/theme.css';
import { Link } from 'react-router-dom'



export const Header = () => {
    return (
        <Navbar expand="sm" sticky='top' className="danger">
            <Container fluid>
                <Navbar.Brand as={Link} to="/"><img className='header-logo' src={logo} alt="logo" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        navbarScroll
                    >
                        <NavDropdown title="Tüm İlanlar" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3">
                                Dr.Öğr.Üyesi
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action4">
                                Doçent
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action5">
                                Prof
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/application/:id">
                            Başvurular
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contact">
                            İletişim
                        </Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Button className='succes' as={Link} to='/login-route'>GİRİŞ</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Header