'use client';
import { useEffect, useState } from 'react';
import styles from './UserList.module.css';
import { useLogin } from '@/context/LoginContext';

export default function UserList({ onView, onAdd, hiddenUserIds = [] }) {
  const [users, setUsers] = useState([]);
  const { user } = useLogin();

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();

        if (res.ok) {
          const filtered = data.filter((u) =>
            u._id !== user._id && !hiddenUserIds.includes(u._id)
          );
          setUsers(filtered);
        } else {
          alert(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Something went wrong');
      }
    };

    fetchUsers();
  }, [user, hiddenUserIds]);

  return (
    <div className={styles.container}>
      {users.map((u) => (
        <div key={u._id} className={styles.user}>
          <span>{u.username}</span>
          <div className={styles.buttons}>
            <button onClick={() => onView(u)}>View</button>
            <button onClick={() => onAdd(u)}>Add</button>
          </div>
        </div>
      ))}
    </div>
  );
}
