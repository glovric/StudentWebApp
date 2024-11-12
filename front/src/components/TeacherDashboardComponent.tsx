import { useEffect, useState, useRef } from 'react';
import { getJWT } from '../misc/Tokens';
import TeacherCourseComponent from './TeacherCourseComponent';
import type { Course } from '../misc/Types';
import AddCourseComponent from './AddCourseComponent';
import { animateTeacherCourseTable } from '../misc/useElementOnScreen';

function TeacherDashboardComponent() {

    const [courses, setCourses] = useState<Course[] | null>(null);

    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [popupOpacity, setPopupOpacity] = useState<number>(1);

    const [popupAddCourseVisible, setPopupAddCourseVisible] = useState<boolean>(false);
    const [popupAddCourseOpacity, setPopupAddCourseOpacity] = useState<number>(1);
    const addCoursePopupRef = useRef<HTMLDivElement | null>(null);

    const showAddCoursePopup = () => {
        setPopupAddCourseVisible(true);
        setPopupAddCourseOpacity(0.9);
    };

    const hideAddCoursePopup = () => {
        setPopupAddCourseVisible(false);
        setPopupAddCourseOpacity(0);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (addCoursePopupRef.current && !addCoursePopupRef.current.contains(event.target as Node)) {
            hideAddCoursePopup();
        }
    };

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
                setCourses(result);
            } else {
                console.log("Dashboard failed:", result);
            }
        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    };

    const refreshCourses = () => {
        loadTeacherCourses(); // Re-load courses after a course has been added
        hideAddCoursePopup(); // Hide the AddCourse popup after the course is added
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

    const deleteCourse = async (courseID: number) => {

        try {

            const token = getJWT().access;

            // Send request to enroll in the course
            const response = await fetch(`http://localhost:8000/delete-course/${courseID}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 204) {
                loadTeacherCourses();
            } else {
                console.log("Course adding failed");
            }
        } catch (error) {
            console.log(`An error occurred during enrollment: ${(error as Error).message}`);
        }

    }

    // Use loadTeacherCourses on component mount
    useEffect(() => {

        const waitCourses = async () => {
            await loadTeacherCourses();
        }

        waitCourses();

        // Add event listener to document
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if(courses !== null) {
            animateTeacherCourseTable(".start-left", "show", {threshold: 0.5});
            animateTeacherCourseTable(".start-right", "show", {threshold: 0.5});
        }
    }, [courses])

    return (
        <div className='teacher-dashboard'>
            <div className='teacher-dashboard-header'>
                <button onClick={showAddCoursePopup}>Add new course</button>
            </div>
            {courses ? (
                courses.length > 0 ? (
                courses?.map((course, index) => {
                    const start_side = index % 2 === 0 ? 'start-left' : 'start-right';
                    return (
                    <div key={course.id} className={`${start_side}`}>
                        <TeacherCourseComponent
                        course={course} 
                        deleteFromCourse={deleteFromCourse} 
                        handleEnrollStudent={handleEnrollStudent} 
                        deleteCourse={deleteCourse}
                        />
                    </div>
                    )
                })
            ) : (
                <p>No courses available.</p>
            )) : (
                <p>Loading courses...</p>
            )}

            {popupVisible && (
                <div className="popup" style={{ opacity: popupOpacity }}>
                    {popupMessage}
                </div>
            )}

            {popupAddCourseVisible && (
                <div style={{ opacity: popupAddCourseOpacity }} ref={addCoursePopupRef}>
                    {<AddCourseComponent onCourseAdded={refreshCourses}/>}
                </div>
            )}
        </div>
    );
}

export default TeacherDashboardComponent;
