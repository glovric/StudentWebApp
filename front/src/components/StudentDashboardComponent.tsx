import { useEffect, useState } from 'react';
import { getJWT, getCSRFToken } from '../tokens/Tokens';

type AvailableCourse = {
    id: number;
    name: string;
    points: number;
    image_url: string;
    coordinator: string;
    associates: string[];
}

type StudentCourse = {
    id: number;
    name: string;
    points: number;
    image_url: string;
    coordinator: string;
    associates: string[];
    enrollment_id: number;
}

function StudentDashboardComponent() {

    const [studentCourses, setStudentCourses] = useState<StudentCourse[] | null>(null);
    const [availableCourses, setAvailableCourses] = useState<AvailableCourse[] | null>(null);

    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [popupOpacity, setPopupOpacity] = useState<number>(1); // New state for opacity

    const enrollToCourse = async (courseID: number, courseName: string) => {

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
                setPopupMessage(`You have successfully enrolled in course: ${courseName}`);
                setPopupVisible(true);
                setPopupOpacity(1); // Reset opacity to 1
                setTimeout(() => {
                    // Start fading out
                    setPopupOpacity(0);
                    setTimeout(() => setPopupVisible(false), 300); // Hide after fade-out
                }, 3000); // Show for 3 seconds
                fetchAvailableCourses();
                fetchStudentCourses();
            } else {
                console.log("Enrollment failed:", result);
            }
        } catch (error) {
            console.log(`An error occurred during enrollment: ${(error as Error).message}`);
        }
    }

    const deleteFromCourse = async (enrollmentId: number, courseName: string) => {

        try {

            const token = getJWT().access;

            // Send request to /dashboard
            const response = await fetch(`http://localhost:8000/delete-enroll/${enrollmentId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // If response is ok (user exists), return JWT token
            if (response.status == 204) {
                console.log("Izbrisan enrollment");
                setPopupMessage(`You have successfully unenrolled from course: ${courseName}`);
                setPopupVisible(true);
                setPopupOpacity(1); // Reset opacity to 1
                setTimeout(() => {
                    // Start fading out
                    setPopupOpacity(0);
                    setTimeout(() => setPopupVisible(false), 300); // Hide after fade-out
                }, 3000); // Show for 3 seconds
                fetchAvailableCourses();
                fetchStudentCourses();
            } else {
                console.log("Brisanje enrollmenta failed.");
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    }

    const fetchAvailableCourses = async () => {
        
        try {

            const token = getJWT().access;
            const csrfToken = await getCSRFToken();

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/student-dashboard/available/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    //'X-CSRFToken': csrfToken,
                },
                //credentials: 'include',
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                console.log("Response u Student Dashboardu:", result);
                setAvailableCourses(result);
            } else {
                console.log("Student Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    const fetchStudentCourses = async () => {
        
        try {

            const token = getJWT().access;
            const csrfToken = await getCSRFToken();

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/student-dashboard/courses/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    //'X-CSRFToken': csrfToken,
                },
                //credentials: 'include',
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                console.log("Response u Student Dashboardu za Studentove coursovoe:", result);
                setStudentCourses(result);
            } else {
                console.log("Student Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    useEffect(() => {
        fetchAvailableCourses();
        fetchStudentCourses();
    }, []);

    return(
        <div className='student-dashboard'>

            Available courses

            {availableCourses ? (
                availableCourses.length > 0 ? (
                    <div className="course-container">
                        {availableCourses.map((course, index) => (
                            <div className="course-card" key={index}>
                                <h3>{course.name}</h3>
                                <p>{course.points} points</p>
                                <p>Course instructor: {course.coordinator ? course.coordinator : "Unknown"}</p>
                                <p>Course associates: {course.associates ? course.associates : "Unknown"}</p>
                                <img src={course.image_url}></img>
                                <button onClick={() => enrollToCourse(course.id, course.name)}>Enroll</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No courses available.</p>
                )
            ) : (
                <p>Loading courses...</p>
            )}

            Your courses.

            {studentCourses ? (
                studentCourses.length > 0 ? (
                    <div className="course-container">
                        {studentCourses.map((course, index) => (
                            <div className="course-card" key={index}>
                                <h3>{course.name}</h3>
                                <p>{course.points} points</p>
                                <p>Course instructor: {course.coordinator ? course.coordinator : "Unknown"}</p>
                                <p>Course associates: {course.associates ? course.associates : "Unknown"}</p>
                                <img src={course.image_url}></img>
                                <button onClick={() => deleteFromCourse(course.enrollment_id, course.name)}>Unenroll</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No courses available.</p>
                )
            ) : (
                <p>Loading courses...</p>
            )}

            {popupVisible && (
                <div className="popup" style={{ opacity: popupOpacity }}>
                    {popupMessage}
                </div>
            )}

        </div>
    )

}

export default StudentDashboardComponent;