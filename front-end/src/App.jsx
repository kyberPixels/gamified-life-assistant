import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Provjera prijave pri učitavanju aplikacije
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

  // Ako korisnik nije ulogovan, sakrij sidebar i prikaži samo auth stranice
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout">
      {!isAuthPage && user && (
        <aside className="sidebar">
          <div className="logo-section">
            <h2>LIFE RPG 🎮</h2>
            <nav className="nav-links">
              <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                🏠 Dashboard
              </Link>
              <Link to="/quests" className={`nav-item ${location.pathname === '/quests' ? 'active' : ''}`}>
                ⚔️ Quests
              </Link>
            </nav>
          </div>
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              Logout 🚪
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