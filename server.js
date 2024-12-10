const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse incoming requests
app.use(express.json());

// Serve static files from the front-end directory
app.use(express.static(path.join(__dirname, "front-end")));

// Fallback route to serve index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "auth/signup.html"));
});

app.get("/forgotpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "auth/forgot-password.html"));
});

app.get("/userhome", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "user/homePage.html"));
});

app.get("/aboutus", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "user/aboutUs.html"));
});

app.get("/Coursepage", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "Moderator/coursePageModerator.html"));/////////////
});

app.get("/adminhome", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "admin/homePageAdmin.html"));
});

app.get("/adminaboutus", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "admin/aboutUsAdmin.html"));
});

app.get("/adminCoursepage", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "admin/coursePageAdmin.html"));
});


app.get("/supperadminhome", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "Moderator/homePageModerator.html"));
});

app.get("/superadminaboutus", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "Moderator/aboutUsModerator.html"));
});

app.get("/superadminCoursepage", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "admin/coursePageAdmin.html"));/////////////
});


// API routes
app.use("/api/bans", require("./api/bans"));
app.use("/api/comments", require("./api/comments"));
app.use("/api/courses", require("./api/courses"));
app.use("/api/posts", require("./api/posts"));
app.use("/api/users", require("./api/users"));

// Default route for catching undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use a port from environment variables or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
