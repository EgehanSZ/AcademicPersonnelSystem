import React from 'react';
import './login.css';
import '../../assets/styles/theme.css';
import { Link } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { createUser } from '../../services/api';
import { UsersTable } from '../../components/UsersTable/usersTable';



export const Login = () => {

    const [form] = Form.useForm();

    const onFinish = async values => {
        const userData = {
            kullaniciId: values.username,
            sifre: values.password,
            rol: 'admin'
        };

        const response = await createUser(userData)
        if (response.status === 201) {
            message.success('Kullanıcı Oluşturuldu')
        } else if (response.status === 400) {
            message.error('Bu Kullanıcı Zaten Kayıtlı', 5)
            form.resetFields();

        } else if (response.status === 500) {
            message.success('Suncu hatası')
            form.resetFields();

        }
        else {
            message.error('Sunucu Hatası')
        }
    };

    return (
        <div>
            <Form
                form={form}
                name="login"
                initialValues={{ remember: true }}
                style={{ maxWidth: 360 }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your ID' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="ID" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a href="">Forgot password</a>
                    </Flex>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" >
                        Log in
                    </Button>
                    or <a href="">Register now!</a>
                </Form.Item>
            </Form>
            <UsersTable></UsersTable>

        </div>
    )
}

