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

const motivationalMessages = [
  "Forge your own destiny today, Hero!",
  "Every quest completed is another step toward becoming a legend.",
  "Consistency is the ultimate stat multiplier. Keep grinding!",
  "Failure is just a temporary debuff. Get back up!",
  "Your potential is limitless. Go unlock some achievements!",
  "Drink some water, sharpen your blade, and conquer the day!",
  "Even the highest level masters started as novices. Keep pushing!",
  "The tavern will tell stories of your triumphs one day.",
  "Focus on the grind, the rewards will follow.",
  "A true warrior doesn't wait for luck; they create it.",
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const navigate = useNavigate();
  const [randomMessage, setRandomMessage] = useState("");

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
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);

      const savedAvatar = predefinedAvatars.find(
        (av) => av.id === (parsedUser.avatar_id || 1),
      );
      if (savedAvatar) {
        setCurrentAvatar(savedAvatar.img);
      }
    }

    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setRandomMessage(motivationalMessages[randomIndex]);
  }, [navigate]);

  const fetchUserQuests = async (userId) => {
    try {
      const response = await fetch(
        `http://88.200.63.148:30097/quests?user_id=${userId}`,
      );
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.quests.length === 0) {
          setQuests([
            {
              id: "default-water",
              title: "Drink 2l of Water",
              description: "Hydration is key to success",
              difficulty: "easy",
              xp_reward: 10,
              is_completed: false,
            },
          ]);
        } else {
          setQuests(data.quests);
        }
      }
    } catch (err) {
      console.error("Error fetching quests:", err);
    }
  };

  // Učitan ruter reaguje sada i na prelazak u 'completed' tab
  useEffect(() => {
    if (user && (activeTab === "quests" || activeTab === "completed")) {
      fetchUserQuests(user.id);
    }
  }, [activeTab, user]);

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

  const handleDeleteQuest = async (questId) => {
    if (questId === "default-water") {
      setQuests([]);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to abandon this quest?",
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://88.200.63.148:30097/quests/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId, userId: user.id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setQuests(quests.filter((q) => q.id !== questId));
      } else {
        alert(data.message || "Failed to delete quest.");
      }
    } catch (err) {
      alert("Error connecting to the backend server.");
    }
  };

  const toggleQuest = async (id, currentStatus, xpReward) => {
    if (id === "default-water") {
      setQuests(
        quests.map((q) =>
          q.id === id ? { ...q, is_completed: !q.is_completed } : q,
        ),
      );
      return;
    }

    const newCompletionStatus = !currentStatus;

    try {
      const response = await fetch(
        "http://88.200.63.148:30097/quests/toggle-completion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questId: id,
            userId: user.id,
            isCompleted: newCompletionStatus,
            xpReward: xpReward,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setQuests(
          quests.map((q) =>
            q.id === id ? { ...q, is_completed: newCompletionStatus } : q,
          ),
        );

        const updatedUser = {
          ...user,
          total_xp: data.newXp,
          current_level: data.newLevel,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        alert(data.message || "Failed to update quest completion.");
      }
    } catch (err) {
      alert("Error connecting to the backend server.");
    }
  };

  const handleAvatarChange = async (avatarId, avatarImg) => {
    try {
      const response = await fetch(
        "http://88.200.63.148:30097/users/update-avatar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            avatarId: avatarId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentAvatar(avatarImg);

        const updatedUser = {
          ...user,
          avatar_id: avatarId,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setIsModalOpen(false);
      } else {
        alert(data.message || "Failed to update avatar in database.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to the server while updating avatar.");
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === "easy") return "#4CAF50";
    if (diff === "medium") return "#FFC107";
    if (diff === "hard") return "#F44336";
    return "#2196F3";
  };

  if (!user) return <p className="text-wheat">Loading Character Sheet...</p>;

  const totalXp = user.total_xp || 0;
  const levelData = calculateLevelData(totalXp);
  const rpgTitle = getRpgTitle(levelData.level);

  // Filtrirani nizovi za lakše upravljanje praznim stanjima
  const activeQuests = quests.filter((q) => !q.is_completed);
  const completedQuests = quests.filter((q) => q.is_completed);

  return (
    <div>
      <div className="dashboard-header">
        <h1>
          Hero Dashboard
          {randomMessage && (
            <span className="dashboard-motivation">({randomMessage})</span>
          )}
        </h1>
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
          onClick={() => setActiveTab("completed")}
          className={`retro-tab-btn ${activeTab === "completed" ? "active" : ""}`}
        >
          🏆 Completed Quests
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
                <p>🔥 {user.streak_count || 0} Days</p> 
              </div>
            </div>
          </div>
        )}

        {activeTab === "quests" && (
          <div>
            <h3>Active Quests</h3>
            <div className="quest-list">
              {activeQuests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px" }}>
                  <p
                    className="text-wheat"
                    style={{
                      fontSize: "1.25rem",
                      fontStyle: "italic",
                      lineHeight: "1.6",
                    }}
                  >
                    ⚔️ All quests cleared! Your quest log is empty. <br />
                    Head over to the Quest Log to create new challenges and
                    start conquering! ⚔️
                  </p>
                </div>
              ) : (
                activeQuests.map((quest) => (
                  <div key={quest.id} className="quest-row">
                    <div className="quest-info">
                      <h4>{quest.title}</h4>
                      <p>{quest.description}</p>
                    </div>

                    <div className="quest-actions-wrapper">
                      <div className="quest-meta-text">
                        <span
                          style={{
                            color: getDifficultyColor(quest.difficulty),
                          }}
                          className="difficulty-badge"
                        >
                          {quest.difficulty}
                        </span>
                        <div className="xp-payout">+{quest.xp_reward} XP</div>
                      </div>

                      <button
                        onClick={() =>
                          toggleQuest(
                            quest.id,
                            quest.is_completed,
                            quest.xp_reward,
                          )
                        }
                        className="quest-btn complete-toggle-btn status-complete"
                      >
                        Complete ⚔️
                      </button>

                      <button
                        onClick={() => handleDeleteQuest(quest.id)}
                        className="quest-delete-btn"
                        title="Abandon Quest"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "completed" && (
          <div>
            <h3>Completed Quests</h3>
            <div className="quest-list">
              {completedQuests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px" }}>
                  <p
                    className="text-wheat"
                    style={{
                      fontSize: "1.25rem",
                      fontStyle: "italic",
                      lineHeight: "1.6",
                    }}
                  >
                    🏆 Your Hall of Fame is currently empty. <br />
                    Complete some active quests to fill up your archive of
                    achievements! 🏆
                  </p>
                </div>
              ) : (
                completedQuests.map((quest) => (
                  <div key={quest.id} className="quest-row completed">
                    <div className="quest-info">
                      <h4>{quest.title}</h4>
                      <p>{quest.description}</p>
                    </div>

                    <div className="quest-actions-wrapper">
                      <div className="quest-meta-text" style={{ opacity: 0.7 }}>
                        <span
                          style={{
                            color: getDifficultyColor(quest.difficulty),
                          }}
                          className="difficulty-badge"
                        >
                          {quest.difficulty}
                        </span>
                        <div className="xp-payout">+{quest.xp_reward} XP</div>
                      </div>

                      <button
                        onClick={() =>
                          toggleQuest(
                            quest.id,
                            quest.is_completed,
                            quest.xp_reward,
                          )
                        }
                        className="quest-btn complete-toggle-btn status-undo"
                      >
                        Undo ✅
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="profile-layout-container">
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
                  <strong>Current Streak:</strong> 🔥 {user.streak_count || 0} Days
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

            <div className="profile-right-scroll-wrapper">
              <div className="profile-right-content">
                  <div style={{ marginTop: "20px" }}>
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
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Select Character</h3>

            <div className="avatar-grid">
              {predefinedAvatars.map((av) => {
                const isSelected =
                  predefinedAvatars.find((p) => p.img === currentAvatar)?.id ===
                  av.id;

                return (
                  <div
                    key={av.id}
                    onClick={() => handleAvatarChange(av.id, av.img)}
                    className={`avatar-tile ${isSelected ? "selected" : ""}`}
                  >
                    <img src={av.img} alt={av.name} className="avatar-thumb" />
                  </div>
                );
              })}
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
