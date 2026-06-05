import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export interface UserLogin extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export const authUser = async (username: string): Promise<UserLogin[]> => {
  const [rows] = await pool.query<UserLogin[]>(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows;
};

export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );
  return result;
};

export const deleteUser = async (userId) => {
  const [result] = await pool.query(
    "DELETE FROM users WHERE id = ?",
    [userId]
  );
  return result;
};

export interface QuestRow {
  id?: number;
  user_id: number;
  category_id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp_reward: number;
  is_recurring: number;
}

export const getUserQuestsFromDb = async (userId: number) => {
  const [rows] = await pool.query(
    `SELECT q.*, 
            IF(qc.id IS NOT NULL, 1, 0) AS is_completed 
     FROM quests q
     LEFT JOIN quest_completions qc ON q.id = qc.quest_id AND qc.user_id = ?
     WHERE q.user_id = ?`,
    [userId, userId]
  );
  return rows;
};

export const createQuestInDb = async (quest: QuestRow) => {
  const [result] = await pool.query(
    "INSERT INTO quests (user_id, category_id, title, description, difficulty, xp_reward, is_recurring) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [quest.user_id, quest.category_id, quest.title, quest.description, quest.difficulty, quest.xp_reward, quest.is_recurring]
  );
  return result;
};

export const deleteQuestFromDb = async (questId: number, userId: number) => {
  const [result] = await pool.query(
    "DELETE FROM quests WHERE id = ? AND user_id = ?",
    [questId, userId]
  );
  return result;
};