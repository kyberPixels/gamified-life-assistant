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
import quest_log from "../assets/emojis/quest_log.png";

import category_1 from "../assets/emojis/category_1.png";
import category_2 from "../assets/emojis/category_2.png";
import category_3 from "../assets/emojis/category_3.png";
import category_4 from "../assets/emojis/category_4.png";
import category_5 from "../assets/emojis/category_5.png";

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
  "🛹": quest_log,
  "❤️": category_1,
  "🧡": category_2,
  "💛": category_3,
  "💚": category_4,
  "💙": category_5,
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