import { useEffect, useState } from 'react';
import { getJWT } from '../tokens/Tokens';

type Student = {
    username: string;
    email: string;
    academic_id: string,
    user_id: number
}

function TeacherDashboardComponent() {

    const [students, setStudents] = useState<Student[] | []>([]);

    const getPermission = async () => {
        
        try {

            const token = getJWT().access;

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/dashboard/', {
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
                setStudents(result);
            } else {
                console.log("Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    useEffect(() => {
        getPermission();
    }, []);

    return(
        <div>
            Teacher component.
            {students ? (
                students.length > 0 ? (
                    <ul>
                        {students.map((student, index) => (
                            <li key={index}>
                                {student.user_id} - {student.email} - {student.username}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No students available.</p>
                )
            ) : (
                <p>Loading students...</p>
            )}
        </div>
    )

}

export default TeacherDashboardComponent;