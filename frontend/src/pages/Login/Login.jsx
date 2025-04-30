import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { loginUser } from '../../services/userApi'
import { useLocation } from 'react-router-dom';
import '../../assets/styles/theme.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css'

export const Login = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const rol = params.get('rol');
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const userData = {
            kullaniciId: values.kullaniciId,
            sifre: values.sifre
        }
        try {
            const response = await loginUser(userData)
            if (response.status === 200) {
                message.success('Giriş Başarılı');
                localStorage.setItem('token', response.data.token)
                const decodedToken = jwtDecode(response.data.token);
                const userRole = decodedToken.rol;
                setTimeout(() => {
                    if (userRole === 'admin') {
                        navigate('/adminpanel');
                    } else if (userRole === 'yönetici') {
                        navigate('/manager/dashboard');
                    } else if (userRole === 'jüri') {
                        navigate('/jurypanel');
                    } else if (userRole === 'aday') {
                        navigate('/ilanlar'); // Aday rolü için ilanlar sayfasına yönlendir
                    } else {
                        navigate('/'); // Bilinmeyen rol olursa ana sayfaya
                    }
                }, 1000);



            }
            else if (response.status === 404) {
                message.error('Kullanıcı Bulunamadı')
            }
            else if (response.status === 401) {
                message.error('Şifre Hatalı')
            }
            else if (response.status === 500) {
                message.error('Sunucu Hatası')
            }
            else {
                message.error('Giriş Başarısız')
            }

        } catch (error) {

        }
    };
    return (
        <div className="ant-form login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className='alogin-container'>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="kullaniciId"
                        rules={[{ required: true, message: "'Lütfen TC'nizi giriniz.'" }]}
                    >
                        <Input size='large' prefix={<UserOutlined />} placeholder="TC Kimlik Numarası" />
                    </Form.Item>
                    <Form.Item
                        name="sifre"
                        rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
                    >
                        <Input size='large' prefix={<LockOutlined />} type="password" placeholder="Şifre" />
                    </Form.Item>
                    <Form.Item>
                        {rol !== 'admin' && rol !== 'yönetici' && rol !== 'jüri' && (
                            <Flex justify="space-between" align="center">
                                <a href="" className="forgot-password">Şifremi Unuttum..</a>
                            </Flex>
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit" className="login-form-button">
                            Giriş Yap
                        </Button>

                        {rol === 'aday' && (
                            <div className='mt-3 signup-link'>veya <Link to={'/applicantsignup'}>Kaydol</Link></div>
                        )}
                    </Form.Item>
                </Form>
            </div>

        </div>


    );
};
