import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/Dashboard.css';

// 1. IMPORT LOKALNIH SLIČICA IZ TVOG FOLDERA (od 1 do 10)
import icon1 from '../assets/icons/1.jpg';
import icon2 from '../assets/icons/2.jpg';
import icon3 from '../assets/icons/3.jpg';
import icon4 from '../assets/icons/4.jpg';
import icon5 from '../assets/icons/5.jpg';
import icon6 from '../assets/icons/6.jpg';
import icon7 from '../assets/icons/7.jpg';
import icon8 from '../assets/icons/8.jpg';
import icon9 from '../assets/icons/9.jpg';
import icon10 from '../assets/icons/10.jpg';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Niz sa uvezenim lokalnim ikonama
  const predefinedAvatars = [
    { id: 1, name: 'Hero 1', img: icon1 },
    { id: 2, name: 'Hero 2', img: icon2 },
    { id: 3, name: 'Hero 3', img: icon3 },
    { id: 4, name: 'Hero 4', img: icon4 },
    { id: 5, name: 'Hero 5', img: icon5 },
    { id: 6, name: 'Hero 6', img: icon6 },
    { id: 7, name: 'Hero 7', img: icon7 },
    { id: 8, name: 'Hero 8', img: icon8 },
    { id: 9, name: 'Hero 9', img: icon9 },
    { id: 10, name: 'Hero 10', img: icon10 },
  ];

  // Postavljamo prvu sličicu (1.png) kao početnu
  const [currentAvatar, setCurrentAvatar] = useState(icon1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allAchievements = [
    { id: 1, title: 'First Blood', description: 'Complete your first ever quest', icon: '🥇', unlocked: true },
    { id: 2, title: 'Hydration God', description: 'Complete the Water quest 5 times', icon: '💧', unlocked: true },
    { id: 3, title: 'Database Architect', description: 'Create all normalized tables', icon: '💾', unlocked: false },
    { id: 4, title: 'Max Level Hero', description: 'Reach Level 10', icon: '👑', unlocked: false },
  ];

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
    }
  }, [navigate]);

  if (!user) return <p className="text-wheat">Loading Character Sheet...</p>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Hero Dashboard</h1>
        <div>
          <span>Welcome, <strong className="text-wheat">{user.username}</strong>! </span>
        </div>
      </div>

      <nav className="tab-button-group">
        <button onClick={() => setActiveTab('home')} className={`retro-tab-btn ${activeTab === 'home' ? 'active' : ''}`}>
          📜 Status
        </button>
        <button onClick={() => setActiveTab('quests')} className={`retro-tab-btn ${activeTab === 'quests' ? 'active' : ''}`}>
          ⚔️ Active Quests
        </button>
        <button onClick={() => setActiveTab('profile')} className={`retro-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}>
          👤 Profile Sheet
        </button>
      </nav>

      <div className="dashboard-inner-content">
        {activeTab === 'home' && (
          <div>
            <h3>Character Overview</h3>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>LEVEL</h3>
                <p>{user.current_level || 1} (Novice)</p>
              </div>
              <div className="dashboard-card">
                <h3>EXPERIENCE (XP)</h3>
                <p>{user.total_xp || 0} / 100 XP</p>
                <div className="xp-bar">
                  <div className="xp-bar-fill" style={{ width: `${user.total_xp || 0}%` }}></div>
                </div>
              </div>
              <div className="dashboard-card">
                <h3>STREAK</h3>
                <p>🔥 3 Days</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <div>
            <h3>Active Quests Preview</h3>
            <ul className="quests-list">
              <li>🔒 Complete seminar implementation <span className="text-wheat">(150 XP)</span></li>
              <li>🔒 Drink 2L of water today <span className="text-wheat">(10 XP)</span></li>
            </ul>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-layout-container">
            
            {/* LIJEVA STRANA: CHARACTER CARD (KOCKASTI DIZAJN) */}
            <div className="profile-left-card">
              <div className="avatar-wrapper" onClick={() => setIsModalOpen(true)}>
                
                {/* Slika je sada kockasta sa debljim retro borderom */}
                <img src={currentAvatar} alt="Hero Avatar" className="avatar-img" />

                <div className="change-badge">CHANGE</div>
              </div>

              <h2 className="profile-username">{user.username}</h2>
              <p className="profile-id">ID: #{user.id}</p>

              <div className="profile-stats">
                <p><strong>Level:</strong> {user.current_level || 1}</p>
                <p><strong>Total XP:</strong> {user.total_xp || 0} XP</p>
                <p><strong>Scroll:</strong> {user.email}</p>
              </div>
            </div>

            {/* DESNA STRANA */}
            <div className="profile-right-content">
              <div className="urgent-quests">
                <h4>⏳ Today's Urgent Quests</h4>
                <ul>
                  <li>Popij 2L vode <span className="text-powder">(10 XP)</span></li>
                </ul>
              </div>

              <div>
                <h4 className="vault-title">Vault of Achievements</h4>
                <div className="achievements-grid">
                  {allAchievements.map((ach) => (
                    <div 
                      key={ach.id} 
                      title={ach.description}
                      className={`achievement ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="achievement-icon">{ach.icon}</div>
                      <div className="achievement-title">{ach.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MODAL ZA PREGLED I BIRAČ 10 LOKALNIH IKONA */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Select Portrait</h3>
            
            {/* Mreža sa 10 kockastih sličica */}
            <div className="avatar-grid">
              {predefinedAvatars.map((av) => (
                <div 
                  key={av.id} 
                  onClick={() => {
                    setCurrentAvatar(av.img);
                    setIsModalOpen(false);
                  }}
                  className={`avatar-tile ${currentAvatar === av.img ? 'selected' : ''}`}
                >
                  <img src={av.img} alt={av.name} className="avatar-thumb" />
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="logout-btn"
            >
              CLOSE VAULT
            </button>
          </div>
        </div>
      )}

    </div>
  );
}