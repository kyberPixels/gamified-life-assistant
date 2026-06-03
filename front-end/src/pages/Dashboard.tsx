import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid black', paddingBottom: '10px' }}>
        <h1>Gamified Life Assistant</h1>
        <div>
          <span>Welcome, <strong>{user.username}</strong>! </span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button 
          onClick={() => setActiveTab('home')} 
          style={{ fontWeight: activeTab === 'home' ? 'bold' : 'normal', backgroundColor: activeTab === 'home' ? '#ddd' : '#fff', padding: '5px 10px' }}
        >
          Home (Dashboard)
        </button>
        <button 
          onClick={() => setActiveTab('quests')} 
          style={{ fontWeight: activeTab === 'quests' ? 'bold' : 'normal', backgroundColor: activeTab === 'quests' ? '#ddd' : '#fff', padding: '5px 10px' }}
        >
          Quests Page
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          style={{ fontWeight: activeTab === 'profile' ? 'bold' : 'normal', backgroundColor: activeTab === 'profile' ? '#ddd' : '#fff', padding: '5px 10px' }}
        >
          Profile
        </button>
      </nav>

      <div style={{ border: '1px solid black', padding: '20px', minHeight: '200px' }}>
        {activeTab === 'home' && (
          <div>
            <h3>Dashboard Overview</h3>
            <p>Your current Level: 1</p>
            <p>Your XP: 0 / 100</p>
            <p>Here you will see your daily summary and progress charts later!</p>
          </div>
        )}

        {activeTab === 'quests' && (
          <div>
            <h3>Active Quests List</h3>
            <ul>
              <li>🔒 Complete seminar implementation (Reward: 50 XP)</li>
              <li>🔒 Drink 2L of water today (Reward: 10 XP)</li>
            </ul>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h3>User Profile Details</h3>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}