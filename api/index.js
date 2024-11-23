const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dataRoutes = require("./routes/dataRoutes");
require("dotenv").config();

const app = express();

// Access MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api", dataRoutes);

// Start Server
// Listen to the port Vercel provides or fallback to 3000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on http://localhost:5000"));
