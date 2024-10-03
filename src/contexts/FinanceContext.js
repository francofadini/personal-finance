import React, { createContext, useContext, useState } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);

  const value = {
    balance,
    setBalance,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
