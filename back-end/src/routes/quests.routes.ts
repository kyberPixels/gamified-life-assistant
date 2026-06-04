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

    if (isCompleted) {
      await pool.query(
        "INSERT INTO quest_completions (user_id, quest_id, completed_at) VALUES (?, ?, NOW())",
        [Number(userId), Number(questId)],
      );

      await pool.query(
        "UPDATE users SET total_xp = total_xp + ? WHERE id = ?",
        [Number(xpReward), Number(userId)],
      );
    } else {
      await pool.query(
        "DELETE FROM quest_completions WHERE user_id = ? AND quest_id = ?",
        [Number(userId), Number(questId)],
      );

      await pool.query(
        "UPDATE users SET total_xp = GREATEST(0, total_xp - ?) WHERE id = ?",
        [Number(xpReward), Number(userId)],
      );
    }

    const [userRows]: any = await pool.query(
      "SELECT total_xp, current_level FROM users WHERE id = ?",
      [Number(userId)],
    );

    const updatedUser = userRows[0];

    res.status(200).json({
      success: true,
      message: isCompleted ? "Quest completed!" : "Quest uncompleted.",
      newXp: updatedUser.total_xp,
      newLevel: updatedUser.current_level,
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
