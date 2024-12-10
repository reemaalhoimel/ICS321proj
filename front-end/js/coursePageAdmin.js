// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", async () => {
    const reviewsContainer = document.getElementById("reviewsContainer");
    const reviewInput = document.getElementById("reviewInput");
    const submitReviewButton = document.getElementById("submitReviewButton");
    const replyFormContainer = document.getElementById("replyFormContainer");
    const replyInput = document.getElementById("replyInput");
    const submitReplyButton = document.getElementById("submit-reply");
    const userVotes = {};
    let currentCourseId = null;
    let currentPostId = null;
  
    try {
        const urlParams = new URLSearchParams(window.location.search);
        currentCourseId = urlParams.get("courseId");
    
        if (!currentCourseId) {
            console.error("Course ID is missing in the URL.");
            return;
        }
    
        await loadCourseDetails(currentCourseId);
        await loadPosts(currentCourseId);
    } catch (error) {
        console.error("Error initializing page:", error);
    }
  
    // Course details functions
    async function loadCourseDetails(courseId) {
        try {
            const response = await fetch(`/api/courses/courses/${courseId}`);
            if (!response.ok) throw new Error("Failed to fetch course details.");
            const course = await response.json();
            displayCourseDetails(course);
        } catch (error) {
            console.error("Error loading course details:", error);
        }
    }
  
    function displayCourseDetails(course) {
        const courseInfoContainer = document.getElementById("courseInfo");
        courseInfoContainer.innerHTML = `
            <h2>${course.code} ${course.name}</h2>
            <div class="credits-container">
                <div class="lec-credits">Lec Credits: ${course.lecCredits}</div>
                <div class="lab-credits">Lab Credits: ${course.labCredits}</div>
                <div class="total-credits">Total Credits: ${course.lecCredits + course.labCredits}</div>
            </div>
            <p class="description">${course.description}</p>
            ${course.prerequisite ? `<p class="prerequisite"><strong>Prerequisite:</strong> ${course.prerequisite}</p>` : ""}
            <div class="edit-button">
                <button id="edit-preview" onclick="openEditCoursePopup('${course._id}')">Edit</button>
            </div>
        `;
    }
  
    function linkify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => 
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        );
    }
  
    // Posts and comments functions
    async function loadPosts(courseId) {
        try {
            const response = await fetch(`/api/posts/${courseId}`);
            if (!response.ok) throw new Error("Failed to fetch posts.");
            const posts = await response.json();
            renderReviews(posts);
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }
  
    function renderReviews(posts) {
        reviewsContainer.innerHTML = "";
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.className = "review";
            postElement.innerHTML = `
                <div class="review-header">
                    <div class="user-icon">👤</div>
                    <span class="username">${post.username || "Anonymous"}</span>
                </div>
                <p class="review-content">${linkify(post.content)}</p>
                <div class="review-actions">
                    <button class="upvote ${userVotes[post._id] === 'upvote' ? 'active' : ''}" data-id="${post._id}">▲</button>
                    <span class="vote-count">${(post.upvotes || 0) - (post.downvotes || 0)}</span>
                    <button class="downvote ${userVotes[post._id] === 'downvote' ? 'active' : ''}" data-id="${post._id}">▼</button>
                    <button class="comment" data-id="${post._id}">💬</button>
                    <div class="dropdown">
                        <button class="edit-post">Edit</button>
                        <div class="dropdown-content">
                            <div class="dropdown-item delete-post" data-id="${post._id}">Delete Post</div>
                            <div class="dropdown-item ban-user" data-id="${post._id}">Ban User</div>
                        </div>
                    </div>
                </div>
                <div class="comments-container">
                    ${(post.comments || []).map(comment => 
                        `<div class="comment">
                            <span class="username">Anonymous</span>: ${linkify(comment)}
                        </div>`
                    ).join("")}
                </div>
            `;
            reviewsContainer.appendChild(postElement);
        });
    }
  
    // Voting functions
    async function handleVote(postId, voteType) {
        try {
            const response = await fetch(`/api/posts/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, voteType })
            });
            if (!response.ok) throw new Error("Failed to update vote");
            await loadPosts(currentCourseId);
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    }
  
    // Admin functions
    async function deletePost(postId) {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Failed to delete post");
            await loadPosts(currentCourseId);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }
  
    async function banUser(username) {
        try {
            const response = await fetch(`/api/users/ban`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });
            if (!response.ok) throw new Error("Failed to ban user");
            alert(`User ${username} has been banned.`);
            await loadPosts(currentCourseId);
        } catch (error) {
            console.error("Error banning user:", error);
        }
    }

    // Edit course functions
    function openEditCoursePopup(courseId) {
        const editPopup = document.getElementById("editCoursePopup");
        editPopup.style.display = "flex";
        
        fetch(`/api/courses/courses/${courseId}`)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch course details");
                return response.json();
            })
            .then(course => {
                // Populate form fields
                document.getElementById("editCourseName").value = course.name;
                document.getElementById("editDepartment").value = course.department;
                document.getElementById("editCourseCode").value = course.code;
                document.getElementById("editDescription").value = course.description;
                document.getElementById("editLecCredits").value = course.lecCredits;
                document.getElementById("editLabCredits").value = course.labCredits;
            })
            .catch(error => {
                console.error("Error fetching course details:", error);
            });
    }

    function closeEditCoursePopup() {
        const editPopup = document.getElementById("editCoursePopup");
        editPopup.style.display = "none";
        clearEditFormErrors();
    }

    function clearEditFormErrors() {
        const errorMessages = document.querySelectorAll(".error-message");
        const inputs = document.querySelectorAll(".input-error");
        
        errorMessages.forEach(error => error.style.display = "none");
        inputs.forEach(input => input.classList.remove("input-error"));
    }

    function validateEditForm() {
        let isValid = true;
        clearEditFormErrors();

        const requiredFields = [
            { id: "editCourseName", message: "Course name is required" },
            { id: "editDepartment", message: "Department is required" },
            { id: "editCourseCode", message: "Course code is required" },
            { id: "editDescription", message: "Description is required" },
            { id: "editLecCredits", message: "Lecture credits are required" },
            { id: "editLabCredits", message: "Lab credits are required" }
        ];

        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element.value.trim()) {
                showError(element, field.message);
                isValid = false;
            }
        });

        return isValid;
    }

    function showError(element, message) {
        element.classList.add("input-error");
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }

    function editCourse() {
        if (!validateEditForm()) return;

        const courseData = {
            name: document.getElementById("editCourseName").value,
            department: document.getElementById("editDepartment").value,
            code: document.getElementById("editCourseCode").value,
            description: document.getElementById("editDescription").value,
            lecCredits: parseInt(document.getElementById("editLecCredits").value),
            labCredits: parseInt(document.getElementById("editLabCredits").value),
        };

        fetch(`/api/courses/update/${currentCourseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update course");
            return loadCourseDetails(currentCourseId);
        })
        .then(() => {
            closeEditCoursePopup();
        })
        .catch(error => {
            console.error("Error updating course:", error);
        });
    }

    // Make functions globally available
    window.openEditCoursePopup = openEditCoursePopup;
    window.closeEditCoursePopup = closeEditCoursePopup;
    window.editCourse = editCourse;
  
    // Event listeners
    reviewsContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("upvote")) {
            const postId = e.target.getAttribute("data-id");
            await handleVote(postId, "upvote");
        } else if (e.target.classList.contains("downvote")) {
            const postId = e.target.getAttribute("data-id");
            await handleVote(postId, "downvote");
        } else if (e.target.classList.contains("comment")) {
            const postId = e.target.getAttribute("data-id");
            showReplyForm(postId);
        } else if (e.target.classList.contains("delete-post")) {
            const postId = e.target.getAttribute("data-id");
            await deletePost(postId);
        } else if (e.target.classList.contains("ban-user")) {
            const postId = e.target.getAttribute("data-id");
            const post = document.querySelector(`[data-id="${postId}"]`).closest(".review");
            const username = post.querySelector(".username").textContent;
            await banUser(username);
        }
    });
  
    submitReviewButton.addEventListener("click", async () => {
        const content = reviewInput.value.trim();
        if (!content) return;
        try {
            const response = await fetch(`/api/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    courseCode: currentCourseId, 
                    content, 
                    username: "Anonymous" 
                })
            });
            if (!response.ok) throw new Error("Failed to add post");
            reviewInput.value = "";
            await loadPosts(currentCourseId);
        } catch (error) {
            console.error("Error adding post:", error);
        }
    });
});