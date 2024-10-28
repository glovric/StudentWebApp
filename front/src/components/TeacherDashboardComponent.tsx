import { useEffect, useState } from 'react';
import { getJWT } from '../misc/Tokens';
import TeacherCourseComponent from './TeacherCourseComponent';
import type { Course } from '../misc/Types';

function TeacherDashboardComponent() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [popupOpacity, setPopupOpacity] = useState<number>(1);

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

    const deleteFromCourse = async (enrollmentId: number, courseName: string, studentName: string) => {
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
                setPopupMessage(`You have successfully deleted ${studentName} from course ${courseName}`);
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

    const handleEnrollStudent = async (courseID: number, courseName: string, studentID: number, studentName: string) => {

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
                // Optionally, refresh the course list or show a success message
                setPopupMessage(`You have successfully enrolled  ${studentName} in course ${courseName}`);
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

    // Use loadTeacherCourses on component mount
    useEffect(() => {
        loadTeacherCourses();
    }, []);

    return (
        <div className='teacher-dashboard'>
            <h1>Your Courses</h1>
            {courses.length > 0 ? (
                courses.map((course) => (
                    <TeacherCourseComponent
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

export default TeacherDashboardComponent;
