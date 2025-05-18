'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginContext = createContext();

export function LoginProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('chatAppUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Invalid stored user data:', e);
        logout(); // fallback
      }
    } else {
      // If user not found, redirect to login
      router.push('/login');
    }
  }, []);

  function login(userData) {
    localStorage.setItem('chatAppUser', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('chatAppUser');
    setUser(null);
    router.push('/login');
  }

  return (
    <LoginContext.Provider value={{ user, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const ctx = useContext(LoginContext);
  if (!ctx) {
    throw new Error('useLogin must be used within a <LoginProvider>');
  }
  return ctx;
}
