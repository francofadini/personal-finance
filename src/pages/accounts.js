import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import AccountList from '@/components/AccountList';
import AddAccountButton from '@/components/AddAccountButton';
import { Spin, Result, message, Button } from 'antd';
import { fetchAccounts, createAccount, deleteAccount, syncAccount, finalizeAccount } from '@/services/accountService';
import { useTranslation } from 'react-i18next';
import MobileHeader from '@/components/MobileHeader';

const AccountsPage = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [linkStatus, setLinkStatus] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (router.query.ref && router.query.institutionId) {
      handleCallback(router.query.ref, router.query.institutionId);
    } else {
      loadAccounts();
    }
  }, [router.query]);

  const handleCallback = async (ref, institutionId) => {
    try {
      setLinkStatus('processing');
      const { savedAccounts, availableAccounts } = await finalizeAccount(ref, institutionId);
      if (availableAccounts.length === 0) {
        message.warning('No accounts were found');
        setLinkStatus(null);
        return;
      }
      if (savedAccounts.length !== availableAccounts.length) {
        if (savedAccounts.length === 0) {
          message.warning(`None of the ${availableAccounts.length} accounts could be linked`);
          setLinkStatus(null);
          return;
        }
        message.warning(`${availableAccounts.length - savedAccounts.length} out of ${availableAccounts.length} accounts were not linked`);
      }
      setLinkStatus('success');
      await loadAccounts();
      router.replace('/', undefined, { shallow: true });
    } catch (error) {
      console.error('Account linking failed:', error);
      setLinkStatus('error');
    }
  };

  const loadAccounts = async () => {
    try {
      const fetchedAccounts = await fetchAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      message.error('Error loading accounts');
    }
  };

  const handleAddAccount = async (institutionId) => {
    try {
      return await createAccount(institutionId);
    } catch (error) {
      message.error('Error adding account');
      throw error;
    }
  };
  
  const handleDeleteAccount = async (accountId) => {
    try {
      await Modal.confirm({
        title: t('accounts.deleteConfirm.title'),
        content: t('accounts.deleteConfirm.content'),
        okText: t('common.delete'),
        okType: 'danger',
        cancelText: t('common.cancel'),
        onOk: async () => {
          await deleteAccount(accountId);
          message.success(t('accounts.deleteSuccess'));
          loadAccounts();
        },
      });
    } catch (error) {
      console.error('Error deleting account', error);
      message.error(t('accounts.deleteError'));  
    }
  };

  const handleSyncAccount = async (accountId) => {
    try {
      await syncAccount(accountId);
      message.success('Account synced successfully');
      loadAccounts();
    } catch (error) {
      message.error('Error syncing account');
    }
  };

  if (linkStatus === 'processing') {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" tip="Linking your account..." />
        </div>
      </Layout>
    );
  }

  if (linkStatus === 'success') {
    return (
      <Layout>
        <Result
          status="success"
          title="Account successfully linked!"
          extra={[
            <Button type="primary" key="console" onClick={() => setLinkStatus(null)}>
              View Accounts
            </Button>,
          ]}
        />
      </Layout>
    );
  }

  if (linkStatus === 'error') {
    return (
      <Layout>
        <Result
          status="error"
          title="Failed to link account"
          subTitle="Please try again or contact support if the problem persists."
          extra={[
            <Button type="primary" key="console" onClick={() => setLinkStatus(null)}>
              Try Again
            </Button>,
          ]}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <MobileHeader
        title={t('accounts.title')}
        onBack={() => router.push('/')}
        action={<AddAccountButton onAccountAdded={handleAddAccount} />}
      />
      <AccountList
        accounts={accounts}
        onDeleteAccount={handleDeleteAccount}
        onSyncAccount={handleSyncAccount}
      />
    </Layout>
  );
};

export default AccountsPage;