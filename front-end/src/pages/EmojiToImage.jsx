import React from "react";

import trophy from "../assets/emojis/trophy.png";
import lock from "../assets/emojis/lock.png";
import active from "../assets/emojis/active.png";
import completedQuests from "../assets/emojis/completed_quests.png";
import profile from "../assets/emojis/profile.png";
import fire from "../assets/emojis/fire.png";
import complete from "../assets/emojis/complete.png";
import x from "../assets/emojis/x.png";
import check from "../assets/emojis/check.png";
import accept from "../assets/emojis/accept.png";
import skull from "../assets/emojis/skull.png";
import key from "../assets/emojis/key.png";
import door from "../assets/emojis/door.jpg";
import logo from "../assets/emojis/life_rpg.png";
import quests from "../assets/emojis/Quests.png";
import dashboard from "../assets/emojis/Dashboard.png";

const emojiMap = {
  "🏆": trophy,
  "🔒": lock,
  "📜": dashboard,
  "⚓": active,
  "👾": completedQuests,
  "👤": profile,
  "🔥": fire,
  "⚔️": complete,
  "❌": x,
  "✅": check,
  "🀄": accept,
  "💀": skull,
  "🗝️": key,
  "🚪": door,
  "🏠": quests,
  "🔰": dashboard,
  LIFE_RPG_LOGO: logo,
};

export const Icon = ({ name, alt = "icon", size = "20px" }) => {
  const imgSrc = emojiMap[name];

  if (!imgSrc) return <span>{name}</span>;

  const isLogo = name === "LIFE_RPG_LOGO";

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      style={isLogo ? {
        width: "100%",
        height: "auto",
        display: "block"
      } : { 
        width: size, 
        height: size, 
        display: "inline-block", 
        verticalAlign: "middle",
        objectFit: "contain"
      }} 
    />
  );
};
