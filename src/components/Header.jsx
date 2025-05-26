'use client';

import styles from './Header.module.css';
import { useLogin } from '@/context/LoginContext';

export default function Header() {
  const { logout, user } = useLogin();

  return (
    <header className={styles.header}>
      <div className={styles.title}>APP</div>
      {user && <div className={styles.userMenu}>
       <div className={styles.title}>Hello {user.username}</div>
        <img src={ '/default-avatar.png'} className={styles.avatar} />
        <div className={styles.dropdown}>
          <div className={styles.menuItem} onClick={() => {/* go to /profile */ }}>
            Edit Profile
          </div>
          <div className={styles.menuItem} onClick={logout}>
            Logout
          </div>
        </div>
      </div>}
    </header>
  );
}

