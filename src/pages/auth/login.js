import React from 'react';
import { Form, Input, Button, Card, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const StyledCard = styled(Card)`
  max-width: 400px;
  margin: 100px auto;
`;

const LoginPage = () => {
  const router = useRouter();

  const onFinish = async (values) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      message.error(result.error);
    } else {
      router.push('/');
    }
  };

  return (
    <StyledCard title="Iniciar Sesión">
      <Form name="login" onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: 'Por favor ingresa tu email' }]}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Iniciar Sesión
          </Button>
        </Form.Item>
        <Form.Item>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Link href="/auth/register">Registrarse</Link>
            <Link href="/auth/forgot-password">Olvidé mi contraseña</Link>
          </Space>
        </Form.Item>
      </Form>
    </StyledCard>
  );
};

export default LoginPage;
