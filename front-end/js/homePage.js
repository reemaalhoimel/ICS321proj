// Filter courses by department
function filterCourses(department) {
    const courses = document.querySelectorAll('.course-button');
    courses.forEach(course => {
        if (course.classList.contains('course-' + department)) {
            course.style.display = 'flex';
        } else {
            course.style.display = 'none';
        }
    });
}

function selectDepartment(department) {
    // Update dropdown button label to the selected department
    document.getElementById("departmentButton").innerHTML = department + ' <span class="arrow">&#9662;</span>';

    // Remove highlight from all dropdown items and highlight the selected one
    const dropdownItems = document.querySelectorAll(".dropdown-content a");
    dropdownItems.forEach(item => item.classList.remove("selected-department"));
    
    const selectedItem = Array.from(dropdownItems).find(item => item.textContent === department);
    if (selectedItem) {
        selectedItem.classList.add("selected-department");
    }
}

// Show all courses
function Department() {
    const courses = document.querySelectorAll('.course-button');
    courses.forEach(course => {
        course.style.display = 'flex';
    });
}

// Filter courses by search input
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

function displayCourse(course) {
    // Create course container
    const courseContainer = document.createElement("a");
    courseContainer.classList.add("course-button", `course-${course.department.toLowerCase()}`);
    courseContainer.href = `/Coursepage?courseId=${course._id}`; // Redirect to course page with the course ID in the query string

    // Set background color based on the department
    switch (course.department.toUpperCase()) {
        case 'MATH':
            courseContainer.style.backgroundColor = '#ffcccb'; // Light red
            break;
        case 'SWE':
            courseContainer.style.backgroundColor = '#ccffcc'; // Light green
            break;
        case 'ENGL':
            courseContainer.style.backgroundColor = '#ccccff'; // Light blue
            break;
        default:
            courseContainer.style.backgroundColor = '#f0f0f0'; // Default light gray
    }

    // Create course name element
    const courseName = document.createElement("div");
    courseName.classList.add("course-name");
    courseName.textContent = course.name;

    // Create course code element
    const courseCode = document.createElement("div");
    courseCode.classList.add("course-code");
    courseCode.textContent = course.code.replace(/([A-Za-z]+)([0-9]+)/, '$1 $2');

    // Append elements to course container
    courseContainer.appendChild(courseName);
    courseContainer.appendChild(courseCode);

    // Append course container to the course grid
    document.querySelector(".course-grid").appendChild(courseContainer);
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
