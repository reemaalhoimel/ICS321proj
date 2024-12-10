const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Get list of all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find(); // Await the result
        res.json(users); // Send the JSON response
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Add a new user to the database
router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword, // Save hashed password
        });

        const savedUser = await user.save();
        res.status(201).json({ message: "User created successfully!", data: savedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found. Check email and try again." });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password. Please try again." });
        }

        // Extract username
        const { username } = user;

        // Send success response with username only
        res.status(200).json({ message: "Login successful", username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get a user by username
router.get("/:username", async (req, res) => {
    const { username } = req.params; // Extract username from the URL

    try {
        const user = await User.findOne({ username }); // Query by username
        if (!user) {
            return res.status(404).json({ error: "User not found" }); // Handle not found
        }
        res.json(user); // Send the user data
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
});

// Update a user by username
router.put("/:username", async (req, res) => {
    const { username } = req.params;
    const userData = req.body;

    try {
        const result = await User.updateOne({ username }, userData); // Update by username
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user by username
router.delete("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const result = await User.deleteOne({ username }); // Delete by username
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
