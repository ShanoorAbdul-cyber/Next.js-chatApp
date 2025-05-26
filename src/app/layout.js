'use client';

import Header from '@/components/Header';
import { LoginProvider } from '@/context/LoginContext';
import ToastProvider from '@/components/ToastProvider';
import '../styles/globals.css';
import styles from './layout.module.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.container}>
        <LoginProvider>
          <ToastProvider />
          <Header />
          <main className={styles.main}>
            {children}
          </main>
          {/* <footer className={styles.footer}>
            <p>&copy; 2023 Chat App. All rights reserved.</p>
          </footer> */}
        </LoginProvider>
      </body>
    </html>
  );
}