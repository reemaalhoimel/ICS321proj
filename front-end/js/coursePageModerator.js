document.addEventListener("DOMContentLoaded", async () => {
  const reviewsContainer = document.getElementById("reviewsContainer");
  const reviewInput = document.getElementById("reviewInput");
  const submitReviewButton = document.getElementById("submitReviewButton");
  const replyFormContainer = document.getElementById("replyFormContainer");
  const replyInput = document.getElementById("replyInput");
  const submitReplyButton = document.getElementById("submit-reply");
  let currentCourseId = null;
  let currentPostId = null;
  const userVotes = {};

  try {
    // Extract course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCourseId = urlParams.get("courseId");

    if (!currentCourseId) {
      console.error("Course ID is missing in the URL.");
      return;
    }

    // Fetch and display course details
    await loadCourseDetails(currentCourseId);

    // Fetch and display posts
    await loadPosts(currentCourseId);
  } catch (error) {
    console.error("Error initializing page:", error);
  }

  // Fetch and display course details
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

  // Fetch and render posts for the course
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

  // Add a new post
  async function addPost(courseCode, content) {
    try {
      const response = await fetch(`/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode, content, username: "Anonymous" }),
      });
  
      console.log("Raw Response:", response);
  
      if (!response.ok) {
        console.error("Response not OK. Status:", response.status);
        const errorData = await response.text(); // Use `.text()` to see raw response
        console.error("Error details:", errorData);
        throw new Error("Failed to add post.");
      }
  
      const result = await response.json();
      console.log("Parsed JSON Response:", result);
  
      await loadPosts(courseCode); // Refresh posts after adding
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }
  

  // Add a reply to a post
  async function addReply(postId, comment) {
    try {
      const response = await fetch(`/api/posts/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, comment, username: "Anonymous" }),
      });
      if (!response.ok) throw new Error("Failed to add reply.");
      await loadPosts(currentCourseId); // Refresh posts after replying
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  }

  // Render posts on the page
  function renderReviews(posts) {
    reviewsContainer.innerHTML = "";
    posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "review";
        
        // Calculate the vote difference
        const voteCount = (post.upvotes || 0) - (post.downvotes || 0);
        
        postElement.innerHTML = `
            <div class="review-header">
                <span class="username">${post.username || "Anonymous"}</span>
            </div>
            <p class="review-content">${post.content}</p>
            <div class="review-actions">
                <button class="upvote ${userVotes[post._id] === 'upvote' ? 'active' : ''}" 
                        data-id="${post._id}">▲</button>
                <span class="vote-count">${voteCount}</span>
                <button class="downvote ${userVotes[post._id] === 'downvote' ? 'active' : ''}" 
                        data-id="${post._id}">▼</button>
                <button class="comment" data-id="${post._id}">Reply</button>
            </div>
            <div class="comments-container">
                ${(post.comments || [])
                    .map(comment => `<div class="comment"><span class="username">Anonymous</span>: ${comment}</div>`)
                    .join("")}
            </div>
        `;
        reviewsContainer.appendChild(postElement);
    });
}

// Event listener for votes
reviewsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("upvote")) {
      const postId = e.target.dataset.id;
      await handleVote(postId, "upvote");
  } else if (e.target.classList.contains("downvote")) {
      const postId = e.target.dataset.id;
      await handleVote(postId, "downvote");
  }
});

async function handleVote(postId, voteType) {
  try {
      console.log(`Attempting to ${voteType} post ${postId}`);
      
      const response = await fetch(`/api/posts/${postId}/vote`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ voteType })
      });

      // Don't try to parse JSON immediately
      if (!response.ok) {
          throw new Error('Failed to update vote');
      }

      // Refresh the posts display
      await loadPosts(currentCourseId);
      
  } catch (error) {
      console.error("Error in handleVote:", error);
  }
}

  // Display course details
  function displayCourseDetails(course) {
    const courseInfoContainer = document.getElementById("courseInfo");
    courseInfoContainer.innerHTML = `
        <h2>${course.code} ${course.name}</h2>
        <div class="credits-container">
          <div class="lec-credits">Lec Credits: ${course.lecCredits}</div>
          <div class="lab-credits">Lab Credits: ${course.labCredits}</div>
          <div class="total-credits">Total Credits: ${
            course.lecCredits + course.labCredits
          }</div>
        </div>
        <p class="description">${course.description}</p>
        ${
          course.prerequisite
            ? `<p class="prerequisite"><strong>Prerequisite:</strong> ${course.prerequisite}</p>`
            : ""
        }
      `;
  }

  // Show reply form
  function showReplyForm(postId) {
    currentPostId = postId;
    replyFormContainer.style.display = "block";
  }

  // Event listener for submitting a new review
  submitReviewButton.addEventListener("click", async () => {
    const content = reviewInput.value.trim();
    if (!content) {
      console.error("Cannot submit an empty review.");
      return;
    }
    await addPost(currentCourseId, content);
    reviewInput.value = ""; // Clear input field
  });

  // Event listener for showing the reply form
  reviewsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("comment")) {
      const postId = e.target.getAttribute("data-id");
      showReplyForm(postId);
    }
  });

  // Event listener for submitting a reply
  submitReplyButton.addEventListener("click", async () => {
    const comment = replyInput.value.trim();
    if (!comment) {
      console.error("Cannot submit an empty reply.");
      return;
    }
    await addReply(currentPostId, comment);
    replyInput.value = ""; // Clear input field
    replyFormContainer.style.display = "none"; // Hide reply form
  });
});
