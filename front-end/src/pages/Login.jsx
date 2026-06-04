import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://88.200.63.148:30097/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        navigate('/');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Welcome back!</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-powder-blue)', marginBottom: '20px' }}>Gate of Login</p>
        
        {error && <p style={{ color: 'var(--color-wheat)', textAlign: 'center', marginBottom: '10px' }}>⚠️ {error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Enter Character Name" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Super Secret Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type="submit" className="auth-submit" style={{ flex: 1 }}>Login 🗝️</button>
            <button type="button" className="auth-submit" style={{ flex: 1, backgroundColor: 'transparent', border: '2px solid var(--color-wheat)' }} onClick={() => navigate('/register')}>Register</button>
          </div>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '1.1rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-wheat)' }}>Create one here</Link>
        </p>
      </div>
    </div>
  );
}