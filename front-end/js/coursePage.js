document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Extract course ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseId');

        if (courseId) {
            // Fetch course details
            const response = await fetch(`/api/courses/courses/${courseId}`);
            if (!response.ok) {
                throw new Error('Failed to load course details');
            }

            const course = await response.json();
            displayCourseDetails(course);

            // Fetch and display initial comments
            await loadComments(courseId);
        } else {
            console.error('Course ID not found in URL');
        }
    } catch (error) {
        console.error(error);
        // Handle error (display error message to user)
    }
});

function displayCourseDetails(course) {
    const courseInfoContainer = document.getElementById('courseInfo');

    // Create course name element
    const courseName = document.createElement("h2");
    courseName.textContent = `${course.code} ${course.name}`;
    courseInfoContainer.appendChild(courseName);

    // Create course credits element
    const creditsContainer = document.createElement("div");
    creditsContainer.classList.add("credits-container");

    const lecCredits = document.createElement("div");
    lecCredits.classList.add("lec-credits");
    lecCredits.textContent = `Lec Credits: ${course.lecCredits}`;
    creditsContainer.appendChild(lecCredits);

    const labCredits = document.createElement("div");
    labCredits.classList.add("lab-credits");
    labCredits.textContent = `Lab Credits: ${course.labCredits}`;
    creditsContainer.appendChild(labCredits);

    // Calculate total credits
    const totalCredits = document.createElement("div");
    totalCredits.classList.add("total-credits");
    totalCredits.textContent = `Total Credits: ${course.lecCredits + course.labCredits}`;
    creditsContainer.appendChild(totalCredits);

    courseInfoContainer.appendChild(creditsContainer);

    // Create course description element
    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = course.description;
    courseInfoContainer.appendChild(description);

    // Create prerequisite element
    if (course.prerequisite) {
        const prerequisite = document.createElement("p");
        prerequisite.classList.add("prerequisite");
        prerequisite.innerHTML = `<strong>Prerequisite:</strong> ${course.prerequisite}`;
        courseInfoContainer.appendChild(prerequisite);
    }
}

async function loadComments(courseCode) {
    try {
        const skip = document.querySelectorAll('.comment').length; // How many comments are already loaded
        const limit = 10; // Number of comments to load per request

        const response = await fetch(`/api/comments/${courseCode}?skip=${skip}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to load comments');

        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        console.error(error);
    }
}

function displayComments(comments) {
    const commentsContainer = document.getElementById('reviewsContainer');
    commentsContainer.innerHTML = ''; // Clear existing comments before displaying new ones

    // Add heading for comments
    const commentsHeading = document.createElement('h3');
    commentsHeading.textContent = 'Comments';
    commentsContainer.appendChild(commentsHeading);

    comments.forEach(comment => {
        // Create a new comment container
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment', 'comment-item'); // Add classes for styling

        // Comment content
        const commentContent = document.createElement('p');
        commentContent.textContent = comment.content;
        commentContent.classList.add('comment-content');
        commentElement.appendChild(commentContent);

        // Comment author
        const commentAuthor = document.createElement('small');
        commentAuthor.textContent = `by ${comment.username}`;
        commentAuthor.classList.add('comment-author');
        commentElement.appendChild(commentAuthor);

        // Add the comment element to the container
        commentsContainer.appendChild(commentElement);
    });
}



// Attach scroll event listener to load more comments
document.getElementById('reviewsContainer').addEventListener('scroll', async () => {
    const container = document.getElementById('reviewsContainer');
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        await loadComments(courseCode); // Use the same courseCode to load more comments
    }
});

document.getElementById('submitReviewButton').addEventListener('click', async () => {
    const reviewInput = document.getElementById('reviewInput').value;
    if (reviewInput) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('courseId');
            const courseCode = courseId; // or map it as required

            const response = await fetch(`/api/comments/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseCode,
                    username: 'user',
                    content: reviewInput,
                    postId: 1
                })
            });

            if (!response.ok) throw new Error('Failed to post comment');
            const newComment = await response.json();
            displayComments([newComment]); // Re-fetch comments to update the UI
            document.getElementById('reviewInput').value = ''; // Clear the input field
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('Please write a comment before posting.');
    }
});