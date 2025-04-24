import React from 'react'
import { useState, useEffect } from 'react'
// import { getListing } from '../../api'

import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../assets/styles/theme.css';



export const CardListing = () => {
    const [listing, setListing] = useState({})
    let params = useParams()
    let id = params.id

    useEffect(() => {
        async function loadListings() {
            let data = await getListing(id)
            setAdvertisements(data)
        }
        loadListings()

    }, [id])

    return (
        <div className='dark card-advertisements'>
            <p>
                {advertisement.title}
            </p>
        </div>
    )
}
