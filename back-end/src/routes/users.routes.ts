import { Request, Response, NextFunction, Router } from "express";
import { authUser, createUser } from "../db/database.js";
import bcrypt from "bcrypt";

const router = Router();

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
      return;
    }

    const queryResult = await authUser(username);

    if (queryResult.length === 0) {
      res.status(401).json({
        success: false,
        message: "User is not registered.",
      });
      return;
    }

    const user = queryResult[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Username, email and password are required.",
      });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const queryResult = await createUser(username, email, hashedPassword); 

    if (queryResult.affectedRows === 1) {
      res.status(201).json({
        success: true,
        message: "User registered.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "User was not registered.",
    });
  } catch (error) {
    next(error);
  }
};

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;