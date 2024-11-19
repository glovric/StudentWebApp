import { useEffect, useState, useRef } from 'react';
import { getJWT } from '../misc/Tokens';
import { animateCourseRows } from '../misc/useElementOnScreen';

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

    const windowWidthRef = useRef(window.innerWidth); // Store window width in a ref

    const handleResize = () => {
        windowWidthRef.current = window.innerWidth;  // Update the ref without triggering a re-render
    };

    const enrollToCourse = async (courseID: number, courseName: string) => {

        try {

            const token = getJWT().access;
            //const csrfToken = await getCSRFToken();

            // Send request to enroll in the course
            const response = await fetch('http://localhost:8000/enroll/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    //'X-CSRFToken': csrfToken,
                },
                //credentials: 'include',
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

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/student-dashboard/available-courses/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                setAvailableCourses(result);
            } else {
                console.error("Student Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    const fetchStudentCourses = async () => {
        
        try {

            const token = getJWT().access;
            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/student-dashboard/my-courses/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                setStudentCourses(result);
            } else {
                console.error("Student Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    useEffect(() => {
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => { window.removeEventListener('resize', handleResize); };
    }, []); // Empty dependency array ensures this effect runs once on mount and cleanup on unmount

    useEffect(() => {
        const fetchCourses = async () => {
            await fetchAvailableCourses(); // Wait for courses to load
            await fetchStudentCourses();
        };
    
        fetchCourses();
    }, []); // Only run once on mount
    
    useEffect(() => {
        if (availableCourses) {
            animateCourseRows(windowWidthRef.current < 768);  // Now that availableCourses is populated, observe elements
        }
    }, [availableCourses]);  // Trigger when availableCourses changes

    useEffect(() => {
        if(studentCourses) {
            animateCourseRows(windowWidthRef.current < 768);
        }
    }, [studentCourses]);  // Trigger when availableCourses changes

    return(
        <div className='student-dashboard'>

            Available courses

            {availableCourses ? (
                availableCourses.length > 0 ? (
                    <div className="course-container">
                        {availableCourses.map((course, index) => {
                            // Determine which class to use based on index
                            const start_side = Math.floor(index / 3) % 2 === 0 ? 'start-left' : 'start-right';
                            return (
                                <div className={`course-card ${start_side}`} key={index}>
                                    <img src={course.image_url} alt={course.name}></img>
                                    <div className='course-card-content'>
                                        <h2>{course.name}</h2>
                                        <p>{course.points} points</p>
                                        <p>Course instructor: {course.coordinator ? course.coordinator : "None"}</p>
                                        <p>Course associates: {course.associates ? course.associates : "None"}</p>
                                        <div className='button-div'>
                                            <button onClick={() => enrollToCourse(course.id, course.name)}>Enroll</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                        {studentCourses.map((course, index) => {
                            // Determine which class to use based on index
                            const start_side = Math.floor(index / 3) % 2 === 0 ? 'start-left' : 'start-right';
                            return (
                                <div className={`course-card ${start_side}`} key={index}>
                                    <img src={course.image_url} alt={course.name}></img>
                                    <div className='course-card-content'>
                                        <h2>{course.name}</h2>
                                        <p>{course.points} points</p>
                                        <p>Course instructor: {course.coordinator ? course.coordinator : "None"}</p>
                                        <p>Course associates: {course.associates ? course.associates : "None"}</p>
                                        <div className='button-div'>
                                            <button onClick={() => deleteFromCourse(course.enrollment_id, course.name)}>Unenroll</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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