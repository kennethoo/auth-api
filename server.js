import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverC from "http";
import auth from "./router/auth.js";
const app = express();

// Database connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB);

const server = serverC.createServer(app);

app.use(express.json());

// CORS Configuration - Allow requests from anyone
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-access-token",
    "x-session-id",
  ],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(auth);

// Health check endpoint
app.get("/", function (req, res) {
  res.json({
    status: "OK",
    service: "Auth API",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", function (req, res) {
  res.json({
    status: "OK",
    service: "Auth API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const port = process.env.PORT || 9000;
const nodeEnv = process.env.NODE_ENV || "development";

server.listen(port, () => {
  console.log(`Auth API server running on port ${port}`);
  console.log(`Environment: ${nodeEnv}`);
});
