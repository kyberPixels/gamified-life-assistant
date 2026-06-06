import { Request, Response, NextFunction, Router } from "express";
import {
  createQuestInDb,
  deleteQuestFromDb,
  getUserQuestsFromDb,
} from "../db/database.js";
import { pool } from "../db/database.js";

const router = Router();

const checkAndUnlockAchievements = async (userId: number, currentCategoryName?: string) => {
  try {
    const [totalRows]: any = await pool.query(
      "SELECT COUNT(*) as count FROM quest_completions WHERE user_id = ?",
      [userId]
    );
    const totalCompleted = totalRows[0].count;

    let categoryCompleted = 0;
    if (currentCategoryName) {
      const [catRows]: any = await pool.query(
        `SELECT COUNT(*) as count 
         FROM quest_completions qc
         JOIN quests q ON qc.quest_id = q.id
         JOIN categories c ON q.category_id = c.id
         WHERE qc.user_id = ? AND c.name = ?`,
        [userId, currentCategoryName]
      );
      categoryCompleted = catRows[0].count;
    }

    const [userRows]: any = await pool.query(
      "SELECT current_level FROM users WHERE id = ?",
      [userId]
    );
    const currentLevel = userRows[0].current_level;

    const [lockedAchievements]: any = await pool.query(
      `SELECT * FROM achievements 
       WHERE id NOT IN (
         SELECT achievement_id FROM user_achievements WHERE user_id = ?
       )`,
      [userId]
    );

    for (const ach of lockedAchievements) {
      let shouldUnlock = false;

      switch (ach.requirement_type) {
        case 'total_quests':
          if (totalCompleted >= ach.requirement_value) shouldUnlock = true;
          break;

        case 'category_quests':
          if (currentCategoryName === ach.category_name && categoryCompleted >= ach.requirement_value) {
            shouldUnlock = true;
          }
          break;

        case 'level':
          if (currentLevel >= ach.requirement_value) shouldUnlock = true;
          break;

        default:
          break;
      }

      if (shouldUnlock) {
        await pool.query(
          "INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)",
          [userId, ach.id]
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const getQuests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.query.user_id);

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
      return;
    }

    const quests = await getUserQuestsFromDb(userId);

    res.status(200).json({
      success: true,
      quests,
    });
  } catch (error) {
    next(error);
  }
};

const createQuest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questData = req.body;
    const {
      user_id,
      category_id,
      title,
      description,
      difficulty,
      xp_reward,
      is_recurring,
    } = questData;

    if (
      !user_id ||
      !category_id ||
      !title ||
      !difficulty ||
      xp_reward == null
    ) {
      res.status(400).json({
        success: false,
        message: "Missing required quest fields.",
      });
      return;
    }

    await createQuestInDb({
      user_id: Number(user_id),
      category_id: Number(category_id),
      title,
      description: description || "",
      difficulty,
      xp_reward: Number(xp_reward),
      is_recurring: is_recurring ? 1 : 0,
    });

    res.status(201).json({
      success: true,
      message: "Quest created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const deleteQuest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questId, userId } = req.body;

    if (!questId || !userId) {
      res.status(400).json({
        success: false,
        message: "Quest ID and User ID are required.",
      });
      return;
    }

    const result = await deleteQuestFromDb(Number(questId), Number(userId));

    if (result.affectedRows === 1) {
      res.status(200).json({
        success: true,
        message: "Quest deleted successfully.",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Quest not found or already deleted.",
      });
    }
  } catch (error) {
    next(error);
  }
};

const toggleQuestCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { questId, userId, isCompleted, xpReward } = req.body;

    if (!questId || !userId || xpReward == null) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
      return;
    }

    let isWaterQuest = questId === "default-water";
    let newStreak = 0;

    if (isCompleted) {
      if (!isWaterQuest) {
        await pool.query(
          "INSERT INTO quest_completions (user_id, quest_id, completed_at) VALUES (?, ?, NOW())",
          [Number(userId), Number(questId)],
        );
      }

      await pool.query(
        "UPDATE users SET total_xp = total_xp + ? WHERE id = ?",
        [Number(xpReward), Number(userId)],
      );

      const danasObj = new Date();
      const danas = danasObj.toISOString().split("T")[0];

      const jucerObj = new Date();
      jucerObj.setDate(jucerObj.getDate() - 1);
      const jucer = jucerObj.toISOString().split("T")[0];

      const [userRows]: any = await pool.query(
        "SELECT streak_count, last_activity_date, total_xp, current_level FROM users WHERE id = ?",
        [Number(userId)],
      );
      const currentUser = userRows[0];

      let currentStreak = currentUser.streak_count || 0;
      let lastActivity = currentUser.last_activity_date;

      if (lastActivity instanceof Date) {
        lastActivity = lastActivity.toISOString().split("T")[0];
      }

      if (lastActivity === danas) {
        newStreak = currentStreak;
      } else if (lastActivity === jucer) {
        newStreak = currentStreak + 1;
      } else {
        newStreak = 1;
      }

      let checkXp = currentUser.total_xp;
      let calculatedLevel = 1;
      let xpNeeded = 100;
      while (checkXp >= xpNeeded) {
        checkXp -= xpNeeded;
        calculatedLevel++;
        xpNeeded += 100;
      }

      await pool.query(
        "UPDATE users SET streak_count = ?, last_activity_date = ?, current_level = ? WHERE id = ?",
        [newStreak, danas, calculatedLevel, Number(userId)],
      );

      if (isWaterQuest) {
        await pool.query(
          "INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, 1)",
          [Number(userId), 1]
        );
      } else {
        const [questCatRows]: any = await pool.query(
          `SELECT c.name FROM quests q 
           JOIN categories c ON q.category_id = c.id 
           WHERE q.id = ?`,
          [Number(questId)]
        );
        
        const categoryName = questCatRows[0]?.name;
        await checkAndUnlockAchievements(Number(userId), categoryName);
      }
    } else {
      if (!isWaterQuest) {
        await pool.query(
          "DELETE FROM quest_completions WHERE user_id = ? AND quest_id = ?",
          [Number(userId), Number(questId)],
        );
      }

      await pool.query(
        "UPDATE users SET total_xp = GREATEST(0, total_xp - ?) WHERE id = ?",
        [Number(xpReward), Number(userId)],
      );

      const [userRows]: any = await pool.query(
        "SELECT total_xp, current_level FROM users WHERE id = ?",
        [Number(userId)],
      );
      
      let checkXp = userRows[0].total_xp;
      let calculatedLevel = 1;
      let xpNeeded = 100;
      while (checkXp >= xpNeeded) {
        checkXp -= xpNeeded;
        calculatedLevel++;
        xpNeeded += 100;
      }

      await pool.query(
        "UPDATE users SET current_level = ? WHERE id = ?",
        [calculatedLevel, Number(userId)]
      );
    }

    const [finalUserRows]: any = await pool.query(
      "SELECT total_xp, current_level, streak_count FROM users WHERE id = ?",
      [Number(userId)],
    );

    const updatedUser = finalUserRows[0];

    res.status(200).json({
      success: true,
      message: isCompleted ? "Quest completed!" : "Quest uncompleted.",
      newXp: updatedUser.total_xp,
      newLevel: updatedUser.current_level,
      newStreak: updatedUser.streak_count,
    });
  } catch (error) {
    next(error);
  }
};

const getUserAchievements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);

    const [rows]: any = await pool.query(
      `SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.badge_name,
        CASE WHEN ua.unlocked_at IS NOT NULL THEN 1 ELSE 0 END as unlocked,
        ua.unlocked_at
       FROM achievements a
       LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
       ORDER BY a.id ASC`,
      [userId]
    );

    res.status(200).json({ success: true, achievements: rows });
  } catch (error) {
    next(error);
  }
};

router.get("/", getQuests);
router.post("/create", createQuest);
router.delete("/delete", deleteQuest);
router.post("/toggle-completion", toggleQuestCompletion);
router.get("/:userId/achievements", getUserAchievements);

export default router;