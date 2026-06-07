import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import { Icon } from "./pages/EmojiToImage";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else if (location.pathname !== '/register') {
      navigate('/login');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout">
      {!isAuthPage && user && (
        <aside className="sidebar">
          
          <div className="sidebar-main-nav-wrapper" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            <div className="logo-section">
              <div className="sidebar-logo">
                <Icon name="LIFE_RPG_LOGO" alt="Life RPG Logo" />
              </div>
            </div>

            <nav className="nav-links">
              <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                <Icon name="🔰" size="50px" /> Dashboard
              </Link>
              <Link to="/quests" className={`nav-item ${location.pathname === '/quests' ? 'active' : ''}`}>
                <Icon name="🏠" size="50px" /> Quests
              </Link>
            </nav>

          </div>

          {/* FOOTER OSTAJE ZAKUCAN NA DNU */}
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              Logout <Icon name="🚪" size="36px" />
            </button>
            <div className="version-info">
              v1.0.0 MVP
            </div>
          </div>
        </aside>
      )}

      <main className={isAuthPage ? "main-content auth-full-screen" : "main-content"}>
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/login" element={<Login onLoginSuccess={(u) => setUser(u)} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;