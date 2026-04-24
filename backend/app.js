const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./db/db");
connectDB();

app.get("/", (req, res) => {
  res.send("hello works");
});

// routes
const userRoutes = require("./routes/user.routes");
app.use("/users", userRoutes);

const jobRoutes = require("./routes/job.routes");
app.use("/jobs", jobRoutes);

const contactRoutes = require("./routes/contact.routes");
app.use("/contactus", contactRoutes);

module.exports = app;
