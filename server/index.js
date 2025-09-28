import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PreLoginRouter from './Router/PreLoginRouter.js';
import PostLoginRouter from './Router/PostLoginRouter.js';
import dotenv from "dotenv";
import { connectDB } from './Config/db.js';
import path from "path";

dotenv.config();
const app = express();

// --- CORS for all requests and preflight ---
app.use(cors({
  origin: "https://nexus-pro-three.vercel.app", // specific frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- Routes ---
app.use("/", PreLoginRouter);
app.use("/api/home", PostLoginRouter);

// --- Connect DB & start server ---
await connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
