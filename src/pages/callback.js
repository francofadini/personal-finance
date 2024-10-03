import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin, Result, Button } from 'antd';

const CallbackPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleCallback = async () => {
      if (!router.query.ref) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/gocardless/requisitions-finalize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ref: router.query.ref }),
        });

        if (!response.ok) {
          throw new Error('Failed to finalize requisition');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setStatus('success');
        } else {
          throw new Error('Requisition finalization failed');
        }
      } catch (error) {
        console.error('Error finalizing requisition:', error);
        setStatus('error');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query.ref]);

  if (status === 'processing') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Processing your request..." />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <Result
        status="success"
        title="Account successfully linked!"
        extra={[
          <Button type="primary" key="console" onClick={() => router.push('/')}>
            Go to Dashboard
          </Button>,
        ]}
      />
    );
  }

  return (
    <Result
      status="error"
      title="Failed to link account"
      subTitle="Please try again or contact support if the problem persists."
      extra={[
        <Button type="primary" key="console" onClick={() => router.push('/')}>
          Go to Dashboard
        </Button>,
      ]}
    />
  );
};

export default CallbackPage;
