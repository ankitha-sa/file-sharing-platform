import { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const hasSpaces = /\s/;
    if (hasSpaces.test(password)) {
      return 'Password cannot contain spaces.';
    }
    if (!pattern.test(password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pwdError = validatePassword(form.password);
    if (pwdError) {
      setPasswordError(pwdError);
      setMessage('');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      setMessage('✅ Registered successfully!');
      setPasswordError('');
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage('⚠️ Username or Email already exists');
      } else {
        setMessage('❌ Registration failed');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Create Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          {passwordError && <p style={styles.error}>{passwordError}</p>}
          <button
            type="submit"
            style={{
              ...styles.button,
              transform: isPressed ? 'scale(0.95)' : 'scale(1)',
              backgroundColor: isPressed ? '#b3563a' : '#d9534f',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
          >
            Register
          </button>
        </form>
        <p style={{ ...styles.message, color: message.startsWith('❌') ? '#d9534f' : '#5cb85c' }}>
          {message}
        </p>
        <p style={styles.loginPrompt}>
          Already a user?{' '}
          <a href="/login" style={styles.loginLink}>
            Login here
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
    backgroundColor: '#fff8f5', // warm light cream background
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
  },
  formBox: {
    backgroundColor: '#fff3f2', // soft pinkish card
    padding: 40,
    borderRadius: 10,
    boxShadow: '0 6px 20px rgba(211, 90, 73, 0.3)',
    width: 360,
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  heading: {
    marginBottom: 30,
    color: '#a6362b', // deep brick red
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  input: {
    padding: '14px 18px',
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #e2b4aa',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '14px 18px',
    fontSize: 17,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: '600',
  },
  message: {
    marginTop: 18,
    minHeight: 24,
    fontWeight: '600',
  },
  error: {
    color: '#c94e48',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 8,
  },
  loginPrompt: {
    marginTop: 20,
    fontSize: 15,
    color: '#6b4c43',
  },
  loginLink: {
    color: '#b3473a',
    textDecoration: 'underline',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
