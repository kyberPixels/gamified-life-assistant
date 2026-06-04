import { Request, Response, NextFunction, Router } from "express";
import { createQuestInDb, deleteQuestFromDb, getUserQuestsFromDb } from "../db/database.js";

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
    const { user_id, category_id, title, description, difficulty, xp_reward, is_recurring } = questData;

    if (!user_id || !category_id || !title || !difficulty || xp_reward == null) {
      res.status(400).json({
        success: false,
        message: "Missing required quest fields.",
      });
      return;
    }

    await createQuestInDb({
      user_id,
      category_id,
      title,
      description: description || "",
      difficulty,
      xp_reward,
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

router.get("/", getQuests);
router.post("/create", createQuest);
router.delete("/delete", deleteQuest);

export default router;
