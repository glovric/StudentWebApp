import { useEffect, useState } from 'react';
import { getJWT } from '../tokens/Tokens';

type Student = {
    id: number;
    name: string;
    academic_id: string,
    enrollment_id: number
}

type Course = {
    course_id: number;
    course_name: string;
    enrolled_students: Student[];
}

function TeacherDashboardComponent() {

    const [courses, setCourses] = useState<Course[] | []>([]);

    const getPermission = async () => {
        
        try {

            const token = getJWT().access;

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/teacher-dashboard/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                console.log("Response u Dashboardu:", result);
                setCourses(result);
            } else {
                console.log("Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    const deleteFromCourse = async (enrollmentId: number) => {

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
                getPermission();
            } else {
                console.log("Brisanje enrollmenta failed.");
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    }

    useEffect(() => {
        getPermission();
    }, []);

    return(
        <div className='teacher-dashboard'>
            Teacher component.
            {courses ? (
                courses.length > 0 ? (
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
                                                <td><button onClick={() => deleteFromCourse(student.enrollment_id)}>Delete from course</button></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>No students enrolled.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p>No courses available.</p>
                )
            ) : (
                <p>Loading students...</p>
            )}
        </div>
    )

}

export default TeacherDashboardComponent;