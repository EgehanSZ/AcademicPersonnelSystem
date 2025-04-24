import React from 'react'
import { useState, useEffect } from 'react'
import { createUser, getListings, } from '../../services/api'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../../assets/styles/theme.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './listings.css';
import '../../app.css';
import { data, Link } from 'react-router-dom'


export const Listings = () => {
    const [listings, setListings] = useState([])

    useEffect(() => {
        async function loadListings() {
            let data = await getListings()
            setListings(data)

        }
        loadListings()
    },)
    return (
        <div className='container-wrapper'>
            <Container fluid className="dark container-advertisements" >
                {listings.map((listing) => {
                    return (
                        <Row className="row-advertisements">
                            <Col className="col-advertisements">
                                <Card className="primary card-advetisements">
                                    <Card.Header as="h5">{listing.title}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{listing._id}</Card.Title>
                                        <Card.Text>
                                            <Button as={Link} to={`/ilanlar/${listing._id}`} variant="primary">İlanı İncele</Button>
                                            <Button onClick={() => createUser(userData)}>Post</Button>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )
                }
                )}
            </Container>
        </div>
    )
}
export default Listings
