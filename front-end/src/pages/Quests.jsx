import React, { useState, useEffect } from "react";
import "../styles/Quests.css";
import { Icon } from "./EmojiToImage";

export default function Quests() {
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
    }
  }, []);

  const handleAddQuest = async (e) => {
    e.preventDefault();
    if (!title || !user) return;

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
        setTitle("");
        setDescription("");
        setCategoryId(1);
        setDifficulty("medium");
        setXp(100);
        setCustomXp(false);
        alert("Quest created successfully!");
      } else {
        alert(data.message || "Failed to create quest.");
      }
    } catch (err) {
      alert("Error connecting to the backend server.");
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === "easy") return "#4CAF50";
    if (diff === "medium") return "#FFC107";
    if (diff === "hard") return "#F44336";
    return "#2196F3";
  };

  const categoryIcons = {
    1: "❤️",
    2: "🧡",
    3: "💛",
    4: "💚",
    5: "💙"
  };

  if (!user) return <p className="text-wheat">Loading Quest Log...</p>;

  return (
    <div className="quest-log-container">
      <h2 className="quests-header" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
        <Icon name="🛹" size="50px" /> <span>Quest Log</span> <Icon name="🛹" size="50px" />
      </h2>

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
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", left: "10px", pointerEvents: "none", display: "flex", alignItems: "center" }}>
                <Icon name={categoryIcons[categoryId]} size="18px" />
              </div>
              <select
                className="quest-input"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                style={{ fontFamily: '"Geo", sans-serif', paddingLeft: "35px", width: "100%" }}
              >
                <option value="1">General</option>
                <option value="2">Health & Fitness</option>
                <option value="3">Study & Coding</option>
                <option value="4">Daily Habits</option>
                <option value="5">Hobbies & Creativity</option>
              </select>
            </div>
          </div>

          <div className="form-group flex-1">
            <label>Difficulty:</label>
            <select
              className="quest-input"
              style={{ color: getDifficultyColor(difficulty), fontFamily: '"Geo", sans-serif' }}
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
              <option value="easy" style={{ color: "#4CAF50" }}>Easy</option>
              <option value="medium" style={{ color: "#FFC107" }}>Medium</option>
              <option value="hard" style={{ color: "#F44336" }}>Hard</option>
              <option value="custom" style={{ color: "#2196F3" }}>Custom</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>XP Reward:</label>
          {customXp ? (
            <input
              className="quest-input"
              style={{ color: getDifficultyColor(difficulty), fontFamily: '"Geo", sans-serif' }}
              type="number"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              min="10"
              max="1000"
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

        <button type="submit" className="quest-btn submit-quest-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <Icon name="🀄" size="32px" /> <span>Accept Quest</span> <Icon name="🀄" size="32px" />
        </button>
      </form>
    </div>
  );
}