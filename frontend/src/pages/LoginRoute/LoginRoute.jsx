import React from 'react';
import { Button, Card } from 'react-bootstrap';
import './loginRoute.css';
import '../../assets/styles/theme.css';
import { Link } from "react-router-dom";


export const LoginRoute = () => {
    return (
        <div className="login-container">
            <Card className="login-card">
                <h2 className="login-title">Giriş Türünü Seçiniz</h2>
                <div className="button-group">
                    <Link to={"/login?rol=aday"} className='btn danger'>
                        Aday
                    </Link>
                    <Link to={"/login?rol=yönetici"} className='btn danger'>
                        Yönetici
                    </Link>
                    <Link to={"/login?rol=admin"} className='btn danger'>
                        Admin
                    </Link>
                    <Link to={"/login?rol=jüri"} className='btn danger'>
                        Jüri
                    </Link>

                </div>
            </Card>
        </div>
    );
};