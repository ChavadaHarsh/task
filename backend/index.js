const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./connection/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true })); // for handling form data
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", require("./routes/taskRoutes"));

// Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
