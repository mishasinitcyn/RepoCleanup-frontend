// src/context/MyContext.tsx
"use client"; // Add this directive at the top

import { createContext, useContext, ReactNode, useState } from 'react';

interface MyContextProps {
  value: string | null;
  setValue: (value: string | null) => void;
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
