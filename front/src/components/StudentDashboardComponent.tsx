import { useEffect, useState } from 'react';
import { getJWT, getCSRFToken } from '../tokens/Tokens';
import { useNavigate } from 'react-router-dom';

type Course = {
    id: number;
    name: string;
    points: number;
    image_url: string;
    main_instructor: string;
    additional_instructors: string[]
}

function StudentDashboardComponent() {

    const [courses, setCourses] = useState<Course[] | null>(null);

    const navigate = useNavigate();

    const enrollToCourse = async (courseID: number) => {

        try {

            const token = getJWT().access;
            const csrfToken = await getCSRFToken();

            // Send request to enroll in the course
            const response = await fetch('http://localhost:8000/enroll/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ course_id: courseID }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Successfully enrolled in course:", result);
                // Optionally, refresh the course list or show a success message
                fetchCourses()
            } else {
                console.log("Enrollment failed:", result);
            }
        } catch (error) {
            console.log(`An error occurred during enrollment: ${(error as Error).message}`);
        }
    }

    const fetchCourses = async () => {
        
        try {

            const token = getJWT().access;

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/courses/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                console.log("Response u Student Dashboardu:", result);
                setCourses(result);
            } else {
                console.log("Student Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    useEffect(() => {
        fetchCourses();
    }, []);

    return(
        <div>
            Student component.
            {courses ? (
                courses.length > 0 ? (
                    <div className="course-container">
                        {courses.map((course, index) => (
                            <div className="course-card" key={index}>
                                <h3>{course.name}</h3>
                                <p>{course.points} points</p>
                                <p>Course instructor: {course.main_instructor ? course.main_instructor : "Unknown"}</p>
                                <p>Course associates: {course.additional_instructors ? course.additional_instructors : "Unknown"}</p>
                                <img src={course.image_url}></img>
                                <button onClick={() => enrollToCourse(course.id)}>Enroll</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No courses available.</p>
                )
            ) : (
                <p>Loading courses...</p>
            )}
        </div>
    )

}

export default StudentDashboardComponent;