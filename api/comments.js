const Comment = require("../models/Comment");
const router = require("express").Router();

// Get list of all comments
router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find(); // Await the result
        res.json(comments); // Send the JSON response
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});


// Get all comments for a specific courseCode
router.get("/:courseCode", async (req, res) => {
    const { courseCode } = req.params;
    const { skip = 0, limit = 10 } = req.query;

    try {
        const comments = await Comment.find({ courseCode })
            .skip(parseInt(skip))
            .limit(parseInt(limit)); // Fetch comments with pagination

        if (comments.length === 0) {
            return res.status(404).json({ error: "No comments found for this courseCode" });
        }
        res.json(comments); // Send the list of comments
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new comment to the database
router.post("/", async (req, res) => {
    try {
        const comment = new Comment(req.body); // Create new comment from request body
        const savedComment = await comment.save(); // Save to database
        res.status(201).json(savedComment); // Respond with the saved comment
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
});

// Get all comments for a specific courseCode and postId
router.get("/:courseCode/:postId", async (req, res) => {
    const { courseCode, postId } = req.params;

    try {
        const comments = await Comment.find({ courseCode, postId }); // Fetch comments by courseCode and postId
        if (comments.length === 0) {
            return res.status(404).json({ error: "No comments found for this courseCode and postId" });
        }
        res.json(comments); // Send the list of comments
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific comment by courseCode, postId, and id
router.get("/:courseCode/:postId/:id", async (req, res) => {
    const { courseCode, postId, id } = req.params;

    try {
        const comment = await Comment.findOne({ courseCode, postId, id }); // Fetch comment by courseCode, postId, and id
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(comment); // Send the comment data
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a comment by courseCode, postId, and id
router.put("/:courseCode/:postId/:id", async (req, res) => {
    const { courseCode, postId, id } = req.params;
    const commentData = req.body;

    try {
        const result = await Comment.updateOne({ courseCode, postId, id }, commentData); // Update comment by identifiers
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.sendStatus(204); // Successfully updated
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a comment by courseCode, postId, and id
router.delete("/:courseCode/:postId/:id", async (req, res) => {
    const { courseCode, postId, id } = req.params;

    try {
        const result = await Comment.deleteOne({ courseCode, postId, id }); // Delete comment by identifiers
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.sendStatus(204); // Successfully deleted
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;