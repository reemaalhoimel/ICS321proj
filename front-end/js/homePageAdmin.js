let courseToDelete = null;

function selectDepartment(department) {
    document.getElementById("departmentButton").innerHTML = department + ' <span class="arrow">&#9662;</span>';

    const dropdownItems = document.querySelectorAll(".dropdown-content a");
    dropdownItems.forEach(item => item.classList.remove("selected-department"));
    
    const selectedItem = Array.from(dropdownItems).find(item => item.textContent === department);
    if (selectedItem) {
        selectedItem.classList.add("selected-department");
    }
}

function filterCourses(department) {
    const departmentClass = `course-${department.toLowerCase()}`;
    const courses = document.querySelectorAll('.course-button');

    courses.forEach(course => {
        if (course.classList.contains(departmentClass)) {
            course.style.display = 'flex';
        } else {
            course.style.display = 'none';
        }
    });
}

function searchCourses() {
    const input = document.getElementById('searchInput').value.toUpperCase();
    const courses = document.querySelectorAll('.course-button');
    courses.forEach(course => {
        const text = course.textContent || course.innerText;
        if (text.toUpperCase().includes(input)) {
            course.style.display = 'flex';
        } else {
            course.style.display = 'none';
        }
    });
}

let deleteMode = false;

function toggleDeleteMode() {
    deleteMode = !deleteMode;
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.style.display = deleteMode ? 'block' : 'none';
    });
}

function showDeletePopup(button) {
    courseToDelete = button.parentElement;
    const courseName = courseToDelete.childNodes[0].textContent.trim();
    document.getElementById("deleteCourseName").textContent = courseName;
    document.getElementById("deletePopupOverlay").style.display = "block";
    document.getElementById("deleteCoursePopup").style.display = "block";
}

function closeDeletePopup() {
    document.getElementById("deletePopupOverlay").style.display = "none";
    document.getElementById("deleteCoursePopup").style.display = "none";
    courseToDelete = null;
}

async function confirmDeleteCourse() {
    if (courseToDelete) {
        const courseId = courseToDelete.dataset.courseId; // Assume course has a data attribute with ID
        await fetch(`/api/courses/courses/${courseId}`, { method: 'DELETE' });
        courseToDelete.remove();
    }
    closeDeletePopup();
}

function clearErrors() {
    document.querySelectorAll('.input-error').forEach(input => {
        input.classList.remove('input-error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = "none";
        error.innerText = "";
    });
}

async function addCourse() {
    clearErrors();

    const name = document.getElementById("courseNameInput").value.trim();
    const department = document.getElementById("courseDepartment").value.toLowerCase();
    const code = document.getElementById("courseCode").value.toUpperCase();
    const description = document.getElementById("courseDescription").value.trim();
    const lecCredits = document.getElementById("LecCredits").value.trim();
    const labCredits = document.getElementById("LabCredits").value.trim();

    let isValid = true;

    if (!name) {
        showError("courseNameInput", "Course name is required.");
        isValid = false;
    }
    if (!department) {
        showError("courseDepartment", "Department selection is required.");
        isValid = false;
    }
    if (!code) {
        showError("courseCode", "Course code is required.");
        isValid = false;
    }
    if (!description) {
        showError("courseDescription", "Course description is required.");
        isValid = false;
    }
    if (!lecCredits) {
        showError("LecCredits", "Lecture hours are required.");
        isValid = false;
    }
    if (!labCredits) {
        showError("LabCredits", "Lab hours are required.");
        isValid = false;
    }

    if (!isValid) return;

    const newCourse = { name, department, code, description, lecCredits, labCredits };

    try {
        const response = await fetch('/api/courses/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCourse)
        });

        if (!response.ok) {
            throw new Error('Failed to add course');
        }

        const addedCourse = await response.json();
        displayCourse(addedCourse);

        closeAddCoursePopup();
    } catch (error) {
        console.error(error);
        // Handle error (display error message to user)
    }
}

function displayCourse(course) {
    // Create course container
    const courseContainer = document.createElement("div");
    courseContainer.classList.add("course-button", `course-${course.department.toLowerCase()}`);
    courseContainer.dataset.courseId = course._id; // Save the course ID as a data attribute

    // Create course name element
    const courseName = document.createElement("div");
    courseName.classList.add("course-name");
    courseName.textContent = course.name;

    // Create course code element
    const courseCode = document.createElement("div");
    courseCode.classList.add("course-code");
    courseCode.textContent = course.code.replace(/([A-Za-z]+)([0-9]+)/, '$1 $2');

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "x";
    deleteButton.style.display = deleteMode ? 'block' : 'none';
    deleteButton.onclick = () => showDeletePopup(deleteButton);

    // Append elements to course container
    courseContainer.appendChild(courseName);
    courseContainer.appendChild(courseCode);
    courseContainer.appendChild(deleteButton);

    // Append course container to the course grid
    document.querySelector(".course-grid").appendChild(courseContainer);
}


function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    inputElement.classList.add("input-error");
    const errorElement = inputElement.nextElementSibling;
    errorElement.style.display = "block";
    errorElement.innerText = message;
}

function openAddCoursePopup() {
    document.getElementById("addCoursePopup").style.display = "block";
}

function closeAddCoursePopup() {
    document.getElementById("addCoursePopup").style.display = "none";
}

async function loadCourses() {
    try {
        const response = await fetch('/api/courses/courses');
        if (!response.ok) {
            throw new Error('Failed to load courses');
        }
        const courses = await response.json();
        courses.forEach(displayCourse);
    } catch (error) {
        console.error(error);
        // Handle error (display error message to user)
    }
}

document.addEventListener("DOMContentLoaded", loadCourses);
