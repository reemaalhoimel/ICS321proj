const Post = require("../models/Post");
const router = require("express").Router();

// Get list of all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find(); // Await the result
    res.json(posts); // Send the JSON response
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle errors
  }
});

// Add a new post to the database
router.post("/", async (req, res) => {
  try {
    const { courseCode, content, username } = req.body;

    if (!courseCode || !content || !username) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const post = new Post({
      courseCode,
      content,
      username,
    });

    await post.save();
    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get all posts for a specific courseCode
router.get("/:courseCode", async (req, res) => {
  const { courseCode } = req.params;

  try {
    const posts = await Post.find({ courseCode }); // Fetch posts by courseCode
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ error: "No posts found for this courseCode" });
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific post by courseCode and id
router.get("/:courseCode/:id", async (req, res) => {
  const { courseCode, id } = req.params;

  try {
    const post = await Post.findOne({ courseCode, id }); // Fetch post by courseCode and id
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post by courseCode and id
router.put("/:courseCode/:id", async (req, res) => {
  const { courseCode, id } = req.params;
  const postData = req.body;

  try {
    const result = await Post.updateOne({ courseCode, id }, postData); // Update by courseCode and id
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.sendStatus(204); // Successfully updated
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post by courseCode and id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Post.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.sendStatus(204); // Successfully deleted
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/reply", async (req, res) => {
  const { postId, comment } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.comments = [...(post.comments || []), comment]; // Append comment
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:postId/vote", async (req, res) => {
  try {
      const postId = req.params.postId;
      const { voteType } = req.body;
      
      console.log("Processing vote:", { postId, voteType });

      // Use updateOne instead of findOneAndUpdate
      const result = await Post.updateOne(
          { _id: postId },
          { $inc: { [voteType === 'upvote' ? 'upvotes' : 'downvotes']: 1 } }
      );

      if (result.matchedCount === 0) {
          return res.status(404).send('Post not found');
      }

      // Send a simple response
      res.status(200).send('Vote updated successfully');
      
  } catch (err) {
      console.error("Error processing vote:", err);
      res.status(500).send('Error updating vote');
  }
});

module.exports = router;
