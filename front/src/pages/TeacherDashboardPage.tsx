import { useEffect, useState } from 'react';
import { getJWT } from '../misc/Tokens';
import CourseComponent from '../components/CourseComponent';
import type { Course } from '../misc/Types';

function TeacherDashboardPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [popupOpacity, setPopupOpacity] = useState<number>(1); // New state for opacity

    const loadTeacherCourses = async () => {
        try {
            const token = getJWT().access;

            const response = await fetch('http://localhost:8000/teacher-dashboard/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Response in Dashboard:", result);
                setCourses(result);
            } else {
                console.log("Dashboard failed:", result);
            }
        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    };

    const deleteFromCourse = async (enrollmentId: number, courseName: string) => {
        try {
            const token = getJWT().access;

            const response = await fetch(`http://localhost:8000/delete-enroll/${enrollmentId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                console.log("Enrollment deleted");
                setPopupMessage(`You have successfully unenrolled from course: ${courseName}`);
                setPopupVisible(true);
                setPopupOpacity(1); // Reset opacity to 1
                setTimeout(() => {
                    // Start fading out
                    setPopupOpacity(0);
                    setTimeout(() => setPopupVisible(false), 300); // Hide after fade-out
                }, 3000); // Show for 3 seconds
                loadTeacherCourses();
            } else {
                console.log("Failed to delete enrollment.");
            }
        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    };

    const handleEnrollStudent = async (courseID: number, studentID: number, courseName: string) => {

        console.log(`Enrolling student ${studentID} in course ${courseID}`);

        try {

            const token = getJWT().access;

            // Send request to enroll in the course
            const response = await fetch('http://localhost:8000/enroll/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ course_id: courseID, student_id: studentID }),
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
                loadTeacherCourses();
            } else {
                console.log("Enrollment failed:", result);
            }
        } catch (error) {
            console.log(`An error occurred during enrollment: ${(error as Error).message}`);
        }
    };

    useEffect(() => {
        loadTeacherCourses();
    }, []);

    return (
        <div className='teacher-dashboard'>
            Teacher component.
            {courses.length > 0 ? (
                courses.map((course) => (
                    <CourseComponent 
                        key={course.id} 
                        course={course} 
                        deleteFromCourse={deleteFromCourse} 
                        handleEnrollStudent={handleEnrollStudent} 
                    />
                ))
            ) : (
                <p>No courses available.</p>
            )}

            {popupVisible && (
                <div className="popup" style={{ opacity: popupOpacity }}>
                    {popupMessage}
                </div>
            )}
        </div>
    );
}

export default TeacherDashboardPage;
