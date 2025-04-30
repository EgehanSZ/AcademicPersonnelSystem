import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber } from 'antd';
const { Option } = Select;


export const PersonalInfoStep = () => {
    return (
        <>
            <Form.Item
                name="ad"
                label="Ad"
                rules={[{ required: true, message: 'Lütfen Adınızı Giriniz!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="soyad"
                label="Soyad"
                rules={[{ required: true, message: 'Lütfen Soyadınızı giriniz!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="email"

                label="E-mail"
                rules={[
                    { type: 'email', message: 'Geçersiz e-posta!' },
                    { required: true, message: 'Lütfen e-posta adresinizi giriniz!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="sifre"
                label="Şifre"
                rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="kullaniciId"
                label="TC Kimlik No"
                rules={[
                    { type: '' },
                    { required: true, message: 'Lütfen TC Kimlik Numaranızı giriniz!' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="dogumTarihi"
                label="Doğum Tarihi"
                rules={[{ required: true, message: 'Lütfen Doğum Tarihinizi Seçiniz!' }]}
            >
                <DatePicker />
            </Form.Item>

            <Form.Item
                name="telefon"
                label="Telefon Numarası"
                rules={[
                    {
                        required: true,
                        message: 'Telefon Numaranızı Giriniz!',
                    },
                    {
                        pattern: /^(\+90|0)?5\d{9}$/,
                        message: 'Geçerli bir Türk telefon numarası girin (örn: 05XXXXXXXXX)',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="adres"
                label="Adres"
                rules={[
                    {
                        required: true,
                        message: 'Adres Alanı Boş Bırakılamaz',
                    },
                ]}
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Lütfen Adresinizi Girin"
                />
            </Form.Item>
        </>
    );
};
