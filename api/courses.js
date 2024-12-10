const Course = require("../models/Course");
const router = require("express").Router();

// Get all courses
router.get('/courses', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

// Add new course
router.post('/courses', async (req, res) => {
    const { name, department, code, description, lecCredits, labCredits } = req.body;
    const newCourse = new Course({ name, department, code, description, lecCredits, labCredits });
    await newCourse.save();
    res.json(newCourse);
});

// Delete course
router.delete('/courses/:id', async (req, res) => {
    const courseId = req.params.id;
    await Course.findByIdAndDelete(courseId);
    res.status(204).end();
});

// Get a course by ID
router.get("/courses/:id", async (req, res) => {
    const courseId = req.params.id; // Extract course ID from the URL

    try {
        const course = await Course.findById(courseId); // Query by course ID
        if (!course) {
            return res.status(404).json({ error: "Course not found" }); // Handle not found
        }
        res.json(course); // Send the course data
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
});

// Update a course by code
router.put("/:code", async (req, res) => {
    const { code } = req.params;
    const courseData = req.body;

    try {
        const result = await Course.updateOne({ code }, courseData); // Update by course code
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.sendStatus(204); // Successfully updated
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a course by ID
router.put('/update/:id', async (req, res) => {
    const courseId = req.params.id;
    const courseData = req.body;

    try {
        const result = await Course.findByIdAndUpdate(courseId, courseData, { new: true });
        if (!result) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;