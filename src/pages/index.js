import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AccountList from '@/components/AccountList';
import AddAccountButton from '@/components/AddAccountButton';
import { fetchAccounts, createAccount, deleteAccount, syncAccount } from '@/services/accountService';
import { message } from 'antd';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const fetchedAccounts = await fetchAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      message.error('Error al cargar las cuentas');
    }
  };

  const handleAddAccount = async (institutionId) => {
    try {
      await createAccount(institutionId);
      message.success('Cuenta agregada exitosamente');
      loadAccounts();
    } catch (error) {
      message.error('Error al agregar la cuenta');
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await deleteAccount(accountId);
      message.success('Cuenta eliminada exitosamente');
      loadAccounts();
    } catch (error) {
      message.error('Error al eliminar la cuenta');
    }
  };

  const handleSyncAccount = async (accountId) => {
    try {
      await syncAccount(accountId);
      message.success('Cuenta sincronizada exitosamente');
      loadAccounts();
    } catch (error) {
      message.error('Error al sincronizar la cuenta');
    }
  };

  return (
    <Layout>
      <h1>Mis Cuentas</h1>
      <AccountList
        accounts={accounts}
        onDeleteAccount={handleDeleteAccount}
        onSyncAccount={handleSyncAccount}
      />
      <AddAccountButton onAccountAdded={handleAddAccount} />
    </Layout>
  );
};

export default AccountsPage;