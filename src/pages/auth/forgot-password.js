import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Link from 'next/link';

const StyledCard = styled(Card)`
  max-width: 400px;
  margin: 100px auto;
`;

const ForgotPasswordPage = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
      } else {
        const data = await response.json();
        message.error(data.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      message.error('Error al procesar la solicitud');
    }
  };

  return (
    <StyledCard title="Recuperar Contraseña">
      <Form name="forgotPassword" onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: 'Por favor ingresa tu email' }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Enviar Instrucciones
          </Button>
        </Form.Item>
        <Form.Item>
          <Link href="/auth/login">Volver al inicio de sesión</Link>
        </Form.Item>
      </Form>
    </StyledCard>
  );
};

export default ForgotPasswordPage;
