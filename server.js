import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
import serverC from "http";
import usersRoute from "./router/userProfileResource.js";
import auth from "./router/auth.js";
import logger from "./service/systemReport/Logger.js";
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = serverC.createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://morpionai.com",
         "https://splyit.com",
         "https://fluffy-blini-341c08.netlify.app"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin not allowed"));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(usersRoute);
app.use(auth);

app.post("/api/auth/v1/log/data", async (req, res) => {
  const result = await logger.log(req.body);
  res.send(result);
});

app.get("/", function (req, res) {
  res.send("Hello how are you ?");
});

server.listen(process.env.PORT);
