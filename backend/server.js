import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/db.js";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`Connected to database: ${result.rows[0].current_database}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
