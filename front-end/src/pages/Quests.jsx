import React, { useState, useEffect } from "react";
import "../styles/Quests.css";

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [difficulty, setDifficulty] = useState("medium");
  const [xp, setXp] = useState(100);
  const [customXp, setCustomXp] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      fetchUserQuests(parsedUser.id);
    }
  }, []);

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

  const handleAddQuest = async (e) => {
    e.preventDefault();
    if (!title || !user) return;

    // SADA DIREKTNO ŠALJEMO ONO ŠTO JE SELEKTOVANO (EASY, MEDIUM, HARD ILI CUSTOM)
    const questData = {
      user_id: user.id,
      category_id: Number(categoryId),
      title: title,
      description: description,
      difficulty: difficulty,
      xp_reward: Number(xp),
      is_recurring: false,
    };

    try {
      const response = await fetch("http://88.200.63.148:30097/quests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        fetchUserQuests(user.id);
        setTitle("");
        setDescription("");
        setCategoryId(1);
        setDifficulty("medium");
        setXp(100);
        setCustomXp(false);
      } else {
        alert(data.message || "Failed to create quest.");
      }
    } catch (err) {
      alert("Error connecting to the backend server.");
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

  const getDifficultyColor = (diff) => {
    if (diff === "easy") return "#4CAF50";
    if (diff === "medium") return "#FFC107";
    if (diff === "hard") return "#F44336";
    return "#2196F3"; // Plava boja za custom
  };

  if (!user) return <p className="text-wheat">Loading Quest Log...</p>;

  return (
    <div className="quest-log-container">
      <h2 className="quests-header">⚔️ Quest Log ⚔️</h2>

      <form onSubmit={handleAddQuest} className="quest-form">
        <h3>Create New Quest</h3>
        <div className="form-group">
          <label>Quest Title:</label>
          <input
            className="quest-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Study React"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            className="quest-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you need to do?"
          />
        </div>

        <div className="form-flex-row">
          <div className="form-group flex-1">
            <label>Category:</label>
            <select
              className="quest-input retro-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="1">⚔️ General</option>
              <option value="2">❤️ Health & Fitness</option>
              <option value="3">📚 Study & Coding</option>
              <option value="4">⏰ Daily Habits</option>
              <option value="5">🎨 Hobbies & Creativity</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label>Difficulty:</label>
            <select
              className="quest-input retro-select"
              style={{ color: getDifficultyColor(difficulty) }}
              value={difficulty}
              onChange={(e) => {
                const selected = e.target.value;
                setDifficulty(selected);
                if (selected === "easy") {
                  setCustomXp(false);
                  setXp(50);
                } else if (selected === "medium") {
                  setCustomXp(false);
                  setXp(100);
                } else if (selected === "hard") {
                  setCustomXp(false);
                  setXp(200);
                } else {
                  setCustomXp(true);
                  setXp(100);
                }
              }}
            >
              <option value="easy" style={{ color: "#4CAF50" }}>
                Easy
              </option>
              <option value="medium" style={{ color: "#FFC107" }}>
                Medium
              </option>
              <option value="hard" style={{ color: "#F44336" }}>
                Hard
              </option>
              <option value="custom" style={{ color: "#2196F3" }}>
                Custom
              </option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>XP Reward:</label>
          {customXp ? (
            <input
              className="quest-input"
              type="number"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              min="10"
              max="1000" // Limit je ostao na 1000 za lakše testiranje
              required
            />
          ) : (
            <div
              className="quest-input static-xp-display"
              style={{ color: getDifficultyColor(difficulty) }}
            >
              <span>{xp} XP</span>
            </div>
          )}
        </div>

        <button type="submit" className="quest-btn submit-quest-btn">
          Accept Quest 📜
        </button>
      </form>

      <div className="quest-list">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`quest-row ${quest.is_completed ? "completed" : ""}`}
          >
            <div className="quest-info">
              <h4>{quest.title}</h4>
              <p>{quest.description}</p>
            </div>

            <div className="quest-actions-wrapper">
              <div className="quest-meta-text">
                <span
                  style={{ color: getDifficultyColor(quest.difficulty) }}
                  className="difficulty-badge"
                >
                  {quest.difficulty}
                </span>
                <div className="xp-payout">+{quest.xp_reward} XP</div>
              </div>

              <button
                onClick={() =>
                  toggleQuest(quest.id, quest.is_completed, quest.xp_reward)
                }
                className={`quest-btn complete-toggle-btn ${quest.is_completed ? "status-undo" : "status-complete"}`}
              >
                {quest.is_completed ? "Undo ✅" : "Complete ⚔️"}
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
        ))}
      </div>
    </div>
  );
}
