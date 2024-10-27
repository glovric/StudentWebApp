import { useEffect, useState } from 'react';
import { getJWT } from '../tokens/Tokens';

type Student = {
    id: number;
    name: string;
    academic_id: string;
    enrollment_id?: number;  // Optional since not all students will have an enrollment ID
};

type Course = {
    course_id: number;
    course_name: string;
    enrolled_students: Student[];
    not_enrolled_students: Student[];
};

function TeacherDashboardComponent() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<{ [courseId: number]: number | null }>({});

    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [popupOpacity, setPopupOpacity] = useState<number>(1); // New state for opacity

    const getPermission = async () => {
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
                getPermission();
            } else {
                console.log("Failed to delete enrollment.");
            }
        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    };

    const handleEnrollStudent = async (courseID: number, studentID: number, courseName: string) => {
        // Implement your enroll logic here
        // e.g., make an API call to enroll the student in the course
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
                getPermission();
            } else {
                console.log("Enrollment failed:", result);
            }
        } catch (error) {
            console.log(`An error occurred during enrollment: ${(error as Error).message}`);
        }
    };

    const handleSelectChange = (courseId: number, studentId: number | null) => {
        setSelectedStudents(prev => ({ ...prev, [courseId]: studentId }));
    };

    useEffect(() => {
        getPermission();
    }, []);

    return (
        <div className='teacher-dashboard'>
            Teacher component.
            {courses.length > 0 ? (
                courses.map((course) => (
                    <div key={course.course_id}>
                        <h3>{course.course_name}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Academic ID</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {course.enrolled_students.length > 0 ? (
                                    course.enrolled_students.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.academic_id}</td>
                                            <td><button onClick={() => deleteFromCourse(student.enrollment_id!, course.course_name)}>Delete from course</button></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>No students enrolled.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div>
                            <label>Select a student to enroll:</label>
                            <select 
                                value={selectedStudents[course.course_id] || ''} 
                                onChange={(e) => handleSelectChange(course.course_id, Number(e.target.value))}
                            >
                                <option value="">Select a student</option>
                                {course.not_enrolled_students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.academic_id})
                                    </option>
                                ))}
                            </select>
                            <button onClick={() => handleEnrollStudent(course.course_id, selectedStudents[course.course_id]!, course.course_name)} disabled={!selectedStudents[course.course_id]}>
                                Enroll
                            </button>
                        </div>
                    </div>
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
