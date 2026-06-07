import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import usersRouter from "./routes/users.routes.js";
import questsRouter from "./routes/quests.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 30097;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../dist/frontend-build")));

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../dist/frontend-build", "index.html"));
});

app.use("/users", usersRouter);
app.use("/quests", questsRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});