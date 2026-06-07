import React, { useState, useEffect } from "react";
import { Icon } from "./EmojiToImage";

const images = import.meta.glob("../assets/achievements/*.jpg", {
  eager: true,
});

export default function Achievements({ userId }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(
          `http://88.200.63.148:30097/quests/${userId}/achievements`,
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setAchievements(data.achievements);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAchievements();
    }
  }, [userId]);

  if (loading) {
    return (
      <p className="text-powder" style={{ fontStyle: "italic" }}>
        Loading vault items...
      </p>
    );
  }

  if (achievements.length === 0) {
    return (
      <p className="text-wheat" style={{ fontStyle: "italic" }}>
        The vault is empty.
      </p>
    );
  }

  return (
    <>
      <div className="achievements-grid">
        {achievements.map((ach) => {
          const matchingImagePath = `../assets/achievements/${ach.badge_name}`;
          const imageSrc =
            images[matchingImagePath]?.default ||
            "https://via.placeholder.com/72?text=🏆";

          return (
            <div
              key={ach.id}
              className={`achievement ${ach.unlocked ? "unlocked" : "locked"}`}
              onClick={() => setSelectedAchievement(ach)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={imageSrc}
                alt={ach.title}
                className="avatar-thumb"
                style={{
                  width: "72px",
                  height: "72px",
                  marginBottom: "8px",
                  imageRendering: "pixelated",
                }}
              />
              <div className="achievement-title">{ach.title}</div>
            </div>
          );
        })}
      </div>

      {selectedAchievement && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ textAlign: "center" }}
          >
            <h3 className="modal-title" style={{ fontSize: "1.8rem" }}>
              {selectedAchievement.title}
            </h3>

            <div style={{ margin: "20px 0" }}>
              <img
                src={
                  images[
                    `../assets/achievements/${selectedAchievement.badge_name}`
                  ]?.default || "https://via.placeholder.com/110?text=🏆"
                }
                alt={selectedAchievement.title}
                style={{
                  width: "110px",
                  height: "110px",
                  border: "4px solid white",
                  outline: "2px solid black",
                  imageRendering: "pixelated",
                  backgroundColor: "#120224",
                  filter: selectedAchievement.unlocked
                    ? "none"
                    : "grayscale(100%)",
                  opacity: selectedAchievement.unlocked ? 1 : 0.6,
                }}
              />
            </div>

            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Status:{" "}
              <span
                style={{
                  color: selectedAchievement.unlocked
                    ? "var(--color-aquamarine)"
                    : "var(--color-carmine)",
                }}
              >
                {selectedAchievement.unlocked ? (
                  <>
                    <Icon name="🏆" size="18px" /> UNLOCKED!
                  </>
                ) : (
                  <>
                    <Icon name="🔒" size="18px" /> LOCKED
                  </>
                )}
              </span>
            </p>

            <p
              className="text-wheat"
              style={{
                fontSize: "1.3rem",
                lineHeight: "1.4",
                marginBottom: "25px",
              }}
            >
              {selectedAchievement.description}
            </p>

            <button
              className="retro-btn-danger"
              onClick={() => setSelectedAchievement(null)}
            >
              Close Log
            </button>
          </div>
        </div>
      )}
    </>
  );
}