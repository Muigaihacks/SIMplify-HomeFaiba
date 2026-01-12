import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // For demo purposes, we'll use localStorage or default values
  const [dealerId, setDealerId] = useState<number>(() => {
    const stored = localStorage.getItem('dealerId');
    return stored ? parseInt(stored, 10) : 1;
  });

  const [agentId, setAgentId] = useState<number | null>(() => {
    const stored = localStorage.getItem('agentId');
    return stored ? parseInt(stored, 10) : null;
  });

  const [userRole, setUserRole] = useState<'dealer' | 'agent'>(() => {
    const stored = localStorage.getItem('userRole');
    return (stored as 'dealer' | 'agent') || 'dealer';
  });

  const handleSetDealerId = (id: number) => {
    setDealerId(id);
    localStorage.setItem('dealerId', id.toString());
  };

  const handleSetAgentId = (id: number | null) => {
    setAgentId(id);
    if (id) {
      localStorage.setItem('agentId', id.toString());
    } else {
      localStorage.removeItem('agentId');
    }
  };

  const handleSetUserRole = (role: 'dealer' | 'agent') => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  return (
    <AppContext.Provider
      value={{
        dealerId,
        agentId,
        userRole,
        setDealerId: handleSetDealerId,
        setAgentId: handleSetAgentId,
        setUserRole: handleSetUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
