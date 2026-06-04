import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://88.200.63.148:30097/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Hero registered! Redirecting to gates...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Forge Your Character</h2>
        {error && <p style={{ color: 'var(--color-wheat)', textAlign: 'center', marginBottom: '10px' }}>⚠️ {error}</p>}
        {message && <p style={{ color: 'var(--color-powder-blue)', textAlign: 'center', marginBottom: '10px' }}>✨ {message}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Choose Character Name" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
          <button type="submit" className="auth-submit">Forge Character</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '1.1rem' }}>
          Already have a hero? <Link to="/login" style={{ color: 'var(--color-wheat)' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}