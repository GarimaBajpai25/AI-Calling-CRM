
const candidateRoutes = require("./routes/candidateRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);


app.use("/api/candidates", candidateRoutes);

// Home
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Calling CRM Backend is running 🚀"
    });
});

// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server and Database API are working"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});