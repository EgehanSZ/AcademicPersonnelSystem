import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './header.css'
import logo from '../../assets/images/logorgb.png'
import '../../assets/styles/theme.css';
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';

export const Header = () => {
    const [show, setShow] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();
    const [rol, setRol] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);

        if (storedToken) {
            const decoded = jwtDecode(storedToken);
            setRol(decoded?.rol); // Rolü state'e al
            const expirationTime = decoded.exp * 1000;
            const currentTime = Date.now();

            if (expirationTime < currentTime) {
                message.error('Token süresi dolmuş! Lütfen tekrar giriş yapın.');
                const timer = setTimeout(() => {
                    localStorage.removeItem('token');
                    setToken(null);
                    navigate('/login-route');
                }, 5000);
                return () => clearTimeout(timer);
            } else {
                const timeout = expirationTime - currentTime;
                const timer = setTimeout(() => {
                    message.error('Token süresi dolmuş! Lütfen tekrar giriş yapın.');
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        setToken(null);
                        navigate('/login-route');
                    }, 5000);
                }, timeout);
                return () => clearTimeout(timer);
            }
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        message.success('Başarıyla çıkış yaptınız!');
        window.location.reload();
    }

    return (
        <Navbar expand="sm" sticky='top' className="danger">
            <Container fluid>
                <Navbar.Brand as={Link} to={rol === 'juri' ? '/jurypanel' : '/'}><img className='header-logo' src={logo} alt="logo" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                        {
                            rol === 'juri' ? (
                                <>
                                    <Nav.Link as={Link} to="/jurypanel" className='text-white'>
                                        Başvuru Değerlendirme
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/contact" className='text-white'>
                                        İletişim
                                    </Nav.Link>
                                </>
                            ) : (
                                <>  
                                    <Nav.Link as={Link} to="/" className='text-white'>
                                        Tüm İlanlar
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/applications" className='text-white'>
                                        Başvurularım
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/contact" className='text-white'>
                                        İletişim
                                    </Nav.Link>
                                </>
                            )
                        }
                    </Nav>
                    {
                        token ? (
                            <NavDropdown
                                title={<FaUserCircle size={40} className="text-white" />}
                                id="profile-dropdown"
                                show={show}
                                onToggle={(isOpen) => setShow(isOpen)}
                                align="end"
                            >
                                <NavDropdown.Item as={Link} to="/accountsettings">
                                    Profilim
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>
                                    Çıkış Yap
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Form className="d-flex ">
                                <Button className='succes secondary' as={Link} to='/login-route'>Giriş / Kayıt Ol</Button>
                            </Form>
                        )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
