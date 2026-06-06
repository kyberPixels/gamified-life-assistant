import { Request, Response, NextFunction, Router } from "express";
import {
  createQuestInDb,
  deleteQuestFromDb,
  getUserQuestsFromDb,
} from "../db/database.js";
import { pool } from "../db/database.js";

const router = Router();

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

    let newStreak = 0;

    if (isCompleted) {
      await pool.query(
        "INSERT INTO quest_completions (user_id, quest_id, completed_at) VALUES (?, ?, NOW())",
        [Number(userId), Number(questId)],
      );

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
        "SELECT streak_count, last_activity_date FROM users WHERE id = ?",
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

      await pool.query(
        "UPDATE users SET streak_count = ?, last_activity_date = ? WHERE id = ?",
        [newStreak, danas, Number(userId)],
      );
    } else {
      //ako user klikne undo
      await pool.query(
        "DELETE FROM quest_completions WHERE user_id = ? AND quest_id = ?",
        [Number(userId), Number(questId)],
      );

      await pool.query(
        "UPDATE users SET total_xp = GREATEST(0, total_xp - ?) WHERE id = ?",
        [Number(xpReward), Number(userId)],
      );

      const [userRows]: any = await pool.query(
        "SELECT streak_count FROM users WHERE id = ?",
        [Number(userId)],
      );
      newStreak = userRows[0].streak_count || 0;
    }

    const [userRows]: any = await pool.query(
      "SELECT total_xp, current_level, streak_count FROM users WHERE id = ?",
      [Number(userId)],
    );

    const updatedUser = userRows[0];

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

router.get("/", getQuests);
router.post("/create", createQuest);
router.delete("/delete", deleteQuest);
router.post("/toggle-completion", toggleQuestCompletion);

export default router;
