import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';

const StyledCard = styled(Card)`
  max-width: 400px;
  margin: 100px auto;
`;

const RegisterPage = () => {
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Registro exitoso. Por favor, inicia sesión.');
        router.push('/auth/login');
      } else {
        const data = await response.json();
        message.error(data.message || 'Error en el registro');
      }
    } catch (error) {
      message.error('Error en el registro');
    }
  };

  return (
    <StyledCard title="Registrarse">
      <Form name="register" onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}>
          <Input prefix={<UserOutlined />} placeholder="Nombre" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: 'Por favor ingresa tu email' }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Registrarse
          </Button>
        </Form.Item>
        <Form.Item>
          <Link href="/auth/login">Ya tengo una cuenta</Link>
        </Form.Item>
      </Form>
    </StyledCard>
  );
};

export default RegisterPage;
