const Ban = require("../models/Ban");
const router = require("express").Router();

// Get list of all bans
router.get("/", async (req, res) => {
    try {
        const bans = await Ban.find(); // Await the result
        res.json(bans); // Send the JSON response
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Add a new ban to the database
router.post("/", async (req, res) => {
    try {
        const ban = new Ban(req.body); // Create new ban from request body
        const savedBan = await ban.save(); // Save to database
        res.status(201).json(savedBan); // Respond with the saved ban
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Get a ban by username
router.get("/:username", async (req, res) => {
    const { username } = req.params; // Extract username from the URL

    try {
        const ban = await Ban.findOne({ username }); // Query by username
        if (!ban) {
            return res.status(404).json({ error: "Ban not found" }); // Handle not found
        }
        res.json(ban); // Send the ban data
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
});

// Update a ban by username
router.put("/:username", async (req, res) => {
    const { username } = req.params;
    const banData = req.body;

    try {
        const result = await Ban.updateOne({ username }, banData); // Update by username
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Ban not found" });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a ban by username
router.delete("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const result = await Ban.deleteOne({ username }); // Delete by username
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Ban not found" });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;