'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLogin } from '@/context/LoginContext';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLogin();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const doAuth = async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed');
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const data = await doAuth('/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        toast.success(data.message);
        login(data.user);
        router.push('/');
      } else {
        // Registration flow
        const data = await doAuth('/api/auth/register', {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        toast.success(data.message);
        setMode('login');
        setForm({
          username: '',
          email: form.email,
          password: '',
        });
        
        toast.success('Registration successful! Please log in.');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {mode === 'login' ? 'Log In' : 'Register'}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            name="username"
            className={styles.input}
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          className={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className={styles.input}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.submitButton}>
          {mode === 'login' ? 'Log In' : 'Register'}
        </button>
      </form>

      <div className={styles.toggle}>
        {mode === 'login' ? (
          <>
            Don't have an account?
            <button onClick={() => setMode('register')}>Register</button>
          </>
        ) : (
          <>
            Already have an account?
            <button onClick={() => setMode('login')}>Log In</button>
          </>
        )}
      </div>
    </div>
  );
}