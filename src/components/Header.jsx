'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { useLogin } from '@/context/LoginContext';

export default function Header() {
  const { logout, user } = useLogin();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.title}>APP</div>
      {user && (
        <div className={styles.userMenu} ref={menuRef}>
          <div className={styles.title}>Hello {user.username}</div>
          <img
            src="/default-avatar.png"
            className={styles.avatar}
            onClick={() => setOpen(!open)}
            alt="Avatar"
          />
          {open && (
            <div className={styles.dropdown}>
              <div
                className={styles.menuItem}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Edit Profile
              </div>
              <div
                className={styles.menuItem}
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
