//login.js
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      // ✅ Save token & username
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);

      setMessage(`${res.data.message} (Welcome ${res.data.username})`);
      setFailedAttempts(0);

      // ✅ Navigate to /home
      window.location.href = '/home';
    } catch (err) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setMessage('❌ Login failed, invalid credentials.');

      if (newAttempts >= 3) {
        setIsLocked(true);
      }
    }
  };

  useEffect(() => {
    let timer;
    if (isLocked) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsLocked(false);
            setCooldown(30);
            setFailedAttempts(0);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked]);

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            disabled={isLocked}
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            disabled={isLocked}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={isLocked}
            style={{
              ...styles.button,
              transform: isPressed ? 'scale(0.95)' : 'scale(1)',
              backgroundColor: isPressed ? '#3a78c2' : '#4a90e2',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
          >
            Login
          </button>
        </form>
        <p
          style={{
            ...styles.message,
            color: message.startsWith('❌') ? 'red' : 'green',
          }}
        >
          {message}
        </p>
        {isLocked && (
          <p style={styles.lockMessage}>
            ⏳ Too many failed attempts. Please wait {cooldown} seconds.
          </p>
        )}
        <p style={styles.forgotPassword}>
          <a href="/forgot-password" style={styles.link}>
            Forgot Password?
          </a>
        </p>
        <p style={styles.forgotPassword}>
  Not a user?{' '}
  <a href="/register" style={styles.link}>
    Register here
  </a>
</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f4f7',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
  },
  formBox: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: 320,
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  heading: {
    marginBottom: 24,
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '12px 16px',
    fontSize: 16,
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  message: {
    marginTop: 16,
    minHeight: 24,
    fontWeight: '600',
  },
  lockMessage: {
    marginTop: 12,
    color: '#ff6600',
    fontWeight: '500',
  },
  forgotPassword: {
    marginTop: 20,
  },
  link: {
    color: '#4a90e2',
    textDecoration: 'none',
  },
};12