import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../styles/Dashboard.css";

import icon1 from "../assets/icons/1.jpg";
import icon2 from "../assets/icons/2.jpg";
import icon3 from "../assets/icons/3.jpg";
import icon4 from "../assets/icons/4.jpg";
import icon5 from "../assets/icons/5.jpg";
import icon6 from "../assets/icons/6.jpg";
import icon7 from "../assets/icons/7.jpg";
import icon8 from "../assets/icons/8.jpg";
import icon9 from "../assets/icons/9.jpg";
import icon10 from "../assets/icons/10.jpg";

const calculateLevelData = (totalXp) => {
  let level = 1;
  let xpNeededForNextLevel = 100;
  let remainingXp = totalXp;

  while (remainingXp >= xpNeededForNextLevel) {
    remainingXp -= xpNeededForNextLevel;
    level++;
    xpNeededForNextLevel += 100;
  }

  const xpPercentage = (remainingXp / xpNeededForNextLevel) * 100;

  return {
    level,
    currentLevelXp: remainingXp,
    nextLevelXpRequirement: xpNeededForNextLevel,
    xpPercentage,
  };
};

const getRpgTitle = (level) => {
  if (level <= 5) return "Novice";
  if (level <= 10) return "Apprentice";
  if (level <= 20) return "Journeyman";
  if (level <= 30) return "Adventurer";
  if (level <= 40) return "Warrior";
  if (level <= 50) return "Champion";
  if (level <= 65) return "Master";
  if (level <= 80) return "Grandmaster";
  if (level <= 95) return "Legend";
  return "Mythic Elite";
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const predefinedAvatars = [
    { id: 1, name: "Hero 1", img: icon1 },
    { id: 2, name: "Hero 2", img: icon2 },
    { id: 3, name: "Hero 3", img: icon3 },
    { id: 4, name: "Hero 4", img: icon4 },
    { id: 5, name: "Hero 5", img: icon5 },
    { id: 6, name: "Hero 6", img: icon6 },
    { id: 7, name: "Hero 7", img: icon7 },
    { id: 8, name: "Hero 8", img: icon8 },
    { id: 9, name: "Hero 9", img: icon9 },
    { id: 10, name: "Hero 10", img: icon10 },
  ];

  const [currentAvatar, setCurrentAvatar] = useState(icon1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allAchievements = [
    {
      id: 1,
      title: "First Blood",
      description: "Complete your first ever quest",
      icon: "🥇",
      unlocked: true,
    },
    {
      id: 2,
      title: "Hydration God",
      description: "Complete the Water quest 5 times",
      icon: "💧",
      unlocked: true,
    },
    {
      id: 3,
      title: "Database Architect",
      description: "Create all normalized tables",
      icon: "💾",
      unlocked: false,
    },
    {
      id: 4,
      title: "Max Level Hero",
      description: "Reach Level 10",
      icon: "👑",
      unlocked: false,
    },
  ];

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(loggedInUser));
    }
  }, [navigate, activeTab]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "WARNING: This action will permanently kill your character and erase all progress. Are you sure you want to proceed?",
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "http://88.200.63.148:30097/users/delete-account",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (err) {
      alert("Cannot connect to backend server.");
    }
  };

  if (!user) return <p className="text-wheat">Loading Character Sheet...</p>;

  const totalXp = user.total_xp || 0;
  const levelData = calculateLevelData(totalXp);
  const rpgTitle = getRpgTitle(levelData.level);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Hero Dashboard</h1>
        <div>
          <span>
            Welcome, <strong className="text-wheat">{user.username}</strong>
            !{" "}
          </span>
        </div>
      </div>

      <nav className="tab-button-group">
        <button
          onClick={() => setActiveTab("home")}
          className={`retro-tab-btn ${activeTab === "home" ? "active" : ""}`}
        >
          📜 Status
        </button>
        <button
          onClick={() => setActiveTab("quests")}
          className={`retro-tab-btn ${activeTab === "quests" ? "active" : ""}`}
        >
          ⚔️ Active Quests
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`retro-tab-btn ${activeTab === "profile" ? "active" : ""}`}
        >
          👤 Profile Sheet
        </button>
      </nav>

      <div className="dashboard-inner-content">
        {activeTab === "home" && (
          <div>
            <h3>Character Overview</h3>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>LEVEL</h3>
                <p>
                  {levelData.level} ({rpgTitle})
                </p>
              </div>
              <div className="dashboard-card">
                <h3>EXPERIENCE (XP)</h3>
                <p>
                  {levelData.currentLevelXp} /{" "}
                  {levelData.nextLevelXpRequirement} XP
                </p>
                <div className="xp-bar">
                  <div
                    className="xp-bar-fill"
                    style={{ width: `${levelData.xpPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="dashboard-card">
                <h3>STREAK</h3>
                <p>🔥 3 Days</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "quests" && (
          <div>
            <h3>Active Quests Preview</h3>
            <ul className="quests-list">
              <li>
                🔒 Complete seminar implementation{" "}
                <span className="text-wheat">(150 XP)</span>
              </li>
              <li>
                🔒 Drink 2L of water today{" "}
                <span className="text-wheat">(10 XP)</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="profile-layout-container">
            {/* LIJEVA STRANA */}
            <div className="profile-left-card">
              <div
                className="avatar-wrapper"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src={currentAvatar}
                  alt="Hero Avatar"
                  className="avatar-img"
                />
                <div className="change-badge">CHANGE</div>
              </div>

              <h2 className="profile-username">{user.username}</h2>
              <p className="profile-id">ID: #{user.id}</p>

              <div className="profile-stats">
                <p>
                  <strong>Level:</strong> {levelData.level} ({rpgTitle})
                </p>
                <p>
                  <strong>Total XP:</strong> {totalXp} XP
                </p>
                <p>
                  <strong>Scroll:</strong> {user.email}
                </p>
              </div>

              <button
                onClick={handleDeleteAccount}
                className="retro-btn-danger"
              >
                💀 Kill Character 💀
              </button>
            </div>

            {/* DESNA STRANA */}
            <div className="profile-right-content">
              <div className="urgent-quests">
                <h4>⏳ Today's Urgent Quests</h4>
                <ul>
                  <li>
                    Drink 2l of Water{" "}
                    <span className="text-powder">(10 XP)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="vault-title">Vault of Achievements</h4>
                <div className="achievements-grid">
                  {allAchievements.map((ach) => (
                    <div
                      key={ach.id}
                      title={ach.description}
                      className={`achievement ${ach.unlocked ? "unlocked" : "locked"}`}
                    >
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Select Character</h3>

            <div className="avatar-grid">
              {predefinedAvatars.map((av) => (
                <div
                  key={av.id}
                  onClick={() => {
                    setCurrentAvatar(av.img);
                    setIsModalOpen(false);
                  }}
                  className={`avatar-tile ${currentAvatar === av.img ? "selected" : ""}`}
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
