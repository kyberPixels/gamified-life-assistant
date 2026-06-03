import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <p style={{ color: 'var(--color-wheat)' }}>Loading Character Sheet...</p>;

  return (
    <div>
      {/* TOP STATS BAR */}
      <div className="dashboard-header">
        <h1>Hero Dashboard</h1>
        <div>
          <span>Welcome, <strong style={{ color: 'var(--color-wheat)' }}>{user.username}</strong>! </span>
          <button onClick={handleLogout} className="logout-btn" style={{ padding: '4px 10px', fontSize: '1rem', marginLeft: '10px' }}>
            Logout 🚪
          </button>
        </div>
      </div>

      {/* TABS FOR CONTENT */}
      <nav className="tab-button-group">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`retro-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
        >
          📜 Status
        </button>
        <button 
          onClick={() => setActiveTab('quests')} 
          className={`retro-tab-btn ${activeTab === 'quests' ? 'active' : ''}`}
        >
          ⚔️ Active Quests
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`retro-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
        >
          👤 Profile Sheet
        </button>
      </nav>

      {/* TAB CONTENT GRID */}
      <div className="dashboard-inner-content">
        {activeTab === 'home' && (
          <div>
            <h3>Character Overview</h3>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>LEVEL</h3>
                <p>1 (Novice)</p>
              </div>
              <div className="dashboard-card">
                <h3>EXPERIENCE (XP)</h3>
                <p>0 / 100 XP</p>
              </div>
              <div className="dashboard-card">
                <h3>STREAK</h3>
                <p>🔥 0 Days</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <div>
            <h3>Active Quests Preview</h3>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '1.3rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>🔒 Complete seminar implementation <span style={{ color: 'var(--color-wheat)' }}>(50 XP)</span></li>
              <li>🔒 Drink 2L of water today <span style={{ color: 'var(--color-wheat)' }}>(10 XP)</span></li>
            </ul>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ fontSize: '1.3rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3>User Profile Details</h3>
            <p><strong>Hero ID:</strong> #{user.id}</p>
            <p><strong>Guild Name (Username):</strong> {user.username}</p>
            <p><strong>Registered Scroll (Email):</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}