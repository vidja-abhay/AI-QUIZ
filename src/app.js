const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

// Initialize app
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require("./routes/authRoute.js");
const quizRoutes = require("./routes/quizRoute.js");

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));