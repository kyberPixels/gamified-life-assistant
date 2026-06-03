import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';

function App() {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* RETRO RPG SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2>LIFE RPG 🎮</h2>
          <nav className="nav-links">
            <Link 
              to="/" 
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              🏠 Dashboard
            </Link>
            <Link 
              to="/quests" 
              className={`nav-item ${location.pathname === '/quests' ? 'active' : ''}`}
            >
              ⚔️ Quests
            </Link>
            <Link 
              to="/login" 
              className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}
            >
              🔑 Login
            </Link>
            <Link 
              to="/register" 
              className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}
            >
              📝 Register
            </Link>
          </nav>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-powder-blue)' }}>
          v1.0.0 MVP
        </div>
      </aside>

      {/* GLAVNI SADRŽAJ (DESNA STRANA) */}
      <main className="main-content">
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;